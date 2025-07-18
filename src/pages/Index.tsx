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
          {/* Background Spline Model */}
          <div className="fixed inset-0 w-full h-full" style={{ zIndex: 0 }}>
            <iframe 
              src='https://my.spline.design/blackholewallpaperforlivelywallpaper-qaCLpW6NEH9x15P6N2Ket8Qd/'
              frameBorder='0' 
              width='100%' 
              height='100%'
              className="w-full h-full"
              style={{ 
                minHeight: '100vh',
                minWidth: '100vw',
                border: 'none'
              }}
            />
            {/* Hide Spline watermark - responsive across all screen sizes */}
            <div 
              className="absolute bottom-0 right-0 bg-background w-48 h-16 sm:w-56 sm:h-20 md:w-64 md:h-24 lg:w-72 lg:h-28 xl:w-80 xl:h-32"
              style={{
                zIndex: 1
              }}
            />
          </div>
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
