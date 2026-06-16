/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ClayBody, GlazeType, CeramicShape, CeramicPiece } from './types';
import { 
  WholesaleProduct, 
  WHOLESALE_PRODUCTS, 
  KERALA_DISTRICTS, 
  getWhatsAppUrl, 
  getCartWhatsAppUrl 
} from './data';
import { AtelierCanvas } from './components/AtelierCanvas';
import { AIPotteryForge } from './components/AIPotteryForge';
import { Catalog } from './components/Catalog';
import { PrimeLogo } from './components/PrimeLogo';
import { NoticesDashboard } from './components/NoticesDashboard';
import { MonsoonRainFX } from './components/MonsoonRainFX';
import { 
  Compass, 
  Sparkles, 
  Layers, 
  Trash2, 
  Check, 
  ArrowRight, 
  Globe, 
  User, 
  Clock, 
  BadgeCheck,
  ShoppingCart,
  MessageSquare,
  FileBox,
  Percent,
  Warehouse,
  Truck,
  PhoneCall,
  MapPin,
  Mail,
  Building,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';

const DEFAULT_SHAPE: CeramicShape = {
  neckWidth: 0.55,
  neckLength: 0.25,
  shoulderWidth: 0.82,
  shoulderHeight: 0.55,
  bellyWidth: 0.70,
  bellyHeight: 0.30,
  baseWidth: 0.50,
  totalHeightCm: 45,
};

export default function App() {
  // Navigation: 'landing' (Bento Home) | 'catalog' (B2B Products) | 'forge' (AI Freight) | 'atelier' (Specs & Logo Canvas) | 'notices' (Offers and Posters dashboard)
  const [activeTab, setActiveTab] = useState<'landing' | 'catalog' | 'forge' | 'atelier' | 'notices'>('landing');

  // Immersive Seasonal Monsoon Theme State
  const [isMonsoonMode, setIsMonsoonMode] = useState<boolean>(true);

  // Active Builder State (using existing names for perfect compilation safety)
  const [currentShape, setCurrentShape] = useState<CeramicShape>(DEFAULT_SHAPE);
  const [currentClay, setCurrentClay] = useState<ClayBody>(ClayBody.SANDSTONE_BUFF);
  const [currentGlaze, setCurrentGlaze] = useState<GlazeType>(GlazeType.TENMOKU_RUST);
  const [currentTitle, setCurrentTitle] = useState<string>('Custom Heavy Duty Box Pack');

  // B2B Shopping Cart & Inquiry Scratchpad
  const [cart, setCart] = useState<Array<{ product: WholesaleProduct; qty: number }>>([]);
  const [showCartDrawer, setShowCartDrawer] = useState<boolean>(false);
  const [flashMessage, setFlashMessage] = useState<string | null>(null);

  // Dealer Enquiry Form state
  const [dealerForm, setDealerForm] = useState({
    shopName: '',
    phone: '',
    location: 'Thiruvananthapuram',
    productInterest: 'Packing Materials',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // GST Live Calculator state
  const [gstCalc, setGstCalc] = useState({
    baseAmount: 10000,
    rate: 18,
    netTotal: 11800,
    taxAmount: 1800
  });

  // Mobile menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto calculate GST whenever input updates
  useEffect(() => {
    const tax = Math.round(gstCalc.baseAmount * (gstCalc.rate / 100));
    setGstCalc(prev => ({
      ...prev,
      taxAmount: tax,
      netTotal: Number(gstCalc.baseAmount) + tax
    }));
  }, [gstCalc.baseAmount, gstCalc.rate]);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const cachedCart = localStorage.getItem('prime_agency_cart');
      if (cachedCart) {
        setCart(JSON.parse(cachedCart));
      }
    } catch (e) {
      console.warn("LocalStorage access is restricted in Incognito mode iframe:", e);
    }
  }, []);

  // Sync cart state
  const updateCartState = (newCart: Array<{ product: WholesaleProduct; qty: number }>) => {
    setCart(newCart);
    try {
      localStorage.setItem('prime_agency_cart', JSON.stringify(newCart));
    } catch (e) {
      console.warn("LocalStorage write is restricted in Incognito mode iframe:", e);
    }
  };

  // Add Product to Cart or increment qty
  const handleAddToCart = (product: WholesaleProduct, qty: number) => {
    const existingIdx = cart.findIndex(item => item.product.id === product.id);
    if (existingIdx > -1) {
      const updated = [...cart];
      updated[existingIdx].qty += qty;
      updateCartState(updated);
    } else {
      updateCartState([...cart, { product, qty }]);
    }
    triggerFlash(`Added ${qty} bundles of "${product.name}" to inquiry list!`);
  };

  // Remove individual item from cart
  const handleRemoveFromCart = (productId: string) => {
    const updated = cart.filter(item => item.product.id !== productId);
    updateCartState(updated);
    triggerFlash('Item removed from inquiry sketchpad.');
  };

  // Clear entire cart scratchpad
  const handleClearCart = () => {
    updateCartState([]);
    triggerFlash('Draft inquiries cleared.');
  };

  // Callback mapping from Catalog onLoadPiece and AIPotteryForge onLoadShape
  const handleLoadStateOnWheel = (shape: CeramicShape, clay: ClayBody, glaze: GlazeType, title: string) => {
    setCurrentShape(shape);
    setCurrentClay(clay);
    setCurrentGlaze(glaze);
    setCurrentTitle(title);
    setActiveTab('atelier');
    triggerFlash(`Loaded dimensional specs: "${title}" loaded in designer.`);
  };

  // Save customized item brief into localized commissions ledger
  const handleSaveCommission = (pieceDetails: Partial<CeramicPiece>) => {
    // Generate simulated product mapping for cart addition directly!
    const simulatedPriceINR = (pieceDetails.estimatedPrice || 150) * 83;
    const artificialProduct: WholesaleProduct = {
      id: `custom-spec-${Date.now()}`,
      name: pieceDetails.title || currentTitle || "Custom Core Specification",
      category: 'packing',
      subCategory: 'Custom Cardboard spec',
      tagline: pieceDetails.description || 'Custom configured dimensions and seals.',
      description: `Bespoke coordinate proportions. Material: ${pieceDetails.clay || currentClay}. Sealing adhesive: ${pieceDetails.glaze || currentGlaze}. Adjusted batch scale: ${pieceDetails.shape?.totalHeightCm || currentShape.totalHeightCm}cm.`,
      wholesalePrice: simulatedPriceINR,
      unitName: 'Bespoke Manufactured Batch of 100',
      minOrderQty: 1,
      gstRate: 18,
      isAvailable: true,
      specifications: {
        'Profile Scale': `${pieceDetails.shape?.totalHeightCm || currentShape.totalHeightCm} cm`,
        'Base Compound': String(pieceDetails.clay || currentClay),
        'Sealing Plies': String(pieceDetails.glaze || currentGlaze),
        'Density Rating': 'Reinforced Heavy Duty'
      },
      blueprintShape: (pieceDetails.shape || currentShape) as any
    };

    handleAddToCart(artificialProduct, 1);
    setShowCartDrawer(true);
    triggerFlash('Bespoke custom specification added to active checkout draft!');
  };

  const handleResetAtelier = () => {
    setCurrentShape(DEFAULT_SHAPE);
    setCurrentClay(ClayBody.SANDSTONE_BUFF);
    setCurrentGlaze(GlazeType.TENMOKU_RUST);
    setCurrentTitle('Custom Heavy Duty Box Pack');
    triggerFlash('Atelier canvas reset to standard logistics configurations.');
  };

  // General flash toast trigger
  const triggerFlash = (msg: string) => {
    setFlashMessage(msg);
    setTimeout(() => {
      setFlashMessage(null);
    }, 4000);
  };

  // Handle Dealer Form submissions
  const handleDealerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealerForm.shopName || !dealerForm.phone) {
      triggerFlash('Please supply Shop/Hotel Name and Phone Number.');
      return;
    }
    setFormSubmitted(true);
    triggerFlash('Dealer enquiry recorded! Click dispatch via WhatsApp below to submit.');
  };

  // Forward dealer form to WhatsApp
  const handleSendDealerWhatsApp = () => {
    const adminPhone = '919446051515';
    const msg = `*PRIME TRADERS THIRUVANANTHAPURAM (CHALAI) - PRE-LAUNCH INTEREST FORM*
🏬 Shop/Hotel Name: ${dealerForm.shopName}
📍 Location Selected: ${dealerForm.location}
📞 Contact Number: ${dealerForm.phone}
🎯 Product Interest: ${dealerForm.productInterest}
📨 Custom Message: ${dealerForm.message || 'No additional note'}

Please register our store and send early wholesale partner sheets before the grand opening at Chalai. Thank you!`;
    window.open(`https://wa.me/${adminPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Send whole compiled order cart via WhatsApp
  const handleDispatchOrderCart = () => {
    if (cart.length === 0) return;
    const info = {
      shopName: dealerForm.shopName || 'B2B Guest Store',
      location: dealerForm.location,
      phone: dealerForm.phone || 'Standard Call'
    };
    const waUrl = getCartWhatsAppUrl(cart, info);
    window.open(waUrl, '_blank');
    triggerFlash('Dispatched wholesale specifications list onto WhatsApp!');
    setShowCartDrawer(false);
  };

  return (
    <div 
      id="prime-agency-app" 
      className={`min-h-screen font-sans antialiased flex flex-col justify-between relative overflow-x-hidden select-none transition-all duration-700 ${
        isMonsoonMode ? 'bg-[#030a16] text-sky-100' : 'bg-[#FAF7EE] text-slate-800'
      }`}
    >
      
      {/* 
        IMMERSIVE WAREHOUSE AISLE BACKGROUND
        Renders receding high shelves on left & right margins, warm overhead spotlight flares, 
        and bright floor hallway reflections representing the official brand environment image perfectly.
      */}
      <div className={`fixed inset-0 pointer-events-none overflow-hidden select-none z-0 transition-opacity duration-700 ${
        isMonsoonMode ? 'opacity-25 mix-blend-screen' : 'mix-blend-multiply opacity-75'
      }`}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            {/* Soft warehouse ambient floor and wall values */}
            <radialGradient id="warehouseGlobalGlow" cx="50%" cy="35%" r="75%">
              {isMonsoonMode ? (
                <>
                  <stop offset="0%" stopColor="#1E293B" />
                  <stop offset="25%" stopColor="#0F172A" />
                  <stop offset="65%" stopColor="#020617" />
                  <stop offset="100%" stopColor="#000000" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="25%" stopColor="#FAF7EE" />
                  <stop offset="65%" stopColor="#FAF4E5" />
                  <stop offset="100%" stopColor="#E6DCC4" />
                </>
              )}
            </radialGradient>

            {/* Radiant ceiling linear spot lights mimicking the supermarket overhead tubes */}
            <radialGradient id="ceilingLightMain" cx="50%" cy="5%" r="45%">
              {isMonsoonMode ? (
                <>
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#0F172A" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#020617" stopOpacity="0" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#FFFDF2" stopOpacity="0.95" />
                  <stop offset="50%" stopColor="#FAF7EE" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#E6DCC4" stopOpacity="0" />
                </>
              )}
            </radialGradient>

            {/* Focus blurs matching camera depth of field */}
            <filter id="softPerspectiveBlur" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
            <filter id="heavyPerspectiveBlur" x="-15%" y="-15%" width="130%" height="130%">
              <feGaussianBlur stdDeviation="12" />
            </filter>

            {/* Seamless floor high reflection glow */}
            <linearGradient id="floorReflection" x1="0" y1="0" x2="0" y2="1">
              {isMonsoonMode ? (
                <>
                  <stop offset="0%" stopColor="#0B1528" stopOpacity="0.95" />
                  <stop offset="45%" stopColor="#070E1B" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#030710" stopOpacity="0" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                  <stop offset="45%" stopColor="#FAF7EE" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#FAF4E5" stopOpacity="0" />
                </>
              )}
            </linearGradient>
          </defs>

          {/* Core beige color base */}
          <rect width="100%" height="100%" fill="url(#warehouseGlobalGlow)" />

          {/* Perspective high-tier industrial shelves */}
          <g filter="url(#softPerspectiveBlur)" opacity="0.8">
            
            {/* LEFT AISLE COLUMN */}
            <path d="M 0,0 L 320,380 L 320,580 L 0,1080 Z" fill="#E2DBCD" opacity="0.25" />
            <path d="M 0,80 L 280,410 L 280,540 L 0,920 Z" fill="#D3C9B4" opacity="0.4" />
            
            {/* Shelf structures */}
            <line x1="-50" y1="180" x2="310" y2="400" stroke="#C8BC9D" strokeWidth="5" opacity="0.6" />
            <line x1="-50" y1="360" x2="310" y2="440" stroke="#C8BC9D" strokeWidth="7" opacity="0.6" />
            <line x1="-50" y1="620" x2="310" y2="490" stroke="#C8BC9D" strokeWidth="9" opacity="0.7" />
            
            {/* Upright steel pillars */}
            <line x1="40" y1="0" x2="40" y2="1080" stroke="#B6A885" strokeWidth="12" opacity="0.35" />
            <line x1="150" y1="30" x2="150" y2="1040" stroke="#C8BC9D" strokeWidth="9" opacity="0.45" />
            <line x1="240" y1="70" x2="240" y2="990" stroke="#D3C9B4" strokeWidth="7" opacity="0.55" />

            {/* Boxes stacked nicely inside racks */}
            <rect x="15" y="240" width="70" height="80" fill="#C8BC9D" opacity="0.55" rx="3" />
            <rect x="95" y="280" width="45" height="55" fill="#B6A885" opacity="0.45" rx="2" />
            <rect x="170" y="300" width="35" height="40" fill="#D3C9B4" opacity="0.6" rx="2" />
            
            <rect x="10" y="480" width="90" height="100" fill="#B6A885" opacity="0.45" rx="5" />
            <rect x="110" y="450" width="55" height="70" fill="#C8BC9D" opacity="0.55" rx="3" />
            <rect x="180" y="430" width="30" height="45" fill="#D3C9B4" opacity="0.6" rx="2" />

            {/* RIGHT AISLE COLUMN */}
            <path d="M 1920,0 L 1600,380 L 1600,580 L 1920,1080 Z" fill="#E2DBCD" opacity="0.25" />
            <path d="M 1920,80 L 1640,410 L 1640,540 L 1920,920 Z" fill="#D3C9B4" opacity="0.4" />
            
            {/* Shelf structures */}
            <line x1="1970" y1="180" x2="1610" y2="400" stroke="#C8BC9D" strokeWidth="5" opacity="0.6" />
            <line x1="1970" y1="360" x2="1610" y2="440" stroke="#C8BC9D" strokeWidth="7" opacity="0.6" />
            <line x1="1970" y1="620" x2="1610" y2="490" stroke="#C8BC9D" strokeWidth="9" opacity="0.7" />
            
            {/* Upright steel pillars */}
            <line x1="1880" y1="0" x2="1880" y2="1080" stroke="#B6A885" strokeWidth="12" opacity="0.35" />
            <line x1="1770" y1="30" x2="1770" y2="1040" stroke="#C8BC9D" strokeWidth="9" opacity="0.45" />
            <line x1="1680" y1="70" x2="1680" y2="990" stroke="#D3C9B4" strokeWidth="7" opacity="0.55" />

            {/* Boxes stacked inside racks */}
            <rect x="1835" y="240" width="70" height="80" fill="#C8BC9D" opacity="0.55" rx="3" />
            <rect x="1780" y="280" width="45" height="55" fill="#B6A885" opacity="0.45" rx="2" />
            <rect x="1715" y="300" width="35" height="40" fill="#D3C9B4" opacity="0.6" rx="2" />
          </g>

          {/* Receding path glow */}
          <rect x="0" y="0" width="100%" height="100%" fill="url(#ceilingLightMain)" />
          <polygon points="320,1080 1600,1080 1140,500 780,500" fill="url(#floorReflection)" opacity="0.8" />
          
          {/* Halogen high lights row overhead */}
          <g filter="url(#heavyPerspectiveBlur)">
            <ellipse cx="50%" cy="12%" rx="160" ry="22" fill="#FFFFFF" opacity="0.85" />
            <ellipse cx="50%" cy="26%" rx="100" ry="15" fill="#FFFFFF" opacity="0.7" />
            <ellipse cx="50%" cy="40%" rx="65" ry="10" fill="#FFFFFF" opacity="0.5" />
          </g>
        </svg>
      </div>
      
      {/* 1. STATE-OF-THE-ART NAV BAR PANEL */}
      <header className={`sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm relative z-10 select-none transition-all duration-500 backdrop-blur-md ${
        isMonsoonMode 
          ? 'bg-[#050e1c]/90 border-b border-sky-950/40 text-slate-100 shadow-[0_10px_30px_rgba(3,10,22,0.5)]' 
          : 'bg-[#FAF7EE]/90 border-b border-[#043259]/10 text-slate-800'
      }`}>
        
        {/* Left Side Logo */}
        <div 
          onClick={() => { setActiveTab('landing'); setMobileMenuOpen(false); }} 
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="shrink-0 overflow-hidden group-hover:scale-105 transition-all">
            <PrimeLogo size={38} showText={false} houseColor={isMonsoonMode ? "#38BDF8" : "#043259"} maskColor={isMonsoonMode ? "#061329" : "#FAF7EE"} />
          </div>
          <div className="flex flex-col text-left">
            <span className={`font-sans text-sm font-extrabold tracking-[0.24em] leading-none uppercase transition-colors ${
              isMonsoonMode ? "text-sky-300" : "text-[#043259]"
            }`}>
              PRIME TRADERS
            </span>
            <span className="font-mono text-[8px] text-[#e35a11] font-bold tracking-widest leading-loose uppercase flex items-center gap-1">
              Chalai TVM <span className="text-[7.5px] bg-[#e35a11]/10 text-[#e35a11] px-1.5 py-0 border border-orange-500/20 rounded animate-pulse">Pre-Launch</span>
            </span>
          </div>
        </div>

        {/* Center Navigation Options (Desktop) */}
        <nav className={`hidden md:flex items-center gap-6 text-[11px] font-bold tracking-widest uppercase transition-colors duration-200 ${
          isMonsoonMode ? 'text-sky-200/85' : 'text-[#043259]/75'
        }`}>
          <button
            id="nav-landing"
            onClick={() => setActiveTab('landing')}
            className={`transition-all duration-200 cursor-pointer ${
              activeTab === 'landing' 
                ? (isMonsoonMode ? 'text-white border-b-2 border-sky-450 pb-1 font-extrabold' : 'text-[#e35a11] border-b-2 border-[#e35a11] pb-1') 
                : (isMonsoonMode ? 'hover:text-white text-sky-200/60' : 'hover:text-[#043259]')
            }`}
          >
            Welcome Hub
          </button>
          <button
            id="nav-catalog"
            onClick={() => setActiveTab('catalog')}
            className={`transition-all duration-200 cursor-pointer ${
              activeTab === 'catalog' 
                ? (isMonsoonMode ? 'text-white border-b-2 border-sky-450 pb-1 font-extrabold' : 'text-[#e35a11] border-b-2 border-[#e35a11] pb-1') 
                : (isMonsoonMode ? 'hover:text-white text-sky-200/60' : 'hover:text-[#043259]')
            }`}
          >
            Products Catalogue
          </button>
          <button
            id="nav-notices"
            onClick={() => setActiveTab('notices')}
            className={`transition-all duration-200 cursor-pointer ${
              activeTab === 'notices' 
                ? (isMonsoonMode ? 'text-white border-b-2 border-sky-450 pb-1 font-extrabold' : 'text-[#e35a11] border-b-2 border-[#e35a11] pb-1') 
                : (isMonsoonMode ? 'hover:text-white text-sky-200/60' : 'hover:text-[#043259]')
            }`}
          >
            Offers & Notices
          </button>
          <button
            id="nav-forge"
            onClick={() => setActiveTab('forge')}
            className={`transition-all duration-200 cursor-pointer ${
              activeTab === 'forge' 
                ? (isMonsoonMode ? 'text-white border-b-2 border-sky-450 pb-1 font-extrabold' : 'text-[#e35a11] border-b-2 border-[#e35a11] pb-1') 
                : (isMonsoonMode ? 'hover:text-white text-sky-200/60' : 'hover:text-[#043259]')
            }`}
          >
            AI Freight Strategist
          </button>
          <button
            id="nav-atelier"
            onClick={() => setActiveTab('atelier')}
            className={`transition-all duration-200 cursor-pointer ${
              activeTab === 'atelier' 
                ? (isMonsoonMode ? 'text-white border-b-2 border-sky-450 pb-1 font-extrabold' : 'text-[#e35a11] border-b-2 border-[#e35a11] pb-1') 
                : (isMonsoonMode ? 'hover:text-white text-sky-200/60' : 'hover:text-[#043259]')
            }`}
          >
            Atelier Specs & Logo Station
          </button>
        </nav>
 
        {/* Right Actions Block */}
        <div className="flex items-center gap-3">
          {/* Quick theme trigger in header */}
          <button
            onClick={() => setIsMonsoonMode(!isMonsoonMode)}
            className={`px-3 py-1.5 rounded-xl transition-all duration-305 flex items-center justify-center gap-1.5 cursor-pointer max-md:hidden border text-xs font-bold ${
              isMonsoonMode 
                ? 'bg-sky-500/10 text-sky-400 border-sky-400/20 hover:bg-sky-500/20' 
                : 'bg-orange-500/10 text-[#e35a11] border-orange-500/20 hover:bg-orange-500/20'
            }`}
            title="Switch website atmosphere"
          >
            <span>{isMonsoonMode ? '🌧️' : '☀️'}</span>
            <span className="font-mono text-[8.5px] uppercase tracking-wider">
              {isMonsoonMode ? 'Monsoon' : 'Standard'}
            </span>
          </button>

          {/* Active shopping cart list queue indicator */}
          <button
            id="history-drawer-trigger"
            onClick={() => setShowCartDrawer(!showCartDrawer)}
            className="px-3.5 py-2 rounded-xl bg-[#e35a11] hover:bg-[#c74c0b] text-white transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-md shadow-orange-500/10"
            title="Open drafted inquiries scratchpad"
          >
            <ShoppingCart size={14} />
            <span className="text-[10px] sm:text-xs font-bold font-mono tracking-wider">
              QUOTE DRAFT ({cart.length})
            </span>
          </button>
 
          {/* Mobile menu trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className={`md:hidden p-1 ${isMonsoonMode ? 'text-sky-300 hover:text-white' : 'text-[#043259] hover:text-[#e35a11]'}`}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>
 
      {/* Mobile context dropdown nav */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-b px-4 py-4 flex flex-col gap-3 text-left text-xs uppercase font-extrabold tracking-wider z-50 relative animate-fade-in ${
          isMonsoonMode 
            ? 'bg-[#040c17] border-blue-950/20 text-slate-100' 
            : 'bg-[#FAF7EE] border-[#043259]/10 text-slate-700'
        }`}>
          <button
            onClick={() => { setActiveTab('landing'); setMobileMenuOpen(false); }}
            className={`py-2 px-3 rounded-lg text-left ${activeTab === 'landing' ? 'bg-[#e35a11] text-white' : (isMonsoonMode ? 'text-sky-200' : 'text-slate-700')}`}
          >
            Welcome Hub
          </button>
          <button
            onClick={() => { setActiveTab('catalog'); setMobileMenuOpen(false); }}
            className={`py-2 px-3 rounded-lg text-left ${activeTab === 'catalog' ? 'bg-[#e35a11] text-white' : (isMonsoonMode ? 'text-sky-200' : 'text-slate-700')}`}
          >
            Products Catalogue
          </button>
          <button
            onClick={() => { setActiveTab('notices'); setMobileMenuOpen(false); }}
            className={`py-2 px-3 rounded-lg text-left ${activeTab === 'notices' ? 'bg-[#e35a11] text-white' : (isMonsoonMode ? 'text-sky-200' : 'text-slate-700')}`}
          >
            Offers & Notices
          </button>
          <button
            onClick={() => { setActiveTab('forge'); setMobileMenuOpen(false); }}
            className={`py-2 px-3 rounded-lg text-left ${activeTab === 'forge' ? 'bg-[#e35a11] text-white' : (isMonsoonMode ? 'text-sky-200' : 'text-slate-700')}`}
          >
            AI Freight Strategist
          </button>
          <button
            onClick={() => { setActiveTab('atelier'); setMobileMenuOpen(false); }}
            className={`py-2 px-3 rounded-lg text-left ${activeTab === 'atelier' ? 'bg-[#e35a11] text-white' : (isMonsoonMode ? 'text-sky-200' : 'text-slate-700')}`}
          >
            Atelier Specs & Logo Station
          </button>
        </div>
      )}

      {/* 2. MAIN HUB CONTENT HOST */}
      <main id="main-content-host" className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 flex-grow">
        
        {/* Toast flash banners overlay */}
        {flashMessage && (
          <div 
            id="flash-toast-notification"
            className="fixed top-20 right-4 sm:right-8 z-50 bg-[#16161a] text-white border border-orange-500/40 rounded-2xl px-5 py-4 shadow-2xl max-w-sm text-xs font-semibold flex items-center gap-3 animate-slide-in"
          >
            <Check size={15} className="text-orange-500 shrink-0" />
            <div className="text-left leading-tight text-slate-200">{flashMessage}</div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW A: CURATORIAL BENTO GRID HOST (Highly requested design style) */}
        {/* ======================================================== */}
        {activeTab === 'landing' && (
          <div id="landing-splash-view" className="space-y-8 animate-fade-in text-left">
            
            {/* Kerala Monsoon Interactive Sound Synth & Particle System */}
            <MonsoonRainFX isMonsoonMode={isMonsoonMode} onToggleMonsoonMode={setIsMonsoonMode} />
            
            {/* HERO HERO SECTION BENTO SPLIT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
              
              {/* BENTO CARD 1: Digital Representation of User's Warehouse Logo Image */}
              <div 
                id="hero-warehouse-showroom-card" 
                className={`lg:col-span-4 rounded-3xl p-6 sm:p-7 flex flex-col items-center justify-between min-h-[380px] shadow-xl relative overflow-hidden group transition-all duration-500 border ${
                  isMonsoonMode 
                    ? "bg-gradient-to-b from-[#0e1726] via-[#090f1a] to-[#040810] border-sky-950/20 text-slate-100 shadow-[0_15px_30px_rgba(2,5,10,0.4)]" 
                    : "bg-gradient-to-b from-[#FAF7EE] via-[#F6F1E3] to-[#F3EAD5] border-[#d4af37]/20 text-slate-800"
                }`}
              >
                {/* Visual perspective wireframe background approximating the receded supermarket aisles and warehouse rack lines */}
                <div className="absolute inset-0 opacity-80 pointer-events-none mix-blend-multiply select-none">
                  <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    {/* Perspective ambient floor/ceiling and warm light gradients */}
                    <rect width="400" height="400" fill="url(#panelFloorGradient)" />
                    
                    {/* Radial receding perspective guidelines to simulate warehouse layout */}
                    <path d="M 200 130 L 0 50 M 200 130 L 400 50 M 200 130 L 0 350 M 200 130 L 400 350" stroke="#E2DBCD" strokeWidth="1.5" strokeOpacity="0.4" />
                    <path d="M 200 130 L 50 20 M 200 130 L 350 20 M 200 130 L 80 380 M 200 130 L 320 380" stroke="#E2DBCD" strokeWidth="1" strokeOpacity="0.3" />
                    
                    {/* Receding Rack Pillars Shelf 1 (Left Side) */}
                    <line x1="160" y1="110" x2="160" y2="165" stroke="#D3C9B4" strokeWidth="2" strokeOpacity="0.8" />
                    <line x1="110" y1="90"  x2="110" y2="210" stroke="#C8BC9D" strokeWidth="3.5" strokeOpacity="0.7" />
                    <line x1="140" y1="95"  x2="140" y2="180" stroke="#C8BC9D" strokeWidth="2.5" strokeOpacity="0.6" strokeDasharray="2,2" />
                    <line x1="40"  y1="60"  x2="40"  y2="300" stroke="#B6A885" strokeWidth="6" strokeOpacity="0.5" />
                    
                    {/* Shelves Left */}
                    <path d="M 40 100 L 110 110 L 160 115" stroke="#C8BC9D" strokeWidth="3" strokeOpacity="0.6" />
                    <path d="M 40 180 L 110 145 L 160 135" stroke="#C8BC9D" strokeWidth="4" strokeOpacity="0.6" />
                    <path d="M 40 260 L 110 200 L 160 155" stroke="#C8BC9D" strokeWidth="5" strokeOpacity="0.6" />

                    {/* Receding Rack Pillars Shelf 2 (Right Side) */}
                    <line x1="240" y1="110" x2="240" y2="165" stroke="#D3C9B4" strokeWidth="2" strokeOpacity="0.8" />
                    <line x1="290" y1="90"  x2="290" y2="210" stroke="#C8BC9D" strokeWidth="3.5" strokeOpacity="0.7" />
                    <line x1="260" y1="95"  x2="260" y2="180" stroke="#C8BC9D" strokeWidth="2.5" strokeOpacity="0.6" strokeDasharray="2,2" />
                    <line x1="360" y1="60"  x2="360" y2="300" stroke="#B6A885" strokeWidth="6" strokeOpacity="0.5" />
                    
                    {/* Shelves Right */}
                    <path d="M 360 100 L 290 110 L 240 115" stroke="#C8BC9D" strokeWidth="3" strokeOpacity="0.6" />
                    <path d="M 360 180 L 290 145 L 240 135" stroke="#C8BC9D" strokeWidth="4" strokeOpacity="0.6" />
                    <path d="M 360 260 L 290 200 L 240 155" stroke="#C8BC9D" strokeWidth="5" strokeOpacity="0.6" />

                    {/* Glowing ceiling light flares recreating the specific supermarket lighting */}
                    <ellipse cx="200" cy="85" rx="14" ry="4" fill="#FFFDE6" fillOpacity="0.9" filter="url(#panelGlowBlur)" />
                    <ellipse cx="200" cy="50" rx="32" ry="9" fill="#FFFDF0" fillOpacity="0.8" filter="url(#panelGlowBlur)" />
                    <ellipse cx="200" cy="18" rx="55" ry="16" fill="#FFFFFF" fillOpacity="0.7" filter="url(#panelGlowBlur)" />

                    <defs>
                      <radialGradient id="panelFloorGradient" cx="50%" cy="30%" r="62%">
                        {isMonsoonMode ? (
                          <>
                            <stop offset="0%" stopColor="#1E293B" />
                            <stop offset="30%" stopColor="#0B1329" />
                            <stop offset="70%" stopColor="#060913" />
                            <stop offset="100%" stopColor="#000000" />
                          </>
                        ) : (
                          <>
                            <stop offset="0%" stopColor="#FFFFFF" />
                            <stop offset="30%" stopColor="#FAF7EE" />
                            <stop offset="70%" stopColor="#F5EFE0" />
                            <stop offset="100%" stopColor="#EADEC3" />
                          </>
                        )}
                      </radialGradient>
                      <filter id="panelGlowBlur">
                        <feGaussianBlur stdDeviation="5" />
                      </filter>
                    </defs>
                  </svg>
                </div>

                {/* Ambient vignette background blur to draw contrast */}
                <div className="absolute inset-0 bg-radial-gradient from-amber-400/10 via-transparent to-transparent pointer-events-none" />

                <div className="w-full flex justify-between items-center z-10">
                  <span className={`text-[8px] tracking-widest font-extrabold px-2 py-1 rounded-md uppercase border ${
                    isMonsoonMode 
                      ? 'bg-sky-500/10 text-sky-300 border-sky-400/20' 
                      : 'bg-[#043259]/5 text-[#043259] border-[#043259]/10'
                  }`}>
                    Official Brand Identity
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </div>

                {/* Center visual container matching the user-received brand picture exactly */}
                <div className={`my-auto py-6 relative z-10 flex flex-col items-center justify-center p-6 sm:p-7 rounded-2xl border scale-100 group-hover:scale-[1.03] transition-all duration-300 ${
                  isMonsoonMode 
                    ? "bg-slate-950/80 border-slate-900/60 shadow-[0_15px_35px_rgba(3,10,22,0.6)]" 
                    : "bg-white/50 backdrop-blur-md border-white/60 shadow-[0_15px_35px_rgba(4,50,89,0.06)]"
                }`}>
                  <PrimeLogo size={110} showText={true} houseColor={isMonsoonMode ? "#38BDF8" : "#043259"} maskColor={isMonsoonMode ? "#061325" : "#FAF7EE"} />
                </div>

                <div className="w-full text-center z-10">
                  <span className={`font-mono text-[8.5px] uppercase tracking-widest font-extrabold inline-flex items-center gap-1.5 backdrop-blur-xs py-1.5 px-3 rounded-full border transition-all ${
                    isMonsoonMode 
                      ? "bg-slate-950/80 border-slate-800 text-sky-300" 
                      : "bg-white/70 text-slate-600 border-slate-300/30"
                  }`}>
                    <Sparkles size={9} className="text-amber-500 shrink-0 animate-pulse" /> TRIVANDRAM & KOLLAM SECTORS
                  </span>
                </div>
              </div>

              {/* BENTO CARD 2: Launch Details & B2B Call to Action */}
              <div 
                id="hero-details-b2b-card" 
                className="lg:col-span-5 bg-gradient-to-br from-[#121c33] via-[#091124] to-[#070b13] border border-blue-900/40 rounded-3xl p-7 sm:p-8 relative overflow-hidden shadow-xl flex flex-col justify-between"
              >
                {/* Ambient blue blur */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="space-y-4 z-10 text-left">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] tracking-widest text-orange-500 font-extrabold uppercase bg-orange-500/10 border border-orange-500/10 px-3 py-1 rounded-full inline-block">
                      EXCLUSIVE GRAND VENTURE
                    </span>
                    <span className="font-mono text-[9px] tracking-widest text-white font-extrabold bg-red-600 px-3 py-1 rounded-full inline-block animate-pulse">
                      📍 FIRST-EVER LAUNCH
                    </span>
                  </div>
                  <p className="font-mono text-xs text-slate-400 font-bold">🚀 Brand New Showroom Showcased First in Chalai Bazaar</p>
                  
                  <h1 className="font-serif text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                    Our First Launch.<br />
                    <span className="text-orange-400 drop-shadow-sm italic">Pre-Opening Price Booking</span>
                  </h1>
                  
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                    <strong>Prime Traders</strong> is a brand-new wholesale venture making its official, absolute debut. We have not launched our products or showroom anywhere else before! Be part of our merchant network at the ultimate beginning. Reserve opening-day prices and queue your distribution interest for our upcoming flagship yard in <strong>Chalai Bazaar, Thiruvananthapuram</strong>.
                  </p>
                </div>

                <div className="pt-6 flex flex-wrap gap-2 sm:gap-3.5 z-10">
                  <button
                    onClick={() => setActiveTab('catalog')}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs tracking-wider uppercase px-5 py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-orange-500/10 cursor-pointer"
                  >
                    View Bulk Catalog <ArrowRight size={13} />
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('notices')}
                    className="bg-[#e35a11]/10 hover:bg-[#e35a11]/20 text-orange-400 border border-orange-500/30 font-extrabold text-xs tracking-wider uppercase px-5 py-3.5 rounded-2xl flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer"
                  >
                    <Percent size={13} className="shrink-0" /> Offers & notices
                  </button>

                  <a
                    href="https://wa.me/919446051515?text=Hi%20Prime%20Traders!%20I%20want%20to%20enquire%20about%20your%20wholesale%20household%20and%20packing%20products%20price%20list.%20Thank%20you!"
                    target="_blank"
                    rel="noreferrer referrer"
                    className="bg-[#111c33]/80 hover:bg-blue-900/20 text-[#bfdbfe] font-extrabold text-xs tracking-wider uppercase px-5 py-3.5 rounded-2xl border border-blue-900/40 shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <MessageSquare size={12} className="text-orange-400 shrink-0" /> WhatsApp Enquiry
                  </a>
                </div>
              </div>

              {/* BENTO CARD 3: Quick categories shortcut grid */}
              <div 
                id="hero-categories-shortcut-card" 
                className="lg:col-span-3 bg-[#121c33] border border-blue-900/30 rounded-3xl p-6 flex flex-col justify-between shadow-xl text-left relative overflow-hidden"
              >
                <div className="space-y-4">
                  <span className="block text-[9px] font-mono tracking-widest text-[#94a3b8] font-bold uppercase">
                    SHOWROOM CATEGORIES
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white leading-snug">Essential Inventory</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    We maintain heavy stacks of products in our sectors to guarantee continuous supply:
                  </p>
                </div>

                <div className="space-y-3 my-4">
                  {/* Category A */}
                  <div 
                    onClick={() => setActiveTab('catalog')}
                    className="group flex items-center justify-between p-3 rounded-2xl bg-[#091124] border border-blue-900/20 hover:border-orange-500/40 hover:bg-orange-500/5 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/10 group-hover:bg-orange-500 text-orange-500 group-hover:text-white flex items-center justify-center transition-all shrink-0">
                        <Warehouse size={14} />
                      </div>
                      <div className="text-left">
                        <h4 className="text-[10.5px] font-extrabold tracking-wide uppercase text-white">Household Jars</h4>
                        <p className="text-[9px] text-slate-500 mt-0.5 mt-px leading-none">Kitchen storage, squeegees</p>
                      </div>
                    </div>
                    <ArrowRight size={12} className="text-slate-500 group-hover:text-orange-500 shrink-0 transform group-hover:translate-x-1 transition-all" />
                  </div>

                  {/* Category B */}
                  <div 
                    onClick={() => setActiveTab('catalog')}
                    className="group flex items-center justify-between p-3 rounded-2xl bg-[#091124] border border-blue-900/20 hover:border-orange-500/40 hover:bg-orange-500/5 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/10 group-hover:bg-orange-500 text-orange-500 group-hover:text-white flex items-center justify-center transition-all shrink-0">
                        <FileBox size={14} />
                      </div>
                      <div className="text-left">
                        <h4 className="text-[10.5px] font-extrabold tracking-wide uppercase text-white">Packing Rolls</h4>
                        <p className="text-[9px] text-slate-500 mt-0.5 mt-px leading-none">Bubble wrap, cargo cartons</p>
                      </div>
                    </div>
                    <ArrowRight size={12} className="text-slate-500 group-hover:text-orange-500 shrink-0 transform group-hover:translate-x-1 transition-all" />
                  </div>
                </div>

                <div className="bg-[#091124]/60 rounded-xl p-2.5 border border-white/5 text-[10px] leading-relaxed text-slate-400 font-serif italic text-center">
                  &ldquo;100% virgin custom-molded compounds.&rdquo;
                </div>
              </div>

            </div>

            {/* BENTO GRID DEEP B2B OPERATIONS HUB */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* BENTO BLOCK 3: High-End Live GST Calculator Tool */}
              <div className="bg-[#121c33] border border-blue-900/30 rounded-3xl p-6 flex flex-col justify-between shadow-lg">
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-[#091124] px-3 py-1.5 rounded-xl border border-white/5">
                    <span className="font-mono text-[9px] tracking-wider text-orange-500 font-bold uppercase flex items-center gap-1">
                      <Percent size={11} /> B2B GST ESTIMATOR
                    </span>
                    <span className="text-[9.5px] font-mono text-slate-400">18% Standard</span>
                  </div>
                  
                  <div className="space-y-3 pt-1">
                    <h4 className="text-base font-serif font-bold text-white">Instant Quotation Helper</h4>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      Enter raw B2B amount to estimate CGST + SGST (18% for household/tape plies) or packaging tax codes:
                    </p>
                  </div>

                  {/* Calculator entries */}
                  <div className="space-y-2.5 bg-[#091124] p-3 rounded-2xl border border-blue-900/10">
                    <div className="space-y-1 text-left">
                      <label className="block text-[8.5px] font-mono text-slate-500 uppercase font-bold">Base Cost (in ₹)</label>
                      <input
                        type="number"
                        value={gstCalc.baseAmount}
                        onChange={(e) => setGstCalc(prev => ({ ...prev, baseAmount: parseFloat(e.target.value) || 0 }))}
                        className="w-full bg-[#121c33] rounded-xl border border-blue-900/30 p-2 text-xs text-white uppercase focus:outline-none focus:border-orange-500 font-semibold text-left font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-left">
                      <div className="space-y-0.5">
                        <span className="text-[8.5px] text-slate-500 uppercase font-mono block">Tax Amount</span>
                        <span className="text-[13px] text-slate-300 font-bold font-mono">₹{gstCalc.taxAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[8.5px] text-slate-500 uppercase font-mono block">Gross Estimate</span>
                        <span className="text-[13px] text-orange-400 font-bold font-mono">₹{gstCalc.netTotal.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-[9.5px] text-slate-500 font-serif leading-snug pt-3 border-t border-white/5 italic text-center">
                  *Standard statutory GST calculated (B2B tax credit invoice generated with GSTIN).
                </p>
              </div>

              {/* BENTO BLOCK 4: Logistics route network Kerala hubs stats */}
              <div className="bg-[#121c33] border border-blue-900/30 rounded-3xl p-6 flex flex-col justify-between shadow-lg">
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-[#091124] px-3 py-1.5 rounded-xl border border-white/5">
                    <span className="font-mono text-[9px] tracking-wider text-orange-500 font-bold uppercase flex items-center gap-1">
                      <Truck size={11} /> DAILY SECTOR FLEETS
                    </span>
                    <span className="text-[9.5px] font-mono text-emerald-400 font-bold">● EXPRESS</span>
                  </div>

                  <div className="space-y-3 pt-1">
                    <h4 className="text-base font-serif font-bold text-white">Kerala Logistics Coverage</h4>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      We coordinate dispatch with major local transport services delivering with next-day container options across:
                    </p>
                  </div>

                  {/* List of districts routes */}
                  <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 text-[11px] select-text">
                    {[
                      { area: 'Thiruvananthapuram Sector (Chalai)', time: 'Daily Express Delivery' },
                      { area: 'Kollam Sector (Hub)', time: 'Daily Direct Delivery' }
                    ].map((route, i) => (
                      <div key={i} className="flex justify-between items-center bg-[#091124]/70 p-2 rounded-lg border border-white/5">
                        <span className="text-white font-bold flex items-center gap-1">
                          <MapPin size={9} className="text-orange-500" /> {route.area}
                        </span>
                        <span className="font-mono text-[9px] text-[#22c55e] font-semibold">{route.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 leading-relaxed pt-3 border-t border-white/5 italic">
                  *Quick state dispatch ensures your retail racks and packing rooms never sit bare.
                </p>
              </div>

              {/* BENTO BLOCK 5: Interactive Kerala maps placeholder & Contact details Card */}
              <div className="bg-[#121c33] border border-blue-900/30 rounded-3xl p-6 flex flex-col justify-between shadow-lg text-left">
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-[#091124] px-3 py-1.5 rounded-xl border border-white/5">
                    <span className="font-mono text-[9px] tracking-wider text-orange-500 font-bold uppercase flex items-center gap-1">
                      <Clock size={11} /> BUSINESS DESK HOURS
                    </span>
                    <span className="text-[9.5px] font-mono text-slate-400">09:00 AM - 06:30 PM</span>
                  </div>

                  <div className="space-y-3.5 pt-1">
                    <h4 className="text-base font-serif font-bold text-white">Central Operations Hub</h4>
                    
                    <div className="space-y-2 text-[11.5px] text-slate-300">
                      <div className="flex items-start gap-2">
                        <MapPin size={13} className="text-orange-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white">Prime Traders House (Opening Soon)</strong><br />
                          Chalai Bazaar, Thiruvananthapuram, Kerala, India
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <PhoneCall size={13} className="text-orange-500 shrink-0" />
                        <span>Office: +91 94460 51515</span>
                      </div>
                      <div className="flex items-center gap-2 select-all">
                        <Mail size={13} className="text-orange-500 shrink-0" />
                        <span>shafeekshafazal7@gmail.com</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated Map */}
                <div className="w-full mt-4 h-20 bg-[#091124] rounded-2xl border border-white/5 overflow-hidden relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] bg-[size:10px_10px] opacity-40" />
                  <div className="absolute w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                  <div className="absolute w-1.5 h-1.5 rounded-full bg-orange-500" />
                  <span className="relative z-10 text-[9.5px] font-mono text-slate-500 uppercase tracking-widest bg-black/40 px-2 py-0.5 rounded-md">
                    KERALA MAP REGION
                  </span>
                </div>
              </div>

            </div>

            {/* DEALER ENQUIRY FORM PANEL (The requested Distributor portal form) */}
            <div id="dealer-enquiry-mat" className="max-w-4xl mx-auto bg-[#121c33] border border-blue-900/30 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="border-b border-white/5 pb-4 mb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[8px] tracking-widest text-orange-500 font-bold uppercase bg-orange-500/10 px-2 py-0.5 rounded-md">
                    RETAILER & DISTRIBUTOR INQUIRY DESK
                  </span>
                  <span className="font-mono text-[8px] tracking-widest text-white font-bold uppercase bg-red-650 px-2 py-0.5 rounded-md animate-pulse">
                    CHALAI TVM: PRE-LAUNCH BOOKINGS ACTIVE
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-white mt-1.5">Pre-Launch Dealership Registration</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans pt-1">
                  Our new wholesale hub is **Coming Soon to Chalai Bazaar, Thiruvananthapuram**! Register your supermarket, hotel, or retail brand now to secure early wholesale pricing sheets and grand-opening priority delivery slots.
                </p>
              </div>

              {!formSubmitted ? (
                <form onSubmit={handleDealerSubmit} className="space-y-4 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="shop-name-input" className="block text-[10px] font-mono tracking-widest text-slate-400 font-bold uppercase">🏬 Shop / Company Name *</label>
                      <input
                        id="shop-name-input"
                        type="text"
                        required
                        value={dealerForm.shopName}
                        onChange={(e) => setDealerForm(prev => ({ ...prev, shopName: e.target.value }))}
                        placeholder="e.g. Malabar Supermarket Chalai"
                        className="w-full bg-[#091124] rounded-xl border border-blue-900/30 p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 text-left font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="shop-phone-input" className="block text-[10px] font-mono tracking-widest text-slate-400 font-bold uppercase">📞 Contact Phone Number *</label>
                      <input
                        id="shop-phone-input"
                        type="tel"
                        required
                        value={dealerForm.phone}
                        onChange={(prev) => setDealerForm(p => ({ ...p, phone: prev.target.value }))}
                        placeholder="e.g. +91 94460 00000"
                        className="w-full bg-[#091124] rounded-xl border border-blue-900/30 p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 text-left font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 text-left">
                      <label htmlFor="shop-loc-dropdown" className="block text-[10px] font-mono tracking-widest text-slate-400 font-bold uppercase">📍 Delivery District (Kerala) *</label>
                      <select
                        id="shop-loc-dropdown"
                        value={dealerForm.location}
                        onChange={(e) => setDealerForm(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full bg-[#091124] rounded-xl border border-blue-900/30 p-3 text-xs text-white focus:outline-none focus:border-orange-500"
                      >
                        {KERALA_DISTRICTS.map((dist, i) => (
                          <option key={i} value={dist} className="bg-[#070b13] text-white font-bold">{dist}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1 text-left">
                      <label htmlFor="shop-interest" className="block text-[10px] font-mono tracking-widest text-slate-400 font-bold uppercase">🎯 Core Products Interest</label>
                      <select
                        id="shop-interest"
                        value={dealerForm.productInterest}
                        onChange={(e) => setDealerForm(prev => ({ ...prev, productInterest: e.target.value }))}
                        className="w-full bg-[#091124] rounded-xl border border-blue-900/30 p-3 text-xs text-white focus:outline-none focus:border-orange-500"
                      >
                        <option value="Household Items" className="bg-[#070b13] text-white">Household Items (Squeegees, Bins, Soap Cases, Canisters)</option>
                        <option value="Packing Materials" className="bg-[#070b13] text-white">Packing Materials (Bubble, Tape, Box, stretch)</option>
                        <option value="Custom Brand Printing" className="bg-[#070b13] text-white">Custom Carrying Bags & Branded Carton printing</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <label htmlFor="shop-note" className="block text-[10px] font-mono tracking-widest text-slate-400 font-bold uppercase">📝 Logistics / Order remarks (Optional)</label>
                    <textarea
                      id="shop-note"
                      rows={2}
                      value={dealerForm.message}
                      onChange={(e) => setDealerForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="List any physical size specifications or monthly volume requirements..."
                      className="w-full bg-[#091124] rounded-xl border border-blue-900/30 p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 text-left font-serif"
                    />
                  </div>

                  <div className="pt-2 border-t border-white/5 flex justify-end">
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs tracking-wider uppercase px-8 py-3.5 rounded-2xl shadow-lg transition-all cursor-pointer"
                    >
                      Save Dealer Profile
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-[#091124] p-6 rounded-2xl border border-orange-500/10 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-900/20 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                    <Check size={24} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-stone-100 font-serif text-lg font-bold">B2B Profile Localized Successfully!</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                      Your business profile has been cached. You can now compile this data together with stock items inside your inquiry draft list.
                    </p>
                  </div>

                  <div className="pt-2.5 flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={handleSendDealerWhatsApp}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wider uppercase px-5 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-md"
                    >
                      <MessageSquare size={13} /> Send Profile on WhatsApp
                    </button>
                    <button
                      onClick={() => setFormSubmitted(false)}
                      className="bg-transparent hover:bg-white/5 text-slate-300 font-bold text-xs tracking-wider uppercase px-4 py-2.5 rounded-xl border border-[#94a3b8]/20 cursor-pointer"
                    >
                      Edit details
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW B: PRODUCTS CATALOGUE */}
        {/* ======================================================== */}
        {activeTab === 'catalog' && (
          <div id="catalog-library-view" className="animate-fade-in pt-2">
            <Catalog onLoadPiece={handleLoadStateOnWheel} onAddToCart={handleAddToCart} />
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW E: OFFERS & NOTICES BULLETINS */}
        {/* ======================================================== */}
        {activeTab === 'notices' && (
          <div id="notices-offers-view" className="animate-fade-in pt-2 bg-transparent text-slate-800">
            <NoticesDashboard 
              onAddToCart={handleAddToCart} 
              onOpenCart={() => setShowCartDrawer(true)} 
              triggerFlash={triggerFlash} 
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW C: AI FORGE (Freight logistics strategist compute) */}
        {/* ======================================================== */}
        {activeTab === 'forge' && (
          <div id="ai-forge-view" className="animate-fade-in pt-2">
            <AIPotteryForge onLoadShape={handleLoadStateOnWheel} />
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW D: DESIGN ATELIER (Dynamic custom spec adjustments & logos) */}
        {/* ======================================================== */}
        {activeTab === 'atelier' && (
          <div id="atelier-sculpt-view" className="space-y-6 animate-fade-in pt-2 text-left">
            <div className="border-b border-blue-900/30 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-0.5">
                <span className="font-mono text-[9px] tracking-widest text-orange-500 font-semibold uppercase">DESIGN STUDIO & MARKING STATION</span>
                <h2 className="font-serif text-3xl font-bold text-white tracking-tight">Atelier Configurator</h2>
                <p className="text-xs text-slate-400">Simulate cardboard cubic metrics, eucalyptus rod lengths, or construct beautiful shop vector emblems.</p>
              </div>

              {/* Active Name modification box */}
              <div className="flex items-center gap-3 border border-blue-900/40 rounded-2xl bg-[#121c33] px-4 py-2.5 shrink-0">
                <span className="font-mono text-[9px] text-[#94a3b8] font-bold uppercase">Label Designation:</span>
                <input
                  id="active-sculpt-name"
                  type="text"
                  value={currentTitle}
                  onChange={(e) => setCurrentTitle(e.target.value)}
                  placeholder="e.g. Custom heavy box batch"
                  className="font-serif text-sm font-bold text-orange-400 focus:outline-none bg-transparent placeholder-slate-600 w-[180px] text-left"
                />
              </div>
            </div>

            {/* Core canvas simulator widget */}
            <AtelierCanvas
              currentShape={currentShape}
              onChangeShape={setCurrentShape}
              currentClay={currentClay}
              onChangeClay={setCurrentClay}
              currentGlaze={currentGlaze}
              onChangeGlaze={setCurrentGlaze}
              title={currentTitle}
              onSave={handleSaveCommission}
              onReset={handleResetAtelier}
            />
          </div>
        )}

      </main>

      {/* 3. CORE ACTIVE CART DRAWER CABINET (Draft wholesale estimates stack) */}
      {showCartDrawer && (
        <div id="history-drawer-backing" className="fixed inset-0 z-40 bg-black/75 backdrop-blur-xs flex justify-end animate-fade-in">
          <div 
            id="history-drawer-body"
            className="w-full max-w-md bg-[#121c33] border-l border-blue-900/40 h-full flex flex-col justify-between overflow-hidden shadow-2xl relative"
          >
            {/* Drawer Header */}
            <div className="p-6 bg-[#091124] text-white border-b border-blue-950/40 flex justify-between items-center shrink-0">
              <div className="space-y-1 text-left">
                <h3 className="font-serif text-xl font-bold text-white">Inquiry Scratchpad Drawer</h3>
                <p className="font-mono text-[8.5px] tracking-widest text-orange-400 font-extrabold uppercase flex items-center gap-1">
                  CORE DIRECT ORDER BUNDLE
                </p>
              </div>
              <button
                id="close-history-drawer"
                onClick={() => setShowCartDrawer(false)}
                className="p-1.5 px-3 py-1 bg-black/35 text-[10px] font-bold font-mono tracking-wider text-slate-300 hover:text-white border border-blue-900/40 hover:bg-white/5 rounded-lg cursor-pointer uppercase"
              >
                Close Drawer
              </button>
            </div>

            {/* List scroll */}
            <div id="drawer-briefs-list" className="flex-grow overflow-y-auto p-6 space-y-4">
              
              {/* Optional dealer profile recap */}
              {dealerForm.shopName && (
                <div className="bg-[#091124] p-3.5 rounded-2xl border border-orange-500/10 text-left text-xs text-slate-300">
                  <div className="font-bold text-[9px] font-mono text-orange-500 uppercase">ACTIVE STORE IDENTITY PROFILE</div>
                  <div className="font-bold text-white text-[12px] mt-0.5">{dealerForm.shopName}</div>
                  <div className="text-[10.5px] text-slate-500 mt-0.5">Location: {dealerForm.location} | Ph: {dealerForm.phone}</div>
                </div>
              )}

              {cart.length === 0 ? (
                <div className="text-center py-20 space-y-4">
                  <Warehouse size={40} className="mx-auto text-slate-600 animate-bounce" />
                  <p className="text-sm font-serif italic text-slate-300">Your inquiry drawer is empty.</p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Search our catalog to bundle essential goods, or use the AI Strategist and Atelier canvas to forge customized specifications.
                  </p>
                </div>
              ) : (
                cart.map((item, idx) => {
                  const lineTotal = item.product.wholesalePrice * item.qty;
                  return (
                    <div
                      key={item.product.id}
                      id={`drawer-item-${item.product.id}`}
                      className="group border border-blue-900/20 rounded-2xl p-4 bg-[#091124] text-left relative"
                    >
                      <button
                        id={`delete-brief-${item.product.id}`}
                        onClick={() => handleRemoveFromCart(item.product.id)}
                        className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-red-500 rounded-md transition-colors border border-transparent hover:border-red-500/10 hover:bg-red-500/5 cursor-pointer animate-duration-150"
                        title="Delete specification draft"
                      >
                        <Trash2 size={13} />
                      </button>

                      <div className="space-y-1 pr-6">
                        <span className="font-mono text-[8px] tracking-widest text-[#94a3b8] font-bold uppercase">
                          No. {idx + 1} / {item.product.subCategory}
                        </span>
                        <h4 className="font-serif text-sm font-bold text-white">{item.product.name}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{item.product.tagline}</p>
                      </div>

                      {/* Controls layer */}
                      <div className="flex items-center justify-between mt-3.5 pt-3.5 border-t border-blue-900/30 text-[11px] font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500">Qty:</span>
                          <input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(e) => {
                              const v = parseInt(e.target.value) || 1;
                              const updated = [...cart];
                              updated[idx].qty = v;
                              updateCartState(updated);
                            }}
                            className="w-12 bg-[#121c33] border border-blue-900/40 rounded-md text-center text-white focus:outline-none p-0.5 h-6 font-bold"
                          />
                          <span className="text-slate-500">Bndl</span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-400">₹{lineTotal.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Cart Drawer footer calculations */}
            <div className="p-6 bg-[#091124] border-t border-blue-950/40 shrink-0 text-center space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                  <span>Net Wholesale Subtotal:</span>
                  <span className="text-white font-bold">
                    ₹{cart.reduce((acc, item) => acc + item.product.wholesalePrice * item.qty, 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-400 font-mono pb-1">
                  <span>Est. GST (18% Avg):</span>
                  <span className="text-white font-bold">
                    ₹{Math.round(cart.reduce((acc, item) => acc + item.product.wholesalePrice * item.qty, 0) * 0.18).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm border-t border-blue-950/40 pt-2 font-bold text-white leading-none">
                  <span className="font-serif">Estimated Order Value:</span>
                  <span className="text-orange-400 font-mono text-base">
                    ₹{Math.round(cart.reduce((acc, item) => acc + item.product.wholesalePrice * item.qty, 0) * 1.18).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleClearCart}
                  disabled={cart.length === 0}
                  className="border border-blue-900/30 hover:bg-slate-900 disabled:opacity-45 text-slate-300 font-bold text-xs py-3 rounded-xl transition-colors cursor-pointer uppercase font-mono"
                >
                  Clear Draft
                </button>
                <button
                  id="checkout-comissions"
                  onClick={handleDispatchOrderCart}
                  disabled={cart.length === 0}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-[#121c33] disabled:text-gray-600 text-white font-bold text-xs tracking-wider uppercase py-3 rounded-xl transition-colors duration-200 cursor-pointer block text-center shadow-lg shadow-emerald-700/10 flex items-center justify-center gap-1"
                >
                  <MessageSquare size={14} /> Send WhatsApp Spec
                </button>
              </div>

              <p className="text-[10px] text-slate-500 font-serif leading-relaxed">
                🚀 Submitting drafts pre-fills your WhatsApp order clipboard directly for prompt state logistics booking with Prime Traders Kerala.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* 4. PROFESSIONAL B2B FOOTER */}
      <footer className="bg-[#091124] text-[#94a3b8] border-t-4 border-orange-500 px-4 sm:px-8 py-10">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 text-left text-xs">
          
          <div className="md:col-span-4 space-y-3.5">
            <h4 className="font-sans text-[13px] font-extrabold tracking-[0.24em] text-white uppercase flex items-center gap-1.5">
              <PrimeLogo size={20} showText={false} houseColor="#ffffff" maskColor="#091124" /> PRIME TRADERS
            </h4>
            <p className="text-[#94a3b8] leading-relaxed font-sans">
              A trusted wholesale partner for every home. Quality Products. Wholesale Prices. We supply bulk carry bags, packing rolls, double fluted cartons, and hotel squeegee cleaning systems directly to retailers across Kerala.
            </p>
          </div>

          <div className="md:col-span-4 space-y-3.5">
            <h4 className="font-mono text-[9px] tracking-widest text-[#94a3b8]/60 uppercase font-bold">STATE CARRIER LOGISTICS SECTORS</h4>
            <ul className="space-y-1.5 text-white/80 font-medium">
              <li className="flex items-center gap-1.5">
                <Truck size={11} className="text-orange-500" /> Central Hub: Chalai Bazaar, Thiruvananthapuram (Opening Soon!)
              </li>
              <li className="flex items-center gap-1.5">
                <Truck size={11} className="text-orange-500" /> Kollam Sector Main Yard
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3.5">
            <h4 className="font-mono text-[9px] tracking-widest text-[#94a3b8]/60 uppercase font-bold">CONTAINER CLOUD ENVIRONMENT</h4>
            <div className="bg-[#070b13] border border-blue-900/30 rounded-xl p-3 text-slate-400 space-y-1.5 font-mono text-[10px] break-all">
              <span className="block italic text-slate-500">Active sandboxed B2B wholesale console environment</span>
              <span className="block">Host Proxy: https://ai.studio/build</span>
              <span className="block flex items-center gap-1 text-[#3b82f6]"><User size={10} /> Operator contact: shafeekshafazal7@gmail.com</span>
            </div>
          </div>

        </div>

        <div className="w-full max-w-7xl mx-auto mt-8 pt-6 border-t border-blue-950/40 flex flex-col md:flex-row justify-between items-center gap-4 text-[10.5px] text-white/40 font-mono">
          <span>&copy; 2026 Prime Traders Kerala Wholesale. All rights reserved.</span>
          <div className="flex gap-4">
            <span className="hover:text-white transition-colors cursor-pointer">MALAYALAM SUPPORT</span>
            <span className="hover:text-white transition-colors cursor-pointer">B2B GSTIN POLICY</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
