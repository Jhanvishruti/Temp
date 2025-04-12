import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { getUserRoleFromToken, getTokenFromCookie } from '../../services/authService';
import { LayoutDashboard, UserCircle, Users, PieChart, ChevronRight, LogOut, Menu, X, Bell, UserPlus } from 'lucide-react';
import { Button } from '../../components/Button';
import FindProjects from './FindProjects';
import FindContributors from './FindContributor';
import { Analytics } from './Analytics';
import Profile from './Profile';
import OwnerNotifications from '../Dashboard/OwnerNotification';
import ContributorNotifications from './ContributorNotifications';
import { ProjectCollaborations } from '../ProjectCollaborations';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${active
      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white'
      : 'text-gray-400 hover:bg-white/5 hover:text-white'
      }`}
  >
    {icon}
    <span className="flex-1">{label}</span>
    <ChevronRight className={`h-5 w-5 transform transition-transform ${active ? 'rotate-90' : ''}`} />
  </button>
);

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border border-gray-700 bg-gray-900 p-6 shadow-xl">
        <h3 className="text-lg font-medium text-white">Confirm Logout</h3>
        <p className="mt-2 text-gray-400">Are you sure you want to log out?</p>
        <div className="mt-4 flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={onConfirm} className="bg-red-500 text-white hover:bg-red-600">Logout</Button>
        </div>
      </div>
    </div>
  );
};

export const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isProjectOwner, setIsProjectOwner] = useState(false);

  useEffect(() => {
    const token = getTokenFromCookie();
    if (!token) {
      navigate('/');
      return;
    }

    const role = getUserRoleFromToken();
    setIsProjectOwner(role === 'Powner');
  }, [navigate]);

  const handleLogout = () => setShowLogoutModal(true);
  const confirmLogout = () => {
    setShowLogoutModal(false);
    document.cookie = 'auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed right-4 top-4 z-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-3 text-white shadow-lg transition-all hover:shadow-blue-500/20"
      >
        {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <div className={`fixed inset-y-0 left-0 z-10 w-64 transform border-r border-white/10 bg-black/20 p-4 backdrop-blur-xl transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 p-2">
            <LayoutDashboard className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
        </div>

        <nav className="space-y-2">
          <SidebarItem icon={<UserCircle className="h-5 w-5" />} label="My Profile" active={location.pathname === '/dashboard/profile'} onClick={() => navigate('/dashboard/profile')} />
          <SidebarItem icon={<Bell className="h-5 w-5" />} label="Notifications" active={location.pathname === '/dashboard/notifications'} onClick={() => navigate('/dashboard/notifications')} />
          {isProjectOwner ? (
            <SidebarItem icon={<Users className="h-5 w-5" />} label="Find Contributors" active={location.pathname === '/dashboard/find-contributors'} onClick={() => navigate('/dashboard/find-contributors')} />
          ) : (
            <SidebarItem icon={<Users className="h-5 w-5" />} label="Find Projects" active={location.pathname === '/dashboard/find-projects'} onClick={() => navigate('/dashboard/find-projects')} />
          )}
          <SidebarItem icon={<UserPlus className="h-5 w-5" />} label="Collaborations" active={location.pathname === '/dashboard/collaborations'} onClick={() => navigate('/dashboard/collaborations')} />
          <SidebarItem icon={<PieChart className="h-5 w-5" />} label="Analytics" active={location.pathname === '/dashboard/analytics'} onClick={() => navigate('/dashboard/analytics')} />
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button onClick={handleLogout} variant="secondary" className="w-full justify-start gap-2 bg-red-500/10 text-red-400 hover:bg-red-500/20">
            <LogOut className="h-5 w-5" /> Logout
          </Button>
        </div>
      </div>

      <div className={`flex-1 p-8 transition-all ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <Routes>
          <Route path="profile" element={<Profile />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="find-contributors" element={<FindContributors />} />
          <Route path="find-projects" element={<FindProjects />} />
          <Route path="notifications" element={isProjectOwner ? <OwnerNotifications /> : <ContributorNotifications />} />
          <Route path="collaborations" element={<ProjectCollaborations />} />
          <Route path="*" element={<div className="rounded-xl bg-white/5 p-6 backdrop-blur-lg">
            <h2 className="text-2xl font-bold text-white">Welcome!</h2>
            <p className="mt-2 text-gray-400">{isProjectOwner ? "Manage your projects and find talented contributors." : "Discover exciting projects and showcase your skills."}</p>
          </div>} />
        </Routes>
      </div>

      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={confirmLogout} />
    </div>
  );
};
