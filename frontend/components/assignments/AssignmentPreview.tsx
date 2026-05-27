'use client';

import * as React from 'react';

interface Question {
  questionNumber: number;
  text: string;
  difficulty: string;
  marks: number;
  answer?: string;
  _id?: string;
}

interface Section {
  title: string;
  instruction: string;
  questions: Question[];
  _id?: string;
}

interface PaperData {
  schoolName: string;
  subject: string;
  className: string;
  timeAllowed: string;
  totalMarks: number;
  totalQuestions: number;
  sections: Section[];
}

interface AssignmentPreviewProps {
  paper: PaperData;
}

const formatClassValue = (val: string) => {
  if (!val) return '';
  return val.replace(/^class\s*:?\s*/i, '').trim();
};

export function AssignmentPreview({ paper }: AssignmentPreviewProps) {
  if (!paper) return null;

  return (
    <div className="w-full overflow-x-auto py-4 select-text">
      {/* Simulation of A4 Paper Sheet (Centered, white background, realistic shadow) */}
      <div id="printable-paper" className="w-[800px] min-h-[1130px] mx-auto bg-white border border-neutral-300 shadow-[0_12px_40px_rgba(0,0,0,0.08)] p-12 flex flex-col justify-between font-serif text-neutral-800 text-sm leading-relaxed shrink-0">
        
        {/* UPPER DOCUMENT HEADERS */}
        <div>
          {/* School Name */}
          <h1 className="text-xl font-bold text-center text-neutral-900 uppercase tracking-wide font-sans mb-1">
            {paper.schoolName || 'Delhi Public School'}
          </h1>
          
          {/* Subject & Class */}
          <h2 className="text-sm font-bold text-center text-neutral-700 font-sans mb-1.5">
            Subject: {paper.subject || 'General'}
          </h2>
          
          {/* Class label */}
          <h3 className="text-xs font-semibold text-center text-neutral-600 font-sans mb-6">
            Class: {formatClassValue(paper.className || '10')}
          </h3>

          {/* Time & Marks Headers */}
          <div className="flex justify-between items-center text-xs font-bold text-neutral-800 border-b border-neutral-800 pb-2 mb-4 font-sans">
            <div>Time Allowed: {paper.timeAllowed || '3 Hours'}</div>
            <div>Maximum Marks: {paper.totalMarks || 0}</div>
          </div>

          {/* Student identifier fields */}
          <div className="grid grid-cols-2 gap-4 max-w-sm mb-8 text-xs font-bold text-neutral-800 font-sans">
            <div className="flex items-center gap-1">
              <span>Name:</span>
              <div className="flex-1 border-b border-neutral-400 h-4 min-w-[120px]" />
            </div>
            <div className="flex items-center gap-1">
              <span>Roll Number:</span>
              <div className="flex-1 border-b border-neutral-400 h-4 min-w-[80px]" />
            </div>
            <div className="flex items-center gap-1 col-span-2">
              <span>Class: {formatClassValue(paper.className || '10')} Section:</span>
              <div className="flex-1 border-b border-neutral-400 h-4 min-w-[160px]" />
            </div>
          </div>

          {/* SECTIONS & QUESTIONS LIST */}
          {paper.sections && paper.sections.map((section, sIdx) => (
            <div key={section._id || sIdx} className="mb-8">
              {/* SECTION DIVIDER */}
              <div className="text-center mb-6">
                <h4 className="text-sm font-extrabold uppercase tracking-widest text-neutral-900 border-b-2 border-neutral-900 inline-block px-4 pb-1 mb-2 font-sans">
                  {section.title}
                </h4>
                <p className="text-xs font-bold text-neutral-800 uppercase tracking-wider font-sans">
                  {section.instruction}
                </p>
              </div>

              {/* QUESTIONS */}
              <div className="flex flex-col gap-5">
                {section.questions && section.questions.map((q, qIdx) => {
                  const displayDifficulty = q.difficulty === 'Medium' ? 'Moderate' : q.difficulty === 'Hard' ? 'Challenging' : q.difficulty;
                  return (
                    <div key={q._id || qIdx} className="flex items-start gap-2.5">
                      <span className="font-bold text-neutral-900 shrink-0 w-5">{q.questionNumber || (qIdx + 1)}.</span>
                      <div className="flex-1 text-neutral-850">
                        <span className="font-bold mr-1.5">({displayDifficulty})</span>
                        <span className="whitespace-pre-line">{q.text}</span>
                      </div>
                      <span className="font-bold text-neutral-900 shrink-0 ml-4 font-sans text-xs">
                        [{q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}]
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* END OF PAPER INDICATOR */}
          <div className="text-center py-3 border-y border-dashed border-neutral-300 text-xs font-bold text-neutral-400 tracking-widest font-sans mb-10 select-none">
            End of Question Paper
          </div>
        </div>

        {/* ANSWER KEY SECTION */}
        <div className="border-t-2 border-neutral-800 pt-6">
          <h4 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wider mb-4 font-sans">
            Answer Key:
          </h4>
          <div className="flex flex-col gap-4 text-xs text-neutral-600">
            {paper.sections && paper.sections.flatMap((sec) => sec.questions || []).map((q, index) => {
              if (!q.answer) return null;
              return (
                <div key={q._id || index} className="flex items-start gap-3 leading-relaxed">
                  <span className="font-bold text-neutral-800 shrink-0 w-8">Q{q.questionNumber || (index + 1)}.</span>
                  <p className="whitespace-pre-line flex-1">{q.answer}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

export default AssignmentPreview;
