import React from 'react';
import type { View, Refund } from '../types';

interface RefundsPageProps {
    refunds: Refund[];
    setView: (view: View) => void;
}

const statusColorMap = {
    'Processing': 'text-yellow-600 bg-yellow-100',
    'Completed': 'text-green-600 bg-green-100',
};

export const RefundsPage: React.FC<RefundsPageProps> = ({ refunds, setView }) => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <header className="bg-white p-4 shadow-sm flex items-center sticky top-0 z-30">
                <button onClick={() => setView('PROFILE')} className="text-gray-600 hover:text-brand-red mr-4" aria-label="Back to profile">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <h1 className="text-xl font-bold text-gray-800">Refunds</h1>
            </header>

            <main className="p-4 max-w-4xl mx-auto space-y-4">
                {refunds.length > 0 ? (
                    refunds.map(refund => (
                        <div key={refund.id} className="bg-white rounded-lg shadow p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-gray-800">Refund ID: {refund.id}</p>
                                    <p className="text-sm text-gray-500">Order: {refund.orderId}</p>
                                    <p className="text-sm text-gray-500">Date: {refund.date}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold">${refund.amount.toFixed(2)}</p>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColorMap[refund.status]}`}>
                                        {refund.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white rounded-lg shadow">
                        <h2 className="text-2xl font-semibold text-gray-700">No Refunds</h2>
                        <p className="text-gray-500 mt-2">You don't have any refunds to show.</p>
                    </div>
                )}
            </main>
        </div>
    );
};
