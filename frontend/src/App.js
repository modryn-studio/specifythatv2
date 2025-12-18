import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, FileText, Target, Lock, Cloud, CheckSquare, XSquare,
  Database, GitBranch, Route, Server, ListOrdered, Award,
  ArrowRight, Upload, Loader2, Check, Edit3, X, Copy, Download,
  RotateCcw, ChevronDown, ChevronUp, Zap, Layers, Code2
} from 'lucide-react';
import { generateAllAnswers, questions, generateSpecMarkdown } from './mockEngine';
import './App.css';

// Icon mapping
const iconMap = {
  Sparkles, FileText, Target, Lock, Cloud, CheckSquare, XSquare,
  Database, GitBranch, Route, Server, ListOrdered, Award
};

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

// Landing Page Component
function LandingPage({ onStart }) {
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
            <button
              onClick={onStart}
              data-testid="start-new-spec-btn"
              className="group flex items-center gap-3 px-8 py-4 bg-accent-600 hover:bg-accent-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-accent-600/25 hover:shadow-accent-500/40 btn-pulse"
            >
              <Sparkles className="w-5 h-5" />
              Start New Spec
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-3 gap-6 mt-12"
          >
            {[
              {
                icon: Layers,
                title: "13 Strategic Questions",
                description: "Automatically answered based on your project description"
              },
              {
                icon: Zap,
                title: "Under 60 Seconds",
                description: "From idea to complete spec faster than you can explain it"
              },
              {
                icon: Code2,
                title: "AI-Builder Ready",
                description: "Optimized for Cursor, Claude, ChatGPT, Bolt, v0 & Emergent"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="p-6 rounded-2xl bg-dark-800/50 border border-dark-700/50 card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center mb-4 mx-auto">
                  <feature.icon className="w-6 h-6 text-accent-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-dark-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
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

// Input Page Component
function InputPage({ onSubmit }) {
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = useCallback((file) => {
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
      const text = e.target.result.slice(0, 10240); // First 10KB
      setDescription(prev => prev ? `${prev}\n\n${text}` : text);
      setFileName(file.name);
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  }, [handleFileUpload]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (description.trim()) {
      onSubmit(description.trim());
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
              onChange={(e) => setDescription(e.target.value)}
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
                  onChange={(e) => handleFileUpload(e.target.files[0])}
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

// Loading Page Component
function LoadingPage({ progress }) {
  const stages = [
    { threshold: 0, text: "Analyzing your project...", icon: FileText },
    { threshold: 30, text: "Answering strategic questions...", icon: Target },
    { threshold: 60, text: "Building specification...", icon: Layers },
    { threshold: 85, text: "Finalizing details...", icon: Sparkles }
  ];

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

// Answer Card Component
function AnswerCard({ question, answer, isEdited, onEdit, onSave, onCancel, editingId }) {
  const [editValue, setEditValue] = useState(answer);
  const isEditing = editingId === question.id;
  const Icon = iconMap[question.icon] || FileText;

  useEffect(() => {
    setEditValue(answer);
  }, [answer]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border transition-all duration-300 ${
        isEditing 
          ? 'border-accent-500 bg-dark-800/80 shadow-lg shadow-accent-500/10' 
          : 'border-dark-700/50 bg-dark-800/50 hover:border-dark-600'
      }`}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isEditing ? 'bg-accent-500/20' : 'bg-dark-700/50'
            }`}>
              <Icon className={`w-5 h-5 ${isEditing ? 'text-accent-400' : 'text-dark-400'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-dark-500 text-sm font-medium">Q{question.id}</span>
                {isEdited && (
                  <span className="px-2 py-0.5 rounded-full bg-accent-500/10 text-accent-400 text-xs font-medium">
                    ✓ Edited
                  </span>
                )}
              </div>
              <h3 className="text-white font-semibold">{question.section}</h3>
            </div>
          </div>
          
          {!isEditing && (
            <button
              onClick={() => onEdit(question.id)}
              data-testid={`edit-answer-${question.id}`}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700 transition-colors text-sm"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>

        {/* Content */}
        {isEditing ? (
          <div className="space-y-4">
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              data-testid={`edit-textarea-${question.id}`}
              className="w-full h-40 p-4 bg-dark-900/50 border border-dark-600 rounded-xl text-white placeholder-dark-500 resize-none focus:outline-none focus:border-accent-500 transition-colors"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={onCancel}
                data-testid={`cancel-edit-${question.id}`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={() => onSave(question.id, editValue)}
                data-testid={`save-edit-${question.id}`}
                className="flex items-center gap-2 px-4 py-2 bg-accent-600 hover:bg-accent-500 text-white rounded-lg transition-colors"
              >
                <Check className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="text-dark-300 whitespace-pre-wrap leading-relaxed text-sm">
            {answer}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Review Page Component
function ReviewPage({ answers, editedQuestions, onEdit, onSave, onCancel, editingId, onGenerate }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-12 px-4"
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Review Your Spec
          </h2>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-green-300 text-sm font-medium">
              13 of 13 questions answered
            </span>
          </div>
        </motion.div>

        {/* Answer Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-4 mb-8"
        >
          {questions.map((q) => (
            <AnswerCard
              key={q.id}
              question={q}
              answer={answers[q.id]}
              isEdited={editedQuestions.includes(q.id)}
              onEdit={onEdit}
              onSave={onSave}
              onCancel={onCancel}
              editingId={editingId}
            />
          ))}
        </motion.div>

        {/* Generate Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="sticky bottom-6 z-10"
        >
          <button
            onClick={onGenerate}
            disabled={editingId !== null}
            data-testid="generate-final-spec-btn"
            className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-accent-600 hover:bg-accent-500 disabled:bg-dark-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-accent-600/30 hover:shadow-accent-500/40 disabled:shadow-none"
          >
            <Sparkles className="w-5 h-5" />
            Generate Spec
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Final Spec Page Component
function FinalSpecPage({ spec, projectName, onStartOver }) {
  const [copied, setCopied] = useState(false);

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
            onClick={onStartOver}
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

// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState('landing'); // landing, input, loading, review, final
  const [projectDescription, setProjectDescription] = useState('');
  const [answers, setAnswers] = useState({});
  const [editedQuestions, setEditedQuestions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [finalSpec, setFinalSpec] = useState('');

  const handleStart = () => {
    setCurrentPage('input');
  };

  const handleSubmitDescription = (description) => {
    setProjectDescription(description);
    setCurrentPage('loading');
    setLoadingProgress(0);

    // Simulate loading with progress
    const duration = 3500; // 3.5 seconds
    const interval = 50;
    const steps = duration / interval;
    let currentStep = 0;

    const progressInterval = setInterval(() => {
      currentStep++;
      const progress = Math.min((currentStep / steps) * 100, 100);
      setLoadingProgress(progress);

      if (currentStep >= steps) {
        clearInterval(progressInterval);
        // Generate answers
        const generatedAnswers = generateAllAnswers(description);
        setAnswers(generatedAnswers);
        setCurrentPage('review');
      }
    }, interval);
  };

  const handleEdit = (questionId) => {
    setEditingId(questionId);
  };

  const handleSave = (questionId, newAnswer) => {
    setAnswers(prev => ({ ...prev, [questionId]: newAnswer }));
    if (!editedQuestions.includes(questionId)) {
      setEditedQuestions(prev => [...prev, questionId]);
    }
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleGenerateFinal = () => {
    const spec = generateSpecMarkdown(answers[1], answers);
    setFinalSpec(spec);
    setCurrentPage('final');
  };

  const handleStartOver = () => {
    setCurrentPage('landing');
    setProjectDescription('');
    setAnswers({});
    setEditedQuestions([]);
    setEditingId(null);
    setLoadingProgress(0);
    setFinalSpec('');
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-dark-900 via-dark-900 to-accent-900/20 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {currentPage === 'landing' && (
            <LandingPage key="landing" onStart={handleStart} />
          )}
          {currentPage === 'input' && (
            <InputPage key="input" onSubmit={handleSubmitDescription} />
          )}
          {currentPage === 'loading' && (
            <LoadingPage key="loading" progress={loadingProgress} />
          )}
          {currentPage === 'review' && (
            <ReviewPage
              key="review"
              answers={answers}
              editedQuestions={editedQuestions}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
              editingId={editingId}
              onGenerate={handleGenerateFinal}
            />
          )}
          {currentPage === 'final' && (
            <FinalSpecPage
              key="final"
              spec={finalSpec}
              projectName={answers[1] || 'Project'}
              onStartOver={handleStartOver}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
