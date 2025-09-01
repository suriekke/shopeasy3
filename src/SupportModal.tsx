
import React from 'react';

interface SupportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Support</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                </div>
                <div className="p-6 flex space-x-6">
                    <div className="w-1/4 flex flex-col space-y-2">
                         <button className="w-full text-left p-3 rounded-lg bg-blue-100 text-blue-700 font-semibold">Live chat</button>
                         <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100">Call us</button>
                         <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100">Email</button>
                         <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100">Order Issues</button>
                    </div>
                    <div className="w-3/4">
                        <div className="p-4 border rounded-lg bg-gray-50">
                            <p className="text-sm font-semibold">Tell us what's going on</p>
                            <div className="flex items-center space-x-4 my-2">
                                <div className="border rounded p-2 text-sm bg-white">Topic: Payments & refunds</div>
                                <div className="border rounded p-2 text-sm bg-white">Order #: 10294</div>
                            </div>
                            <textarea className="w-full p-2 border rounded-md" placeholder="Describe the issue..."></textarea>
                            <div className="flex justify-end mt-2">
                                <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600">Start chat</button>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="font-semibold mb-2">Quick help</h3>
                            <div className="space-y-2 text-sm">
                                <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">Where is my order?</div>
                                <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">How do I apply a promo?</div>
                                <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">Can I change delivery address?</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
