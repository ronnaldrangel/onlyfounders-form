"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import InleadForm from "./components/InleadForm";
import { ThemeToggle } from "./components/ThemeToggle";

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 relative transition-colors duration-300">
      {/* Theme toggle - top right */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      {/* Back button - top left corner of the page */}
      {currentStep > 0 && !isCompleted && (
        <motion.button
          type="button"
          onClick={handlePrev}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-6 left-6 p-2 text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-1 text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Atrás
        </motion.button>
      )}

      <div className="max-w-lg mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logos/logo_black.png"
            alt="Logo"
            width={140}
            height={80}
            className="object-contain dark:invert"
          />
        </div>

        {/* Form */}
        <InleadForm 
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          isCompleted={isCompleted}
          setIsCompleted={setIsCompleted}
        />
      </div>
    </main>
  );
}
