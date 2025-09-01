import React from 'react';
import type { View } from '../types';

// --- Start of new InfoPage component ---
interface InfoPageProps {
    title: string;
    setView: (view: View) => void;
}

const getInfoContent = (title: string): React.ReactNode => {
    switch (title) {
        case 'About Us':
            return (
                <div className="space-y-4">
                    <p>Welcome to ShopEasy, your one-stop shop for groceries and essentials, delivered in minutes. We were founded with the mission to make shopping simple, fast, and convenient.</p>
                    <p>Our team works tirelessly to source the freshest products and ensure they reach your doorstep with care and speed. Thank you for choosing us for your daily needs.</p>
                </div>
            );
        case 'Privacy Policy':
            return (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">1. Information We Collect</h3>
                    <p>We collect information you provide directly to us, such as when you create an account, place an order, or contact customer support. This may include your name, email address, phone number, and delivery address.</p>
                    <h3 className="text-lg font-semibold">2. How We Use Your Information</h3>
                    <p>We use the information we collect to process your orders, provide customer service, and improve our services. We do not sell your personal information to third parties.</p>
                </div>
            );
        case 'Terms & Conditions':
             return (
                <div className="space-y-4">
                    <p>By using the ShopEasy application, you agree to be bound by these Terms and Conditions. Please read them carefully.</p>
                    <p>All sales are final. If there is an issue with your order, please contact our support team within 24 hours of delivery.</p>
                </div>
            );
        case 'Careers':
             return <p>We're always looking for talented individuals to join our team. Check our official website for current openings.</p>;
        case 'Blog':
             return <p>Stay up-to-date with the latest news, recipes, and tips from the ShopEasy team on our blog.</p>;
        case 'FAQs':
            return (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">How fast is delivery?</h3>
                    <p>We pride ourselves on our 10-minute delivery promise for most locations.</p>
                    <h3 className="text-lg font-semibold">What are the delivery charges?</h3>
                    <p>Delivery is free for all orders!</p>
                </div>
            );
        default:
            return <p>Content for {title} is coming soon.</p>;
    }
};

export const InfoPage: React.FC<InfoPageProps> = ({ title, setView }) => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <header className="bg-white p-4 shadow-sm flex items-center sticky top-0 z-30">
                <button onClick={() => setView('GENERAL_INFO')} className="text-gray-600 hover:text-brand-red mr-4" aria-label="Back to General Info">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <h1 className="text-xl font-bold text-gray-800">{title}</h1>
            </header>

            <main className="p-4 max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow p-6 text-gray-700 leading-relaxed">
                    {getInfoContent(title)}
                </div>
            </main>
        </div>
    );
};
// --- End of new InfoPage component ---


interface GeneralInfoPageProps {
    setView: (view: View) => void;
    onNavigateToInfo: (title: string) => void;
}

const ChevronRightIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
);

export const GeneralInfoPage: React.FC<GeneralInfoPageProps> = ({ setView, onNavigateToInfo }) => {
    const infoItems = [
        'About Us',
        'Privacy Policy',
        'Terms & Conditions',
        'Careers',
        'Blog',
        'FAQs'
    ];

    return (
        <div className="bg-gray-100 min-h-screen">
            <header className="bg-white p-4 shadow-sm flex items-center sticky top-0 z-30">
                <button onClick={() => setView('PROFILE')} className="text-gray-600 hover:text-brand-red mr-4" aria-label="Back to profile">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <h1 className="text-xl font-bold text-gray-800">General Info</h1>
            </header>

            <main className="p-4 max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                        {infoItems.map(item => (
                            <li 
                                key={item} 
                                onClick={() => onNavigateToInfo(item)} 
                                className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition"
                            >
                                <span className="text-gray-800">{item}</span>
                                <ChevronRightIcon />
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
};