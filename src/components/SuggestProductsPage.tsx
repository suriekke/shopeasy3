import React, { useState } from 'react';
import type { View } from '../types';

interface SuggestProductsPageProps {
    setView: (view: View) => void;
}

export const SuggestProductsPage: React.FC<SuggestProductsPageProps> = ({ setView }) => {
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Suggestion Submitted:', { productName, description });
        setSubmitted(true);
        setProductName('');
        setDescription('');
        setTimeout(() => setSubmitted(false), 3000); // Reset after 3 seconds
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <header className="bg-white p-4 shadow-sm flex items-center sticky top-0 z-30">
                <button onClick={() => setView('PROFILE')} className="text-gray-600 hover:text-brand-red mr-4" aria-label="Back to profile">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <h1 className="text-xl font-bold text-gray-800">Suggest Products</h1>
            </header>

            <main className="p-4 max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Missing a product?</h2>
                    <p className="text-sm text-gray-600 mb-6">Let us know what you'd like to see on ShopEasy, and we'll do our best to get it for you!</p>
                    
                    {submitted && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md" role="alert">
                            <p className="font-bold">Thank you!</p>
                            <p>Your suggestion has been submitted.</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="productName" className="block text-sm font-medium text-gray-700">Product Name</label>
                            <input
                                type="text"
                                id="productName"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-purple focus:border-brand-purple sm:text-sm"
                                placeholder="e.g., Organic Almond Milk"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (optional)</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-purple focus:border-brand-purple sm:text-sm"
                                placeholder="Any specific details, like brand or size?"
                            ></textarea>
                        </div>
                        <div>
                            <button type="submit" className="w-full bg-brand-purple text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors">
                                Submit Suggestion
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};