import React, { useState } from 'react';
import type { View, Product, CartItem } from '../types';

interface ProductDetailPageProps {
    product: Product;
    wishlist: number[];
    cartItems: CartItem[];
    onAddToCartWithQuantity: (product: Product, quantity: number) => void;
    onToggleWishlist: (productId: number) => void;
    setView: (view: View) => void;
}

const HeartIcon: React.FC<{ filled: boolean; className?: string }> = ({ filled, className = 'w-6 h-6' }) => (
    <svg 
        className={`${className} ${filled ? 'text-red-500' : 'text-gray-500'}`} 
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

const ShareIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg
      className={`${className} text-gray-500`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8m-4-6l-4-4m0 0L8 6m4-4v12"
      />
    </svg>
);

const StarIcon: React.FC<{ filled: boolean; }> = ({ filled }) => (
    <svg className={`w-5 h-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const StarRating: React.FC<{ rating: number; totalStars?: number; }> = ({ rating, totalStars = 5 }) => (
    <div className="flex items-center">
        {[...Array(totalStars)].map((_, i) => (
            <StarIcon key={i} filled={i < rating} />
        ))}
    </div>
);


export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ 
    product, 
    wishlist,
    cartItems,
    onAddToCartWithQuantity, 
    onToggleWishlist, 
    setView 
}) => {
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const isWishlisted = wishlist.includes(product.id);
    const itemInCart = cartItems.find(item => item.id === product.id);

    const handleAddToCartClick = () => {
        onAddToCartWithQuantity(product, quantity);
        setQuantity(1);
    };

    const handleShare = async () => {
        const shareData = {
            title: product.name,
            text: `Check out this product on ShopEasy: ${product.name}`,
            url: `${window.location.origin}/product/${product.id}`,
        };

        // Use Web Share API if available
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                // We can ignore AbortError which is thrown when the user cancels the share dialog.
                if ((err as Error).name !== 'AbortError') {
                    console.error('Share failed:', err);
                    alert('There was an error trying to share.');
                }
            }
        } else if (navigator.clipboard) {
            // Fallback to copying to clipboard
            try {
                await navigator.clipboard.writeText(shareData.url);
                alert('Product link copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy text: ', err);
                alert('Failed to copy link.');
            }
        } else {
            // Fallback for very old browsers
            alert('Sharing is not supported on your browser.');
        }
    };

    const averageRating = product.reviews && product.reviews.length > 0
        ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
        : 0;
    const totalReviews = product.reviews ? product.reviews.length : 0;

    return (
        <div className="bg-white min-h-screen">
            <header className="bg-white p-4 shadow-sm flex items-center sticky top-0 z-30 border-b">
                <button onClick={() => setView('HOME')} className="text-gray-600 hover:text-brand-red mr-4" aria-label="Back to home">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <h1 className="text-xl font-bold text-gray-800 truncate">{product.name}</h1>
            </header>

            <main className="max-w-4xl mx-auto p-4 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Product Image */}
                    <div className="bg-gray-100 rounded-lg flex items-center justify-center p-4 h-96">
                        <img src={product.image} alt={product.name} className="max-h-full object-contain" />
                    </div>

                    {/* Product Info & Actions */}
                    <div className="flex flex-col">
                        <h2 className="text-3xl font-bold text-gray-900">{product.name}</h2>
                        <p className="text-gray-600 mt-2 text-lg">{product.description}</p>
                        
                        <p className="text-4xl font-extrabold text-gray-900 my-6">${product.price.toFixed(2)}</p>

                        {itemInCart && (
                            <div className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-2 rounded-md mb-4" role="status">
                                You have {itemInCart.quantity} in your cart.
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center space-x-2 mt-auto pt-6 border-t">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="px-4 py-2 text-gray-700 font-bold text-xl"
                                    aria-label="Decrease quantity"
                                >-</button>
                                <span className="px-5 py-2 text-gray-800 font-bold text-lg" aria-live="polite">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="px-4 py-2 text-gray-700 font-bold text-xl"
                                    aria-label="Increase quantity"
                                >+</button>
                            </div>
                            <button
                                onClick={handleAddToCartClick}
                                className="flex-grow bg-brand-purple text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors"
                            >Add {quantity} to Cart</button>
                            <button 
                                onClick={() => onToggleWishlist(product.id)} 
                                className="p-3 border-2 rounded-lg hover:bg-red-50 transition"
                                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                            ><HeartIcon filled={isWishlisted} className="w-6 h-6" /></button>
                             <button 
                                onClick={handleShare}
                                className="p-3 border-2 rounded-lg hover:bg-blue-50 transition"
                                aria-label="Share product"
                            ><ShareIcon className="w-6 h-6" /></button>
                        </div>
                    </div>
                </div>

                {/* Details, Description, Reviews Tabs */}
                <div className="mt-12 border-t">
                    <div className="flex border-b">
                        {['description', 'details', 'reviews'].map(tabName => (
                            <button
                                key={tabName}
                                onClick={() => setActiveTab(tabName)}
                                className={`py-3 px-6 text-lg font-semibold transition-colors ${
                                    activeTab === tabName
                                        ? 'text-brand-purple border-b-2 border-brand-purple'
                                        : 'text-gray-500 hover:text-gray-800'
                                }`}
                            >
                                {tabName.charAt(0).toUpperCase() + tabName.slice(1)}
                                {tabName === 'reviews' && ` (${totalReviews})`}
                            </button>
                        ))}
                    </div>
                    <div className="py-6 text-gray-700 leading-relaxed">
                        {activeTab === 'description' && (
                            <p>{product.longDescription || product.description}</p>
                        )}
                        {activeTab === 'details' && (
                            product.details && product.details.length > 0 ? (
                                <ul className="list-disc list-inside space-y-2">
                                    {product.details.map((detail, index) => <li key={index}>{detail}</li>)}
                                </ul>
                            ) : <p>No specific details available for this product.</p>
                        )}
                        {activeTab === 'reviews' && (
                            totalReviews > 0 ? (
                                <div>
                                    <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="text-3xl font-bold">{averageRating.toFixed(1)}</p>
                                            <p className="text-sm text-gray-500">out of 5</p>
                                        </div>
                                        <div>
                                            <StarRating rating={averageRating} />
                                            <p className="text-sm text-gray-600 mt-1">Based on {totalReviews} reviews</p>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        {product.reviews?.map(review => (
                                            <div key={review.id} className="border-b pb-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <StarRating rating={review.rating} />
                                                        <p className="font-bold text-gray-800">{review.author}</p>
                                                    </div>
                                                    <p className="text-sm text-gray-500">{review.date}</p>
                                                </div>
                                                <p className="mt-2">{review.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : <p>No reviews yet. Be the first to leave a review!</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};