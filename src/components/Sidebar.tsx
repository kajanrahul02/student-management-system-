import React from 'react';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Settings,
  Info,
  GraduationCap,
  Sparkles,
  X,
  Code2
} from 'lucide-react';

export type NavView = 'dashboard' | 'students' | 'add-student' | 'student-details' | 'edit-student';

interface SidebarProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenAbout: () => void;
  onOpenSettings: () => void;
  onResetData: () => void;
  totalStudentsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
  onOpenAbout,
  onOpenSettings,
  onResetData,
  totalStudentsCount,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      view: 'dashboard' as NavView,
      badge: null,
    },
    {
      id: 'students',
      label: 'Students',
      icon: Users,
      view: 'students' as NavView,
      badge: totalStudentsCount !== undefined ? totalStudentsCount : null,
    },
    {
      id: 'add-student',
      label: 'Add Student',
      icon: UserPlus,
      view: 'add-student' as NavView,
      badge: null,
    },
  ];

  const handleNavClick = (view: NavView) => {
    onNavigate(view);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          id="sidebar-mobile-backdrop"
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* App Branding & Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/30">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
                Student Management System
              </h1>
              <p className="text-xs text-slate-500 leading-snug mt-1 line-clamp-2">
                Manage students, courses, and academic information efficiently.
              </p>
            </div>
          </div>
          <button
            id="sidebar-close-mobile-btn"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Navigation List */}
        <div className="flex-1 overflow-y-auto px-4 py-5">
          <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase px-3 mb-2">
            Main Menu
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentView === item.view ||
                (item.view === 'students' &&
                  (currentView === 'student-details' || currentView === 'edit-student'));

              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.view)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200/60 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Demo Utilities */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase px-3 mb-2">
              Demonstration & Tools
            </div>
            <button
              id="sidebar-reset-sample-btn"
              onClick={() => {
                onResetData();
                onCloseMobile();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-blue-700 hover:bg-blue-50/60 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>Reset Sample Records</span>
            </button>
          </div>
        </div>

        {/* Bottom Section: Settings & About */}
        <div className="p-4 border-t border-slate-100 space-y-1 bg-slate-50/60">
          <button
            id="nav-link-settings"
            onClick={() => {
              onOpenSettings();
              onCloseMobile();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white transition-colors"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Settings</span>
          </button>
          <button
            id="nav-link-about"
            onClick={() => {
              onOpenAbout();
              onCloseMobile();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white transition-colors"
          >
            <Info className="w-4 h-4 text-slate-400" />
            <span>About & Docs</span>
          </button>

          {/* System Badge */}
          <div className="pt-2 px-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-200/60 mt-2">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              API: REST / SQLite
            </span>
            <span className="font-mono">v1.0.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};
