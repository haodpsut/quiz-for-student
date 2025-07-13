
import React from 'react';
import { SUBJECTS } from '../constants';

interface SubjectSelectorProps {
  onSelectSubject: (subject: string) => void;
}

const SubjectSelector: React.FC<SubjectSelectorProps> = ({ onSelectSubject }) => {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-extrabold text-center text-white mb-4">Choose a Subject</h1>
      <p className="text-lg text-slate-400 text-center mb-12">Select a topic below to start your quiz.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SUBJECTS.map(subject => (
          <button
            key={subject}
            onClick={() => onSelectSubject(subject)}
            className="group bg-slate-800 p-8 rounded-xl border border-slate-700 hover:border-cyan-500 hover:bg-slate-700/50 transition-all duration-300 transform hover:-translate-y-1"
          >
            <h2 className="text-2xl font-bold text-slate-200 group-hover:text-cyan-400 transition-colors duration-300">{subject}</h2>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubjectSelector;
