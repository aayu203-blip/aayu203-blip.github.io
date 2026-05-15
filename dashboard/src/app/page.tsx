'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, ServerStackIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

type Product = {
  id: number;
  vendor: string;
  url: string;
  title: string;
  regular_price: number | null;
  sale_price: number | null;
  description: string;
  specifications: string;
  image_url: string;
  part_number: string | null;
};

export default function CatalogDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(query)}&page=${page}`);
        const data = await res.json();
        setProducts(data.products || []);
        setTotal(data.pagination?.total || 0);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };

    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, page]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-indigo-500/30">
      {/* Premium Header */}
      <div className="border-b border-white/5 bg-neutral-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                <ServerStackIcon className="w-8 h-8 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                  Global Parts Catalog
                </h1>
                <p className="text-sm text-neutral-500 mt-1">
                  {total.toLocaleString()} aftermarket parts indexed
                </p>
              </div>
            </div>

            <div className="w-full md:w-96 relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search models, parts, vendors..."
                className="w-full pl-11 pr-4 py-3 bg-neutral-900 border border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-neutral-600"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium text-neutral-400">No parts found matching "{query}"</h3>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {products.map((product) => (
              <a 
                key={product.id} 
                href={product.url} 
                target="_blank" 
                rel="noreferrer"
                className="group relative flex flex-col bg-neutral-900/40 border border-white/5 rounded-3xl overflow-hidden hover:bg-neutral-800/60 hover:border-indigo-500/30 transition-all duration-300 shadow-2xl shadow-black/20"
              >
                <div className="aspect-square w-full bg-neutral-800/50 p-6 flex items-center justify-center relative overflow-hidden">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.title} 
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-2xl" 
                    />
                  ) : (
                    <span className="text-neutral-600 font-medium">No Image</span>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-neutral-950/80 backdrop-blur-md border border-white/10 rounded-full text-xs font-medium tracking-wide text-neutral-300 uppercase">
                      {product.vendor}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  {product.part_number && (
                    <span className="text-xs font-mono text-indigo-400 mb-2 block uppercase tracking-wider">
                      PN: {product.part_number}
                    </span>
                  )}
                  <h3 className="text-sm font-semibold text-neutral-200 line-clamp-2 mb-4 group-hover:text-indigo-300 transition-colors">
                    {product.title}
                  </h3>
                  
                  <div className="mt-auto pt-4 border-t border-white/5 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Price</p>
                      <div className="flex items-center gap-2">
                        {product.sale_price ? (
                          <>
                            <span className="text-lg font-bold text-emerald-400">${product.sale_price.toFixed(2)}</span>
                            <span className="text-sm text-neutral-600 line-through">${product.regular_price?.toFixed(2)}</span>
                          </>
                        ) : product.regular_price ? (
                          <span className="text-lg font-bold text-neutral-200">${product.regular_price.toFixed(2)}</span>
                        ) : (
                          <span className="text-sm font-medium text-neutral-500">Contact for pricing</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && total > 50 && (
          <div className="mt-12 flex justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-6 py-2 rounded-xl bg-neutral-900 border border-white/10 disabled:opacity-50 hover:bg-neutral-800 transition-colors font-medium text-sm text-neutral-300"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page * 50 >= total}
              className="px-6 py-2 rounded-xl bg-neutral-900 border border-white/10 disabled:opacity-50 hover:bg-neutral-800 transition-colors font-medium text-sm text-neutral-300"
            >
              Next Page
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
