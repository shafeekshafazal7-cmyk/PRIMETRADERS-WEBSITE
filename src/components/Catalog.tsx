/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { WholesaleProduct, WHOLESALE_PRODUCTS, getWhatsAppUrl, getProductResellerInfo } from '../data';
import { CeramicShape, ClayBody, GlazeType } from '../types';
import { 
  Sparkles, 
  Search, 
  Filter, 
  PhoneCall, 
  CheckCircle2, 
  Layers, 
  BadgePercent, 
  FileBox, 
  Sliders, 
  Truck, 
  Check, 
  Package, 
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';

interface CatalogProps {
  onLoadPiece: (shape: CeramicShape, clay: ClayBody, glaze: GlazeType, title: string) => void;
  onAddToCart?: (product: WholesaleProduct, qty: number) => void;
}

export const Catalog: React.FC<CatalogProps> = ({ onLoadPiece, onAddToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'household' | 'packing'>('all');
  const [justInStock, setJustInStock] = useState(false);
  const [addedProductNotification, setAddedProductNotification] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'photo' | 'blueprint'>('photo');
  const [individualOverrides, setIndividualOverrides] = useState<{[key: string]: 'photo' | 'blueprint'}>({});

  // Filter and Search logic
  const filteredProducts = useMemo(() => {
    return WHOLESALE_PRODUCTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.subCategory.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.tagline.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesStock = !justInStock || p.isAvailable;
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [searchTerm, selectedCategory, justInStock]);

  const handleCustomiseSpec = (product: WholesaleProduct) => {
    // Map product categories logically to static types for compiled 3D simulation safety
    let clayMap = ClayBody.SANDSTONE_BUFF; // timber mapping
    let glazeMap = GlazeType.UNGLAZED_NATURAL;

    if (product.category === 'packing') {
      clayMap = ClayBody.TERRACOTTA; // Multi-wall kraft mapping
      glazeMap = GlazeType.TENMOKU_RUST; // High strength adhesive seal
    } else {
      if (product.subCategory.includes('Plastic')) {
        clayMap = ClayBody.STONEWARE_GREY;
        glazeMap = GlazeType.VOLCANIC_ASH_MATTE;
      } else if (product.subCategory.includes('Steel')) {
        clayMap = ClayBody.STONEWARE_GREY;
        glazeMap = GlazeType.COBALT_LUSTRE;
      } else {
        clayMap = ClayBody.PORCELAIN_WHITE;
        glazeMap = GlazeType.PURE_ALABASTER;
      }
    }

    onLoadPiece(
      product.blueprintShape as CeramicShape,
      clayMap,
      glazeMap,
      product.name
    );
  };

  const handleLocalAddToCart = (product: WholesaleProduct) => {
    if (onAddToCart) {
      onAddToCart(product, product.minOrderQty);
      setAddedProductNotification(product.name);
      setTimeout(() => {
        setAddedProductNotification(null);
      }, 3000);
    }
  };

  return (
    <div id="wholesale-catalog-root" className="space-y-8 text-left animate-fade-in">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100 dark:border-white/10">
        <div className="space-y-1">
          <span className="font-mono text-[10px] tracking-widest text-orange-500 font-bold uppercase flex items-center gap-1.5">
            <Package size={13} /> PREMIUM EXPORT AND DOMESTIC GRADES
          </span>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-white">
            Wholesale Products Catalogue
          </h2>
          <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
            Browse our core inventory of heavy-duty packing rolls, structural transit containers, and wholesale commercial household utilities. Select items to modify printing seals or queue them in your active checkout scratchpad.
          </p>
        </div>

        {/* Info alerts */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 border border-white/5 text-[11px] text-slate-300">
          <Truck size={14} className="text-orange-500 shrink-0" />
          <span>Daily direct transport delivery strictly to Thiruvananthapuram sectors only</span>
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="bg-[#16161a] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
        
        {/* Category Filters Switches */}
        <div className="flex bg-[#0a0a0c] p-1.5 rounded-xl border border-white/5 w-full md:w-auto">
          {[
            { id: 'all', label: 'All Essentials' },
            { id: 'household', label: 'Household Items' },
            { id: 'packing', label: 'Packing Materials' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`flex-1 md:flex-none text-xs font-bold px-4 py-2 rounded-lg tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search with input */}
        <div className="relative w-full md:w-80">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search bulk products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0a0a0c] rounded-xl border border-white/15 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 text-left"
          />
        </div>

        {/* View Switcher: Real Photos / Specifications Blueprint */}
        <div className="flex bg-[#0a0a0c] p-1 rounded-xl border border-white/5 shrink-0 select-none">
          <button
            type="button"
            onClick={() => {
              setViewMode('photo');
              setIndividualOverrides({}); // clear overrides when switching globally
            }}
            className={`text-[10px] uppercase tracking-wider font-bold px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'photo'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ImageIcon size={12} />
            <span>Real Gallery</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setViewMode('blueprint');
              setIndividualOverrides({}); // clear overrides when switching globally
            }}
            className={`text-[10px] uppercase tracking-wider font-bold px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'blueprint'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sliders size={12} />
            <span>Blueprints</span>
          </button>
        </div>

        {/* Available Checker */}
        <div className="flex items-center gap-2 shrink-0 select-none">
          <input
            id="stock-only-checker"
            type="checkbox"
            checked={justInStock}
            onChange={(e) => setJustInStock(e.target.checked)}
            className="w-4 h-4 text-orange-500 border-gray-300 rounded-sm focus:ring-orange-500 bg-slate-900 accent-orange-500 cursor-pointer"
          />
          <label htmlFor="stock-only-checker" className="text-xs text-slate-300 font-bold tracking-wide cursor-pointer uppercase">
            In Stock (Bulk)
          </label>
        </div>

      </div>

      {/* NOTIFICATION TOAST */}
      {addedProductNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#16161a] border border-orange-500/40 rounded-2xl px-5 py-4 text-xs font-bold text-white flex items-center gap-3 shadow-2xl animate-fade-in max-w-sm">
          <div className="w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
            <Check size={14} />
          </div>
          <div className="text-left">
            <div className="text-white text-[11px] uppercase tracking-wider font-mono">Item added to draft brief list</div>
            <div className="text-slate-400 text-[11.5px] font-normal leading-tight mt-0.5 line-clamp-1">{addedProductNotification}</div>
          </div>
        </div>
      )}

      {/* CATALOG GRID */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-[#16161a] border border-white/10 rounded-3xl">
          <AlertCircle size={36} className="mx-auto text-slate-500 animate-pulse" />
          <p className="text-base font-serif italic text-slate-300">No products match your active search filter.</p>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">Try clearing your filters or testing other query terms to locate your wholesale packaging requirements.</p>
        </div>
      ) : (
        <div id="catalog-card-grid" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProducts.map((p) => {
            const currentMode = individualOverrides[p.id] || viewMode;
            return (
              <div
                key={p.id}
                id={`catalog-card-${p.id}`}
                className="bg-[#16161a] border border-white/10 rounded-3xl p-6 flex flex-col justify-between transition-all duration-350 hover:border-orange-500/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)]"
              >
                <div>
                  {/* Category badging */}
                  <div className="flex justify-between items-center gap-2 mb-4">
                    <span className="font-mono text-[8px] tracking-widest text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-full font-bold uppercase">
                      {p.category.toUpperCase()} / {p.subCategory}
                    </span>
                    <span className="flex items-center gap-1.5 font-mono text-[8.5px] tracking-wider text-emerald-400 font-bold bg-emerald-900/10 border border-emerald-500/10 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 size={10} /> IN STOCK (BULK)
                    </span>
                  </div>

                  <div className="flex gap-4">
                    {/* Visual representative panel (Real Photo or Blueprint) */}
                    <div className="w-[110px] h-[125px] bg-[#0a0a0c] rounded-2xl border border-white/5 flex items-center justify-center shrink-0 overflow-hidden relative group/image">
                      {currentMode === 'photo' && p.imageUrl ? (
                        <>
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover rounded-2xl animate-fade-in transition-all duration-300"
                          />
                          <span className="absolute top-2 left-2 text-[7px] font-mono tracking-wider text-white/50 bg-black/60 px-1 py-0.5 rounded uppercase select-none">
                            REAL
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="absolute top-2 left-2 text-[7px] font-mono tracking-wider text-slate-500 select-none">
                            V-COORD
                          </span>
                          
                          {/* SVG Technical Blueprints reflecting the actual items */}
                          <svg width="100%" height="100%" viewBox="0 0 100 100" className="opacity-90">
                            {/* Blueprint grid */}
                            <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" strokeDasharray="2 2" />
                            <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" strokeDasharray="2 2" />
                            
                            {p.category === 'packing' ? (
                              <g stroke="#f97316" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                {p.subCategory === 'Tape' && (
                                  <>
                                    <circle cx="50" cy="50" r="28" strokeWidth="3.5" />
                                    <circle cx="50" cy="50" r="16" strokeDasharray="3 2" />
                                    <circle cx="50" cy="50" r="10" fill="rgba(249,115,22,0.15)" strokeWidth="1" />
                                  </>
                                )}
                                {p.subCategory === 'Bubble wrap' && (
                                  <>
                                    <rect x="25" y="15" width="50" height="70" rx="3" strokeWidth="1.5" />
                                    <circle cx="38" cy="30" r="3" fill="#f97316" />
                                    <circle cx="50" cy="30" r="3" fill="#f97316" />
                                    <circle cx="62" cy="30" r="3" fill="#f97316" />
                                    <circle cx="38" cy="50" r="3" fill="#f97316" />
                                    <circle cx="50" cy="50" r="3" fill="#f97316" />
                                    <circle cx="62" cy="50" r="3" fill="#f97316" />
                                    <circle cx="38" cy="70" r="3" fill="#f97316" />
                                    <circle cx="50" cy="70" r="3" fill="#f97316" />
                                    <circle cx="62" cy="70" r="3" fill="#f97316" />
                                  </>
                                )}
                                {p.subCategory === 'Corrugated boxes' && (
                                  <>
                                    <path d="M 20 35 L 50 15 L 80 35 L 50 55 Z" />
                                    <path d="M 20 35 L 20 70 L 50 90 L 50 55 Z" />
                                    <path d="M 80 35 L 80 70 L 50 90 Z" />
                                  </>
                                )}
                                {p.subCategory === 'Packaging rolls' && (
                                  <>
                                    <ellipse cx="50" cy="22" rx="20" ry="6" fill="rgba(249,115,22,0.1)" />
                                    <line x1="30" y1="22" x2="30" y2="78" />
                                    <line x1="70" y1="22" x2="70" y2="78" />
                                    <ellipse cx="50" cy="78" rx="20" ry="6" />
                                    <ellipse cx="50" cy="22" rx="20" ry="6" />
                                    <line x1="50" y1="22" x2="50" y2="78" strokeDasharray="3 3" strokeWidth="1" />
                                  </>
                                )}
                                {p.subCategory === 'Carry bags' && (
                                  <>
                                    <path d="M 30 35 L 70 35 L 75 88 L 25 88 Z" />
                                    <path d="M 40 35 C 40 20, 60 20, 60 35" strokeWidth="2.2" />
                                    <line x1="42" y1="55" x2="58" y2="55" strokeWidth="1" />
                                    <line x1="42" y1="65" x2="58" y2="65" strokeWidth="1" />
                                  </>
                                )}
                              </g>
                            ) : (
                              <g stroke="#3b82f6" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                {p.subCategory === 'Cleaning products' && (
                                  <>
                                    <line x1="15" y1="35" x2="85" y2="35" strokeWidth="3.2" />
                                    <line x1="50" y1="35" x2="50" y2="90" strokeWidth="2.2" />
                                    <path d="M 20 35 L 15 50 M 35 35 L 30 50 M 50 35 L 45 50 M 65 35 L 60 50 M 80 35 L 75 50" />
                                  </>
                                )}
                                {p.subCategory === 'Storage containers' && (
                                  <>
                                    <rect x="30" y="25" width="40" height="55" rx="5" />
                                    <line x1="30" y1="40" x2="70" y2="40" />
                                    <rect x="38" y="15" width="24" height="10" rx="2" fill="rgba(59,130,246,0.15)" />
                                  </>
                                )}
                                {p.subCategory === 'Plastic items' && (
                                  <>
                                    <ellipse cx="50" cy="30" rx="30" ry="10" />
                                    <path d="M 20 30 C 20 30, 25 85, 32 85 L 68 85 C 75 85, 80 30, 80 30" />
                                    <path d="M 15 30 L 10 30 M 85 30 L 90 30" strokeWidth="2.5" />
                                  </>
                                )}
                                {p.subCategory === 'Kitchen accessories' && (
                                  <>
                                    <rect x="32" y="22" width="36" height="58" rx="8" />
                                    <ellipse cx="50" cy="22" rx="18" ry="4" />
                                    <circle cx="50" cy="74" r="3" fill="#3b82f6" />
                                  </>
                                )}
                              </g>
                            )}
                          </svg>
                        </>
                      )}

                      {/* Local Toggle Overriding System */}
                      {p.imageUrl && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIndividualOverrides(prev => ({
                              ...prev,
                              [p.id]: currentMode === 'photo' ? 'blueprint' : 'photo'
                            }));
                          }}
                          className="absolute right-1.5 bottom-1.5 bg-black/85 hover:bg-black p-1.5 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer border border-white/10 shadow-md select-none group/btn z-10"
                          title={currentMode === 'photo' ? "Show Specifications Blueprint" : "Show Real Photo"}
                        >
                          {currentMode === 'photo' ? <Sliders size={10} /> : <ImageIcon size={10} />}
                        </button>
                      )}
                    </div>

                    {/* Details and Description */}
                    <div className="space-y-1 mt-0.5">
                      <h3 className="font-serif text-lg font-bold text-white transition-colors group-hover:text-orange-500">{p.name}</h3>
                      <p className="text-[11px] font-medium text-slate-300 italic tracking-wide leading-relaxed">{p.tagline}</p>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans pt-1">
                        {p.description}
                      </p>
                    </div>
                  </div>

                  {/* Specifications items */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 bg-[#0a0a0c]/85 border border-white/5 rounded-2xl p-3.5 mt-4 text-[11px]">
                    {Object.entries(p.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">{key}:</span>
                        <span className="text-slate-300 font-semibold text-right max-w-[110px] truncate">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer price estimate and actions bar */}
                <div className="mt-5 pt-3.5 border-t border-white/5 space-y-4">
                  
                  {/* Financials / MOQ and Pack details */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-slate-400 font-mono">
                    <div className="flex items-center gap-1.5">
                      <BadgePercent size={14} className="text-orange-500" />
                      <span>Pack size: <strong className="text-white">{p.unitName}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Layers size={13} className="text-orange-500" />
                      <span>MOQ: <strong className="text-white">{p.minOrderQty} Packs</strong></span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-1">
                    
                    {/* Reseller Program Block */}
                    {(() => {
                      const r = getProductResellerInfo(p);
                      return (
                        <div className="space-y-1.5 text-left bg-orange-500/5 hover:bg-orange-500/10 border border-orange-500/10 rounded-xl p-3 transition-all w-full select-text">
                          <div className="flex items-center justify-between gap-2 border-b border-orange-500/10 pb-1.5">
                            <span className="text-[9.5px] text-orange-400 font-mono uppercase font-bold tracking-wider">Estimated Margin:</span>
                            <span className="text-xs font-extrabold text-green-400 font-mono tracking-tight">{r.estimatedRetailMargin}</span>
                          </div>
                          <div className="text-[10px] text-slate-300 font-sans leading-tight flex flex-col gap-1">
                            <div><span className="text-slate-500 font-bold uppercase tracking-wider font-mono text-[8px]">Ideal Audience: </span> {r.targetRetailSegment}</div>
                            <div><span className="text-slate-500 font-bold uppercase tracking-wider font-mono text-[8px]">Retail Pack: </span> {r.packagingOptions}</div>
                          </div>
                          <p className="text-[8px] text-amber-500/80 font-mono uppercase font-bold text-center mt-1 pt-1.5 border-t border-orange-500/10 select-none">
                            🔒 Wholesaler price protected. Request B2B Quote.
                          </p>
                        </div>
                      );
                    })()}

                    {/* Actions bundle */}
                    <div className="flex items-center justify-between gap-1.5 w-full">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCustomiseSpec(p)}
                          id={`load-catalog-${p.id}`}
                          title="Open this item as a baseline inside our custom specs modeler"
                          className="bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white transition-all font-bold text-xs p-2.5 rounded-xl border border-white/10 shadow-sm cursor-pointer"
                        >
                          <Sliders size={13} />
                        </button>

                        {onAddToCart && (
                          <button
                            onClick={() => handleLocalAddToCart(p)}
                            className="bg-orange-500/10 hover:bg-orange-500 hover:text-white text-orange-500 transition-all font-bold text-[10.5px] px-3 py-2.5 rounded-xl flex items-center gap-1 border border-orange-500/10 shadow-xs cursor-pointer tracking-wider"
                          >
                            <FileBox size={13} /> Add to Inquiry
                          </button>
                        )}
                      </div>

                      <a
                        href={getWhatsAppUrl(p.name, 'wholesale reseller quote')}
                        target="_blank"
                        rel="noreferrer referrer"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white transition-all font-bold text-[10.5px] px-3 py-2.5 rounded-xl flex items-center gap-1 shadow-md shadow-emerald-700/10 cursor-pointer tracking-wider shrink-0"
                      >
                        <PhoneCall size={12} /> Get Quote
                      </a>
                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VALUE ADVANTAGES BANNER */}
      <div id="catalog-value-footer" className="bg-gradient-to-br from-[#16161a] to-[#0a0a0c] p-8 rounded-3xl border border-white/10 text-center space-y-4 max-w-4xl mx-auto shadow-md">
        <Sparkles size={24} className="mx-auto text-orange-400 opacity-80" />
        <h4 className="font-serif text-lg font-bold text-white">The Prime Traders Promise</h4>
        <p className="text-xs text-slate-400 leading-relaxed italic max-w-xl mx-auto">
          &ldquo;We maintain deep container stocks of everyday essentials to eliminate supplier delays. All corrugated products are checked for burst parameters, and household plastics utilize 100% virgin compounds to serve Kerala with premium, long-lasting trust.&rdquo;
        </p>
      </div>

    </div>
  );
};
