import React from 'react';
import type { View, Notification } from '../types';

interface NotificationsPageProps {
    notifications: Notification[];
    setView: (view: View) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ notifications, setView }) => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <header className="bg-white p-4 shadow-sm flex items-center sticky top-0 z-30">
                <button onClick={() => setView('PROFILE')} className="text-gray-600 hover:text-brand-red mr-4" aria-label="Back to profile">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <h1 className="text-xl font-bold text-gray-800">Notifications</h1>
            </header>

            <main className="p-4 max-w-4xl mx-auto space-y-4">
                {notifications.length > 0 ? (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                            {notifications.map(notif => (
                                <li key={notif.id} className={`p-4 flex items-start space-x-4 ${!notif.read ? 'bg-blue-50' : ''}`}>
                                    {!notif.read && (
                                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    )}
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-bold text-gray-800">{notif.title}</h3>
                                            <p className="text-xs text-gray-500">{notif.date}</p>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-lg shadow">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <h2 className="mt-2 text-lg font-medium text-gray-900">No new notifications</h2>
                        <p className="mt-1 text-sm text-gray-500">You're all caught up!</p>
                    </div>
                )}
            </main>
        </div>
    );
};
