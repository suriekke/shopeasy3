import React, { useState } from 'react';
import type { View, PaymentMethod, PaymentMethodType } from '../types';

interface PaymentManagementPageProps {
    methods: PaymentMethod[];
    setView: (view: View) => void;
    onAddMethod: (method: Omit<PaymentMethod, 'id'>) => void;
    onRemoveMethod: (methodId: string) => void;
}

const AddPaymentModal: React.FC<{ onClose: () => void; onSave: (method: Omit<PaymentMethod, 'id'>) => void; }> = ({ onClose, onSave }) => {
    const [type, setType] = useState<PaymentMethodType>('Credit Card');
    const [provider, setProvider] = useState('');
    const [last4, setLast4] = useState('');
    const [expiry, setExpiry] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newMethod: Omit<PaymentMethod, 'id'> = type === 'Credit Card' 
            ? { type, provider, last4, expiry } 
            : { type, provider, last4 };
        onSave(newMethod);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Add Payment Method</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <select value={type} onChange={(e) => setType(e.target.value as PaymentMethodType)} className="w-full p-2 border rounded-md">
                        <option>Credit Card</option>
                        <option>UPI</option>
                    </select>
                    {type === 'Credit Card' ? (
                        <>
                            <input type="text" value={provider} onChange={e => setProvider(e.target.value)} placeholder="Card Provider (e.g., Visa)" className="w-full p-2 border rounded-md" required />
                            <input type="text" value={last4} onChange={e => setLast4(e.target.value)} placeholder="Last 4 Digits" maxLength={4} className="w-full p-2 border rounded-md" required />
                            <input type="text" value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="Expiry (MM/YY)" className="w-full p-2 border rounded-md" required />
                        </>
                    ) : (
                        <>
                           <input type="text" value={provider} onChange={e => setProvider(e.target.value)} placeholder="UPI App (e.g., Google Pay)" className="w-full p-2 border rounded-md" required />
                           <input type="text" value={last4} onChange={e => setLast4(e.target.value)} placeholder="UPI ID (e.g., user@okbank)" className="w-full p-2 border rounded-md" required />
                        </>
                    )}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-brand-purple text-white">Save Method</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const PaymentManagementPage: React.FC<PaymentManagementPageProps> = ({ methods, setView, onAddMethod, onRemoveMethod }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    return (
        <div className="bg-gray-100 min-h-screen">
            <header className="bg-white p-4 shadow-sm flex items-center sticky top-0 z-30">
                <button onClick={() => setView('PROFILE')} className="text-gray-600 hover:text-brand-red mr-4" aria-label="Back to profile">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <h1 className="text-xl font-bold text-gray-800">Payment Management</h1>
            </header>

            <main className="p-4 max-w-4xl mx-auto space-y-4">
                <button onClick={() => setIsModalOpen(true)} className="w-full bg-brand-red text-white font-bold py-3 rounded-lg hover:bg-opacity-90">
                    Add New Payment Method
                </button>

                {methods.length > 0 ? (
                    methods.map(method => (
                        <div key={method.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
                           <div>
                                <p className="font-bold text-gray-800">{method.provider}</p>
                                <p className="text-sm text-gray-600">
                                    {method.type === 'Credit Card' ? `**** **** **** ${method.last4}` : method.last4}
                                </p>
                                {method.expiry && <p className="text-xs text-gray-500">Expires: {method.expiry}</p>}
                           </div>
                           <button 
                                onClick={() => {
                                    if(window.confirm('Are you sure you want to remove this payment method?')) {
                                        onRemoveMethod(method.id);
                                    }
                                }} 
                                className="text-sm text-red-600 hover:text-red-800 font-semibold"
                            >
                                Remove
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white rounded-lg shadow">
                        <h2 className="text-2xl font-semibold text-gray-700">No Payment Methods</h2>
                        <p className="text-gray-500 mt-2">Add a payment method to get started.</p>
                    </div>
                )}
            </main>
            {isModalOpen && <AddPaymentModal onClose={() => setIsModalOpen(false)} onSave={onAddMethod} />}
        </div>
    );
};
