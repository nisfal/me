/**
 * json-lab.js
 *
 * Quantum JSON Synthesizer Engine (Dimension C-137)
 * Combines:
 *  - De-Cronenberger: Smart JSON parser (with auto-unescape), formatter, minifier, key sorter,
 *    exact line/column syntax diagnostics, telemetry analyzer, and portal syntax highlighter.
 *  - Timeline Divergence Scanner: Deep semantic JSON diff with JSONPath anomaly detection,
 *    stability scoring, and LCS-aligned side-by-side visual diff rows.
 *
 * Dual environment: works directly in browser (window.QuantumJsonEngine) and Node.js (module.exports).
 */

(function (root) {
  'use strict';

  function getValueType(val) {
    if (val === null) return 'null';
    if (Array.isArray(val)) return 'array';
    return typeof val;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  /**
   * Computes 1-based line and column from a character index in source text.
   */
  function indexToLineCol(text, index) {
    const safeIdx = Math.max(0, Math.min(index, text.length));
    const before = text.slice(0, safeIdx);
    const lines = before.split('\n');
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;
    const allLines = text.split('\n');
    const lineContent = allLines[line - 1] !== undefined ? allLines[line - 1] : '';
    return { line, column, lineContent };
  }

  /**
   * Extracts line/column info from a JS JSON.parse SyntaxError message across V8/SpiderMonkey/JSC.
   */
  function extractJsonErrorLocation(rawText, err) {
    const msg = err && err.message ? String(err.message) : 'Invalid JSON syntax';

    // Chrome/V8 format: "... at position 42" or "(line 3 column 12)"
    const lineColMatch = msg.match(/line\s+(\d+)\s+column\s+(\d+)/i);
    if (lineColMatch) {
      const line = parseInt(lineColMatch[1], 10);
      const column = parseInt(lineColMatch[2], 10);
      const allLines = rawText.split('\n');
      const lineContent = allLines[line - 1] || '';
      return { message: msg, line, column, lineContent };
    }

    const posMatch = msg.match(/position\s+(\d+)/i);
    if (posMatch) {
      const pos = parseInt(posMatch[1], 10);
      const loc = indexToLineCol(rawText, pos);
      return { message: msg, line: loc.line, column: loc.column, lineContent: loc.lineContent };
    }

    // Fallback: locate end of text if unexpected end
    if (/unexpected end/i.test(msg)) {
      const loc = indexToLineCol(rawText, rawText.length);
      return { message: msg, line: loc.line, column: loc.column, lineContent: loc.lineContent };
    }

    return { message: msg, line: 1, column: 1, lineContent: (rawText.split('\n')[0] || '') };
  }

  /**
   * Attempts to unescape a double-escaped JSON string (common in backend logs / SQS / RabbitMQ payloads).
   */
  function tryUnescapeJsonString(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return null;

    // Case 1: Valid JSON string wrapping JSON, e.g. "{\"a\":1}"
    try {
      const parsedOnce = JSON.parse(trimmed);
      if (typeof parsedOnce === 'string') {
        const inner = parsedOnce.trim();
        if (
          (inner.startsWith('{') && inner.endsWith('}')) ||
          (inner.startsWith('[') && inner.endsWith(']'))
        ) {
          const parsedInner = JSON.parse(inner);
          return { value: parsedInner, unescaped: true };
        }
      }
    } catch (_) {
      // continue to Case 2
    }

    // Case 2: Raw escaped JSON without outer quotes, e.g. {\"a\": \"hello\"}
    if (trimmed.includes('\\"')) {
      try {
        const unescapedText = trimmed
          .replace(/\\"/g, '"')
          .replace(/\\n/g, '\n')
          .replace(/\\r/g, '\r')
          .replace(/\\t/g, '\t')
          .replace(/\\\\/g, '\\');
        const parsed = JSON.parse(unescapedText);
        return { value: parsed, unescaped: true };
      } catch (_) {
        return null;
      }
    }

    return null;
  }

  /**
   * Smart JSON parser with optional auto-unescape and detailed error location.
   */
  function parseSmartJson(raw, options) {
    const opts = options || {};
    const autoUnescape = opts.autoUnescape !== false;
    const text = typeof raw === 'string' ? raw : '';
    const trimmed = text.trim();

    if (!trimmed) {
      return {
        ok: false,
        empty: true,
        error: { message: 'Empty input', line: 1, column: 1, lineContent: '' }
      };
    }

    // First try standard parse
    try {
      const parsed = JSON.parse(trimmed);
      // If parsed result is itself a JSON string and autoUnescape is ON, unwrap it
      if (autoUnescape && typeof parsed === 'string') {
        const inner = parsed.trim();
        if (
          (inner.startsWith('{') && inner.endsWith('}')) ||
          (inner.startsWith('[') && inner.endsWith(']'))
        ) {
          try {
            const unwrapped = JSON.parse(inner);
            return { ok: true, value: unwrapped, unescaped: true };
          } catch (_) {
            // keep original parsed string
          }
        }
      }
      return { ok: true, value: parsed, unescaped: false };
    } catch (firstErr) {
      if (autoUnescape) {
        const rescued = tryUnescapeJsonString(trimmed);
        if (rescued) {
          return { ok: true, value: rescued.value, unescaped: true };
        }
      }
      return {
        ok: false,
        empty: false,
        error: extractJsonErrorLocation(text, firstErr)
      };
    }
  }

  /**
   * Deeply sorts all object keys alphabetically while preserving array order.
   */
  function sortObjectKeys(val) {
    if (Array.isArray(val)) {
      return val.map(sortObjectKeys);
    }
    if (val !== null && typeof val === 'object') {
      const sorted = {};
      Object.keys(val)
        .sort((a, b) => a.localeCompare(b))
        .forEach((k) => {
          sorted[k] = sortObjectKeys(val[k]);
        });
      return sorted;
    }
    return val;
  }

  /**
   * Formats a parsed JS value into JSON string.
   */
  function formatJson(value, options) {
    const opts = options || {};
    const target = opts.sortKeys ? sortObjectKeys(value) : value;
    if (opts.minify) {
      return JSON.stringify(target);
    }
    const indent = opts.indent === '\t' ? '\t' : Number(opts.indent || 2);
    return JSON.stringify(target, null, indent);
  }

  /**
   * Calculates telemetry statistics for a parsed JSON value.
   */
  function analyzeJson(value, serializedStr) {
    let maxDepth = 0;
    let totalKeys = 0;
    let totalNodes = 0;

    function walk(node, depth) {
      totalNodes++;
      if (depth > maxDepth) maxDepth = depth;
      if (Array.isArray(node)) {
        for (let i = 0; i < node.length; i++) {
          walk(node[i], depth + 1);
        }
      } else if (node !== null && typeof node === 'object') {
        const keys = Object.keys(node);
        totalKeys += keys.length;
        for (let i = 0; i < keys.length; i++) {
          walk(node[keys[i]], depth + 1);
        }
      }
    }

    walk(value, 1);

    const str = typeof serializedStr === 'string' ? serializedStr : JSON.stringify(value);
    const bytes = typeof TextEncoder !== 'undefined'
      ? new TextEncoder().encode(str).length
      : str.length;

    return {
      bytes,
      formattedSize: formatBytes(bytes),
      maxDepth,
      totalKeys,
      totalNodes,
      rootType: getValueType(value)
    };
  }

  /**
   * Syntax highlights a formatted JSON string into safe HTML spans with Portal C-137 palette classes.
   */
  function highlightJsonLineHtml(line) {
    const tokenRegex = /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g;
    let result = '';
    let lastIndex = 0;
    let match;

    while ((match = tokenRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        result += escapeHtml(line.slice(lastIndex, match.index));
      }

      const token = match[0];
      const isKey = Boolean(match[2]);

      if (isKey) {
        // Separate key string and trailing colon/spaces
        const colonIdx = token.lastIndexOf(':');
        const keyPart = token.slice(0, colonIdx);
        const tailPart = token.slice(colonIdx);
        result += `<span class="j-key">${escapeHtml(keyPart)}</span><span class="j-punct">${escapeHtml(tailPart)}</span>`;
      } else if (token.startsWith('"')) {
        const escapedStr = escapeHtml(token).replace(
          /\[REDACTED_[A-Z0-9_]+\]/g,
          (tag) => `<span class="j-redacted">${tag}</span>`
        );
        result += `<span class="j-str">${escapedStr}</span>`;
      } else if (token === 'true' || token === 'false') {
        result += `<span class="j-bool">${token}</span>`;
      } else if (token === 'null') {
        result += `<span class="j-null">null</span>`;
      } else {
        result += `<span class="j-num">${token}</span>`;
      }

      lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < line.length) {
      result += escapeHtml(line.slice(lastIndex));
    }

    return result;
  }

  /**
   * Renders full JSON string as numbered HTML lines.
   */
  function highlightJsonWithLinesHtml(jsonString) {
    const lines = String(jsonString).split('\n');
    return lines
      .map((line, idx) => {
        const lineNum = idx + 1;
        return `<div class="j-code-line"><span class="j-ln">${lineNum}</span><span class="j-lc">${highlightJsonLineHtml(line)}</span></div>`;
      })
      .join('');
  }

  /**
   * Counts total leaf primitives / empty containers to compute accurate timeline stability score.
   */
  function countLeaves(val) {
    if (Array.isArray(val)) {
      if (val.length === 0) return 1;
      return val.reduce((acc, item) => acc + countLeaves(item), 0);
    }
    if (val !== null && typeof val === 'object') {
      const keys = Object.keys(val);
      if (keys.length === 0) return 1;
      return keys.reduce((acc, k) => acc + countLeaves(val[k]), 0);
    }
    return 1;
  }

  function formatPathSegment(basePath, key) {
    if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)) {
      return `${basePath}.${key}`;
    }
    return `${basePath}[${JSON.stringify(key)}]`;
  }

  function previewValue(val) {
    if (val === undefined) return 'undefined';
    const str = JSON.stringify(val);
    if (!str) return String(val);
    return str.length > 96 ? `${str.slice(0, 93)}...` : str;
  }

  /**
   * Computes deep structural & semantic anomalies between two parsed JSON values.
   */
  function collectAnomalies(left, right, path, anomalies, stats) {
    const leftType = getValueType(left);
    const rightType = getValueType(right);

    if (leftType !== rightType) {
      anomalies.push({
        type: 'type_changed',
        path,
        leftValue: left,
        rightValue: right,
        leftPreview: previewValue(left),
        rightPreview: previewValue(right),
        leftType,
        rightType
      });
      stats.totalLeaves += Math.max(countLeaves(left), countLeaves(right));
      return;
    }

    if (leftType === 'object') {
      const allKeys = Array.from(new Set([...Object.keys(left), ...Object.keys(right)])).sort((a, b) =>
        a.localeCompare(b)
      );
      if (allKeys.length === 0) {
        stats.totalLeaves += 1;
        stats.matchedLeaves += 1;
        return;
      }
      for (const key of allKeys) {
        const nextPath = formatPathSegment(path, key);
        const inLeft = Object.prototype.hasOwnProperty.call(left, key);
        const inRight = Object.prototype.hasOwnProperty.call(right, key);

        if (inLeft && !inRight) {
          anomalies.push({
            type: 'removed',
            path: nextPath,
            leftValue: left[key],
            rightValue: undefined,
            leftPreview: previewValue(left[key]),
            rightPreview: null,
            leftType: getValueType(left[key]),
            rightType: 'undefined'
          });
          stats.totalLeaves += countLeaves(left[key]);
        } else if (!inLeft && inRight) {
          anomalies.push({
            type: 'added',
            path: nextPath,
            leftValue: undefined,
            rightValue: right[key],
            leftPreview: null,
            rightPreview: previewValue(right[key]),
            leftType: 'undefined',
            rightType: getValueType(right[key])
          });
          stats.totalLeaves += countLeaves(right[key]);
        } else {
          collectAnomalies(left[key], right[key], nextPath, anomalies, stats);
        }
      }
      return;
    }

    if (leftType === 'array') {
      const maxLen = Math.max(left.length, right.length);
      if (maxLen === 0) {
        stats.totalLeaves += 1;
        stats.matchedLeaves += 1;
        return;
      }
      for (let i = 0; i < maxLen; i++) {
        const nextPath = `${path}[${i}]`;
        if (i >= left.length) {
          anomalies.push({
            type: 'added',
            path: nextPath,
            leftValue: undefined,
            rightValue: right[i],
            leftPreview: null,
            rightPreview: previewValue(right[i]),
            leftType: 'undefined',
            rightType: getValueType(right[i])
          });
          stats.totalLeaves += countLeaves(right[i]);
        } else if (i >= right.length) {
          anomalies.push({
            type: 'removed',
            path: nextPath,
            leftValue: left[i],
            rightValue: undefined,
            leftPreview: previewValue(left[i]),
            rightPreview: null,
            leftType: getValueType(left[i]),
            rightType: 'undefined'
          });
          stats.totalLeaves += countLeaves(left[i]);
        } else {
          collectAnomalies(left[i], right[i], nextPath, anomalies, stats);
        }
      }
      return;
    }

    // Primitive comparison
    stats.totalLeaves += 1;
    if (left === right) {
      stats.matchedLeaves += 1;
    } else {
      anomalies.push({
        type: 'modified',
        path,
        leftValue: left,
        rightValue: right,
        leftPreview: previewValue(left),
        rightPreview: previewValue(right),
        leftType,
        rightType
      });
    }
  }

  /**
   * Computes LCS line diff operations between two arrays of lines.
   * For very large payloads (>600 lines each), falls back gracefully to greedy line alignment.
   */
  function computeLineDiffOps(leftLines, rightLines) {
    const m = leftLines.length;
    const n = rightLines.length;

    // Fast path for huge JSONs to avoid O(m*n) memory spike in browser
    if (m * n > 360000) {
      const ops = [];
      const max = Math.max(m, n);
      for (let i = 0; i < max; i++) {
        if (i < m && i < n) {
          if (leftLines[i] === rightLines[i]) {
            ops.push({ type: 'equal', left: leftLines[i], right: rightLines[i], leftIdx: i + 1, rightIdx: i + 1 });
          } else {
            ops.push({ type: 'removed', left: leftLines[i], leftIdx: i + 1 });
            ops.push({ type: 'added', right: rightLines[i], rightIdx: i + 1 });
          }
        } else if (i < m) {
          ops.push({ type: 'removed', left: leftLines[i], leftIdx: i + 1 });
        } else {
          ops.push({ type: 'added', right: rightLines[i], rightIdx: i + 1 });
        }
      }
      return ops;
    }

    // Standard LCS DP table
    const dp = new Array(m + 1);
    for (let i = 0; i <= m; i++) {
      dp[i] = new Int32Array(n + 1);
    }

    for (let i = m - 1; i >= 0; i--) {
      for (let j = n - 1; j >= 0; j--) {
        if (leftLines[i] === rightLines[j]) {
          dp[i][j] = dp[i + 1][j + 1] + 1;
        } else {
          dp[i][j] = dp[i + 1][j] >= dp[i][j + 1] ? dp[i + 1][j] : dp[i][j + 1];
        }
      }
    }

    const ops = [];
    let i = 0;
    let j = 0;
    while (i < m && j < n) {
      if (leftLines[i] === rightLines[j]) {
        ops.push({ type: 'equal', left: leftLines[i], right: rightLines[j], leftIdx: i + 1, rightIdx: j + 1 });
        i++;
        j++;
      } else if (dp[i + 1][j] >= dp[i][j + 1]) {
        ops.push({ type: 'removed', left: leftLines[i], leftIdx: i + 1 });
        i++;
      } else {
        ops.push({ type: 'added', right: rightLines[j], rightIdx: j + 1 });
        j++;
      }
    }
    while (i < m) {
      ops.push({ type: 'removed', left: leftLines[i], leftIdx: i + 1 });
      i++;
    }
    while (j < n) {
      ops.push({ type: 'added', right: rightLines[j], rightIdx: j + 1 });
      j++;
    }

    return ops;
  }

  /**
   * Aligns raw LCS ops into side-by-side rows, pairing adjacent removed + added blocks as 'modified'.
   */
  function buildSideBySideRows(ops) {
    const rows = [];
    let idx = 0;

    while (idx < ops.length) {
      if (ops[idx].type === 'equal') {
        rows.push({
          type: 'equal',
          leftLineNum: ops[idx].leftIdx,
          leftText: ops[idx].left,
          rightLineNum: ops[idx].rightIdx,
          rightText: ops[idx].right
        });
        idx++;
        continue;
      }

      const removedBlock = [];
      const addedBlock = [];
      while (idx < ops.length && ops[idx].type !== 'equal') {
        if (ops[idx].type === 'removed') removedBlock.push(ops[idx]);
        else if (ops[idx].type === 'added') addedBlock.push(ops[idx]);
        idx++;
      }

      const maxBlock = Math.max(removedBlock.length, addedBlock.length);
      for (let k = 0; k < maxBlock; k++) {
        const rem = removedBlock[k];
        const add = addedBlock[k];
        if (rem && add) {
          rows.push({
            type: 'modified',
            leftLineNum: rem.leftIdx,
            leftText: rem.left,
            rightLineNum: add.rightIdx,
            rightText: add.right
          });
        } else if (rem) {
          rows.push({
            type: 'removed',
            leftLineNum: rem.leftIdx,
            leftText: rem.left,
            rightLineNum: null,
            rightText: ''
          });
        } else if (add) {
          rows.push({
            type: 'added',
            leftLineNum: null,
            leftText: '',
            rightLineNum: add.rightIdx,
            rightText: add.right
          });
        }
      }
    }

    return rows;
  }

  /**
   * Generates a clean text report of the timeline divergence for clipboard / Subspace Terminal relay.
   */
  function buildDiffReportText(result) {
    const header = [
      '=== TIMELINE DIVERGENCE REPORT (DIMENSION C-137 vs J19ζ7) ===',
      `Stability Score : ${result.stabilityPct.toFixed(1)}% (${result.isIdentical ? 'REAL FAMILY // IDENTICAL' : 'ANOMALIES DETECTED'})`,
      `Summary         : +${result.counts.added} Added | -${result.counts.removed} Removed | ~${result.counts.modified} Modified (Total: ${result.counts.total})`,
      ''
    ];

    if (result.anomalies.length === 0) {
      header.push('Zero anomalies detected. Both dimensions are 100% synchronized.');
      return header.join('\n');
    }

    const lines = result.anomalies.map((a) => {
      if (a.type === 'added') {
        return `[+ ADDED]    ${a.path} = ${a.rightPreview}`;
      }
      if (a.type === 'removed') {
        return `[- REMOVED]  ${a.path} = ${a.leftPreview}`;
      }
      if (a.type === 'type_changed') {
        return `[~ TYPE]     ${a.path}: (${a.leftType}) ${a.leftPreview}  -->  (${a.rightType}) ${a.rightPreview}`;
      }
      return `[~ MODIFIED] ${a.path}: ${a.leftPreview}  -->  ${a.rightPreview}`;
    });

    return header.concat(lines).join('\n');
  }

  /**
   * Full JSON Diff entry point.
   */
  function diffJson(leftValue, rightValue, options) {
    const opts = options || {};
    const ignoreKeyOrder = opts.ignoreKeyOrder !== false;
    const indent = opts.indent || 2;

    const anomalies = [];
    const leafStats = { totalLeaves: 0, matchedLeaves: 0 };
    collectAnomalies(leftValue, rightValue, '$', anomalies, leafStats);

    const counts = {
      added: 0,
      removed: 0,
      modified: 0,
      total: anomalies.length
    };
    anomalies.forEach((a) => {
      if (a.type === 'added') counts.added++;
      else if (a.type === 'removed') counts.removed++;
      else counts.modified++;
    });

    const leftFormatted = formatJson(leftValue, { indent, sortKeys: ignoreKeyOrder });
    const rightFormatted = formatJson(rightValue, { indent, sortKeys: ignoreKeyOrder });

    const leftLines = leftFormatted.split('\n');
    const rightLines = rightFormatted.split('\n');

    const lineOps = computeLineDiffOps(leftLines, rightLines);
    const sideBySideRows = buildSideBySideRows(lineOps);

    // If ignoreKeyOrder is false and JSONs have identical values but different key order,
    // reflect visual line differences in stability slightly or note key-order drift.
    const hasVisualLineDiff = sideBySideRows.some((r) => r.type !== 'equal');
    const isSemanticallyIdentical = anomalies.length === 0;
    const isIdentical = ignoreKeyOrder ? isSemanticallyIdentical : (isSemanticallyIdentical && !hasVisualLineDiff);

    let stabilityPct = 100.0;
    if (leafStats.totalLeaves > 0) {
      stabilityPct = (leafStats.matchedLeaves / leafStats.totalLeaves) * 100;
    }
    if (!isIdentical && stabilityPct === 100) {
      stabilityPct = 99.0; // key order drift when strict mode is ON
    }

    const result = {
      isIdentical,
      isSemanticallyIdentical,
      keyOrderDriftOnly: isSemanticallyIdentical && hasVisualLineDiff && !ignoreKeyOrder,
      stabilityPct,
      counts,
      anomalies,
      sideBySideRows,
      leftFormatted,
      rightFormatted
    };

    result.reportText = buildDiffReportText(result);
    return result;
  }

  const QuantumJsonEngine = {
    parseSmartJson,
    sortObjectKeys,
    formatJson,
    analyzeJson,
    highlightJsonLineHtml,
    highlightJsonWithLinesHtml,
    diffJson,
    formatBytes,
    escapeHtml
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuantumJsonEngine;
  }
  if (root) {
    root.QuantumJsonEngine = QuantumJsonEngine;
  }
})(typeof window !== 'undefined' ? window : globalThis);
