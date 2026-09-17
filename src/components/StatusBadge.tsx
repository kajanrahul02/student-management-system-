import React from 'react';
import { StudentStatus } from '../types.ts';

interface StatusBadgeProps {
  status: StudentStatus | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'Active':
      return (
        <span
          id={`status-badge-${status.toLowerCase()}`}
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Active
        </span>
      );
    case 'Inactive':
      return (
        <span
          id={`status-badge-${status.toLowerCase()}`}
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Inactive
        </span>
      );
    case 'Graduated':
      return (
        <span
          id={`status-badge-${status.toLowerCase()}`}
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          Graduated
        </span>
      );
    default:
      return (
        <span
          id={`status-badge-default`}
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"
        >
          {status}
        </span>
      );
  }
};
