'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Sparkles, Upload, ArrowRight } from 'lucide-react';
import { setDescription } from '@/lib/store';

export default function InputPage() {
  const router = useRouter();
  const [description, setDescriptionLocal] = useState('');
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = useCallback((file: File | null) => {
    if (!file) return;
    
    const validTypes = ['text/plain', 'text/markdown', 'text/x-markdown'];
    const validExtensions = ['.txt', '.md'];
    const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    
    if (!validTypes.includes(file.type) && !hasValidExtension) {
      alert('Please upload a .txt or .md file');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be under 10MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string)?.slice(0, 10240) || ''; // First 10KB
      setDescriptionLocal(prev => prev ? `${prev}\n\n${text}` : text);
      setFileName(file.name);
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  }, [handleFileUpload]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      setDescription(description.trim());
      router.push('/loading-spec');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center px-4 py-12"
    >
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Describe Your Project
          </h2>
          <p className="text-dark-400 text-lg">
            What does it do and who is it for?
          </p>
        </motion.div>

        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div
            className={`relative rounded-2xl border-2 transition-all duration-300 ${
              isDragging 
                ? 'border-accent-500 bg-accent-500/5' 
                : 'border-dark-700 bg-dark-800/50 hover:border-dark-600'
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <textarea
              value={description}
              onChange={(e) => setDescriptionLocal(e.target.value)}
              placeholder="e.g., A task management app for remote teams that helps them coordinate work and track progress without constant meetings..."
              data-testid="project-description-input"
              className="w-full h-48 md:h-64 p-6 bg-transparent text-white placeholder-dark-500 resize-none focus:outline-none text-lg"
            />
            
            {/* File Upload Zone */}
            <div className="p-4 border-t border-dark-700/50">
              <label
                className="flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-dashed border-dark-600 hover:border-accent-500/50 cursor-pointer transition-colors group"
              >
                <Upload className="w-5 h-5 text-dark-500 group-hover:text-accent-400 transition-colors" />
                <span className="text-dark-400 group-hover:text-dark-300 transition-colors text-sm">
                  {fileName || 'Drop or click to upload .txt or .md (up to 10MB)'}
                </span>
                <input
                  type="file"
                  accept=".txt,.md"
                  onChange={(e) => handleFileUpload(e.target.files?.[0] || null)}
                  className="hidden"
                  data-testid="file-upload-input"
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={!description.trim()}
            data-testid="generate-spec-btn"
            className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-accent-600 hover:bg-accent-500 disabled:bg-dark-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-accent-600/25 hover:shadow-accent-500/40 disabled:shadow-none"
          >
            <Sparkles className="w-5 h-5" />
            Generate My Spec
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.form>
      </div>
    </motion.div>
  );
}
