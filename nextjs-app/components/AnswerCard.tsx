'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Edit3, X, Check } from 'lucide-react';
import {
  Sparkles, Target, Lock, Cloud, CheckSquare, XSquare,
  Database, GitBranch, Route, Server, ListOrdered, Award
} from 'lucide-react';
import type { Question } from '@/lib/mockEngine';

// Icon mapping
const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Sparkles, FileText, Target, Lock, Cloud, CheckSquare, XSquare,
  Database, GitBranch, Route, Server, ListOrdered, Award
};

interface AnswerCardProps {
  question: Question;
  answer: string;
  isEdited: boolean;
  onEdit: (id: number) => void;
  onSave: (id: number, value: string) => void;
  onCancel: () => void;
  editingId: number | null;
}

export default function AnswerCard({ 
  question, 
  answer, 
  isEdited, 
  onEdit, 
  onSave, 
  onCancel, 
  editingId 
}: AnswerCardProps) {
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
