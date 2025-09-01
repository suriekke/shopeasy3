import React from 'react';
import type { View, Reward } from '../types';

interface RewardsPageProps {
    rewards: Reward[];
    setView: (view: View) => void;
}

export const RewardsPage: React.FC<RewardsPageProps> = ({ rewards, setView }) => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <header className="bg-white p-4 shadow-sm flex items-center sticky top-0 z-30">
                <button onClick={() => setView('PROFILE')} className="text-gray-600 hover:text-brand-red mr-4" aria-label="Back to profile">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <h1 className="text-xl font-bold text-gray-800">My Rewards</h1>
            </header>

            <main className="p-4 max-w-4xl mx-auto space-y-4">
                 {rewards.length > 0 ? (
                    rewards.map(reward => (
                        <div key={reward.id} className="bg-white rounded-lg shadow-md border-l-4 border-brand-purple p-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-brand-purple">{reward.title}</h3>
                                <div className="border border-dashed border-gray-400 p-2 rounded-md">
                                    <span className="font-mono font-bold text-gray-700">{reward.code}</span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 my-2">{reward.description}</p>
                            <p className="text-xs text-gray-500">Expires on: {reward.expiryDate}</p>
                        </div>
                    ))
                ) : (
                     <div className="text-center py-20 bg-white rounded-lg shadow">
                        <h2 className="text-2xl font-semibold text-gray-700">No Rewards Yet</h2>
                        <p className="text-gray-500 mt-2">Check back later for exciting offers!</p>
                    </div>
                )}
            </main>
        </div>
    );
};
