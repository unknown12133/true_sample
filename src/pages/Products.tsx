import React, { useState, useEffect } from 'react';
import {
    Plus, Edit3, Trash2, Search, Filter, RefreshCw,
    ShoppingBag, Star, Zap, MoreHorizontal, ArrowRight
} from 'lucide-react';
import { api } from '../services/api';

interface ProductDescription {
    Features: { [key: string]: string };
    Description: string;
}

interface Product {
    product_id: string;
    userid: string;
    name: string;
    description: ProductDescription;
    price: { [key: string]: number };
    tag: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

const getMockOffer = (id: string, price: number) => {
    const hasOffer = id.charCodeAt(id.length - 1) % 2 === 0;
    const discount = hasOffer ? 10 + (id.charCodeAt(id.length - 2) % 15) : 0;
    const originalPrice = Math.floor(price * (1 + discount / 100));
    return { hasOffer, discount, originalPrice };
};

const ProductImage = ({ tag, name }: { tag: string, name: string }) => {
    const [imgSrc, setImgSrc] = useState(`/Products/${tag.trim().toLowerCase()}.png`);
    const [error, setError] = useState(false);

    useEffect(() => {
        setImgSrc(`/Products/${tag.trim().toLowerCase()}.png`);
        setError(false);
    }, [tag]);

    if (error) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#FDFBF7] text-gray-300">
                <ShoppingBag size={24} strokeWidth={1} />
            </div>
        );
    }

    return (
        <img
            src={imgSrc}
            alt={name}
            className="w-full h-full object-cover mix-blend-multiply opacity-95 group-hover:scale-105 transition-transform duration-1000 ease-out"
            onError={() => setError(true)}
        />
    );
};

const Products = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.products.getAll();
            setProducts(data);
        } catch (err: any) {
            setError(err.message || 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] bg-[#FDFBF7]">
            <div className="w-12 h-12 border-2 border-[#1A4D2E]/20 border-t-[#1A4D2E] rounded-full animate-spin"></div>
            <p className="mt-4 text-[10px] font-bold tracking-[0.2em] text-[#1A4D2E] uppercase">Loading Collection</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center bg-[#FDFBF7]">
            <RefreshCw className="text-gray-300 mb-4" size={32} />
            <p className="text-gray-500 mb-6">{error}</p>
            <button onClick={fetchProducts} className="text-[#1A4D2E] underline underline-offset-4 hover:text-black transition-colors text-sm font-medium">
                Try Connection Again
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFBF7] pb-20">
            {/* Elegant Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div>
                        <span className="text-[#1A4D2E] text-xs font-bold tracking-[0.2em] uppercase mb-2 block">Premium Catalog</span>
                        <h1 className="text-4xl md:text-5xl font-serif text-[#1A3C34] leading-tight">
                            Curated <span className="italic text-[#D4A373]">Harvest</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative group flex-1 md:w-64">
                            <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-hover:text-[#1A4D2E] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search collection..."
                                className="w-full pl-8 pr-4 py-2 bg-transparent border-b border-gray-200 focus:border-[#1A4D2E] outline-none text-sm placeholder:text-gray-300 transition-colors"
                            />
                        </div>
                        <button className="p-2 text-gray-400 hover:text-[#1A4D2E] transition-colors">
                            <Filter size={18} />
                        </button>
                        <button className="bg-[#1A4D2E] text-white px-6 py-2.5 rounded-full hover:bg-[#143B23] transition-all shadow-lg shadow-[#1A4D2E]/20 flex items-center gap-2 text-sm tracking-wide font-medium ml-4">
                            <Plus size={16} />
                            <span>New Item</span>
                        </button>
                    </div>
                </div>

                {/* Minimalist Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.map((product) => {
                        const prices = Object.values(product.price);
                        const basePrice = Math.min(...prices);
                        const { hasOffer, discount, originalPrice } = getMockOffer(product.product_id, basePrice);

                        return (
                            <div key={product.product_id} className="group flex flex-col bg-white rounded-2xl p-4 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(26,77,46,0.1)] border border-transparent hover:border-[#1A4D2E]/5 h-full">

                                {/* Image Container */}
                                <div className="relative aspect-[4/5] bg-[#F4F5F4] rounded-xl overflow-hidden mb-6">
                                    <ProductImage tag={product.tag} name={product.name} />

                                    {/* Minimalist Floating Badges */}
                                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                                        {hasOffer && (
                                            <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold tracking-wider uppercase text-[#D4A373]">
                                                {discount}% Off
                                            </span>
                                        )}
                                        {product.tag === 'milk' && (
                                            <span className="px-2 py-1 bg-[#1A4D2E] text-white text-[10px] font-bold tracking-wider uppercase">
                                                Best Seller
                                            </span>
                                        )}
                                    </div>

                                    {/* Hover Actions */}
                                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0">
                                        <button className="w-8 h-8 rounded-full bg-white/90 backdrop-blur text-gray-600 hover:text-[#1A4D2E] flex items-center justify-center shadow-sm transition-colors">
                                            <Edit3 size={14} />
                                        </button>
                                        <button className="w-8 h-8 rounded-full bg-white/90 backdrop-blur text-gray-600 hover:text-red-500 flex items-center justify-center shadow-sm transition-colors">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>

                                    {/* Overlay Gradient on Hover */}
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-bold tracking-[0.15em] text-[#D4A373] uppercase">
                                            {product.tag}
                                        </span>
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <Star key={s} size={8} className="text-[#1A4D2E] fill-[#1A4D2E] opacity-40" />
                                            ))}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-serif text-[#1A4D2E] mb-2 leading-tight group-hover:text-black transition-colors">
                                        {product.name}
                                    </h3>

                                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-6 font-light">
                                        {product.description?.Description}
                                    </p>

                                    {/* Footer */}
                                    <div className="mt-auto flex items-end justify-between border-t border-gray-50 pt-4">
                                        <div className="flex flex-col">
                                            {hasOffer && (
                                                <span className="text-xs text-gray-400 line-through decoration-[#D4A373]/50 decoration-1 mb-0.5">
                                                    ₹{originalPrice}
                                                </span>
                                            )}
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-sm font-serif text-[#1A4D2E]">₹</span>
                                                <span className="text-2xl font-serif text-[#1A4D2E]">{basePrice}</span>
                                            </div>
                                        </div>

                                        <button className="group/btn relative px-4 py-2 bg-[#F4F5F4] hover:bg-[#1A4D2E] rounded-full overflow-hidden transition-all duration-300">
                                            <span className="relative z-10 text-[10px] font-bold uppercase tracking-wider text-[#1A4D2E] group-hover/btn:text-white flex items-center gap-2">
                                                Add <ArrowRight size={12} className="-translate-x-1 opacity-0 group-hover/btn:translate-x-0 group-hover/btn:opacity-100 transition-all" />
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Products;
