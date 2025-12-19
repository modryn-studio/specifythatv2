'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className="p-6 rounded-2xl bg-dark-800/50 border border-dark-700/50 card-hover"
    >
      <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center mb-4 mx-auto">
        <Icon className="w-6 h-6 text-accent-400" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-dark-400 text-sm">{description}</p>
    </motion.div>
  );
}
