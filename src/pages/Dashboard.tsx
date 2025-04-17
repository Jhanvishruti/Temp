import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProfileSection from '../components/Dashboard/ProfileSection';
import { getUserType } from '../services/authService';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { section } = useParams<{ section: string }>();
  const [userType, setUserType] = useState<'contributor' | 'project-owner' | null>(null);
  
  useEffect(() => {
    // Get user type from auth service
    const type = getUserType();
    if (type === 'contributor' || type === 'project-owner') {
      setUserType(type);
    } else {
      // Redirect to login if user type is not valid
      navigate('/login');
    }
  }, [navigate]);

  if (!userType) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
            <nav className="space-y-2">
              <button 
                onClick={() => navigate('/dashboard/profile')}
                className={`w-full text-left px-4 py-2 rounded-md ${section === 'profile' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
              >
                My Profile
              </button>
              
              {userType === 'contributor' && (
                <>
                  <button 
                    onClick={() => navigate('/dashboard/find-projects')}
                    className={`w-full text-left px-4 py-2 rounded-md ${section === 'find-projects' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                  >
                    Find Projects
                  </button>
                  <button 
                    onClick={() => navigate('/dashboard/my-collaborations')}
                    className={`w-full text-left px-4 py-2 rounded-md ${section === 'my-collaborations' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                  >
                    My Collaborations
                  </button>
                </>
              )}
              
              {userType === 'project-owner' && (
                <>
                  <button 
                    onClick={() => navigate('/dashboard/find-contributors')}
                    className={`w-full text-left px-4 py-2 rounded-md ${section === 'find-contributors' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                  >
                    Find Contributors
                  </button>
                  <button 
                    onClick={() => navigate('/dashboard/my-projects')}
                    className={`w-full text-left px-4 py-2 rounded-md ${section === 'my-projects' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                  >
                    My Projects
                  </button>
                </>
              )}
              
              <button 
                onClick={() => navigate('/dashboard/notifications')}
                className={`w-full text-left px-4 py-2 rounded-md ${section === 'notifications' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
              >
                Notifications
              </button>
              
              <button 
                onClick={() => navigate('/dashboard/settings')}
                className={`w-full text-left px-4 py-2 rounded-md ${section === 'settings' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
              >
                Settings
              </button>
              
              <button 
                onClick={() => {
                  // Clear auth token and redirect to login
                  document.cookie = 'auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                  navigate('/login');
                }}
                className="w-full text-left px-4 py-2 rounded-md text-red-400 hover:bg-gray-700"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {section === 'profile' && userType && (
            <ProfileSection userType={userType} />
          )}
          
          {section === 'find-projects' && userType === 'contributor' && (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Find Projects</h2>
              {/* Import and use your FindProjects component here */}
            </div>
          )}
          
          {section === 'find-contributors' && userType === 'project-owner' && (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Find Contributors</h2>
              {/* Import and use your FindContributors component here */}
            </div>
          )}
          
          {/* Add other sections as needed */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;