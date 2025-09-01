

import React from 'react';
import type { View } from '../types';

interface OrderSuccessPageProps {
    setView: (view: View) => void;
    paymentMethod: string;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ setView, paymentMethod }) => {
    const isCOD = paymentMethod === 'Pay On Delivery';
    const title = isCOD ? "Order Placed Successfully!" : "Payment Successful!";
    const message = isCOD 
        ? "Your order is confirmed. Please keep the exact amount ready for the delivery person."
        : "Your order is confirmed and on its way.";
        
    return (
        <div className="max-w-2xl mx-auto p-8 text-center flex flex-col items-center justify-center min-h-screen">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
            <p className="text-gray-600 mt-2 mb-8">{message}</p>
            
            <div className="w-full aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-lg mb-8">
                <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
                    <source src="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            
            <button 
                onClick={() => setView('HOME')}
                className="bg-brand-purple text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-colors">
                Continue Shopping
            </button>
        </div>
    );
};
