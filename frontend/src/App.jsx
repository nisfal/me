import React from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import Hero from './components/hero/Hero';

function AppContent() {
  const { theme } = useTheme();

  return (
    <Layout>
      <Hero />
      <section className="mt-20 text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-3xl font-bold mb-6">
          {theme === 'dark' ? 'Backend Architecture' : 'Frontend Experience'}
        </h2>
        <p className="text-lg opacity-80 max-w-2xl mx-auto">
          {theme === 'dark'
            ? 'Exploring microservices, database optimization, Redis caching, and scalable REST/GraphQL APIs.'
            : 'Crafting pixel-perfect, accessible, and responsive user interfaces using React, Angular, and Tailwind.'}
        </p>
      </section>
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
