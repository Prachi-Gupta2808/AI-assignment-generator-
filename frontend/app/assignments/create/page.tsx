'use client';

import { createAssignment, getAssignment } from '@/app/lib/api';
import { QuestionTypeRow } from '@/components/assignments/QuestionTypeRow';
import { Button, Input } from '@/components/ui/custom-ui';
import { UploadDropzone } from '@/components/ui/UploadDropzone';
import { QuestionTypeRowConfig } from '@/types';
import { ArrowLeft, ArrowRight, Calendar, Mic, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

export default function CreateAssignmentPage() {
  const router = useRouter();

  // Form state configurations
  const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const isDateBeforeToday = (dateStr: string) => {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateVal = new Date(dateStr);
    return dateVal < today;
  };

  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(getTodayString());
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationMessage, setGenerationMessage] = useState('Generating your question paper...');
  const [errorMsg, setErrorMsg] = useState('');

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const handleVoiceInput = () => {
    if (typeof window === 'undefined') return;
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setAdditionalInfo((prev) => prev ? prev + ' ' + transcript : transcript);
    };

    recognition.onerror = (err: any) => {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  //default is 0 for all
  const [questionRows, setQuestionRows] = useState<QuestionTypeRowConfig[]>([
    {
      id: '1',
      type: 'Multiple Choice Questions',
      noOfQuestions: 0,
      marks: 0,
    },
    {
      id: '2',
      type: 'Short Questions',
      noOfQuestions: 0,
      marks: 0,
    },
    {
      id: '3',
      type: 'Diagram/Graph-Based Questions',
      noOfQuestions: 0,
      marks: 0,
    },
    {
      id: '4',
      type: 'Numerical Problems',
      noOfQuestions: 0,
      marks: 0,
    },
  ]);

  const handleRowChange = (id: string, updatedFields: Partial<QuestionTypeRowConfig>) => {
    setQuestionRows(
      questionRows.map((row) => (row.id === id ? { ...row, ...updatedFields } : row))
    );
  };

  const handleAddRow = () => {
    const nextId = (Math.max(...questionRows.map((r) => parseInt(r.id) || 0)) + 1).toString();
    const newRow: QuestionTypeRowConfig = {
      id: nextId,
      type: 'Multiple Choice Questions',
      noOfQuestions: 0,
      marks: 0,
    };
    setQuestionRows([...questionRows, newRow]);
  };
  const handleRemoveRow = (id: string) => {
    if (questionRows.length > 1) {
      setQuestionRows(questionRows.filter((row) => row.id !== id));
    }
  };

  const totalQuestions = questionRows.reduce((sum, row) => sum + row.noOfQuestions, 0);
  const totalMarks = questionRows.reduce((sum, row) => sum + (row.noOfQuestions * row.marks), 0);

  const handleNext = async () => {
    if (!title.trim()) {
      alert("Please enter an assignment title.");
      return;
    }

    try {
      setIsGenerating(true);
      setErrorMsg('');
      setGenerationMessage('Creating assignment...');

      const formData = new FormData();
      formData.append('title', title);
      formData.append('dueDate', dueDate); // YYYY-MM-DD format
      
      const questionTypesData = questionRows.map(row => ({
        type: row.type,
        numberOfQuestions: row.noOfQuestions,
        marks: row.marks
      }));
      formData.append('questionTypes', JSON.stringify(questionTypesData));
      
      if (additionalInfo.trim()) {
        formData.append('additionalInstructions', additionalInfo);
      }
      if (file) {
        formData.append('file', file);
      }

      const res = await createAssignment(formData);
      if (res.data && res.data.success && res.data.data) {
        const assignmentId = res.data.data._id;
        
        setGenerationMessage('Connecting to generator...');
        
        const wsHost = typeof window !== 'undefined' 
          ? `ws://${window.location.hostname}:5000` 
          : 'ws://localhost:5000';
        const ws = new WebSocket(wsHost);
        
        let finished = false;
        
        const cleanup = () => {
          finished = true;
          clearInterval(pollingInterval);
          try {
            ws.close();
          } catch (e) {}
        };

        const handleSuccess = () => {
          cleanup();
          window.location.href = `/assignments/${assignmentId}?created=true`;
        };

        const handleFailure = (msg: string) => {
          cleanup();
          setIsGenerating(false);
          setErrorMsg(msg || 'Generation failed. Please try again.');
        };

        ws.onopen = () => {
          ws.send(JSON.stringify({ assignmentId }));
        };
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.status === 'processing') {
              setGenerationMessage(data.message || 'Generating your question paper...');
            } else if (data.status === 'completed') {
              handleSuccess();
            } else if (data.status === 'failed') {
              handleFailure(data.message);
            }
          } catch (e) {
            console.error('Error parsing WS message:', e);
          }
        };
        
        ws.onerror = (err) => {
          console.error('WebSocket error:', err);
        };
        
        ws.onclose = () => {
          console.log('WebSocket connection closed.');
        };

        const pollingInterval = setInterval(async () => {
          if (finished) return;
          try {
            const checkRes = await getAssignment(assignmentId);
            if (checkRes.data && checkRes.data.success && checkRes.data.data) {
              const status = checkRes.data.data.status;
              if (status === 'completed') {
                handleSuccess();
              } else if (status === 'failed') {
                handleFailure('Generation failed on the server.');
              }
            }
          } catch (err) {
            console.error('Polling check failed:', err);
          }
        }, 2000);
      } else {
        setIsGenerating(false);
        setErrorMsg('Failed to create assignment. Please try again.');
      }
    } catch (err: any) {
      console.error(err);
      setIsGenerating(false);
      setErrorMsg(err.response?.data?.message || 'Error occurred during creation.');
    }
  };

  if (errorMsg) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-6 text-center select-none">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md border border-neutral-200/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] flex flex-col items-center gap-6">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <div>
            <h3 className="text-lg font-extrabold text-neutral-800 tracking-tight mb-2">
              Generation Failed
            </h3>
            <p className="text-xs font-semibold text-red-500 mb-4">
              {errorMsg}
            </p>
            <p className="text-neutral-400 text-xs leading-relaxed mb-6">
              There was an issue processing your request or generating the questions.
            </p>
            <div className="flex items-center justify-center gap-3 w-full">
              <Button
                onClick={() => setErrorMsg('')}
                variant="outline"
                className="rounded-full flex-1 py-2.5 text-xs font-bold border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50"
              >
                Go Back
              </Button>
              <Button
                onClick={handleNext}
                className="rounded-full flex-1 py-2.5 text-xs font-bold bg-black text-white hover:bg-neutral-800"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-6 text-center select-none">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md border border-neutral-200/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] flex flex-col items-center gap-6">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-neutral-100 rounded-full" />
            <div className="absolute inset-0 border-4 border-t-[#FF6A2B] rounded-full animate-spin" />
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-[#FF6A2B] animate-pulse">
              <span className="font-extrabold text-lg">AI</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-extrabold text-neutral-800 tracking-tight mb-2">
              Generating Assignment
            </h3>
            <p className="text-xs font-semibold text-[#FF6A2B] uppercase tracking-wider mb-3">
              {generationMessage}
            </p>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Our AI is customized specifically for CBSE standards. This usually takes 10 to 30 seconds.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 select-none relative min-h-[calc(100vh-10rem)] pb-24">
      <div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF6A2B]" />
          <h1 className="text-xl lg:text-2xl font-extrabold text-neutral-800 tracking-tight">
            Create Assignment
          </h1>
        </div>
        <p className="text-xs text-neutral-400 font-semibold mt-1">
          Set up a new assignment for your students.
        </p>
      </div>
      <div className="w-full">
        <div className="w-full h-1 bg-neutral-200 rounded-full overflow-hidden">
          <div className="w-1/2 h-full bg-[#FF6A2B] rounded-full transition-all duration-300" />
        </div>
      </div>
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col gap-6">
        
        <div>
          <h2 className="text-base font-extrabold text-neutral-800 tracking-tight">
            Assignment Details
          </h2>
          <p className="text-[11px] text-neutral-400 font-semibold mt-0.5">
            Basic information about your assignment
          </p>
        </div>

        <div>
          <UploadDropzone onFileSelect={(selectedFile) => setFile(selectedFile)} />
          <span className="text-[10px] text-neutral-400 font-semibold mt-2.5 block text-center">
            Upload images of your preferred document/image
          </span>
        </div>

        <div className="max-w-md">
          <label className="text-xs font-bold text-neutral-800 tracking-wide mb-1.5 block">
            Assignment Title
          </label>
          <Input
            type="text"
            placeholder="e.g. Quiz on Electricity"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xs font-semibold text-neutral-700 bg-neutral-50/50 border-neutral-200 h-11 shadow-none"
            required
          />
        </div>

        <div className="max-w-md">
          <label className="text-xs font-bold text-neutral-800 tracking-wide mb-1.5 block">
            Due Date
          </label>
          <Input
            type="date"
            icon={<Calendar size={15} />}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={`text-xs font-semibold h-11 shadow-none transition-all ${
              isDateBeforeToday(dueDate)
                ? 'border-red-500 bg-red-50/10 focus:border-red-500 focus:ring-red-500 text-red-700'
                : 'text-neutral-700 bg-neutral-50/50 border-neutral-200 focus:border-[#FF6A2B] focus:ring-[#FF6A2B]'
            }`}
          />
          {isDateBeforeToday(dueDate) && (
            <p className="text-[10px] font-bold text-red-500 mt-1 animate-pulse">
              Warning: Selection is in the past!
            </p>
          )}
        </div>

        {/* Dynamic Question Type Settings */}
        <div className="flex flex-col gap-4">
          <div className="hidden lg:flex items-center justify-between border-b border-neutral-100 pb-2 text-[10px] font-bold text-neutral-400 uppercase tracking-wider select-none">
            <span className="flex-1">Question Type</span>
            <div className="flex items-center gap-12 pr-6">
              <span>No. of Questions</span>
              <span className="pr-3">Marks</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:gap-3">
            {questionRows.map((row) => (
              <QuestionTypeRow
                key={row.id}
                row={row}
                onChange={handleRowChange}
                onRemove={handleRemoveRow}
              />
            ))}
          </div>
          <div>
            <button
              type="button"
              onClick={handleAddRow}
              className="inline-flex items-center gap-1.5 bg-neutral-50 border border-neutral-200 text-neutral-700 hover:bg-neutral-100 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-none"
            >
              <Plus size={14} className="text-neutral-500" strokeWidth={2.5} />
              <span>Add Question Type</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 text-right border-t border-neutral-100 pt-4 text-xs font-semibold text-neutral-600">
          <p>
            Total Questions : <span className="text-neutral-900 font-extrabold">{totalQuestions}</span>
          </p>
          <p>
            Total Marks : <span className="text-neutral-900 font-extrabold">{totalMarks}</span>
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-neutral-800 tracking-wide">
            Additional Information (For better output)
          </label>
          <div className="relative w-full">
            <textarea
              rows={4}
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="e.g. Generate a question paper for 3 hour exam duration..."
              className="w-full bg-white text-neutral-800 placeholder-neutral-400 text-xs font-semibold rounded-xl border border-neutral-200 py-3.5 pl-4 pr-12 transition-all focus:outline-none focus:border-[#FF6A2B] focus:ring-1 focus:ring-[#FF6A2B] resize-none"
            />
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`absolute bottom-4 right-4 w-7 h-7 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                isListening 
                  ? 'bg-red-500 border-red-500 text-white animate-pulse' 
                  : 'bg-neutral-50 border-neutral-200 text-neutral-400 hover:text-[#FF6A2B] hover:bg-orange-50 active:scale-90'
              }`}
              title="Dictate instructions"
            >
              <Mic size={13} />
            </button>
          </div>
        </div>

      </div>
      <div className="flex items-center justify-between mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/assignments')}
          className="rounded-full px-7 font-bold text-xs h-11 border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50 flex items-center gap-2 shadow-none"
        >
          <ArrowLeft size={14} strokeWidth={2.5} />
          <span>Previous</span>
        </Button>

        <Button
          type="button"
          onClick={handleNext}
          className="rounded-full px-8 font-bold text-xs h-11 bg-black text-white hover:bg-neutral-800 flex items-center gap-2"
        >
          <span>Next</span>
          <ArrowRight size={14} strokeWidth={2.5} />
        </Button>
      </div>
    </div>
  );
}
