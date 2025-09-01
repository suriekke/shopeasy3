import React from 'react';

// SVG Icons
const InstagramIcon = () => (
    <svg className="w-6 h-6 text-gray-600 hover:text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
    </svg>
);
const TwitterIcon = () => (
    <svg className="w-6 h-6 text-gray-600 hover:text-brand-purple" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.223.085a4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path>
    </svg>
);
const FacebookIcon = () => (
    <svg className="w-6 h-6 text-gray-600 hover:text-brand-purple" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.675 0h-21.35C.589 0 0 .589 0 1.325v21.351C0 23.411.589 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.736 0 1.325-.589 1.325-1.325V1.325C24 .589 23.411 0 22.675 0z"></path>
    </svg>
);
const LinkedInIcon = () => (
    <svg className="w-6 h-6 text-gray-600 hover:text-brand-purple" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
    </svg>
);
const GooglePlayIcon = () => (
    <svg className="w-7 h-7" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <path fill="#4285F4" d="M337.8 215.1l-102.5 102.5 150.3 43.9z"></path>
        <path fill="#34A853" d="M337.8 296.9l-102.5-102.5-150.3 43.9z"></path>
        <path fill="#FBBC05" d="M488.1 256l-96.4-27.9-43.9 43.9 102.5 102.5z"></path>
        <path fill="#EA4335" d="M488.1 256l-96.4 27.9-43.9-43.9-102.5-102.5z"></path>
    </svg>
);
const AppleStoreIcon = () => (
    <svg className="w-7 h-7 text-gray-800" fill="currentColor" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg">
        <path d="M318.7 268.7c-.2-36.7 35.4-55.6 35.4-55.6-34.2-46.3-82.3-51.7-99.6-54.3-31.2-4.8-62.2 2.1-88.6 2.1-26.6 0-56.1-2.3-83.3-1.6-42.3 1.1-83.8 25.1-105.4 62.4-35.3 61.3-11.3 153.2 26.3 206.2 21.1 29.8 48.1 57.2 81.3 56.4 32.5-.7 43.2-20.1 79.2-20.1 36.1 0 46.5 20.1 79.5 20.1s52.4-25.8 72.8-55.8c16.3-23.7 20.9-48.5 21.3-72.9-2.3-.1-47.5-6.5-47.5-74.3zm-119.5-224.2c23.3-25.6 37.2-59.4 36.3-94.2-25.5 1.2-51.5 15.3-71.1 36.4-18.7 19.8-32.3 49.8-30.8 79.2 26.5-.8 51.2-15.2 65.6-21.4z"></path>
    </svg>
);

const footerCategories = [
    'Fruits & Vegetables', 'Atta, Rice, Oil & Dals', 'Masala & Dry Fruits', 'Sweet Cravings', 'Frozen Food & Ice Creams',
    'Baby Food', 'Dairy, Bread & Eggs', 'Cold Drinks & Juices', 'Munchies', 'Meats, Fish & Eggs',
    'Breakfast & Sauces', 'Tea, Coffee & More', 'Biscuits', 'Makeup & Beauty', 'Bath & Body',
    'Cleaning Essentials', 'Home Needs', 'Electricals & Accessories', 'Hygiene & Grooming', 'Health & Baby Care',
    'Homegrown Brands', 'Paan Corner'
];

const mainLinks = [
    'Home', 'Delivery Areas', 'Careers', 'Customer Support', 'Press', 'Mojo - a Shopeasy Blog'
];

const policyLinks = [
    'Privacy Policy', 'Terms of Use', 'Responsible Disclosure Policy', 'Sell on Shopeasy', 'Deliver with Shopeasy', 'Franchise with Shopeasy'
];

const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
    return (
        <div className="relative group">
            {children}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-max px-3 py-1.5 bg-gray-800 text-white text-xs rounded-md opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all pointer-events-none">
                {text}
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
            </div>
        </div>
    );
};

interface FooterProps {
    onCategorySelect: (categoryName: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onCategorySelect }) => {
    return (
        <footer className="bg-white border-t mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Categories Section */}
                <div className="mb-12">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-2">
                        {footerCategories.map(category => (
                            <button 
                                key={category} 
                                onClick={() => onCategorySelect(category)}
                                className="text-sm text-gray-600 hover:text-brand-purple text-left"
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <hr className="my-8 border-gray-200" />

                {/* Main Footer Section */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Logo and Socials */}
                    <div className="md:col-span-3">
                        <h2 className="text-3xl font-bold text-brand-purple tracking-tighter">shopeasy</h2>
                        <div className="flex space-x-4 mt-4">
                            <Tooltip text="Instagram">
                                <a href="#" aria-label="Instagram"><InstagramIcon /></a>
                            </Tooltip>
                            <Tooltip text="Twitter">
                                <a href="#" aria-label="Twitter"><TwitterIcon /></a>
                            </Tooltip>
                            <Tooltip text="Facebook">
                                <a href="#" aria-label="Facebook"><FacebookIcon /></a>
                            </Tooltip>
                             <Tooltip text="LinkedIn">
                                <a href="#" aria-label="LinkedIn"><LinkedInIcon /></a>
                            </Tooltip>
                        </div>
                        <p className="text-xs text-gray-500 mt-6">© Shopeasy Marketplace Private Limited</p>
                    </div>

                    {/* Links */}
                    <div className="md:col-span-3 md:col-start-5">
                        <ul className="space-y-3">
                            {mainLinks.map(link => (
                                <li key={link}><a href="#" className="text-sm text-gray-600 hover:text-brand-purple">{link}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Policy Links */}
                    <div className="md:col-span-3">
                        <ul className="space-y-3">
                            {policyLinks.map(link => (
                                <li key={link}><a href="#" className="text-sm text-gray-600 hover:text-brand-purple">{link}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Download App */}
                    <div className="md:col-span-3">
                        <h4 className="font-semibold text-gray-900 mb-4">Download App</h4>
                        <div className="space-y-3">
                            <a href="#" className="flex items-center border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50">
                                <GooglePlayIcon />
                                <div className="ml-3">
                                    <p className="text-xs">Get it on</p>
                                    <p className="text-sm font-semibold">Google Play</p>
                                </div>
                            </a>
                            <a href="#" className="flex items-center border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50">
                                <AppleStoreIcon />
                                <div className="ml-3">
                                    <p className="text-xs">Download on the</p>
                                    <p className="text-sm font-semibold">App Store</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};