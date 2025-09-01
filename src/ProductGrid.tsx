import React from 'react';
import { ProductCard } from './ProductCard';
import type { Product, CartItem } from '../types';

interface ProductGridProps {
    products: Product[];
    cartItems: CartItem[];
    wishlist: number[];
    onAddToCart: (product: CartItem) => void;
    onUpdateQuantity: (productId: number, quantity: number) => void;
    onToggleWishlist: (productId: number) => void;
    onProductSelect: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, cartItems, onAddToCart, onUpdateQuantity, wishlist, onToggleWishlist, onProductSelect }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => {
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
    );
};