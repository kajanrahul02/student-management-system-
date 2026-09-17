import React, { useState } from 'react';
import {
  X,
  Settings,
  Database,
  RefreshCw,
  Download,
  CheckCircle2,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { Student } from '../types.ts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetData: () => void;
  students: Student[];
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onResetData,
  students,
}) => {
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  if (!isOpen) return null;

  const handleReset = async () => {
    setResetting(true);
    await onResetData();
    setResetting(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(students, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `students_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
  };

  return (
    <div
      id="settings-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
    >
      <div
        id="settings-modal-container"
        role="dialog"
        aria-modal="true"
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-white">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">System Settings</h2>
              <p className="text-xs text-slate-500">Database preferences & sample records management</p>
            </div>
          </div>
          <button
            id="settings-modal-close-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-6 space-y-5 text-sm">
          {/* Database Info */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-xs uppercase tracking-wider">
                <Database className="w-4 h-4 text-blue-600" />
                <span>SQLite Database Status</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Connected
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-600">
              <div>
                <span className="text-slate-400 font-sans block">File:</span>
                students.db
              </div>
              <div>
                <span className="text-slate-400 font-sans block">Total Records:</span>
                {students.length} students
              </div>
            </div>
          </div>

          {/* Demonstration Tools: Reset Sample Data */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Demo Data Tools
            </h3>
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white">
              <div>
                <h4 className="font-semibold text-slate-800 text-xs">Reset Sample Students</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Repopulates database with 8 fictional student profiles.
                </p>
              </div>
              <button
                id="settings-reset-sample-btn"
                onClick={handleReset}
                disabled={resetting}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 active:scale-95 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
                <span>{resetting ? 'Resetting...' : 'Reset Records'}</span>
              </button>
            </div>
            {resetSuccess && (
              <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Sample students restored successfully!
              </p>
            )}
          </div>

          {/* Backup Data */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Data Portability
            </h3>
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white">
              <div>
                <h4 className="font-semibold text-slate-800 text-xs">Export Full JSON Backup</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Download all active student records as formatted JSON.
                </p>
              </div>
              <button
                id="settings-export-json-btn"
                onClick={handleExportJSON}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-xl hover:bg-slate-200 active:scale-95 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
};
