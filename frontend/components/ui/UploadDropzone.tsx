'use client';

import { File, Trash, UploadCloud } from 'lucide-react';
import * as React from 'react';
import { Button } from './custom-ui';

interface UploadDropzoneProps {
  onFileSelect?: (file: File | null) => void;
}

export function UploadDropzone({ onFileSelect }: UploadDropzoneProps) {
  const [dragActive, setDragActive] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<{ name: string; size: string } | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const sizeStr = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
      setSelectedFile({ name: file.name, size: sizeStr });
      if (onFileSelect) onFileSelect(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeStr = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
      setSelectedFile({ name: file.name, size: sizeStr });
      if (onFileSelect) onFileSelect(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (onFileSelect) onFileSelect(null);
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
        dragActive ? 'border-[#FF6A2B] bg-[#FF6A2B]/5' : 'border-neutral-200 bg-white hover:border-neutral-300'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={handleFileChange}
      />

      {!selectedFile ? (
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-4 text-[#FF6A2B]">
            <UploadCloud size={24} />
          </div>
          
          <p className="text-neutral-800 text-sm font-semibold mb-1">
            Choose a file or drag & drop it here
          </p>
          <p className="text-neutral-400 text-xs mb-4">
            JPEG, PNG, upto 10MB
          </p>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full px-5 text-neutral-800 border-neutral-300 hover:bg-neutral-50 shadow-none font-semibold text-xs py-2"
            onClick={() => fileInputRef.current?.click()}
          >
            Browse Files
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between bg-neutral-50 w-full max-w-md p-3.5 rounded-xl border border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-neutral-200 rounded-lg flex items-center justify-center text-neutral-700">
              <File size={18} />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-neutral-800 truncate max-w-[200px]">
                {selectedFile.name}
              </p>
              <p className="text-xs text-neutral-400">
                {selectedFile.size}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="text-neutral-400 hover:text-red-500 transition-colors p-1"
            onClick={removeFile}
          >
            <Trash size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
