import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Button } from "../../components/Button";
import { ContributorProfile } from "../ContributorProfile";
import axios from "axios";
import { getUserIdFromToken } from "../../services/authService";

const Notifications: React.FC = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [selectedNotification, setSelectedNotification] = useState<any | null>(null);
    const [showProfile, setShowProfile] = useState(false);

    useEffect(() => {
        // Fetch notifications from the API
        axios.get(`http://localhost:5247/api/request/pending/${getUserIdFromToken()}`)
            .then(response => {
                console.log(response.data);
                setNotifications(response.data);
            })
            .catch(error => {
                toast.error("Failed to fetch notifications");
            });
    }, []);

    const handleAccept = (id: string) => {
        axios.post(`http://localhost:5247/api/request/accept/${id}`)
            .then(() => {
                toast.success('Request accepted');
                setNotifications(prev => prev.filter(notification => notification.id !== id));
            })
            .catch(() => {
                toast.error('Failed to accept request');
            });
    };

    const handleReject = (id: string) => {
        axios.post(`http://localhost:5247/api/request/reject/${id}`)
            .then(() => {
                toast.success('Request rejected');
                setNotifications(prev => prev.map(notification =>
                    notification.id === id ? { ...notification, status: 'rejected' } : notification
                ));
            })
            .catch(() => {
                toast.error('Failed to reject request');
            });
    };

    const handleProfileClick = (notification: any) => {
        setSelectedNotification(notification);
        setShowProfile(true);
    };

    return (
        <div className="rounded-lg border border-gray-700 bg-black/20 p-6">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Request Notifications</h2>
                <span className="rounded-full bg-blue-500 px-3 py-1 text-sm text-white">
                    {notifications.length} New
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
                                    <p className="text-sm text-gray-400">{notification.projectTitle}</p>
                                </div>
                            </div>
                            <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
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
                        </div>
                    </div>
                ))}
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
