import React, { useState, useEffect } from 'react';
import type { View, UserProfile } from '../types';

interface WalletInfo {
    balance: number;
}

interface ProfilePageProps {
    user: UserProfile | null;
    onUpdateUser: (updatedProfile: UserProfile) => void;
    setView: (view: View) => void;
    onOpenSupport: () => void;
    onLogout: () => void;
}

const ChevronRightIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
);

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateUser, setView, onOpenSupport, onLogout }) => {
    const [editedUser, setEditedUser] = useState<UserProfile | null>(null);
    const [wallet, setWallet] = useState<WalletInfo | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchWalletData = async () => {
             try {
                // Mock /api/user/wallet
                await new Promise(res => setTimeout(res, 500));
                setWallet({ balance: 125.50 });
            } catch (error) {
                console.error("Failed to fetch wallet data:", error);
            }
        };
        fetchWalletData();
    }, []);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editedUser) return;
        const { name, value } = e.target;
        setEditedUser({ ...editedUser, [name]: value });
    };

    const handleSave = async () => {
        if (!editedUser) return;
        setIsSaving(true);
        try {
            // Mock API PUT /api/user/profile
            await new Promise(res => setTimeout(res, 1000));
            onUpdateUser(editedUser);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save profile:", error);
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleEditClick = () => {
        setEditedUser(user);
        setIsEditing(true);
    };

    const renderProfileView = () => (
        <>
            <div className="flex items-center space-x-4">
                <img src={user!.avatar} alt="User Avatar" className="w-20 h-20 rounded-full object-cover" />
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">{user!.name}</h2>
                    <p className="text-gray-600">{user!.phoneNumber}</p>
                </div>
            </div>
            <button 
                onClick={handleEditClick}
                className="mt-4 text-sm font-semibold text-brand-purple hover:underline"
            >
                Edit Profile
            </button>
        </>
    );

    const renderEditView = () => (
        <>
            <div className="flex items-center space-x-4">
                <img src={editedUser!.avatar} alt="User Avatar" className="w-20 h-20 rounded-full object-cover" />
                <div className="w-full space-y-2">
                     <div>
                        <label className="text-xs font-medium text-gray-500">Name</label>
                        <input 
                            type="text"
                            name="name"
                            value={editedUser!.name}
                            onChange={handleInputChange}
                            className="w-full p-2 border-b-2 focus:outline-none focus:border-brand-purple"
                        />
                    </div>
                     <div>
                        <label className="text-xs font-medium text-gray-500">Phone Number</label>
                        <p className="w-full p-2 text-gray-500">{editedUser!.phoneNumber}</p>
                    </div>
                </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
                <button onClick={() => { setIsEditing(false); setEditedUser(user); }} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition">Cancel</button>
                <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 rounded-lg bg-brand-green text-white font-semibold transition hover:bg-opacity-90 disabled:opacity-50">
                    {isSaving ? 'Saving...' : 'Save'}
                </button>
            </div>
        </>
    );

    const menuItems: { label: string; view: View }[] = [
        { label: 'My Wishlist', view: 'WISHLIST' },
        { label: 'My Orders', view: 'ORDERS' },
        { label: 'My Refunds', view: 'REFUNDS' },
        { label: 'ShopEasy Cash & Gift Card', view: 'GIFT_CARDS' },
        { label: 'Saved Addresses', view: 'SAVED_ADDRESSES' },
        { label: 'My Rewards', view: 'REWARDS' },
        { label: 'Payment Management', view: 'PAYMENT_MANAGEMENT' },
        { label: 'Suggest Products', view: 'SUGGEST_PRODUCTS' },
        { label: 'Notifications', view: 'NOTIFICATIONS' },
        { label: 'General Info', view: 'GENERAL_INFO' },
    ];
    
    return (
        <div className="bg-gray-100 min-h-screen">
             <header className="bg-white p-4 shadow-sm flex items-center sticky top-0 z-30">
                <button onClick={() => setView('HOME')} className="text-gray-600 hover:text-brand-purple mr-4" aria-label="Back to home">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <h1 className="text-xl font-bold text-gray-800">My Account</h1>
            </header>
            
            <main className="p-4 max-w-4xl mx-auto space-y-6">
                {!user ? (
                     <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">Loading profile...</div>
                ) : (
                    <div className="bg-white rounded-lg shadow p-6">
                        {isEditing ? renderEditView() : renderProfileView()}
                    </div>
                )}
                
                {wallet && (
                    <div className="bg-white rounded-lg shadow p-6">
                         <h3 className="text-lg font-bold text-gray-800 mb-2">Wallet</h3>
                         <div className="flex justify-between items-center">
                            <div>
                                <p className="text-2xl font-bold">${wallet.balance.toFixed(2)}</p>
                                <p className="text-sm text-gray-500">ShopEasy Cash & Gift Card</p>
                            </div>
                            <button onClick={() => setView('GIFT_CARDS')} className="text-sm font-semibold text-brand-purple hover:underline">Show details</button>
                        </div>
                    </div>
                )}
                
                 <div className="bg-white rounded-lg shadow overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                        {menuItems.map(item => (
                             <li key={item.label} onClick={() => setView(item.view)} className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition" role="button" tabIndex={0}>
                                <span className="text-gray-800">{item.label}</span>
                                <ChevronRightIcon />
                            </li>
                        ))}
                        <li onClick={onOpenSupport} className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition" role="button" tabIndex={0}>
                            <span className="text-gray-800">Support</span>
                            <ChevronRightIcon />
                        </li>
                    </ul>
                </div>
                
                 <div className="text-center pt-4">
                    <button onClick={onLogout} className="w-full max-w-sm bg-white text-brand-red font-bold py-3 rounded-lg border-2 border-brand-red hover:bg-red-50 transition-colors">
                        LOGOUT
                    </button>
                </div>
            </main>
        </div>
    );
};