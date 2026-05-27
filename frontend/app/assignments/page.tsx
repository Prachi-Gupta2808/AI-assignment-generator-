'use client';

import { AssignmentGrid } from '@/components/assignments/AssignmentGrid';
import { EmptyAssignments } from '@/components/assignments/EmptyAssignments';
import { Button, Input } from '@/components/ui/custom-ui';
import { Assignment } from '@/types';
import { Plus, Search, SlidersHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useState } from 'react';

import { deleteAssignment, getAssignments } from '@/app/lib/api';

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export default function AssignmentsPage() {
  const router = useRouter();
  
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getAssignments();
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        const mapped = res.data.data.map((item: any) => ({
          id: item._id,
          title: item.title,
          assignedDate: formatDate(item.createdAt),
          dueDate: formatDate(item.dueDate),
        }));
        setAssignments(mapped);
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch assignments. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAssignments();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      setAssignments(prev => prev.filter((item) => item.id !== id));
      await deleteAssignment(id);
    } catch (err) {
      console.error('Failed to delete assignment:', err);
      alert('Failed to delete assignment from backend. Refreshing list...');
      fetchAssignments();
    }
  };

  const filteredAssignments = assignments.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-6 select-none">
        <div className="w-10 h-10 border-4 border-neutral-200 border-t-[#FF6A2B] rounded-full animate-spin" />
        <p className="text-xs font-semibold text-neutral-400 mt-4 animate-pulse">Loading assignments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-6 select-none text-center">
        <p className="text-red-500 font-semibold mb-4">{error}</p>
        <Button onClick={fetchAssignments} className="rounded-full px-6 py-2.5 text-xs font-bold bg-black text-white hover:bg-neutral-800">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 select-none relative min-h-[calc(100vh-10rem)] pb-24">
      {assignments.length === 0 ? (
        <EmptyAssignments />
      ) : (
        <>
          {/* 1. Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              {/* Main heading and green active status indicator */}
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h1 className="text-xl lg:text-2xl font-extrabold text-neutral-800 tracking-tight">
                  Assignments
                </h1>
              </div>
              <p className="text-xs text-neutral-400 font-semibold mt-1">
                Manage and create assignments for your classes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full bg-white/70 backdrop-blur-xs rounded-2xl p-2.5 border border-neutral-200/40 shadow-xs">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-neutral-200 shadow-none text-neutral-600 hover:bg-neutral-50 flex items-center gap-2 px-4 py-2.5 text-xs font-semibold h-10 shrink-0"
            >
              <SlidersHorizontal size={14} />
              <span>Filter By</span>
            </Button>
            
            <div className="flex-1">
              <Input
                icon={<Search size={16} />}
                placeholder="Search Assignment"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="shadow-none border-neutral-200 rounded-xl h-10"
              />
            </div>
          </div>

          <div className="flex-1">
            <AssignmentGrid
              assignments={filteredAssignments}
              onDelete={handleDelete}
            />
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#F4F4F4] via-[#F4F4F4]/80 to-transparent pointer-events-none z-10" />

          <div className="fixed bottom-24 lg:bottom-10 left-[50%] translate-x-[-50%] lg:left-[calc(50%+9.5rem)] z-20">
            <button
              onClick={() => router.push('/assignments/create')}
              className="bg-black text-white hover:bg-neutral-800 rounded-full px-7 py-3.5 font-semibold text-xs tracking-wide shadow-lg border border-neutral-800 hover:shadow-xl active:scale-95 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus size={14} strokeWidth={2.5} />
              <span>Create Assignment</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}