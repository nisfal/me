window.initSpaceShooter = function(canvas, onExit) {
  const ctx = canvas.getContext('2d');
  
  const STATE = { START: 0, PLAYING: 1, GAMEOVER: 2 };
  let currentState = STATE.START;
  let animationId;
  
  // Input
  const keys = {};
  let mouse = { x: canvas.width / 2, y: canvas.height - 100, isDown: false };
  let usingMouse = false;
  
  const onKeyDown = e => { keys[e.key.toLowerCase()] = true; usingMouse = false; };
  const onKeyUp = e => { keys[e.key.toLowerCase()] = false; };
  const onMouseMove = e => { mouse.x = e.clientX; mouse.y = e.clientY; usingMouse = true; };
  const onTouchMove = e => { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; usingMouse = true; };
  const onMouseDown = () => { mouse.isDown = true; };
  const onMouseUp = () => { mouse.isDown = false; };
  const onTouchStart = () => { mouse.isDown = true; };
  const onTouchEnd = () => { mouse.isDown = false; };

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('touchmove', onTouchMove);
  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('touchstart', onTouchStart);
  canvas.addEventListener('touchend', onTouchEnd);
  
  // Audio
  let audioCtx = null;
  function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
  }
  function playSound(type) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    const t = audioCtx.currentTime;
    if (type === 'laser') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.exponentialRampToValueAtTime(110, t + 0.1);
      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
      osc.start(t); osc.stop(t + 0.1);
    } else if (type === 'explosion') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, t);
      osc.frequency.exponentialRampToValueAtTime(10, t + 0.3);
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
      osc.start(t); osc.stop(t + 0.3);
    } else if (type === 'powerup') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.linearRampToValueAtTime(880, t + 0.1);
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.linearRampToValueAtTime(0.01, t + 0.3);
      osc.start(t); osc.stop(t + 0.3);
    } else if (type === 'boss_laser') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, t);
      osc.frequency.linearRampToValueAtTime(50, t + 0.5);
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
      osc.start(t); osc.stop(t + 0.5);
    }
  }

  // Entities
  let player, projectiles, enemies, particles, powerups, stars, boss, frameCount;

  function resetGame() {
    player = { x: canvas.width / 2, y: canvas.height - 100, w: 40, h: 40, speed: 8, lives: 3, score: 0, level: 1, shield: 0, spreadShotTime: 0, megaSeedTime: 0, lastFire: 0 };
    projectiles = [];
    enemies = [];
    particles = [];
    powerups = [];
    stars = [];
    boss = null;
    frameCount = 0;
    
    for (let i = 0; i < 150; i++) {
      stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, speed: 0.5 + Math.random() * 2, size: Math.random() * 2 });
    }
  }

  function spawnExplosion(x, y, color) {
    playSound('explosion');
    for (let i = 0; i < 20; i++) {
      particles.push({
        x: x, y: y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1, color: color, size: Math.random() * 4 + 2
      });
    }
  }

  function update() {
    if (currentState !== STATE.PLAYING) return;
    frameCount++;

    // Player movement
    if (usingMouse) {
      player.x += (mouse.x - player.x - player.w / 2) * 0.1;
      player.y += (mouse.y - player.y - player.h / 2) * 0.1;
    } else {
      let speed = player.megaSeedTime > 0 ? player.speed * 1.5 : player.speed;
      if (keys['w'] || keys['arrowup']) player.y -= speed;
      if (keys['s'] || keys['arrowdown']) player.y += speed;
      if (keys['a'] || keys['arrowleft']) player.x -= speed;
      if (keys['d'] || keys['arrowright']) player.x += speed;
    }
    
    // Clamp player
    player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.h, player.y));

    // Powerup timers
    if (player.spreadShotTime > 0) player.spreadShotTime--;
    if (player.megaSeedTime > 0) player.megaSeedTime--;

    // Firing
    let fireDelay = player.megaSeedTime > 0 ? 8 : 15;
    if ((keys[' '] || mouse.isDown || usingMouse) && frameCount - player.lastFire > fireDelay) {
      playSound('laser');
      player.lastFire = frameCount;
      if (player.spreadShotTime > 0) {
        projectiles.push({ x: player.x + player.w/2, y: player.y, vx: -3, vy: -15, isPlayer: true, color: '#00FF66' });
        projectiles.push({ x: player.x + player.w/2, y: player.y, vx: 0, vy: -15, isPlayer: true, color: '#00FF66' });
        projectiles.push({ x: player.x + player.w/2, y: player.y, vx: 3, vy: -15, isPlayer: true, color: '#00FF66' });
      } else {
        projectiles.push({ x: player.x + player.w/2, y: player.y, vx: 0, vy: -15, isPlayer: true, color: '#00FF66' });
      }
    }

    // Stars
    stars.forEach(s => { s.y += s.speed * (player.megaSeedTime > 0 ? 2 : 1); if (s.y > canvas.height) { s.y = 0; s.x = Math.random() * canvas.width; } });

    // Projectiles
    for (let i = projectiles.length - 1; i >= 0; i--) {
      let p = projectiles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -50 || p.y > canvas.height + 50 || p.x < -50 || p.x > canvas.width + 50) projectiles.splice(i, 1);
    }

    // Level progression & Boss Spawn
    if (player.score > player.level * 1000 && !boss) {
      player.level++;
      if (player.level % 3 === 0) {
        // Spawn Boss Cromulon
        boss = { x: canvas.width/2 - 100, y: -200, w: 200, h: 250, hp: 100, maxHp: 100, phase: 0, timer: 0 };
      }
    }

    // Boss Logic
    if (boss) {
      boss.timer++;
      if (boss.y < 50) boss.y += 2;
      else {
        boss.x = canvas.width/2 - boss.w/2 + Math.sin(boss.timer * 0.02) * (canvas.width/3);
        // Boss Attack
        if (boss.timer % 60 === 0) {
          playSound('boss_laser');
          for(let a=0; a<5; a++) {
            let angle = (a - 2) * 0.2 + Math.PI/2;
            projectiles.push({ x: boss.x + boss.w/2, y: boss.y + boss.h - 50, vx: Math.cos(angle)*8, vy: Math.sin(angle)*8, isPlayer: false, color: '#FF00FF', w: 15, h: 15 });
          }
        }
      }
    } else {
      // Spawn Enemies
      let spawnRate = Math.max(20, 60 - player.level * 5);
      if (frameCount % spawnRate === 0) {
        let isHazard = Math.random() < 0.2;
        enemies.push({
          x: Math.random() * (canvas.width - 50), y: -50, w: 40, h: 40,
          hp: isHazard ? 2 : 1, speed: 2 + Math.random() * player.level,
          isHazard: isHazard,
          type: isHazard ? (Math.random() < 0.5 ? 'beer' : 'crystal') : 'gromflomite',
          timer: 0
        });
      }
    }

    // Enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
      let e = enemies[i];
      e.timer++;
      if (e.type === 'gromflomite') e.x += Math.sin(e.timer * 0.05) * 3;
      e.y += e.speed;

      // Enemy shoot
      if (e.type === 'gromflomite' && Math.random() < 0.01) {
        projectiles.push({ x: e.x + e.w/2, y: e.y + e.h, vx: 0, vy: 6, isPlayer: false, color: '#FF3333', w: 5, h: 15 });
      }

      if (e.y > canvas.height) enemies.splice(i, 1);
    }

    // Powerups
    for (let i = powerups.length - 1; i >= 0; i--) {
      let pu = powerups[i];
      pu.y += 3;
      if (pu.y > canvas.height) powerups.splice(i, 1);
      
      // Collect
      if (rectIntersect(player.x, player.y, player.w, player.h, pu.x, pu.y, pu.w, pu.h)) {
        playSound('powerup');
        if (pu.type === 'fluid') player.spreadShotTime = 600; // 10 secs
        if (pu.type === 'plumbus') player.shield = 3;
        if (pu.type === 'megaseed') player.megaSeedTime = 400;
        player.score += 50;
        powerups.splice(i, 1);
      }
    }

    // Collisions
    for (let i = projectiles.length - 1; i >= 0; i--) {
      let p = projectiles[i];
      let pRect = { x: p.x - (p.w||4)/2, y: p.y, w: p.w||4, h: p.h||15 };
      
      let hit = false;
      if (p.isPlayer) {
        // Hit boss
        if (boss && rectIntersect(pRect.x, pRect.y, pRect.w, pRect.h, boss.x, boss.y, boss.w, boss.h)) {
          boss.hp--;
          hit = true;
          spawnExplosion(p.x, p.y, '#FF00FF');
          if (boss.hp <= 0) {
            spawnExplosion(boss.x + boss.w/2, boss.y + boss.h/2, '#FFFFFF');
            player.score += 5000;
            boss = null;
          }
        }
        // Hit enemies
        for (let j = enemies.length - 1; j >= 0; j--) {
          let e = enemies[j];
          if (rectIntersect(pRect.x, pRect.y, pRect.w, pRect.h, e.x, e.y, e.w, e.h)) {
            e.hp--;
            hit = true;
            spawnExplosion(p.x, p.y, e.type === 'gromflomite' ? '#00FF66' : '#FFCC00');
            if (e.hp <= 0) {
              player.score += e.isHazard ? 50 : 100;
              // Drop powerup
              if (Math.random() < 0.1) {
                const types = ['fluid', 'plumbus', 'megaseed'];
                powerups.push({ x: e.x, y: e.y, w: 30, h: 30, type: types[Math.floor(Math.random()*types.length)] });
              }
              enemies.splice(j, 1);
            }
            break;
          }
        }
      } else {
        // Hit player
        if (rectIntersect(pRect.x, pRect.y, pRect.w, pRect.h, player.x, player.y, player.w, player.h)) {
          hit = true;
          playerHit();
        }
      }
      if (hit) projectiles.splice(i, 1);
    }

    // Enemy touches player
    for (let i = enemies.length - 1; i >= 0; i--) {
      let e = enemies[i];
      if (rectIntersect(player.x, player.y, player.w, player.h, e.x, e.y, e.w, e.h)) {
        spawnExplosion(e.x + e.w/2, e.y + e.h/2, '#FFAA00');
        enemies.splice(i, 1);
        playerHit();
      }
    }
    
    // Boss touches player
    if (boss && rectIntersect(player.x, player.y, player.w, player.h, boss.x, boss.y, boss.w, boss.h)) {
       playerHit();
       player.y = boss.y + boss.h + 20; // push down
    }

    // Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      let pt = particles[i];
      pt.x += pt.vx; pt.y += pt.vy; pt.life -= 0.05;
      if (pt.life <= 0) particles.splice(i, 1);
    }
  }

  function playerHit() {
    if (player.shield > 0) {
      player.shield--;
      playSound('explosion');
      return;
    }
    spawnExplosion(player.x + player.w/2, player.y + player.h/2, '#00FFFF');
    player.lives--;
    player.spreadShotTime = 0;
    player.megaSeedTime = 0;
    if (player.lives <= 0) {
      currentState = STATE.GAMEOVER;
    }
  }

  function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x2 < x1 + w1 && x2 + w2 > x1 && y2 < y1 + h1 && y2 + h2 > y1;
  }

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Stars
    ctx.fillStyle = '#FFF';
    stars.forEach(s => ctx.fillRect(s.x, s.y, s.size, s.size));

    if (currentState === STATE.START) {
      ctx.fillStyle = '#00FF66';
      ctx.font = 'bold 50px "Courier New"';
      ctx.textAlign = 'center';
      ctx.fillText('C-137 SPACE SHOOTER', canvas.width/2, canvas.height/2 - 50);
      ctx.font = '20px "Courier New"';
      ctx.fillStyle = '#FFF';
      ctx.fillText('CLICK OR PRESS SPACE TO START', canvas.width/2, canvas.height/2 + 20);
      ctx.fillText('WASD / Drag to Move. Auto-fire on Touch.', canvas.width/2, canvas.height/2 + 60);
      return;
    }

    if (currentState === STATE.GAMEOVER) {
      ctx.fillStyle = '#FF0033';
      ctx.font = 'bold 60px "Courier New"';
      ctx.textAlign = 'center';
      ctx.fillText('WASTED', canvas.width/2, canvas.height/2 - 50);
      ctx.font = '30px "Courier New"';
      ctx.fillStyle = '#00FF66';
      ctx.fillText('SCORE: ' + player.score, canvas.width/2, canvas.height/2 + 10);
      ctx.font = '20px "Courier New"';
      ctx.fillStyle = '#FFF';
      ctx.fillText('"Show me what you got? Pathetic." - Rick', canvas.width/2, canvas.height/2 + 60);
      ctx.fillText('CLICK OR PRESS SPACE TO RESTART', canvas.width/2, canvas.height/2 + 100);
      return;
    }

    // Player
    ctx.save();
    ctx.translate(player.x, player.y);
    // Ship body
    ctx.fillStyle = '#00FFFF';
    ctx.beginPath();
    ctx.moveTo(player.w/2, 0);
    ctx.lineTo(player.w, player.h);
    ctx.lineTo(0, player.h);
    ctx.closePath();
    ctx.fill();
    // Engine flame
    if (keys['w'] || keys['arrowup'] || usingMouse) {
      ctx.fillStyle = '#FF6600';
      ctx.beginPath();
      ctx.moveTo(player.w/2 - 10, player.h);
      ctx.lineTo(player.w/2 + 10, player.h);
      ctx.lineTo(player.w/2, player.h + 15 + Math.random()*10);
      ctx.fill();
    }
    // Shield
    if (player.shield > 0) {
      ctx.strokeStyle = '#FF00FF';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(player.w/2, player.h/2, player.w, 0, Math.PI*2);
      ctx.stroke();
    }
    ctx.restore();

    // Projectiles
    projectiles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      if (p.w) ctx.fillRect(p.x - p.w/2, p.y, p.w, p.h);
      else ctx.fillRect(p.x - 2, p.y, 4, 15);
      ctx.shadowBlur = 0;
    });

    // Enemies
    enemies.forEach(e => {
      ctx.save();
      ctx.translate(e.x, e.y);
      if (e.type === 'gromflomite') {
        ctx.fillStyle = '#00FF66';
        ctx.fillRect(0, 0, e.w, e.h);
        ctx.fillStyle = '#000';
        ctx.fillRect(e.w/4, e.h/4, 5, 5); // eye
        ctx.fillRect(e.w - e.w/4 - 5, e.h/4, 5, 5); // eye
      } else if (e.type === 'beer') {
        ctx.fillStyle = '#1E90FF';
        ctx.fillRect(0, 0, e.w, e.h);
        ctx.fillStyle = '#C0C0C0';
        ctx.fillRect(0, 0, e.w, 10);
      } else if (e.type === 'crystal') {
        ctx.fillStyle = '#FF00FF';
        ctx.beginPath();
        ctx.moveTo(e.w/2, 0); ctx.lineTo(e.w, e.h/2); ctx.lineTo(e.w/2, e.h); ctx.lineTo(0, e.h/2);
        ctx.fill();
      }
      ctx.restore();
    });

    // Boss
    if (boss) {
      ctx.save();
      ctx.translate(boss.x, boss.y);
      // Giant Head
      ctx.fillStyle = '#F5DEB3'; // skin
      ctx.beginPath();
      ctx.ellipse(boss.w/2, boss.h/2, boss.w/2, boss.h/2, 0, 0, Math.PI*2);
      ctx.fill();
      // Eyes
      ctx.fillStyle = '#FFF';
      ctx.fillRect(boss.w/4, boss.h/3, 40, 20);
      ctx.fillRect(boss.w - boss.w/4 - 40, boss.h/3, 40, 20);
      ctx.fillStyle = '#000';
      ctx.fillRect(boss.w/4 + 10, boss.h/3 + 5, 10, 10);
      ctx.fillRect(boss.w - boss.w/4 - 20, boss.h/3 + 5, 10, 10);
      // Mouth
      ctx.fillStyle = '#000';
      ctx.fillRect(boss.w/2 - 30, boss.h - 80, 60, Math.max(10, 30 * Math.sin(boss.timer * 0.1)));
      
      // Boss HP Bar
      ctx.fillStyle = '#333';
      ctx.fillRect(0, -20, boss.w, 10);
      ctx.fillStyle = '#FF0033';
      ctx.fillRect(0, -20, boss.w * (boss.hp / boss.maxHp), 10);
      
      ctx.restore();
    }

    // Powerups
    powerups.forEach(pu => {
      ctx.save();
      ctx.translate(pu.x, pu.y);
      if (pu.type === 'fluid') {
        ctx.fillStyle = '#00FF66';
        ctx.beginPath(); ctx.arc(pu.w/2, pu.h/2, pu.w/2, 0, Math.PI*2); ctx.fill();
      } else if (pu.type === 'plumbus') {
        ctx.fillStyle = '#FF69B4';
        ctx.fillRect(0, 0, pu.w, pu.h);
      } else if (pu.type === 'megaseed') {
        ctx.fillStyle = '#8B4513';
        ctx.beginPath(); ctx.ellipse(pu.w/2, pu.h/2, pu.w/4, pu.h/2, 0, 0, Math.PI*2); ctx.fill();
      }
      ctx.restore();
    });

    // Particles
    particles.forEach(pt => {
      ctx.fillStyle = pt.color;
      ctx.globalAlpha = pt.life;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI*2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // HUD
    ctx.fillStyle = '#00FF66';
    ctx.font = 'bold 24px "Courier New"';
    ctx.textAlign = 'left';
    ctx.fillText('SCORE: ' + player.score, 20, 40);
    ctx.fillText('LEVEL: ' + player.level, 20, 70);
    
    // Lives
    ctx.fillStyle = '#FF0033';
    ctx.fillText('LIVES: ' + '♥'.repeat(player.lives), 20, 100);
    
    // Active Powerups
    if (player.spreadShotTime > 0) {
      ctx.fillStyle = '#00FF66';
      ctx.fillRect(20, 120, player.spreadShotTime / 6, 10);
      ctx.fillText('FLUID', 20, 150);
    }
    if (player.megaSeedTime > 0) {
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(20, 170, player.megaSeedTime / 4, 10);
      ctx.fillText('MEGA SEED', 20, 200);
    }
  }

  function loop() {
    update();
    draw();
    animationId = requestAnimationFrame(loop);
  }

  const startHandler = (e) => {
    if (currentState === STATE.START || currentState === STATE.GAMEOVER) {
      if (e.type === 'keydown' && e.key !== ' ') return;
      initAudio();
      resetGame();
      currentState = STATE.PLAYING;
    }
  };
  window.addEventListener('keydown', startHandler);
  canvas.addEventListener('mousedown', startHandler);
  canvas.addEventListener('touchstart', startHandler);

  resetGame();
  loop();
  
  return {
    stop: () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', startHandler);
      canvas.removeEventListener('mousedown', startHandler);
      canvas.removeEventListener('touchstart', startHandler);
    }
  };
};
