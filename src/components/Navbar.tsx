import React from 'react';
import { Menu, Search, UserPlus, ShieldCheck } from 'lucide-react';
import { NavView } from './Sidebar.tsx';

interface NavbarProps {
  currentView: NavView;
  onOpenMobileSidebar: () => void;
  onNavigate: (view: NavView) => void;
  onQuickSearch: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onOpenMobileSidebar,
  onNavigate,
  onQuickSearch,
}) => {
  const [searchValue, setSearchValue] = React.useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onQuickSearch(searchValue.trim());
      onNavigate('students');
    }
  };

  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Academic Dashboard';
      case 'students':
        return 'Student Directory';
      case 'add-student':
        return 'Register New Student';
      case 'edit-student':
        return 'Modify Student Record';
      case 'student-details':
        return 'Student Profile & Academic Record';
      default:
        return 'Student Management System';
    }
  };

  return (
    <header
      id="app-navbar"
      className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 bg-white/90 backdrop-blur-md border-b border-slate-200"
    >
      <div className="flex items-center gap-3">
        <button
          id="navbar-mobile-toggle-btn"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
          aria-label="Open sidebar navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-base md:text-lg font-bold text-slate-900 leading-tight">
            {getPageTitle()}
          </h2>
          <span className="hidden sm:block text-xs text-slate-500">
            Academic Year 2025–2026 • Spring Term
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Search in Navbar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex relative items-center">
          <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
          <input
            id="navbar-quick-search-input"
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Quick search student..."
            className="w-52 lg:w-64 pl-9 pr-3 py-1.5 text-xs bg-slate-100/90 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </form>

        {/* Primary CTA */}
        {currentView !== 'add-student' && (
          <button
            id="navbar-add-student-btn"
            onClick={() => onNavigate('add-student')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs md:text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-all shadow-xs shadow-blue-500/20"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Student</span>
          </button>
        )}

        {/* Admin Avatar & Role */}
        <div
          id="navbar-admin-profile"
          className="flex items-center gap-2 pl-2 border-l border-slate-200"
        >
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            AD
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
              Admin Portal
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="text-[10px] text-slate-500">Administrator</div>
          </div>
        </div>
      </div>
    </header>
  );
};
