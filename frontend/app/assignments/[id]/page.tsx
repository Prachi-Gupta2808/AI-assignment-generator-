'use client';

import { getAssignment, getPaper, regeneratePaper } from '@/app/lib/api';
import { AssignmentPreview } from '@/components/assignments/AssignmentPreview';
import { Button } from '@/components/ui/custom-ui';
import { ArrowLeft, CheckCircle, Download, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useEffect, useRef, useState } from 'react';

export default function AssignmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  // all the States
  const [paper, setPaper] = useState<any>(null);
  const [assignment, setAssignment] = useState<any>(null);
  const [status, setStatus] = useState<'loading' | 'generating' | 'completed' | 'failed'>('loading');
  const [generationMessage, setGenerationMessage] = useState('Generating your question paper...');
  const [downloading, setDownloading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const paperContainerRef = useRef<HTMLDivElement>(null);

  const fetchPaperData = async () => {
    try {
      setStatus('loading');
      setErrorMsg('');
      
      const paperRes = await getPaper(id);
      if (paperRes.data && paperRes.data.success && paperRes.data.data) {
        setPaper(paperRes.data.data);
        setStatus('completed');
        
        try {
          const assignRes = await getAssignment(id);
          if (assignRes.data && assignRes.data.success) {
            setAssignment(assignRes.data.data);
          }
        } catch (e) {
          console.error('Failed to load assignment details', e);
        }
      } else {
        await checkAssignmentStatus();
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        await checkAssignmentStatus();
      } else {
        console.error(err);
        setErrorMsg('Failed to load assignment details.');
        setStatus('failed');
      }
    }
  };

  const checkAssignmentStatus = async () => {
    try {
      const res = await getAssignment(id);
      if (res.data && res.data.success && res.data.data) {
        const assignData = res.data.data;
        setAssignment(assignData);
        
        if (assignData.status === 'completed') {
          const paperRes = await getPaper(id);
          if (paperRes.data && paperRes.data.success && paperRes.data.data) {
            setPaper(paperRes.data.data);
            setStatus('completed');
          } else {
            setStatus('failed');
            setErrorMsg('Paper data could not be retrieved.');
          }
        } else if (assignData.status === 'failed') {
          setStatus('failed');
          setErrorMsg('Generation failed on the server.');
        } else {
          setStatus('generating');
          setGenerationMessage('Generating your question paper...');
          connectWebSocket();
        }
      } else {
        setStatus('failed');
        setErrorMsg('Assignment not found.');
      }
    } catch (err) {
      console.error(err);
      setStatus('failed');
      setErrorMsg('Failed to read assignment status.');
    }
  };

  const connectWebSocket = () => {
    const wsHost = typeof window !== 'undefined' 
      ? `ws://${window.location.hostname}:5000` 
      : 'ws://localhost:5000';
    const ws = new WebSocket(wsHost);
    
    ws.onopen = () => {
      ws.send(JSON.stringify({ assignmentId: id }));
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.status === 'processing') {
          setGenerationMessage(data.message || 'Generating your question paper...');
        } else if (data.status === 'completed') {
          ws.close();
          // Reload paper data
          reloadPaper();
        } else if (data.status === 'failed') {
          ws.close();
          setStatus('failed');
          setErrorMsg(data.message || 'Generation failed. Please try again.');
        }
      } catch (e) {
        console.error('Error parsing WS message:', e);
      }
    };
    
    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      ws.close();
      setStatus('failed');
      setErrorMsg('WebSocket connection error.');
    };
  };

  const reloadPaper = async () => {
    try {
      const paperRes = await getPaper(id);
      if (paperRes.data && paperRes.data.success && paperRes.data.data) {
        setPaper(paperRes.data.data);
        setStatus('completed');
      } else {
        setTimeout(reloadPaper, 2000);
      }
    } catch (err) {
      console.error(err);
      setTimeout(reloadPaper, 2000);
    }
  };

  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetchPaperData();

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('created') === 'true') {
        setShowToast(true);
        const newUrl = window.location.pathname;
        window.history.replaceState({ path: newUrl }, '', newUrl);
        
        const timer = setTimeout(() => {
          setShowToast(false);
        }, 4000);
        return () => clearTimeout(timer);
      }
    }
  }, [id]);

  const handleDownload = () => {
    if (!paper) return;
    const element = document.getElementById('printable-paper');
    if (!element) {
      alert('Print element not found.');
      return;
    }
  
    setDownloading(true);
  
    try {
      const styleSheets = Array.from(document.styleSheets)
        .map((sheet) => {
          try {
            return Array.from(sheet.cssRules)
              .map((rule) => rule.cssText)
              .join('\n');
          } catch {
            return sheet.href ? `@import url("${sheet.href}");` : '';
          }
        })
        .join('\n');
  
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.top = '-9999px';
      iframe.style.left = '-9999px';
      iframe.style.width = '210mm';
      iframe.style.height = '297mm';
      iframe.style.border = 'none';
      document.body.appendChild(iframe);
  
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) {
        alert('Could not create print frame.');
        document.body.removeChild(iframe);
        setDownloading(false);
        return;
      }
  
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${paper.title || 'Question Paper'}</title>
            <style>${styleSheets}</style>
            <style>
              @media print {
                @page { margin: 10mm; size: A4; }
                body { margin: 0; padding: 0; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              }
              body { margin: 0; padding: 0; background: white; }
            </style>
          </head>
          <body>
            ${element.outerHTML}
          </body>
        </html>
      `);
      iframeDoc.close();
  
      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } finally {
          setTimeout(() => {
            document.body.removeChild(iframe);
            setDownloading(false);
          }, 1000);
        }
      }, 800);
  
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      alert('Failed to print the document.');
      setDownloading(false);
    }
  };

  const handleRegenerate = async () => {
    try {
      setRegenerating(true);
      setErrorMsg('');
      
      await regeneratePaper(id);
      setStatus('generating');
      setGenerationMessage('Regeneration started...');
      connectWebSocket();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to start regeneration.');
    } finally {
      setRegenerating(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-6 select-none">
        <div className="w-10 h-10 border-4 border-neutral-200 border-t-[#FF6A2B] rounded-full animate-spin" />
        <p className="text-xs font-semibold text-neutral-400 mt-4 animate-pulse">Loading assignment details...</p>
      </div>
    );
  }

  if (status === 'generating') {
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

  if (status === 'failed') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-6 text-center select-none">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md border border-red-100 shadow-[0_8px_32px_rgba(239,68,68,0.05)] flex flex-col items-center gap-6">
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
                onClick={() => router.push('/assignments')}
                variant="outline"
                className="rounded-full flex-1 py-2.5 text-xs font-bold border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50 shadow-none"
              >
                Go Back
              </Button>
              <Button
                onClick={handleRegenerate}
                className="rounded-full flex-1 py-2.5 text-xs font-bold bg-black text-white hover:bg-neutral-800 flex items-center justify-center gap-2"
                disabled={regenerating}
              >
                {regenerating ? <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <RefreshCw size={12} />}
                <span>Retry Generation</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 select-none relative min-h-[calc(100vh-10rem)] pb-12">
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
          onClick={() => router.push('/assignments')}
          className="rounded-full px-5 py-2 font-bold text-xs h-10 border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50 flex items-center gap-2 shadow-none sm:self-center self-start"
        >
          <ArrowLeft size={13} strokeWidth={2.5} />
          <span>Dashboard</span>
        </Button>
      </div>
      <div className="bg-black text-white rounded-2xl p-6 flex flex-col items-start gap-4 shadow-lg border border-neutral-800 select-text">
        <div className="w-full">
          
          <p className="text-xs sm:text-sm font-semibold leading-relaxed tracking-wide text-neutral-200">
            {paper.aiMessage || `Certainly, Lakshya! Here is a customized Question Paper for your CBSE Grade 5 Science classes on the NCERT chapters:`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 select-none">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="bg-white text-black hover:bg-neutral-100 rounded-full px-6 py-3 font-semibold text-xs tracking-wide flex items-center gap-2 transition-all cursor-pointer active:scale-95 disabled:opacity-50 shadow-md font-sans"
          >
            {downloading ? (
              <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download size={14} className="text-black" strokeWidth={2.5} />
            )}
            <span>{downloading ? 'Downloading...' : 'Download as PDF'}</span>
          </button>

          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="bg-neutral-900 border border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white rounded-full px-5 py-3 font-semibold text-xs tracking-wide flex items-center gap-2 transition-all cursor-pointer active:scale-95 disabled:opacity-50 font-sans"
          >
            {regenerating ? (
              <span className="w-3.5 h-3.5 border-2 border-neutral-300 border-t-transparent rounded-full animate-spin" />
            ) : (
              <RefreshCw size={13} className="text-neutral-400" strokeWidth={2.5} />
            )}
            <span>Regenerate</span>
          </button>
        </div>
      </div>
      <div 
        ref={paperContainerRef} 
        className="bg-neutral-200/50 rounded-2xl p-4 lg:p-6 border border-neutral-300/40 shadow-inner overflow-hidden"
      >
        <AssignmentPreview paper={paper} />
      </div>

      <div className="flex justify-end gap-3 select-none">
        <Button
          type="button"
          onClick={() => {
            alert(`Assignment has been successfully assigned to ${paper.className || 'Class 10'} classes!`);
            router.push('/assignments');
          }}
          className="rounded-full px-8 py-3.5 font-bold text-xs tracking-wide bg-[#FF6A2B] text-white hover:bg-[#e0581f] flex items-center gap-2 shadow-[0_4px_14px_rgba(255,106,43,0.3)] hover:shadow-[0_6px_18px_rgba(255,106,43,0.45)] border-0"
        >
          <CheckCircle size={14} strokeWidth={2.5} />
          <span>Publish & Assign</span>
        </Button>
      </div>

      {showToast && (
        <div className="fixed top-5 right-5 z-50 bg-[#10B981] text-white font-sans text-xs sm:text-sm font-bold py-3.5 px-6 rounded-2xl shadow-xl flex items-center gap-2 border border-emerald-400/20 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle size={16} strokeWidth={2.5} />
          <span>Assignment generated successfully!</span>
        </div>
      )}
    </div>
  );
}
