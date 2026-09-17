import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Server,
  Database,
  Layers,
  Code2,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  GraduationCap
} from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div
      id="about-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
    >
      <div
        id="about-modal-container"
        role="dialog"
        aria-modal="true"
        className="w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Student Management System — Project Overview
              </h2>
              <p className="text-xs text-slate-500">
                Academic Web Development Specification & REST API Documentation
              </p>
            </div>
          </div>
          <button
            id="about-modal-close-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-600 leading-relaxed">
          {/* Architecture Card */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              System Architecture
            </h3>
            <div className="font-mono text-xs text-slate-800 bg-white p-3 rounded-lg border border-slate-200 overflow-x-auto">
              {`User (Web Browser)
   │
   ▼
React Frontend (SPA / State / Modular Components)
   │
   ▼
REST API (HTTP / JSON / Service Layer)
   │
   ▼
Backend Server (Express / Django REST Framework)
   │
   ▼
Database (SQLite with Persistent Tables & Constraints)`}
            </div>
          </div>

          {/* API Endpoints Summary */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-600" />
              Documented REST API Endpoints
            </h3>
            <div className="grid grid-cols-1 gap-2 text-xs font-mono">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold mr-2">GET</span>
                  <span className="text-slate-800">/api/students/</span>
                </div>
                <span className="text-slate-400 font-sans">List all students with filters</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold mr-2">GET</span>
                  <span className="text-slate-800">/api/students/:id/</span>
                </div>
                <span className="text-slate-400 font-sans">Retrieve single student</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold mr-2">POST</span>
                  <span className="text-slate-800">/api/students/</span>
                </div>
                <span className="text-slate-400 font-sans">Create student record</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold mr-2">PUT</span>
                  <span className="text-slate-800">/api/students/:id/</span>
                </div>
                <span className="text-slate-400 font-sans">Update student record</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold mr-2">DELETE</span>
                  <span className="text-slate-800">/api/students/:id/</span>
                </div>
                <span className="text-slate-400 font-sans">Delete student record</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-bold mr-2">GET</span>
                  <span className="text-slate-800">/api/students/search/?q=value</span>
                </div>
                <span className="text-slate-400 font-sans">Dynamic query search</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-bold mr-2">GET</span>
                  <span className="text-slate-800">/api/dashboard/stats/</span>
                </div>
                <span className="text-slate-400 font-sans">Aggregated dashboard counts</span>
              </div>
            </div>
          </div>

          {/* Demonstration Order Checklist */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Demonstration Flow (SOP Section 37)
            </h3>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-600 bg-emerald-50/50 p-4 rounded-xl border border-emerald-200/70">
              <li><strong>Open Dashboard</strong> — View total, active, inactive, and graduated student counts.</li>
              <li><strong>Open Students</strong> — View paginated list retrieved directly from the REST API.</li>
              <li><strong>Click Add Student</strong> — Fill out academic details; test validation errors (invalid email, phone).</li>
              <li><strong>Save Student</strong> — Data is validated and stored in SQLite database.</li>
              <li><strong>Search & Filter</strong> — Test keyword search and filter by department/year/status.</li>
              <li><strong>Open Student Details</strong> — Review formatted card view with audit timestamps.</li>
              <li><strong>Edit Student</strong> — Update student year or status and save changes.</li>
              <li><strong>Delete Student</strong> — Confirm deletion modal and see real-time stats update.</li>
            </ol>
          </div>

          {/* Django Backend Export Notice */}
          <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200 text-xs space-y-1.5">
            <h4 className="font-bold text-blue-900 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-blue-600" />
              Django REST Framework Backend Code
            </h4>
            <p className="text-blue-800">
              The project root also contains the complete Django REST Framework backend in <code className="font-mono bg-blue-100/80 px-1 py-0.5 rounded">backend/</code> with <code className="font-mono bg-blue-100/80 px-1 py-0.5 rounded">models.py</code>, <code className="font-mono bg-blue-100/80 px-1 py-0.5 rounded">serializers.py</code>, <code className="font-mono bg-blue-100/80 px-1 py-0.5 rounded">views.py</code>, <code className="font-mono bg-blue-100/80 px-1 py-0.5 rounded">urls.py</code>, <code className="font-mono bg-blue-100/80 px-1 py-0.5 rounded">admin.py</code>, and 12 unit tests!
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-xs"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
