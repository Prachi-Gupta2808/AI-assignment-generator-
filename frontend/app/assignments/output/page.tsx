// app/assignments/output/page.tsx
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Download, ArrowLeft, CheckCircle } from 'lucide-react';
import { AssignmentPreview } from '@/components/assignments/AssignmentPreview';
import { Button } from '@/components/ui/custom-ui';
import { mockAcademicAssignment } from '@/data/mockData';

const mockPaper = {
  schoolName: mockAcademicAssignment.schoolName,
  subject: 'Science',
  className: 'Class 5',
  timeAllowed: mockAcademicAssignment.timeAllowed,
  totalMarks: mockAcademicAssignment.maxMarks,
  totalQuestions: mockAcademicAssignment.questions.length,
  sections: [
    {
      title: mockAcademicAssignment.section,
      instruction: mockAcademicAssignment.sectionSubtitle,
      questions: mockAcademicAssignment.questions.map((q) => ({
        questionNumber: q.id,
        text: q.text,
        difficulty: q.difficulty,
        marks: q.marks,
        answer: mockAcademicAssignment.answerKeys.find((a) => a.id === q.id)?.text || '',
      })),
    },
  ],
};

export default function AssignmentOutputPage() {
  const router = useRouter();
  const [downloading, setDownloading] = React.useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert('Your PDF is being generated and will download automatically!');
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6 select-none relative min-h-[calc(100vh-10rem)] pb-12">
      {/* 1. Page Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h1 className="text-xl lg:text-2xl font-extrabold text-neutral-800 tracking-tight">
              AI Output Preview
            </h1>
          </div>
          <p className="text-xs text-neutral-400 font-semibold mt-1">
            Review the generated question paper and answers.
          </p>
        </div>

        {/* Previous step arrow */}
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/assignments/create')}
          className="rounded-full px-5 py-2 font-bold text-xs h-10 border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50 flex items-center gap-2 shadow-none sm:self-center self-start"
        >
          <ArrowLeft size={13} strokeWidth={2.5} />
          <span>Edit Details</span>
        </Button>
      </div>

      {/* 2. Top Black AI Response Banner with Download CTA */}
      <div className="bg-black text-white rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-lg border border-neutral-800 select-text">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-5 h-5 rounded-md bg-[#FF6A2B] flex items-center justify-center text-white text-[10px] font-extrabold font-sans select-none shrink-0">
              V
            </div>
            <span className="text-[10px] font-bold text-[#FF6A2B] uppercase tracking-widest font-sans select-none">
              VedaAI Generated Response
            </span>
          </div>
          
          <p className="text-xs sm:text-sm font-semibold leading-relaxed tracking-wide text-neutral-200">
            Certainly, Lakshya! Here is a customized Question Paper for your CBSE Grade 5 Science classes on the NCERT chapters:
          </p>
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="bg-white text-black hover:bg-neutral-100 rounded-full px-6 py-3 font-semibold text-xs tracking-wide flex items-center gap-2 transition-all cursor-pointer active:scale-95 disabled:opacity-50 shrink-0 shadow-md select-none font-sans"
        >
          {downloading ? (
            <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <Download size={14} className="text-black" strokeWidth={2.5} />
          )}
          <span>{downloading ? 'Downloading...' : 'Download as PDF'}</span>
        </button>
      </div>

      {/* 3. Printable A4 Document Preview Container (Fully responsive scrollable envelope) */}
      <div className="bg-neutral-200/50 rounded-2xl p-4 lg:p-6 border border-neutral-300/40 shadow-inner overflow-hidden">
        <AssignmentPreview paper={mockPaper} />
      </div>

      {/* 4. Complete Action Footer */}
      <div className="flex justify-end gap-3 select-none">
        <Button
          type="button"
          onClick={() => {
            alert('Assignment has been successfully assigned to Delhi Public School Grade 5 classes!');
            router.push('/assignments');
          }}
          className="rounded-full px-8 py-3.5 font-bold text-xs tracking-wide bg-[#FF6A2B] text-white hover:bg-[#e0581f] flex items-center gap-2 shadow-[0_4px_14px_rgba(255,106,43,0.3)] hover:shadow-[0_6px_18px_rgba(255,106,43,0.45)] border-0"
        >
          <CheckCircle size={14} strokeWidth={2.5} />
          <span>Publish & Assign</span>
        </Button>
      </div>
    </div>
  );
}
