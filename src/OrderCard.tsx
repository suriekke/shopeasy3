import React, { useState } from 'react';
import type { Order, OrderStatus } from '../types';

interface OrderCardProps {
    order: Order;
    onCancelOrder: (orderId: string) => void;
    onGetHelp: () => void;
}

const StatusTracker: React.FC<{ status: OrderStatus }> = ({ status }) => {
    const statuses: OrderStatus[] = ['Processing', 'Out for Delivery', 'Delivered'];
    const currentIndex = statuses.indexOf(status);

    if (status === 'Cancelled') return null;

    return (
        <div className="flex items-center w-full my-4">
            {statuses.map((s, index) => (
                <React.Fragment key={s}>
                    <div className="flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${index <= currentIndex ? 'bg-green-500' : 'bg-gray-300'}`}>
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <p className={`text-xs mt-1 ${index <= currentIndex ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>{s}</p>
                    </div>
                    {index < statuses.length - 1 && (
                        <div className={`flex-grow h-1 mx-2 ${index < currentIndex ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

const CancelOrderModal: React.FC<{ onConfirm: () => void; onCancel: () => void; }> = ({ onConfirm, onCancel }) => (
    <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-modal-title"
        aria-describedby="cancel-modal-description"
    >
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center transform transition-all">
            <h3 id="cancel-modal-title" className="text-xl font-bold text-gray-800 mb-2">Confirm Cancellation</h3>
            <p id="cancel-modal-description" className="text-gray-600 mb-6">This will cancel your entire order. Your refund, if applicable, will be processed within 3-5 business days. This action cannot be undone.</p>
            <div className="flex justify-center space-x-4">
                <button
                    onClick={onCancel}
                    className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition"
                >
                    No, Keep Order
                </button>
                <button
                    onClick={onConfirm}
                    className="px-6 py-2 rounded-lg bg-brand-red text-white font-semibold hover:bg-red-700 transition"
                >
                    Yes, Cancel
                </button>
            </div>
        </div>
    </div>
);


export const OrderCard: React.FC<OrderCardProps> = ({ order, onCancelOrder, onGetHelp }) => {
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const isCancelled = order.status === 'Cancelled';

    const handleConfirmCancellation = () => {
        onCancelOrder(order.id);
        setIsCancelModalOpen(false);
    };

    return (
        <>
            <div className={`bg-white rounded-lg shadow-md overflow-hidden transition ${isCancelled ? 'opacity-70 bg-gray-50' : ''}`}>
                <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                    <div>
                        <p className="font-bold text-gray-800">Order {order.id}</p>
                        <p className="text-sm text-gray-500">Placed on {order.date}</p>
                    </div>
                    <p className="text-lg font-bold text-gray-800">${order.total.toFixed(2)}</p>
                </div>

                <div className="p-4">
                    <div className="mb-4">
                         <p className={`font-semibold ${
                            isCancelled ? 'text-brand-red' :
                            order.status === 'Delivered' ? 'text-gray-600' : 'text-green-600'}`
                        }>
                            {isCancelled ? 'Order Cancelled' : order.estimatedDelivery}
                        </p>
                    </div>

                    {isCancelled ? (
                        <div className="text-center py-4 my-4 border-t border-b">
                            <p className="text-brand-red font-bold">This order has been cancelled.</p>
                        </div>
                    ) : (
                         <StatusTracker status={order.status} />
                    )}

                    <div className="mt-6 space-y-3">
                        {order.items.map(item => (
                            <div key={item.id} className="flex items-center">
                                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-md object-cover mr-4" />
                                <div>
                                    <p className="font-semibold text-gray-700">{item.name}</p>
                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        {order.status === 'Processing' && !isCancelled && (
                            <button 
                                onClick={() => setIsCancelModalOpen(true)}
                                className="text-sm font-semibold text-brand-red border border-brand-red px-4 py-2 rounded-lg hover:bg-red-50 transition">
                                Cancel Order
                            </button>
                        )}
                        <button className="text-sm font-semibold text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition">View Details</button>
                        <button onClick={onGetHelp} className="text-sm font-semibold text-brand-purple border border-brand-purple px-4 py-2 rounded-lg hover:bg-brand-purple-light transition">Get Help</button>
                    </div>
                </div>
            </div>
            {isCancelModalOpen && (
                <CancelOrderModal 
                    onConfirm={handleConfirmCancellation}
                    onCancel={() => setIsCancelModalOpen(false)}
                />
            )}
        </>
    );
};