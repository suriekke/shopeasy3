
import React from 'react';
import type { CartItem } from '../types';

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
    onUpdateQuantity: (productId: number, quantity: number) => void;
    total: number;
    onCheckout: () => void;
}

export const Cart: React.FC<CartProps> = ({ isOpen, onClose, cartItems, onUpdateQuantity, total, onCheckout }) => {
    return (
        <>
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}></div>
            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-xl font-bold">Your Cart</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
                    </div>
                    
                    {cartItems.length > 0 ? (
                        <>
                            <div className="p-4 bg-green-50 border-b border-green-200 text-green-700 text-sm font-medium">
                                ✓ Free delivery auto applied on this order!
                            </div>
                            <div className="flex-grow overflow-y-auto p-4">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover mr-4" />
                                            <div>
                                                <p className="font-semibold">{item.name}</p>
                                                <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center border border-gray-300 rounded-lg">
                                            <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 text-gray-700 font-bold">-</button>
                                            <span className="px-3 py-1 text-gray-700 font-bold">{item.quantity}</span>
                                            <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-gray-700 font-bold">+</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 border-t">
                                <button className="w-full text-center py-2 border border-dashed border-gray-400 text-gray-600 rounded-lg hover:bg-gray-100">
                                    + Add More Items
                                </button>
                                <div className="mt-4 p-4 bg-brand-purple text-white rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm">{cartItems.reduce((sum, i) => sum + i.quantity, 0)} Items</p>
                                            <p className="text-xl font-bold">${total.toFixed(2)}</p>
                                        </div>
                                        <button onClick={onCheckout} className="bg-white text-brand-purple font-bold py-2 px-6 rounded-lg">
                                            Go to Checkout &rarr;
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
                            <p className="text-lg font-semibold text-gray-700">Your cart is empty</p>
                            <p className="text-gray-500 mt-2">Add items to get started!</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
