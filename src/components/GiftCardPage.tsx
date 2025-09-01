import React, { useState } from 'react';
import type { View, GiftCard } from '../types';

interface GiftCardPageProps {
    giftCards: GiftCard[];
    setView: (view: View) => void;
    onAddGiftCard: (code: string) => boolean;
}

const AddGiftCardModal: React.FC<{ onClose: () => void; onSave: (code: string) => boolean; }> = ({ onClose, onSave }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!code.trim()) {
            setError('Please enter a gift card code.');
            return;
        }
        const success = onSave(code);
        if (success) {
            onClose();
        } else {
            setError('Invalid gift card code. Please check and try again.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="add-gift-card-title">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all">
                <h3 id="add-gift-card-title" className="text-xl font-bold text-gray-800 mb-4">Add a Gift Card</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="giftCardCode" className="text-sm font-medium text-gray-700">Enter Gift Card Code</label>
                        <input
                            type="text"
                            id="giftCardCode"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-brand-purple focus:outline-none"
                            placeholder="e.g., ABCD-EFGH-IJKL-MNOP"
                            required
                        />
                    </div>
                    {error && <p className="text-sm text-red-500" role="alert">{error}</p>}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-brand-purple text-white font-semibold hover:bg-opacity-90 transition">Add Card</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export const GiftCardPage: React.FC<GiftCardPageProps> = ({ giftCards, setView, onAddGiftCard }) => {
    const totalBalance = giftCards.reduce((acc, card) => acc + card.balance, 0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="bg-gray-100 min-h-screen">
            <header className="bg-white p-4 shadow-sm flex items-center sticky top-0 z-30">
                <button onClick={() => setView('PROFILE')} className="text-gray-600 hover:text-brand-red mr-4" aria-label="Back to profile">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <h1 className="text-xl font-bold text-gray-800">E-Gift Cards</h1>
            </header>

            <main className="p-4 max-w-4xl mx-auto space-y-6">
                {/* Balance Summary */}
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <p className="text-sm text-gray-500">Total Gift Card Balance</p>
                    <p className="text-4xl font-bold text-brand-purple mt-2">${totalBalance.toFixed(2)}</p>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="mt-4 bg-brand-red text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90">
                        Add a Gift Card
                    </button>
                </div>

                {/* Transaction History */}
                <div className="bg-white rounded-lg shadow">
                    <h2 className="text-lg font-semibold p-4 border-b">Transaction History</h2>
                    {giftCards.flatMap(card => card.transactions).length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                           {giftCards.flatMap(card => card.transactions).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(tx => (
                                <li key={tx.id} className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{tx.description}</p>
                                        <p className="text-sm text-gray-500">{tx.date}</p>
                                    </div>
                                    <p className={`font-bold ${tx.type === 'added' ? 'text-green-600' : 'text-red-600'}`}>
                                        {tx.type === 'added' ? '+' : '-'}${tx.amount.toFixed(2)}
                                    </p>
                                </li>
                           ))}
                        </ul>
                    ) : (
                        <p className="p-4 text-center text-gray-500">No transactions yet.</p>
                    )}
                </div>
            </main>
            {isModalOpen && <AddGiftCardModal onClose={() => setIsModalOpen(false)} onSave={onAddGiftCard} />}
        </div>
    );
};