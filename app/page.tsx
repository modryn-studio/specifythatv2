'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Zap, Layers, Code2 } from 'lucide-react';
import Link from 'next/link';
import FeatureCard from '@/components/FeatureCard';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function LandingPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col"
    >
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/10 border border-accent-500/20 mb-6">
              <Zap className="w-4 h-4 text-accent-400" />
              <span className="text-accent-300 text-sm font-medium">Planning & Prompt Engine</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">SpecifyThat</span>
            </h1>
            <p className="text-xl md:text-2xl text-dark-300 max-w-2xl mx-auto leading-relaxed">
              Transform raw ideas into <span className="text-white font-medium">build-ready specs</span> in under 60 seconds
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link
              href="/input"
              data-testid="start-new-spec-btn"
              className="group flex items-center gap-3 px-8 py-4 bg-accent-600 hover:bg-accent-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-accent-600/25 hover:shadow-accent-500/40 btn-pulse"
            >
              <Sparkles className="w-5 h-5" />
              Start New Spec
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-3 gap-6 mt-12"
          >
            <FeatureCard
              icon={Layers}
              title="13 Strategic Questions"
              description="Automatically answered based on your project description"
            />
            <FeatureCard
              icon={Zap}
              title="Under 60 Seconds"
              description="From idea to complete spec faster than you can explain it"
            />
            <FeatureCard
              icon={Code2}
              title="AI-Builder Ready"
              description="Optimized for Cursor, Claude, ChatGPT, Bolt, v0 & Emergent"
            />
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-dark-500 text-sm border-t border-dark-800">
        Built for the future of spec writing
      </footer>
    </motion.div>
  );
}
