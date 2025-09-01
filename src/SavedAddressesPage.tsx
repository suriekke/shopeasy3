import React, { useState } from 'react';
import type { View, Address } from '../types';

interface SavedAddressesPageProps {
    addresses: Address[];
    setView: (view: View) => void;
    onAddAddress: (address: Omit<Address, 'id'>) => void;
    onRemoveAddress: (addressId: string) => void;
}

const AddressModal: React.FC<{ onClose: () => void; onSave: (address: Omit<Address, 'id'>) => void; }> = ({ onClose, onSave }) => {
    const [address, setAddress] = useState({ type: 'Home' as 'Home' | 'Work' | 'Other', line1: '', city: '', state: '', zip: '' });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(address);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Address</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Type</label>
                        <select name="type" value={address.type} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md">
                            <option>Home</option>
                            <option>Work</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Address Line 1</label>
                        <input type="text" name="line1" value={address.line1} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" required />
                    </div>
                     <div className="flex space-x-4">
                        <div className="w-1/2">
                            <label className="text-sm font-medium text-gray-700">City</label>
                            <input type="text" name="city" value={address.city} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" required />
                        </div>
                        <div className="w-1/2">
                            <label className="text-sm font-medium text-gray-700">State</label>
                            <input type="text" name="state" value={address.state} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" required />
                        </div>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-700">ZIP Code</label>
                        <input type="text" name="zip" value={address.zip} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" required />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-brand-purple text-white">Save Address</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export const SavedAddressesPage: React.FC<SavedAddressesPageProps> = ({ addresses, setView, onAddAddress, onRemoveAddress }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    return (
        <div className="bg-gray-100 min-h-screen">
            <header className="bg-white p-4 shadow-sm flex items-center sticky top-0 z-30">
                <button onClick={() => setView('PROFILE')} className="text-gray-600 hover:text-brand-red mr-4" aria-label="Back to profile">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <h1 className="text-xl font-bold text-gray-800">Saved Addresses</h1>
            </header>

            <main className="p-4 max-w-4xl mx-auto space-y-4">
                <button onClick={() => setIsModalOpen(true)} className="w-full bg-brand-red text-white font-bold py-3 rounded-lg hover:bg-opacity-90">
                    Add New Address
                </button>

                {addresses.length > 0 ? (
                    addresses.map(address => (
                        <div key={address.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-start">
                           <div>
                                <span className="text-xs font-semibold bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{address.type}</span>
                                <p className="font-semibold text-gray-800 mt-2">{address.line1}</p>
                                <p className="text-sm text-gray-600">{address.city}, {address.state} {address.zip}</p>
                           </div>
                           <button 
                                onClick={() => {
                                    if(window.confirm('Are you sure you want to remove this address?')) {
                                        onRemoveAddress(address.id);
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
                        <h2 className="text-2xl font-semibold text-gray-700">No Saved Addresses</h2>
                        <p className="text-gray-500 mt-2">Add an address to see it here.</p>
                    </div>
                )}
            </main>
            {isModalOpen && <AddressModal onClose={() => setIsModalOpen(false)} onSave={onAddAddress} />}
        </div>
    );
};
