'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FileText, Target, Layers, Sparkles } from 'lucide-react';
import { getDescription, setAnswers } from '@/lib/store';
import { generateAllAnswers } from '@/lib/mockEngine';

const stages = [
  { threshold: 0, text: "Analyzing your project...", icon: FileText },
  { threshold: 30, text: "Answering strategic questions...", icon: Target },
  { threshold: 60, text: "Building specification...", icon: Layers },
  { threshold: 85, text: "Finalizing details...", icon: Sparkles }
];

export default function LoadingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const description = getDescription();
    
    // If no description, redirect back to input
    if (!description) {
      router.replace('/input');
      return;
    }

    const duration = 3500; // 3.5 seconds
    const interval = 50;
    const steps = duration / interval;
    let currentStep = 0;

    const progressInterval = setInterval(() => {
      currentStep++;
      const newProgress = Math.min((currentStep / steps) * 100, 100);
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(progressInterval);
        // Generate answers
        const generatedAnswers = generateAllAnswers(description);
        setAnswers(generatedAnswers);
        router.push('/review');
      }
    }, interval);

    return () => clearInterval(progressInterval);
  }, [router]);

  const currentStage = [...stages].reverse().find(s => progress >= s.threshold) || stages[0];
  const StageIcon = currentStage.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center px-4"
    >
      <div className="w-full max-w-md text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center"
        >
          <StageIcon className="w-10 h-10 text-accent-400" />
        </motion.div>

        <motion.h2
          key={currentStage.text}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-semibold text-white mb-6"
        >
          {currentStage.text}
        </motion.h2>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-gradient-to-r from-accent-600 to-accent-400 rounded-full"
          />
        </div>

        <p className="text-dark-500 text-sm">{Math.round(progress)}% complete</p>

        {/* Stage Indicators */}
        <div className="flex justify-between mt-8 px-4">
          {stages.map((stage, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center gap-2 ${
                progress >= stage.threshold ? 'text-accent-400' : 'text-dark-600'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${
                progress >= stage.threshold ? 'bg-accent-500' : 'bg-dark-700'
              }`} />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
