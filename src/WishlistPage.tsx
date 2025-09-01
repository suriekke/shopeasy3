import React from 'react';
import { ProductCard } from './ProductCard';
import type { View, Product, CartItem } from '../types';

interface WishlistPageProps {
    wishlistedProducts: Product[];
    cartItems: CartItem[];
    wishlist: number[];
    onAddToCart: (product: CartItem) => void;
    onUpdateQuantity: (productId: number, quantity: number) => void;
    onToggleWishlist: (productId: number) => void;
    onProductSelect: (product: Product) => void;
    setView: (view: View) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
    wishlistedProducts,
    cartItems,
    wishlist,
    onAddToCart,
    onUpdateQuantity,
    onToggleWishlist,
    onProductSelect,
    setView
}) => {
    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="bg-white p-4 shadow-sm flex items-center sticky top-[68px] md:top-0 z-30">
                <button onClick={() => setView('PROFILE')} className="text-gray-600 hover:text-brand-red mr-4" aria-label="Back to profile">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <h1 className="text-xl font-bold text-gray-800">My Wishlist ({wishlistedProducts.length})</h1>
            </header>

            <main className="p-4 max-w-7xl mx-auto">
                {wishlistedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {wishlistedProducts.map(product => {
                            const cartItem = cartItems.find(item => item.id === product.id);
                            const isWishlisted = wishlist.includes(product.id);
                            return (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    quantityInCart={cartItem ? cartItem.quantity : 0}
                                    onAddToCart={() => onAddToCart(product as CartItem)}
                                    onUpdateQuantity={(quantity) => onUpdateQuantity(product.id, quantity)}
                                    isWishlisted={isWishlisted}
                                    onToggleWishlist={() => onToggleWishlist(product.id)}
                                    onProductSelect={() => onProductSelect(product)}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 flex flex-col items-center">
                         <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"></path></svg>
                        <h2 className="text-2xl font-semibold text-gray-700">Your Wishlist is Empty</h2>
                        <p className="text-gray-500 mt-2">Tap the heart on any product to save it for later.</p>
                        <button
                            onClick={() => setView('HOME')}
                            className="mt-6 bg-brand-purple text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors"
                        >
                            Discover Products
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};