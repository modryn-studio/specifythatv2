'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Check, Copy, Download, RotateCcw, Zap } from 'lucide-react';
import { getFinalSpec, getAnswers, clearSession } from '@/lib/store';

export default function FinalPage() {
  const router = useRouter();
  const [spec, setSpec] = useState('');
  const [projectName, setProjectName] = useState('Project');
  const [copied, setCopied] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedSpec = getFinalSpec();
    const answers = getAnswers();
    
    // If no spec, redirect back
    if (!storedSpec) {
      router.replace('/input');
      return;
    }
    
    setSpec(storedSpec);
    setProjectName(answers[1] || 'Project');
    setIsLoaded(true);
  }, [router]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(spec);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([spec], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '-').toLowerCase()}-spec.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleStartOver = () => {
    clearSession();
    router.push('/');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-12 px-4"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-green-300 text-sm font-medium">Spec Generated!</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Your Project Specification
          </h2>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-8"
        >
          <button
            onClick={handleCopy}
            data-testid="copy-spec-btn"
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              copied 
                ? 'bg-green-500 text-white' 
                : 'bg-accent-600 hover:bg-accent-500 text-white shadow-lg shadow-accent-600/25'
            }`}
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
          
          <button
            onClick={handleDownload}
            data-testid="download-spec-btn"
            className="flex items-center gap-2 px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-xl font-medium transition-colors"
          >
            <Download className="w-5 h-5" />
            Download .md
          </button>
        </motion.div>

        {/* Spec Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-dark-700 bg-dark-800/50 overflow-hidden mb-8"
        >
          <div className="p-4 border-b border-dark-700 bg-dark-800/80 flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <span className="text-dark-400 text-sm font-mono">{projectName.replace(/\s+/g, '-').toLowerCase()}-spec.md</span>
          </div>
          <pre className="p-6 overflow-x-auto text-dark-300 text-sm font-mono whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
            {spec}
          </pre>
        </motion.div>

        {/* Next Step Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl bg-accent-500/5 border border-accent-500/20 mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-accent-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">📋 Next Step</h3>
              <p className="text-dark-300">
                Paste this into your favorite AI creator (<span className="text-accent-400">Cursor</span>, <span className="text-accent-400">VS Code Copilot</span>, <span className="text-accent-400">Claude</span>, <span className="text-accent-400">ChatGPT</span>, <span className="text-accent-400">Bolt</span>, <span className="text-accent-400">v0</span>, or <span className="text-accent-400">Emergent</span>) and start building!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Start Over Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <button
            onClick={handleStartOver}
            data-testid="start-over-btn"
            className="inline-flex items-center gap-2 px-6 py-3 text-dark-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Start Over
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
