import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

export const Hero = () => {
  const scrollToRegister = () => {
    const element = document.querySelector('#register');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToAbout = () => {
    const element = document.querySelector('#about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      <div className="container mx-auto text-center relative z-10 max-w-6xl">
        {/* Main Title - Vertical Stack */}
        <motion.div
          className="flex flex-col items-center justify-center space-y-8 sm:space-y-12 mb-8 sm:mb-12"
        >
          {/* SPARDHA - Top */}
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-gradient animate-glow-pulse font-audiowide leading-tight" 
            style={{fontFamily: 'Audiowide, cursive'}}
          >
            SPARDHA
          </motion.h1>

          {/* 2025 - Bottom */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-foreground font-audiowide mt-16 sm:mt-20"
            style={{fontFamily: 'Audiowide, cursive'}}
          >
            2025
          </motion.div>
        </motion.div>

        {/* Subtitle - Responsive */}
        <motion.div
          className="space-y-2 sm:space-y-4 mb-8 sm:mb-12 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-base sm:text-xl md:text-2xl text-muted-foreground font-light">
            The Annual Techno-Cultural Fest of VVIT
          </p>
          <p className="text-sm sm:text-lg md:text-xl text-primary font-medium">
            Presented by ACM VVITU Student Chapter
          </p>
        </motion.div>

        {/* Call to Action Buttons - Responsive */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          <Button
            onClick={scrollToRegister}
            size="lg"
            className="w-full sm:w-auto dashboard-glass text-base sm:text-lg px-6 sm:px-8 py-3 hover:scale-105 transition-all duration-300 border-primary/30 hover:border-primary/50"
          >
            Register Now
          </Button>
          
          <Button
            onClick={scrollToAbout}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto crystal-glass text-base sm:text-lg px-6 sm:px-8 py-3 hover:scale-105 transition-all duration-300"
          >
            Learn More
          </Button>
        </motion.div>

        {/* Scroll Indicator - Hidden on mobile */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          <motion.div
            className="cursor-pointer"
            onClick={scrollToAbout}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-6 h-6 text-primary" />
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements - Reduced on mobile */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full hidden sm:block"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </section>
  );
};