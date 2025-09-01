
import React, { useState } from 'react';
import type { View, CartItem, Location, Address } from '../types';

interface CheckoutPageProps {
    cartItems: CartItem[];
    total: number;
    setView: (view: View) => void;
    location: Location;
    onLocationChange: () => void;
    savedAddresses: Address[];
    onSelectAddress: (address: Address) => void;
    onOrderPlaced: (paymentMethod: string) => void;
}

const formatAddressString = (address: Address): string => {
    const fullAddress = `${address.type} - ${address.line1}, ${address.city}`;
    return fullAddress;
}

// SVG Icons for Payment Methods
const CardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
const UpiIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const WalletIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const NetbankingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>;
const CodIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>;
const WorkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.571A4.002 4.002 0 0116 15v1a2 2 0 01-2 2H6a2 2 0 01-2-2v-1a4.002 4.002 0 01-1.429-2.429V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm8 5H4v2.571A2.002 2.002 0 015.429 15H14.57a2.002 2.002 0 011.429-2.429V10z" clipRule="evenodd" /></svg>;

const paymentMethods = [
    { name: 'Credit / Debit Card', icon: <CardIcon /> },
    { name: 'UPI', icon: <UpiIcon /> },
    { name: 'Wallets', icon: <WalletIcon /> },
    { name: 'Netbanking', icon: <NetbankingIcon /> },
    { name: 'Pay On Delivery', icon: <CodIcon /> }
];

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ cartItems, total, setView, location, onLocationChange, savedAddresses, onSelectAddress, onOrderPlaced }) => {
    const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0].name);
    const [upiId, setUpiId] = useState('');
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });

    const deliveryFee = 0; // Free delivery
    const finalTotal = total + deliveryFee;

    const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCardDetails(prev => ({ ...prev, [name]: value }));
    };

    const handlePayment = () => {
        let isValid = false;
        switch (selectedMethod) {
            case 'Credit / Debit Card':
                if (cardDetails.number.length >= 14 && cardDetails.expiry.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/) && cardDetails.cvv.length === 3) {
                    isValid = true;
                } else {
                    alert('Please enter valid card details.');
                }
                break;
            case 'UPI':
                if (upiId.includes('@')) {
                    isValid = true;
                } else {
                    alert('Please enter a valid UPI ID.');
                }
                break;
            default: // For Wallets, Netbanking, POD, we assume success
                isValid = true;
                break;
        }

        if (isValid) {
            onOrderPlaced(selectedMethod);
            setView('SUCCESS');
        }
    };
    
    const renderPaymentDetails = () => {
        switch (selectedMethod) {
            case 'Credit / Debit Card':
                return (
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-700">Enter card details</h4>
                        <div>
                            <label className="text-xs font-medium text-gray-600">Card Number</label>
                            <input type="tel" name="number" placeholder="xxxx xxxx xxxx xxxx" value={cardDetails.number} onChange={handleCardInputChange} className="w-full mt-1 p-3 border rounded-md" maxLength={19} />
                        </div>
                        <div className="flex space-x-4">
                            <div className="w-1/2">
                                <label className="text-xs font-medium text-gray-600">Expiry</label>
                                <input type="text" name="expiry" placeholder="MM/YY" value={cardDetails.expiry} onChange={handleCardInputChange} className="w-full mt-1 p-3 border rounded-md" />
                            </div>
                            <div className="w-1/2">
                                <label className="text-xs font-medium text-gray-600">CVV</label>
                                <input type="password" name="cvv" placeholder="xxx" value={cardDetails.cvv} onChange={handleCardInputChange} className="w-full mt-1 p-3 border rounded-md" maxLength={3} />
                            </div>
                        </div>
                    </div>
                );
            case 'UPI':
                return (
                    <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Enter your UPI ID</h4>
                        <input 
                            type="text" 
                            placeholder="yourname@bank" 
                            className="w-full p-3 border rounded-md" 
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                        />
                    </div>
                );
            case 'Wallets':
                return <p className="text-gray-600">You will be redirected to select your preferred wallet and complete the payment.</p>;
            case 'Netbanking':
                return <p className="text-gray-600">You will be redirected to your bank's portal to complete the payment securely.</p>;
            case 'Pay On Delivery':
                return <p className="text-gray-600">You can pay with cash or UPI when your order is delivered. Please have the exact amount ready.</p>;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
            <button onClick={() => setView('HOME')} className="text-brand-purple font-semibold mb-6 flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                <span>Back to Home</span>
            </button>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Left side: Address & Order Summary */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Select Delivery Address</h2>
                        <div className="space-y-3">
                            {savedAddresses.map((address) => {
                                const isSelected = location.address.includes(address.line1);
                                return (
                                    <div
                                        key={address.id}
                                        onClick={() => onSelectAddress(address)}
                                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                            isSelected
                                                ? 'border-brand-purple bg-brand-purple-light'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-center font-semibold text-gray-800">
                                            {address.type === 'Home' && <HomeIcon />}
                                            {address.type === 'Work' && <WorkIcon />}
                                            <span>{address.type}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1 pl-7">{address.line1}, {address.city}</p>
                                    </div>
                                );
                            })}
                        </div>
                         <button onClick={onLocationChange} className="w-full mt-4 font-semibold text-brand-purple border-2 border-dashed border-brand-purple px-4 py-3 rounded-lg text-sm hover:bg-brand-purple-light transition-colors">
                            + Add New Address
                        </button>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold border-b pb-3 mb-4">Your Order</h2>
                        <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center">
                                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-md object-cover mr-3" />
                                        <div>
                                            <p className="font-semibold text-gray-800">{item.name}</p>
                                            <p className="text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-semibold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-bold border-b pb-2 mb-4">Bill Details</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex justify-between"><span>Item Total</span><span>${total.toFixed(2)}</span></div>
                            <div className="flex justify-between">
                                <span>Delivery Fee</span>
                                <span className="text-brand-green font-semibold">FREE</span>
                            </div>
                            <div className="flex justify-between font-bold text-gray-800 text-base pt-2 border-t mt-2"><span>To Pay</span><span>${finalTotal.toFixed(2)}</span></div>
                        </div>
                    </div>
                </div>

                {/* Right side: Payment Method */}
                <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Choose Payment Method</h2>
                    <div className="flex flex-wrap gap-3 mb-6">
                        {paymentMethods.map(method => (
                            <button
                                key={method.name}
                                onClick={() => setSelectedMethod(method.name)}
                                className={`flex items-center space-x-2 p-3 border-2 rounded-lg font-semibold transition-all duration-200 ${selectedMethod === method.name ? 'border-brand-purple bg-brand-purple-light text-brand-purple' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}
                            >
                                {method.icon}
                                <span>{method.name}</span>
                            </button>
                        ))}
                    </div>
                    <div className="min-h-[150px] p-4 bg-gray-50 rounded-lg">
                        {renderPaymentDetails()}
                    </div>
                    <button 
                        onClick={handlePayment}
                        className="w-full bg-brand-green text-white font-bold text-lg py-4 rounded-lg hover:bg-opacity-90 transition-colors mt-6">
                        Pay ${finalTotal.toFixed(2)}
                    </button>
                </div>
            </div>
        </div>
    );
};
