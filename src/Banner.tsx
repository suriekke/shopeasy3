import React from 'react';

interface BannerProps {
    title: string;
    description: string;
    imageUrl: string;
    bgColor: string;
    onOrderNow: () => void;
}

export const Banner: React.FC<BannerProps> = ({ title, description, imageUrl, bgColor, onOrderNow }) => {
    return (
        <div className={`rounded-lg overflow-hidden ${bgColor} p-8 flex items-center`}>
            <div className="w-1/2">
                <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
                <p className="text-gray-600 mt-2 mb-6">{description}</p>
                <button 
                    onClick={onOrderNow}
                    className="bg-white text-gray-800 font-bold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                    Order Now
                </button>
            </div>
            <div className="w-1/2 flex justify-center">
                 <img src={imageUrl} alt={title} className="max-h-48 rounded-lg" />
            </div>
        </div>
    );
};