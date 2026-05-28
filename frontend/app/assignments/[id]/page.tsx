'use client';

import { getAssignment, getPaper, regeneratePaper } from '@/app/lib/api';
import { useRouter } from 'next/navigation';
import { use, useEffect, useRef, useState } from 'react';

export default function AssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const [paper, setPaper] = useState<any>(null);
  const [assignment, setAssignment] = useState<any>(null);
  const [status, setStatus] = useState<
    'loading' | 'generating' | 'completed' | 'failed'
  >('loading');

  const [generationMessage, setGenerationMessage] = useState(
    'Generating your question paper...'
  );

  const [downloading, setDownloading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showToast, setShowToast] = useState(false);

  const paperContainerRef = useRef<HTMLDivElement>(null);

  const pollPaperStatus = () => {
    const interval = setInterval(async () => {
      try {
        const paperRes = await getPaper(id);

        if (
          paperRes.data &&
          paperRes.data.success &&
          paperRes.data.data
        ) {
          setPaper(paperRes.data.data);
          setStatus('completed');
          clearInterval(interval);
        }
      } catch (err) {
        console.log('Still generating...');
      }
    }, 3000);

    return interval;
  };

  const fetchPaperData = async () => {
    try {
      setStatus('loading');
      setErrorMsg('');

      const paperRes = await getPaper(id);

      if (
        paperRes.data &&
        paperRes.data.success &&
        paperRes.data.data
      ) {
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

          if (
            paperRes.data &&
            paperRes.data.success &&
            paperRes.data.data
          ) {
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
          setGenerationMessage(
            'Generating your question paper...'
          );

          pollPaperStatus();
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

  const reloadPaper = async () => {
    try {
      const paperRes = await getPaper(id);

      if (
        paperRes.data &&
        paperRes.data.success &&
        paperRes.data.data
      ) {
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

  useEffect(() => {
    fetchPaperData();

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);

      if (params.get('created') === 'true') {
        setShowToast(true);

        const newUrl = window.location.pathname;

        window.history.replaceState(
          { path: newUrl },
          '',
          newUrl
        );

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
            return sheet.href
              ? `@import url("${sheet.href}");`
              : '';
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

      const iframeDoc =
        iframe.contentDocument ||
        iframe.contentWindow?.document;

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
                @page {
                  margin: 10mm;
                  size: A4;
                }

                body {
                  margin: 0;
                  padding: 0;
                  background: white;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
              }

              body {
                margin: 0;
                padding: 0;
                background: white;
              }
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

      pollPaperStatus();
    } catch (err: any) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          'Failed to start regeneration.'
      );
    } finally {
      setRegenerating(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-6 select-none">
        <div className="w-10 h-10 border-4 border-neutral-200 border-t-[#FF6A2B] rounded-full animate-spin" />

        <p className="text-xs font-semibold text-neutral-400 mt-4 animate-pulse">
          Loading assignment details...
        </p>
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
              <span className="font-extrabold text-lg">
                AI
              </span>
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
              Our AI is customized specifically for CBSE
              standards. This usually takes 10 to 30 seconds.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <div></div>;
}