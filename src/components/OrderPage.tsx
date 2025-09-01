import React from 'react';
import type { View, Order } from '../types';
import { OrderCard } from './OrderCard';

interface OrderPageProps {
    orders: Order[];
    setView: (view: View) => void;
    onCancelOrder: (orderId: string) => void;
    onOpenSupport: () => void;
}

export const OrderPage: React.FC<OrderPageProps> = ({ orders, setView, onCancelOrder, onOpenSupport }) => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <header className="bg-white p-4 shadow-sm flex items-center sticky top-0 z-30">
                <button onClick={() => setView('PROFILE')} className="text-gray-600 hover:text-brand-red mr-4" aria-label="Back to profile">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <h1 className="text-xl font-bold text-gray-800">Your Orders</h1>
            </header>

            <main className="p-4 max-w-4xl mx-auto space-y-6">
                {orders.length > 0 ? (
                    orders.map(order => <OrderCard key={order.id} order={order} onCancelOrder={onCancelOrder} onGetHelp={onOpenSupport} />)
                ) : (
                    <div className="text-center py-20 bg-white rounded-lg shadow">
                        <h2 className="text-2xl font-semibold text-gray-700">No Orders Yet</h2>
                        <p className="text-gray-500 mt-2">Looks like you haven't made any orders.</p>
                        <button
                            onClick={() => setView('HOME')}
                            className="mt-6 bg-brand-purple text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors"
                        >
                            Start Shopping
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};