import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Preloader } from '@/components/layout/Preloader';
import { Header } from '@/components/layout/Header';
import { VanillaThreeBackground } from '@/components/3d/VanillaThreeBackground';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Events } from '@/components/sections/Events';
import { Navigation } from '@/components/sections/Navigation';
import { RegistrationForm } from '@/components/forms/RegistrationForm';
import { PromoVideo } from '@/components/sections/PromoVideo';
import { Contact } from '@/components/sections/Contact';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Set initial theme
    document.documentElement.classList.add('dark');
  }, []);

  const handleThemeToggle = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
    document.documentElement.classList.toggle('light');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatePresence>
        {isLoading && (
          <Preloader onLoadingComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="fixed inset-0 w-full h-full object-cover"
            style={{ zIndex: 0 }}
          >
            <source src="/src/assets/Of_course_here_202507160457.mp4" type="video/mp4" />
          </video>
          <Header isDark={isDark} onThemeToggle={handleThemeToggle} />
          
          <main className="relative z-10 pt-20">
            <Hero />
            <About />
            <Events />
            <PromoVideo />
            <Navigation />
            
            <section id="register" className="py-20">
              <div className="container mx-auto px-6">
                <RegistrationForm />
              </div>
            </section>
            
            <Contact />
          </main>

          <footer className="relative z-10 py-8 border-t border-border/30">
            <div className="container mx-auto px-6 text-center">
              <p className="text-muted-foreground">
                &copy; 2025 Spardha | ACM VVITU Student Chapter. All Rights Reserved.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Designed with 💜 for the future
              </p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default Index;
