import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Button } from '../../components/Button';
import { ContributorProfile } from '../ContributorProfile';
import axios from 'axios';
import { getUserIdFromToken } from '../../services/authService';

interface Notification {
    id: string;
    profilePicture: string;
    name: string;
    status: 'pending' | 'accepted' | 'rejected';
    date: string;
    email: string;
    skills: string[];
    experienceLevel: string;
    preferredDomain: string;
    availability: string;
    preferredCollaboration: string;
    hoursPerDay: string;
    linkedinUrl: string;
    githubUrl: string;
    motivation: string;
}

const Notifications: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const [showProfile, setShowProfile] = useState(false);

    useEffect(() => {
        // Fetch notifications from the API
        var uid = getUserIdFromToken();
        axios.get(`http://localhost:5247/api/request/pending/${uid}`)
            .then(response => {
                console.log(response.data);
                setNotifications(response.data);
            })
            .catch(error => {
                toast.error(error);
            });
    }, []);

    const handleAccept = (id: string) => {
        axios.post(`http://localhost:5247/api/request/accept/${id}`)
            .then(() => {
                toast.success('Contributor accepted');
                setNotifications(prev => prev.filter(notification => notification.id !== id));
            })
            .catch(() => {
                toast.error('Failed to accept request');
            });
    };

    const handleReject = (id: string) => {
        axios.post(`http://localhost:5247/api/request/reject/${id}`)
            .then(() => {
                toast.success('Contributor rejected');
                setNotifications(prev => prev.map(notification =>
                    notification.id === id ? { ...notification, status: 'rejected' } : notification
                ));
            })
            .catch(() => {
                toast.error('Failed to reject request');
            });
    };

    const handleProfileClick = (notification: Notification) => {
        setSelectedNotification(notification);
        setShowProfile(true);
    };

    const pendingNotifications = notifications.filter(n => n.status === 'pending');

    return (
        <div className="rounded-lg border border-gray-700 bg-black/20 p-6">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Contributor Requests for Collaboration</h2>
                <span className="rounded-full bg-blue-500 px-3 py-1 text-sm text-white">
                    {pendingNotifications.length} New
                </span>
            </div>

            <div className="space-y-4">
                {notifications.map((notification) => (
                    <div 
                        key={notification.id} 
                        className="rounded-lg border border-gray-700 bg-black/10 p-4 cursor-pointer hover:bg-black/20 transition-colors"
                        onClick={() => handleProfileClick(notification)}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <img
                                    src={notification.profilePicture}
                                    alt={notification.name}
                                    className="h-12 w-12 rounded-full object-cover"
                                />
                                <div>
                                    <h3 className="text-lg font-medium text-white">{notification.name}</h3>
                                    <p className="text-sm text-gray-400">{notification.preferredDomain}</p>
                                    <p className="text-sm text-gray-500">Expert in: {notification.skills ? notification.skills.join(', ') : 'No skills listed'}</p>
                                </div>
                            </div>
                            {notification.status === 'pending' && (
                                <div className="flex space-x-2" onClick={e => e.stopPropagation()}>
                                    <Button onClick={() => handleAccept(notification.id)}>
                                        Accept
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={() => handleReject(notification.id)}
                                        className="bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                    >
                                        Reject
                                    </Button>
                                </div>
                            )}
                            {notification.status === 'accepted' && (
                                <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400">
                                    Accepted
                                </span>
                            )}
                            {notification.status === 'rejected' && (
                                <span className="rounded-full bg-red-500/20 px-3 py-1 text-sm text-red-400">
                                    Rejected
                                </span>
                            )}
                        </div>
                    </div>
                ))}

                {notifications.length === 0 && (
                    <div className="rounded-lg border border-gray-700 bg-black/10 p-6 text-center">
                        <p className="text-gray-400">No new notifications</p>
                    </div>
                )}
            </div>

            {showProfile && selectedNotification && (
                <ContributorProfile
                    contributor={selectedNotification}
                    onClose={() => setShowProfile(false)}
                    showActions={selectedNotification.status === 'pending'}
                    onAccept={() => handleAccept(selectedNotification.id)}
                    onReject={() => handleReject(selectedNotification.id)}
                    status={selectedNotification.status}
                />
            )}
        </div>
    );
};

export default Notifications;