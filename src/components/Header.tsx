import React from 'react';
import type { Location } from '../types';

interface HeaderProps {
    onCartClick: () => void;
    onLocationClick: () => void;
    onSupportClick: () => void;
    onProfileClick: () => void;
    onHomeClick: () => void;
  
    onAnalyticsClick: () => void;
    cartItemCount: number;
    onSearch: (query: string) => void;
    searchQuery: string;
    location: Location;
    isLoggedIn: boolean;
}

const LogoIcon = () => (
    <svg className="h-8 w-8 text-pink-600" viewBox="0 0 448 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M352 160v-32C352 57.42 294.58 0 224 0S96 57.42 96 128v32H0v272c0 44.18 35.82 80 80 80h288c44.18 0 80-35.82 80-80V160h-96zM224 48c52.93 0 96 43.07 96 96v16H128v-16c0-52.93 43.07-96 96-96zm160 416H64c-17.64 0-32-14.36-32-32V192h384v240c0 17.64-14.36 32-32 32z"/>
    </svg>
);

export const Header: React.FC<HeaderProps> = ({ onCartClick, onLocationClick, onSupportClick, onProfileClick, onHomeClick, onAnalyticsClick, cartItemCount, onSearch, searchQuery, location, isLoggedIn }) => {

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearch(e.target.value);
    };

    const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSearch(searchQuery.trim());
        }
    };

    const clearSearch = () => {
        onSearch('');
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap md:flex-nowrap gap-y-3 gap-x-4">
                {/* Left Section */}
                <div className="flex items-center space-x-6">
                    <div onClick={onHomeClick} className="flex items-center space-x-2 cursor-pointer">
                        <LogoIcon />
                        <h1 className="text-3xl font-bold text-pink-600 tracking-tighter">shopeasy</h1>
                    </div>
                    <div onClick={onLocationClick} className="hidden md:flex items-center cursor-pointer group">
                        <LocationIcon />
                        <div className="ml-2">
                            <p className="text-sm font-bold text-gray-800">{location.deliveryTime}</p>
                            <p className="text-xs text-gray-500 group-hover:text-pink-600">{location.address}</p>
                        </div>
                        <ChevronDownIcon />
                    </div>
                </div>

                {/* Center Section - Search */}
                <div className="w-full md:flex-1 order-last md:order-none md:max-w-2xl">
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for products..."
                            className="block w-full bg-gray-100 border border-gray-200 rounded-lg py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            aria-label="Search for products"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onKeyDown={handleSearchSubmit}
                        />
                         {searchQuery && (
                            <button onClick={clearSearch} className="absolute inset-y-0 right-0 pr-3 flex items-center" aria-label="Clear search">
                                <svg className="h-5 w-5 text-gray-500 hover:text-gray-700" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center space-x-4 sm:space-x-6 text-sm">
                    <button onClick={onSupportClick} className="hidden sm:block text-gray-600 hover:text-pink-600">Support</button>
        
            <button onClick={onAnalyticsClick} className="hidden sm:block text-gray-600 hover:text-pink-600">Analytics</button>
                    <button onClick={onProfileClick} className="flex items-center space-x-1 text-gray-600 hover:text-pink-600">
                        <ProfileIcon />
                        <span>{isLoggedIn ? 'Profile' : 'Login'}</span>
                    </button>
                    <button onClick={onCartClick} className="relative flex items-center bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-200">
                        <CartIcon />
                        <span className="hidden sm:inline ml-2">Cart</span>
                        {cartItemCount > 0 && (
                             <span className="absolute -top-2 -right-2 bg-pink-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartItemCount}</span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};


const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);
const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);
const ProfileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);