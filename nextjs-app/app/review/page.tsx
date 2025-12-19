'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Check } from 'lucide-react';
import { getAnswers, setAnswers, getEditedQuestions, setEditedQuestions, setFinalSpec } from '@/lib/store';
import { questions, generateSpecMarkdown, type Answers } from '@/lib/mockEngine';
import AnswerCard from '@/components/AnswerCard';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function ReviewPage() {
  const router = useRouter();
  const [answers, setAnswersLocal] = useState<Answers>({});
  const [editedQuestions, setEditedQuestionsLocal] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedAnswers = getAnswers();
    const storedEdited = getEditedQuestions();
    
    // If no answers, redirect back to input
    if (Object.keys(storedAnswers).length === 0) {
      router.replace('/input');
      return;
    }
    
    setAnswersLocal(storedAnswers);
    setEditedQuestionsLocal(storedEdited);
    setIsLoaded(true);
  }, [router]);

  const handleEdit = (questionId: number) => {
    setEditingId(questionId);
  };

  const handleSave = (questionId: number, newAnswer: string) => {
    const updatedAnswers = { ...answers, [questionId]: newAnswer };
    setAnswersLocal(updatedAnswers);
    setAnswers(updatedAnswers);
    
    if (!editedQuestions.includes(questionId)) {
      const updatedEdited = [...editedQuestions, questionId];
      setEditedQuestionsLocal(updatedEdited);
      setEditedQuestions(updatedEdited);
    }
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleGenerateFinal = () => {
    const spec = generateSpecMarkdown(answers[1] || 'Project', answers);
    setFinalSpec(spec);
    router.push('/final');
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
              answer={answers[q.id] || ''}
              isEdited={editedQuestions.includes(q.id)}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
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
            onClick={handleGenerateFinal}
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
