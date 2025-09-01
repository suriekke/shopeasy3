
import React from 'react';
import type { Category } from '../types';

interface CategoryNavProps {
    categories: Category[];
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({ categories, selectedCategory, setSelectedCategory }) => {
    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex space-x-8">
                    {categories.map(category => (
                        <button
                            key={category.name}
                            onClick={() => setSelectedCategory(category.name)}
                            className={`flex items-center py-4 text-sm font-medium transition-colors duration-200 ${
                                selectedCategory === category.name
                                    ? 'text-brand-purple border-b-2 border-brand-purple'
                                    : 'text-gray-600 hover:text-brand-purple'
                            }`}
                        >
                            <span>{category.icon}</span>
                            <span className="ml-2">{category.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
};