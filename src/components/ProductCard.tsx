import React from 'react';
import type { Product } from '../types';

interface ProductCardProps {
    product: Product;
    quantityInCart: number;
    isWishlisted: boolean;
    onAddToCart: () => void;
    onUpdateQuantity: (quantity: number) => void;
    onToggleWishlist: () => void;
    onProductSelect: () => void;
}

const HeartIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
    <svg 
        className={`w-6 h-6 transition-colors ${filled ? 'text-red-500' : 'text-gray-500 group-hover:text-red-500'}`} 
        fill={filled ? 'currentColor' : 'none'} 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
        ></path>
    </svg>
);


export const ProductCard: React.FC<ProductCardProps> = ({ product, quantityInCart, isWishlisted, onAddToCart, onUpdateQuantity, onToggleWishlist, onProductSelect }) => {
    
    const handleActionClick = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
    };
    
    return (
        <div onClick={onProductSelect} className="bg-white rounded-lg shadow-md overflow-hidden group transition-all duration-300 hover:shadow-xl cursor-pointer">
            <div className="relative">
                <div className="h-48 overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                 <button 
                    onClick={(e) => handleActionClick(e, onToggleWishlist)}
                    className="group absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-red-100 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-purple z-10"
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    <HeartIcon filled={isWishlisted} />
                </button>
            </div>
            <div className="p-4 flex flex-col justify-between h-44">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.description}</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <p className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
                    
                    {/* Unified Quantity Controller */}
                    <div className="flex items-center">
                        {quantityInCart > 0 ? (
                            <div className="flex items-center border border-brand-green rounded-lg" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => onUpdateQuantity(quantityInCart - 1)}
                                    className="px-3 py-1 text-brand-green font-bold text-lg"
                                    aria-label="Decrease quantity"
                                >
                                    -
                                </button>
                                <span className="px-3 py-1 text-brand-green font-bold" aria-live="polite">
                                    {quantityInCart}
                                </span>
                                <button
                                    onClick={() => onUpdateQuantity(quantityInCart + 1)}
                                    className="px-3 py-1 text-brand-green font-bold text-lg"
                                    aria-label="Increase quantity"
                                >
                                    +
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={(e) => handleActionClick(e, onAddToCart)}
                                className="bg-brand-purple-light text-brand-purple font-bold py-2 px-6 rounded-lg hover:bg-brand-purple hover:text-white transition-colors duration-300"
                                aria-label="Add to cart"
                            >
                                ADD
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};