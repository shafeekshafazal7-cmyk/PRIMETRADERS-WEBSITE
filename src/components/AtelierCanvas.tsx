/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ClayBody, GlazeType, CeramicShape, CeramicPiece, LogoSpecification } from '../types';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Layers, 
  Sparkles, 
  Scale, 
  Info, 
  ShoppingCart, 
  Copy, 
  Check, 
  Download, 
  Eye, 
  Home, 
  Lamp, 
  Coffee, 
  Sliders, 
  Palette, 
  Hammer, 
  FileJson,
  Scissors
} from 'lucide-react';

interface AtelierCanvasProps {
  currentShape: CeramicShape;
  onChangeShape: (shape: CeramicShape) => void;
  currentClay: ClayBody;
  onChangeClay: (clay: ClayBody) => void;
  currentGlaze: GlazeType;
  onChangeGlaze: (glaze: GlazeType) => void;
  title: string;
  onSave: (piece: Partial<CeramicPiece>) => void;
  onReset: () => void;
}

export const AtelierCanvas: React.FC<AtelierCanvasProps> = ({
  currentShape,
  onChangeShape,
  currentClay,
  onChangeClay,
  currentGlaze,
  onChangeGlaze,
  title,
  onSave,
  onReset,
}) => {
  // Core Atelier Mode toggle: 'logo_designer' (I want to make a logo) vs 'article_designer' (custom objects)
  const [atelierMode, setAtelierMode] = useState<'logo_designer' | 'article_designer'>('logo_designer');
  
  // Custom states for Dynamic Logo Creator / Configurator
  const [logoConfig, setLogoConfig] = useState<LogoSpecification>({
    iconType: 'chair',
    frameStyle: 'circle',
    colorTheme: 'azure',
    brandName: 'PRIME TRADERS',
    tagline: 'A TRUSTED WHOLESALE PARTNER FOR EVERY HOME',
    iconSize: 80,
    strokeWidth: 3.0,
    fontSize: 13,
  });

  const [copiedLogo, setCopiedLogo] = useState(false);
  const [logoShowGrid, setLogoShowGrid] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showWireframe, setShowWireframe] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'material'>('form');

  // Household Articles custom template selector for the Article designer
  const [selectedArticle, setSelectedArticle] = useState<'lamp' | 'chair' | 'carafe' | 'organizer'>('lamp');

  // --- LOGO SPECIFICATION PRESETS & GRADIENTS ---
  const activeThemeDetails = useMemo(() => {
    switch (logoConfig.colorTheme) {
      case 'azure':
        return {
          textColor: '#3b82f6',
          strokeColor: '#60a5fa',
          accentColor: '#1d4ed8',
          bgGradient: 'from-[#0b1329] via-[#0e172e] to-[#0a0a0c]',
          glowFilter: 'rgba(59, 130, 246, 0.45)',
          description: 'Cobalt Azure & Titanium Silver'
        };
      case 'bronze':
        return {
          textColor: '#f59e0b',
          strokeColor: '#fbbf24',
          accentColor: '#b45309',
          bgGradient: 'from-[#241a10] via-[#1b120a] to-[#0a0a0c]',
          glowFilter: 'rgba(245, 158, 11, 0.45)',
          description: 'Honed Copper & Golden Bronze'
        };
      case 'laurel':
        return {
          textColor: '#10b981',
          strokeColor: '#34d399',
          accentColor: '#047857',
          bgGradient: 'from-[#091f16] via-[#071711] to-[#0a0a0c]',
          glowFilter: 'rgba(16, 185, 129, 0.45)',
          description: 'Biophilic Sage & Moss Laurel'
        };
      case 'charcoal':
        return {
          textColor: '#ffffff',
          strokeColor: '#e2e8f0',
          accentColor: '#475569',
          bgGradient: 'from-[#111113] via-[#161619] to-[#0a0a0c]',
          glowFilter: 'rgba(255, 255, 255, 0.35)',
          description: 'Monochrome Slate & Dark Obsidian'
        };
      case 'brick':
        return {
          textColor: '#ef4444',
          strokeColor: '#f87171',
          accentColor: '#991b1b',
          bgGradient: 'from-[#240f0f] via-[#190a0a] to-[#0a0a0c]',
          glowFilter: 'rgba(239, 68, 68, 0.45)',
          description: 'Terracotta Crimson & Brick Clay'
        };
    }
  }, [logoConfig.colorTheme]);

  // Handle Logo Text updates
  const handleLogoValue = (key: keyof LogoSpecification, val: any) => {
    setLogoConfig(prev => ({ ...prev, [key]: val }));
  };

  // Copy customized SVG logo markup to clipboard
  const handleCopyLogoMarkup = () => {
    const rawSvgElement = document.getElementById('rendered-logo-svg');
    if (rawSvgElement) {
      navigator.clipboard.writeText(rawSvgElement.outerHTML);
      setCopiedLogo(true);
      setTimeout(() => setCopiedLogo(false), 3000);
    }
  };

  // Material translations for Household Articles
  const clayDetails = useMemo(() => {
    switch (currentClay) {
      case ClayBody.TERRACOTTA:
        return {
          name: 'Multi-Wall Kraft Cardboard',
          desc: 'High-burst Kraft cardboard crafted from unbleached natural pine wood pulp. Extremely robust, 100% biodegradable, with structural moisture resistance.',
          stops: [
            { offset: '0%', color: '#6A4A23' },
            { offset: '30%', color: '#976C3E' },
            { offset: '65%', color: '#C29B6D' },
            { offset: '85%', color: '#DEC097' },
            { offset: '100%', color: '#523412' },
          ],
        };
      case ClayBody.STONEWARE_GREY:
        return {
          name: 'Virgin High-Density Polyethylene',
          desc: 'Puncture-proof structural HDPE polymer designed for extreme environments. Fully chemical-resistant, dense, and lightweight.',
          stops: [
            { offset: '0%', color: '#2C3440' },
            { offset: '25%', color: '#4E5B70' },
            { offset: '60%', color: '#7E8FAD' },
            { offset: '85%', color: '#B5C4E0' },
            { offset: '100%', color: '#1B2129' },
          ],
        };
      case ClayBody.SANDSTONE_BUFF:
        return {
          name: 'Steamed Eucalyptus Rod Wood',
          desc: 'Sealed blonde Eucalyptus timber milled into highly tactile rods and mop shafts, cured for splinter prevention and high tension limits.',
          stops: [
            { offset: '0%', color: '#5B4F3D' },
            { offset: '30%', color: '#9A866A' },
            { offset: '65%', color: '#C8B9A0' },
            { offset: '85%', color: '#EBE0CC' },
            { offset: '100%', color: '#433A2D' },
          ],
        };
      case ClayBody.PORCELAIN_WHITE:
        return {
          name: 'Brushed Marine Stainless Steel',
          desc: 'Vitreous food-grade 304 stainless steel, resistant to rust, humidity, acidic cleaning products, and high heat cycles.',
          stops: [
            { offset: '0%', color: '#71757A' },
            { offset: '25%', color: '#A8ACAF' },
            { offset: '65%', color: '#E6E8EA' },
            { offset: '85%', color: '#FFFFFF' },
            { offset: '100%', color: '#5C5F62' },
          ],
        };
      case ClayBody.OBSIDIAN_BLACK:
        return {
          name: 'Triple-Layer Elastic Bubble Polymer',
          desc: 'Premium air-locked linear low-density polyethylene sheet composite designed to absorbs severe drops and transit shocks.',
          stops: [
            { offset: '0%', color: '#0F1216' },
            { offset: '30%', color: '#272F3B' },
            { offset: '65%', color: '#435063' },
            { offset: '85%', color: '#687B99' },
            { offset: '100%', color: '#090B0E' },
          ],
        };
    }
  }, [currentClay]);

  const glazeDetails = useMemo(() => {
    switch (currentGlaze) {
      case GlazeType.CRACKLE_CELADON:
        return {
          name: 'Heat-Sealed Shrink wrap Layer',
          color: '#8395A7',
          sheen: 'frosted airtight vacuum',
          desc: 'High-tensile shrink wrap film barrier. Seals inventory items against ocean humidity, rain splash, and superficial scratches.',
          opacity: 0.5,
          overlayGradient: ['#E6F0FA', '#718093', '#2F3640'],
        };
      case GlazeType.TENMOKU_RUST:
        return {
          name: 'Aggrressive Hot-Melt Adhesive',
          color: '#3B2A1E',
          sheen: 'high-bond adhesive resin seal',
          desc: 'Aggregate high shear rubber coating gum. Remains firmly bonded on Kraft paperbox plies even under moist coast conditions.',
          opacity: 0.8,
          overlayGradient: ['#302015', '#1B110B', '#080503'],
        };
      case GlazeType.COBALT_LUSTRE:
        return {
          name: 'High-Gloss Water-Proof Laminate',
          color: '#1E272C',
          sheen: 'glossy hydrophobic laminate',
          desc: 'Liquid plastic compound laminated onto cardboard surfaces to safeguard custom branding inks and retain solid strength.',
          opacity: 0.6,
          overlayGradient: ['#4A90E2', '#1B2C3E', '#0B1119'],
        };
      case GlazeType.MATTE_OCHRE:
        return {
          name: 'Custom Golden Branding Foil',
          color: '#D4AF37',
          sheen: 'embossed metallic gold hotstamp',
          desc: 'Highly reflective pure gold branding stamp foil applied on top of cardboard carry bags, bins, or crates for luxury hotels.',
          opacity: 0.45,
          overlayGradient: ['#FCE8A6', '#C5A028', '#5E4909'],
        };
      case GlazeType.PURE_ALABASTER:
        return {
          name: 'Smooth Alabaster Recycled Liner',
          color: '#F5F5F0',
          sheen: 'creamy smooth paper liner',
          desc: 'Finely-milled waste pulp carrier liner paper providing absolute flat surface and anti-scratch nesting within packages.',
          opacity: 0.35,
          overlayGradient: ['#FFFFFF', '#EADCC9', '#9C8E7C'],
        };
      case GlazeType.VOLCANIC_ASH_MATTE:
        return {
          name: 'Anti-Slip Basalt Grit Texturing',
          color: '#2C3E50',
          sheen: 'heavy tactile structural friction',
          desc: 'Micro-beaded sand compound mixed onto polymer handles to guarantee maximum grip stability even when mops or bins are wet.',
          opacity: 0.7,
          overlayGradient: ['#7F8C8D', '#2C3E50', '#1A252F'],
        };
      case GlazeType.UNGLAZED_NATURAL:
        return {
          name: 'Raw Premium Unbleached Matte',
          color: 'transparent',
          sheen: 'natural organic mill spec',
          desc: 'Completely raw finish preserving the natural structural fiber layout, eco integrity, and pure biodegradation limits of raw stock.',
          opacity: 0,
          overlayGradient: [],
        };
    }
  }, [currentGlaze]);

  // Estimates for physical articles
  const estimates = useMemo(() => {
    const scale = currentShape.totalHeightCm;
    const volLiters = Math.round((currentShape.bellyWidth * 4.2 * (currentShape.shoulderWidth * 1.8) * (scale / 30)) * 10) / 10;
    const clayWeightKg = Math.round((volLiters * 1.5 + scale * 0.05) * 10) / 10;
    const manufacturingHours = Math.round(12 + (scale * 0.15) + (currentClay === ClayBody.PORCELAIN_WHITE ? 8 : 0));
    
    let complexity: 'Standard Class' | 'Heavy Duty Grade' | 'Extreme Industrial Grade' = 'Standard Class';
    const complexityScore = 
      Math.abs(currentShape.neckWidth - currentShape.bellyWidth) + 
      Math.abs(currentShape.shoulderWidth - currentShape.baseWidth) + 
      (scale > 60 ? 0.9 : 0.3);

    if (complexityScore > 1.9) complexity = 'Extreme Industrial Grade';
    else if (complexityScore > 1.1) complexity = 'Heavy Duty Grade';

    let cost = Math.round(95 + complexityScore * 130 + (scale * 3));
    if (currentClay === ClayBody.PORCELAIN_WHITE) cost += 120;
    if (currentGlaze === GlazeType.COBALT_LUSTRE) cost += 60;

    return {
      volumeLiters: volLiters,
      weightKg: clayWeightKg,
      kilnHours: manufacturingHours,
      complexity,
      quotedCost: cost,
    };
  }, [currentShape, currentClay, currentGlaze]);

  const handleSliderChange = (key: keyof CeramicShape, val: number) => {
    onChangeShape({
      ...currentShape,
      [key]: val,
    });
  };

  return (
    <div id="atelier-canvas-root" className="space-y-8">
      {/* 1. TOP STUDIO MODE SWITCHER */}
      <div className="flex flex-col sm:flex-row justify-center items-center bg-[#16161a] border border-white/10 p-2 rounded-2xl max-w-lg mx-auto gap-1">
        <button
          id="mode-set-logo"
          onClick={() => setAtelierMode('logo_designer')}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
            atelierMode === 'logo_designer'
              ? 'bg-[#3b82f6] text-white shadow-md'
              : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
          }`}
        >
          <Scissors size={14} /> Logo Configurator
        </button>
        <button
          id="mode-set-articles"
          onClick={() => setAtelierMode('article_designer')}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
            atelierMode === 'article_designer'
              ? 'bg-[#3b82f6] text-white shadow-md'
              : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
          }`}
        >
          <Home size={14} /> Household Designer
        </button>
      </div>

      {/* ======================================================== */}
      {/* ATELIER MODE 1: INTERACTIVE BRAND LOGO CUSTOMIZER */}
      {/* ======================================================== */}
      {atelierMode === 'logo_designer' && (
        <div id="logo-designer-sandbox" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
          
          {/* Visual Canvas Block (Left Column) */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className={`relative w-full aspect-[1/1] bg-gradient-to-br ${activeThemeDetails.bgGradient} rounded-3xl border border-white/10 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.8)] overflow-hidden flex flex-col justify-between transition-all duration-500`}>
              
              {/* Grid overlay */}
              {logoShowGrid && (
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
              )}

              {/* Header Status lines */}
              <div className="flex items-center justify-between w-full relative z-10 select-none">
                <span className="font-mono text-[9px] tracking-widest text-[#94a3b8] flex items-center gap-1 bg-[#0a0a0c]/80 px-2.5 py-1 rounded-md border border-white/5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                  VECTOR LAYER GENERATED
                </span>
                <button
                  onClick={() => setLogoShowGrid(!logoShowGrid)}
                  title="Toggle Grid Alignment Overlays"
                  className={`p-1.5 rounded-md text-[10px] font-mono tracking-wider transition-all border cursor-pointer ${
                    logoShowGrid 
                      ? 'bg-[#3b82f6]/20 border-[#3b82f6]/40 text-blue-300' 
                      : 'bg-black/40 border-white/5 text-slate-500'
                  }`}
                >
                  GRID: {logoShowGrid ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Core Rendered Logo Body */}
              <div className="w-full flex justify-center items-center relative my-auto h-[260px] z-10 select-none">
                <svg
                  id="rendered-logo-svg"
                  viewBox="0 0 200 200"
                  className="w-[200px] h-[200px] transition-transform duration-300"
                  style={{
                    filter: `drop-shadow(0 4px 15px ${activeThemeDetails.glowFilter})`
                  }}
                >
                  {/* Circular Frame Option */}
                  {logoConfig.frameStyle === 'circle' && (
                    <circle
                      cx="100"
                      cy="92"
                      r="65"
                      stroke={activeThemeDetails.strokeColor}
                      strokeWidth={logoConfig.strokeWidth}
                      strokeLinecap="round"
                    />
                  )}

                  {/* Squircle Rim Frame */}
                  {logoConfig.frameStyle === 'squircle' && (
                    <rect
                      x="38"
                      y="30"
                      width="124"
                      height="124"
                      rx="32"
                      stroke={activeThemeDetails.strokeColor}
                      strokeWidth={logoConfig.strokeWidth}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Hexagon Rim Frame */}
                  {logoConfig.frameStyle === 'hexagon' && (
                    <polygon
                      points="100,26 156,58 156,122 100,154 44,122 44,58"
                      stroke={activeThemeDetails.strokeColor}
                      strokeWidth={logoConfig.strokeWidth}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Dynamic Inner Icon Symbols */}
                  {logoConfig.iconType === 'chair' && (
                    <g stroke={activeThemeDetails.strokeColor} strokeWidth={logoConfig.strokeWidth + 0.3} strokeLinecap="round" strokeLinejoin="round" className="opacity-90">
                      {/* Sculpted arm chair */}
                      <path d="M 72 110 L 82 110 C 85 99, 89 95, 102 95 L 115 95 C 122 95, 125 90, 125 83 M 82 110 L 78 122 L 78 124 M 102 95 L 102 124 M 115 95 L 121 124" />
                      <line x1="50" y1="130" x2="150" y2="130" strokeWidth={logoConfig.strokeWidth - 0.5} />
                    </g>
                  )}

                  {logoConfig.iconType === 'lamp' && (
                    <g stroke={activeThemeDetails.strokeColor} strokeWidth={logoConfig.strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="opacity-90">
                      {/* Modern designer light */}
                      <path d="M 125 125 L 125 95 C 125 80, 112 68, 96 68 L 92 68" />
                      <path d="M 84 65 C 84 60, 100 60, 100 65 Z" fill={activeThemeDetails.strokeColor} />
                      <line x1="55" y1="125" x2="145" y2="125" strokeWidth={logoConfig.strokeWidth - 0.5} />
                    </g>
                  )}

                  {logoConfig.iconType === 'house' && (
                    <g stroke={activeThemeDetails.strokeColor} strokeWidth={logoConfig.strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="opacity-90">
                      {/* Minimal line-art cottage and nested accent */}
                      <path d="M 65 122 L 65 92 L 100 58 L 135 92 L 135 122 Z" />
                      <circle cx="100" cy="95" r="10" strokeWidth={logoConfig.strokeWidth - 0.5} />
                    </g>
                  )}

                  {logoConfig.iconType === 'carafe' && (
                    <g stroke={activeThemeDetails.strokeColor} strokeWidth={logoConfig.strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="opacity-90">
                      {/* Borosilicate brewer */}
                      <path d="M 85 64 L 115 64 M 85 64 C 85 64, 88 80, 95 85 C 90 95, 75 110, 75 122 C 75 122, 85 130, 100 130 C 115 130, 125 122, 125 122 C 125 110, 110 95, 105 85 C 112 80, 115 64, 115 64" />
                      <circle cx="100" cy="115" r="5" fill={activeThemeDetails.strokeColor} />
                    </g>
                  )}

                  {logoConfig.iconType === 'utensils' && (
                    <g stroke={activeThemeDetails.strokeColor} strokeWidth={logoConfig.strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="opacity-90">
                      {/* Gourmet crossover */}
                      <path d="M 75 60 C 75 80, 95 85, 95 105 L 95 130" /> {/* Spoon */}
                      <path d="M 70 60 L 80 60" />
                      <path d="M 125 60 C 125 80, 105 85, 105 105 L 105 130" /> {/* Fork */}
                      <line x1="120" y1="60" x2="120" y2="78" />
                      <line x1="110" y1="60" x2="110" y2="78" />
                    </g>
                  )}

                  {/* Accents outside the logo body */}
                  <circle cx="100" cy="144" r="3" fill={activeThemeDetails.strokeColor} />
                </svg>
              </div>

              {/* Dynamic Footer Wordmarks inside visual Mat */}
              <div className="text-center z-10 space-y-1 select-none">
                <span className="block font-serif text-[18px] tracking-[0.24em] text-white select-all font-semibold uppercase leading-none">
                  {logoConfig.brandName || 'PRIME AGENCY'}
                </span>
                <span className="block font-sans text-[8.5px] tracking-[0.18em] text-[#94a3b8] font-bold uppercase">
                  {logoConfig.tagline || 'HOUSEHOLD ARTICLES'}
                </span>
              </div>
            </div>

            {/* Quick Export Panel underneath Logo Map */}
            <div className="w-full mt-4 flex gap-3">
              <button
                id="btn-copy-svg-logo"
                onClick={handleCopyLogoMarkup}
                className="flex-1 bg-[#16161a] hover:bg-white/5 text-[#94a3b8] hover:text-white py-3 px-4 rounded-xl border border-white/10 text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                {copiedLogo ? (
                  <>
                    <Check size={14} className="text-emerald-500" /> COPIED VECTOR SVG!
                  </>
                ) : (
                  <>
                    <Copy size={14} /> Copy raw SVG
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Configuration Sliders & Selectors (Right Column) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-[#16161a] border border-white/10 rounded-3xl p-6 shadow-xs space-y-6 text-left">
              
              <div className="border-b border-white/5 pb-3">
                <h3 className="font-serif text-xl font-normal text-white flex items-center gap-1.5">
                  <Scissors size={18} className="text-[#3b82f6]" /> Logo Generator Studio
                </h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  Design bespoke, modern vector marks tailored specifically for Prime Traders household articles and packing materials.
                </p>
              </div>

              {/* 1. Brand Text Inputs */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="logo-brand-name-input" className="block text-[10px] font-mono tracking-widest text-[#94a3b8] font-bold uppercase">Brand/Agency Name</label>
                    <input
                      id="logo-brand-name-input"
                      type="text"
                      value={logoConfig.brandName}
                      onChange={(e) => handleLogoValue('brandName', e.target.value.toUpperCase())}
                      className="w-full bg-[#0a0a0c] rounded-xl border border-white/10 p-3 text-xs text-white uppercase tracking-wider focus:outline-none focus:border-[#3b82f6]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="logo-tagline-input" className="block text-[10px] font-mono tracking-widest text-[#94a3b8] font-bold uppercase">Corporate Tagline</label>
                    <input
                      id="logo-tagline-input"
                      type="text"
                      value={logoConfig.tagline}
                      onChange={(e) => handleLogoValue('tagline', e.target.value.toUpperCase())}
                      className="w-full bg-[#0a0a0c] rounded-xl border border-white/10 p-3 text-xs text-white uppercase tracking-wider focus:outline-none focus:border-[#3b82f6]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Choose Core Symbol */}
              <div className="space-y-2.5">
                <span className="block text-[10px] font-mono tracking-widest text-[#94a3b8] font-bold uppercase">1. Select Core Emblem Icon</span>
                <div className="grid grid-cols-5 gap-2.5">
                  {[
                    { id: 'chair', label: 'Furniture', icon: <Sliders size={14} /> },
                    { id: 'lamp', label: 'Lighting', icon: <Lamp size={14} /> },
                    { id: 'house', label: 'Domestic', icon: <Home size={14} /> },
                    { id: 'carafe', label: 'Carafes', icon: <Coffee size={14} /> },
                    { id: 'utensils', label: 'Tableware', icon: <Sliders size={14} /> },
                  ].map((sym) => (
                    <button
                      key={sym.id}
                      id={`logo-symbol-${sym.id}`}
                      onClick={() => handleLogoValue('iconType', sym.id)}
                      className={`p-3 rounded-xl border text-[10px] font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        logoConfig.iconType === sym.id
                          ? 'border-[#3b82f6] bg-[#3b82f6]/10 text-[#3b82f6]'
                          : 'border-white/5 bg-[#0a0a0c]/40 text-slate-400 hover:border-[#3b82f6]/30 hover:text-white'
                      }`}
                    >
                      {sym.icon}
                      <span className="text-[8.5px] tracking-wide truncate w-full text-center">{sym.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Boundaries Frames */}
              <div className="space-y-2.5">
                <span className="block text-[10px] font-mono tracking-widest text-[#94a3b8] font-bold uppercase">2. Select Frame Border</span>
                <div className="grid grid-cols-4 gap-2.5">
                  {[
                    { id: 'circle', label: 'Fine Circle' },
                    { id: 'squircle', label: 'Squircle' },
                    { id: 'hexagon', label: 'Hexagon' },
                    { id: 'none', label: 'None' },
                  ].map((frm) => (
                    <button
                      key={frm.id}
                      id={`logo-frame-${frm.id}`}
                      onClick={() => handleLogoValue('frameStyle', frm.id)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center truncate ${
                        logoConfig.frameStyle === frm.id
                          ? 'border-[#3b82f6] bg-[#3b82f6]/10 text-[#3b82f6]'
                          : 'border-white/5 bg-[#0a0a0c]/40 text-slate-400 hover:border-[#3b82f6]/30 hover:text-white'
                      }`}
                    >
                      {frm.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Color Schemes */}
              <div className="space-y-2.5">
                <span className="block text-[10px] font-mono tracking-widest text-[#94a3b8] font-bold uppercase">3. Choose Accent Tone theme</span>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { id: 'azure', color: '#3b82f6', label: 'Cobalt Azure' },
                    { id: 'bronze', color: '#f59e0b', label: 'Copper Bronze' },
                    { id: 'laurel', color: '#10b981', label: 'Sage Moss' },
                    { id: 'charcoal', color: '#ffffff', label: 'Obsidian Mono' },
                    { id: 'brick', color: '#ef4444', label: 'Crimson Clay' },
                  ].map((thm) => (
                    <button
                      key={thm.id}
                      id={`logo-theme-${thm.id}`}
                      onClick={() => handleLogoValue('colorTheme', thm.id)}
                      className={`p-1.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-[8.5px] font-semibold cursor-pointer ${
                        logoConfig.colorTheme === thm.id
                          ? 'border-[#3b82f6] bg-[#3b82f6]/10 text-[#3b82f6]'
                          : 'border-white/5 bg-[#0a0a0c]/45 text-slate-400 hover:border-[#3b82f6]/30 hover:text-white'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full shadow-inner block" style={{ backgroundColor: thm.color }} />
                      <span className="truncate w-full text-center">{thm.label.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
                <p className="bg-[#0a0a0c] px-3 py-2 rounded-xl border border-white/5 text-[11px] leading-relaxed text-[#94a3b8] italic">
                  Theme active: <strong className="text-white font-medium">{activeThemeDetails.description}</strong>. Highly complementary with domestic layouts.
                </p>
              </div>

              {/* 5. Geometrical stroke sliders */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <span className="block text-[10px] font-mono tracking-widest text-[#94a3b8] font-bold uppercase">4. Coordinate adjustments</span>
                
                {/* Stroke width */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-400">Stroke Thickness</span>
                    <span className="font-mono text-[#3b82f6] font-semibold">{logoConfig.strokeWidth.toFixed(1)} px</span>
                  </div>
                  <input
                    id="logo-slider-stroke"
                    type="range"
                    min="1.5"
                    max="5.0"
                    step="0.5"
                    value={logoConfig.strokeWidth}
                    onChange={(e) => handleLogoValue('strokeWidth', parseFloat(e.target.value))}
                    className="w-full h-1 bg-[#0a0a0c] rounded-lg cursor-pointer accent-[#3b82f6]"
                  />
                </div>
              </div>

            </div>

            {/* Save Brand Config card */}
            <div className="bg-gradient-to-br from-[#16161a] to-[#0a0a0c] rounded-3xl p-6 border border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="space-y-0.5 text-left">
                <span className="text-[9px] font-mono tracking-wide text-[#3b82f6] font-bold uppercase">CORP IDENTITY PACKAGE READY</span>
                <h4 className="font-serif text-base text-white">Save Identity Asset</h4>
                <p className="text-xs text-[#94a3b8]">Register this custom brand logo specification into your active brief portfolio.</p>
              </div>
              <button
                onClick={() => {
                  onSave({
                    title: `Logo: ${logoConfig.brandName}`,
                    description: `Custom branded logo identity. Symbol: ${logoConfig.iconType.toUpperCase()} within a ${logoConfig.frameStyle.toUpperCase()} border under ${activeThemeDetails.description} layout parameters.`,
                    estimatedPrice: 150,
                    shape: {
                      neckWidth: logoConfig.strokeWidth / 5,
                      neckLength: 0.15,
                      shoulderWidth: logoConfig.iconSize / 100,
                      shoulderHeight: 0.5,
                      bellyWidth: 0.5,
                      bellyHeight: 0.3,
                      baseWidth: 0.4,
                      totalHeightCm: 25,
                    },
                    clay: ClayBody.TERRACOTTA,
                    glaze: GlazeType.UNGLAZED_NATURAL,
                  });
                }}
                className="w-full sm:w-auto bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold text-xs tracking-wider uppercase px-5 py-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Sparkles size={13} /> Save Logo Brief
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* ATELIER MODE 2: INTERACTIVE HOUSEHOLD ARTICLE DESIGNER */}
      {/* ======================================================== */}
      {atelierMode === 'article_designer' && (
        <div id="article-designer-sandbox" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
          
          {/* Visual Product Canvas Column */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="relative w-full aspect-[4/5] bg-[#16161a] rounded-3xl border border-white/10 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.6)] overflow-hidden flex flex-col justify-between">
              
              {/* Product Design Metrics Header */}
              <div className="flex items-center justify-between w-full relative z-10 select-none">
                <span className="font-mono text-xs tracking-wider text-[#94a3b8] flex items-center gap-1.5 bg-[#0a0a0c]/80 px-2.5 py-1 rounded-full border border-white/10">
                  <span className={`w-2 h-2 rounded-full ${isSpinning ? 'bg-[#3b82f6] animate-ping' : 'bg-blue-400'}`} />
                  {isSpinning ? '360° SPIN PREVIEW' : 'STABLE AXIS SPEC'}
                </span>
                <div className="flex gap-2">
                  <button
                    id="toggle-wireframe"
                    title="Toggle Wireframe Blueprint"
                    onClick={() => setShowWireframe(!showWireframe)}
                    className={`p-2 rounded-lg border transition-all duration-200 cursor-pointer ${
                      showWireframe 
                        ? 'bg-[#3b82f6] border-[#3b82f6] text-white' 
                        : 'bg-[#0a0a0c]/80 border-white/10 text-[#94a3b8] hover:bg-white/5'
                    }`}
                  >
                    <Layers size={14} />
                  </button>
                </div>
              </div>

              {/* Dynamically Styled SVG Drawing of Selected Product */}
              <div className="w-full flex justify-center items-center relative my-auto h-[320px]">
                {/* Ground casting shadows */}
                <div className="absolute bottom-[2px] w-[180px] h-[8px] bg-black/40 rounded-full blur-md" />

                <svg
                  id="svg-product-sculptor"
                  viewBox="0 0 340 400"
                  width="100%"
                  height="100%"
                  className={`max-w-[2700px] relative z-10 select-none transition-transform duration-300 ${
                    isSpinning ? 'animate-wheel-spin duration-[12s]' : ''
                  }`}
                  style={{
                    filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.5))',
                  }}
                >
                  <defs>
                    <linearGradient id="article-texture" x1="0%" y1="0%" x2="100%" y2="0%">
                      {clayDetails.stops.map((st, i) => (
                        <stop key={i} offset={st.offset} stopColor={st.color} />
                      ))}
                    </linearGradient>

                    {glazeDetails.overlayGradient.length > 0 && (
                      <linearGradient id="finish-coating" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={glazeDetails.overlayGradient[0]} stopOpacity={glazeDetails.opacity * 0.75} />
                        <stop offset="45%" stopColor={glazeDetails.overlayGradient[1]} stopOpacity={glazeDetails.opacity * 0.4} />
                        <stop offset="85%" stopColor={glazeDetails.overlayGradient[1]} stopOpacity={glazeDetails.opacity * 0.15} />
                        <stop offset="100%" stopColor={glazeDetails.overlayGradient[2]} stopOpacity={glazeDetails.opacity * 0.8} />
                      </linearGradient>
                    )}
                  </defs>

                  {/* RENDER CHAIRblueprints */}
                  {selectedArticle === 'chair' && (
                    <g className="transition-all duration-300">
                      {!showWireframe ? (
                        <>
                          {/* Sled steel base footing */}
                          <path
                            d={`M 100 290 L ${170 - currentShape.baseWidth * 90} 340 L ${170 + currentShape.baseWidth * 90} 340 L 240 290 Z`}
                            stroke="url(#article-texture)"
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                          />
                          {/* Padded seat cushion */}
                          <rect
                            x={170 - currentShape.shoulderWidth * 90}
                            y={270 - currentShape.shoulderHeight * 30}
                            width={currentShape.shoulderWidth * 180}
                            height={currentShape.neckWidth * 75}
                            rx="12"
                            fill="url(#article-texture)"
                          />
                          {/* Supporting backrest cushion */}
                          <path
                            d={`M ${170 - currentShape.shoulderWidth * 80} 130 
                               C ${170 - currentShape.shoulderWidth * 80} 130, ${170 - currentShape.shoulderWidth * 85} ${180 - currentShape.neckLength * 40}, ${170 - currentShape.shoulderWidth * 90} ${270 - currentShape.shoulderHeight * 30}
                               L ${170 + currentShape.shoulderWidth * 90} ${270 - currentShape.shoulderHeight * 30}
                               C ${170 + currentShape.shoulderWidth * 85} ${180 - currentShape.neckLength * 40}, ${170 + currentShape.shoulderWidth * 80} 130, ${170 + currentShape.shoulderWidth * 80} 130 Z`}
                            fill="url(#article-texture)"
                          />
                          
                          {/* Glaze coating overlays */}
                          {glazeDetails.overlayGradient.length > 0 && (
                            <>
                              <rect
                                x={170 - currentShape.shoulderWidth * 90}
                                y={270 - currentShape.shoulderHeight * 30}
                                width={currentShape.shoulderWidth * 180}
                                height={currentShape.neckWidth * 75}
                                rx="12"
                                fill="url(#finish-coating)"
                                className="mix-blend-color-dodge opacity-80"
                              />
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          {/* Wireframe blueprints */}
                          <rect
                            x={170 - currentShape.shoulderWidth * 90}
                            y={270 - currentShape.shoulderHeight * 30}
                            width={currentShape.shoulderWidth * 180}
                            height={currentShape.neckWidth * 75}
                            rx="12"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2"
                            strokeDasharray="4 2"
                          />
                          <ellipse cx="170" cy="340" rx={currentShape.baseWidth * 90} ry="10" fill="none" stroke="#fff" strokeWidth="1" />
                          <line x1="170" y1="100" x2="170" y2="350" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="5 5" />
                        </>
                      )}
                    </g>
                  )}

                  {/* RENDER LAMP */}
                  {selectedArticle === 'lamp' && (
                    <g className="transition-all duration-300">
                      {!showWireframe ? (
                        <>
                          {/* Heavy ground base stem */}
                          <path
                            d={`M ${170 - currentShape.baseWidth * 60} 350 L ${170 + currentShape.baseWidth * 60} 350`}
                            stroke="url(#article-texture)"
                            strokeWidth="14"
                            strokeLinecap="round"
                          />
                          <path
                            d={`M 170 350 L 170 ${100 + currentShape.neckLength * 280}`}
                            stroke="url(#article-texture)"
                            strokeWidth="10"
                            strokeLinecap="round"
                          />
                          {/* Sleek cone shade lamp fitting */}
                          <path
                            d={`M ${170 - currentShape.neckWidth * 105} ${140 + currentShape.neckLength * 120}
                               L ${170 + currentShape.neckWidth * 105} ${140 + currentShape.neckLength * 120}
                               L ${170 + currentShape.shoulderWidth * 25} ${90 + currentShape.neckLength * 50}
                               L ${170 - currentShape.shoulderWidth * 25} ${90 + currentShape.neckLength * 50} Z`}
                            fill="url(#article-texture)"
                          />
                          {/* Golden glowing rays of light */}
                          <polygon
                            points={`${170 - currentShape.neckWidth * 120},360 170,140 ${170 + currentShape.neckWidth * 120},360`}
                            fill="url(#finish-coating)"
                            className="opacity-35 mix-blend-screen"
                          />
                        </>
                      ) : (
                        <>
                          <line x1="170" y1="60" x2="170" y2="360" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 4" />
                          <circle cx="170" cy="90" r={currentShape.baseWidth * 30} fill="none" stroke="#fff" strokeWidth="1" />
                          <ellipse cx="170" cy="350" rx={currentShape.baseWidth * 60} ry="5" fill="none" stroke="#3b82f6" strokeWidth="2" />
                        </>
                      )}
                    </g>
                  )}

                  {/* RENDER CARAFE */}
                  {selectedArticle === 'carafe' && (
                    <g className="transition-all duration-300">
                      {!showWireframe ? (
                        <>
                          {/* Glass beaker silhouette */}
                          <path
                            d={`M 130 90
                               C 118 90, 130 110, 130 110
                               C 130 110, ${170 - currentShape.shoulderWidth * 50} ${160 - currentShape.shoulderHeight * 40}, ${170 - currentShape.bellyWidth * 75} 240
                               C ${170 - currentShape.bellyWidth * 80} 320, ${170 - currentShape.baseWidth * 60} 340, ${170 - currentShape.baseWidth * 55} 340
                               L ${170 + currentShape.baseWidth * 55} 340
                               C ${170 + currentShape.baseWidth * 60} 340, ${170 + currentShape.bellyWidth * 80} 320, ${170 + currentShape.bellyWidth * 75} 240
                               C ${170 + currentShape.shoulderWidth * 50} ${160 - currentShape.shoulderHeight * 40}, 210 110, 210 110
                               C 210 110, 222 90, 210 90 Z`}
                            fill="url(#article-texture)"
                            className="opacity-90"
                          />
                          {/* Inner liquid */}
                          <ellipse cx="170" cy="240" rx={currentShape.bellyWidth * 50} ry="20" fill="url(#finish-coating)" className="opacity-70 mix-blend-multiply" />
                        </>
                      ) : (
                        <>
                          <ellipse cx="170" cy="90" rx="40" ry="10" fill="none" stroke="#fff" strokeWidth="1" />
                          <ellipse cx="170" cy="240" rx={currentShape.bellyWidth * 60} ry="25" fill="none" stroke="#3b82f6" strokeWidth="2" />
                          <ellipse cx="170" cy="340" rx={currentShape.baseWidth * 55} ry="12" fill="none" stroke="#fff" strokeWidth="1" />
                        </>
                      )}
                    </g>
                  )}

                  {/* RENDER ORGANIZER TRAY */}
                  {selectedArticle === 'organizer' && (
                    <g className="transition-all duration-300">
                      {!showWireframe ? (
                        <>
                          {/* Solid compartment body */}
                          <rect
                            x={170 - currentShape.shoulderWidth * 90}
                            y={200}
                            width={currentShape.shoulderWidth * 180}
                            height="120"
                            rx="16"
                            fill="url(#article-texture)"
                          />
                          {/* Inner divider shelves */}
                          <line x1="170" y1="200" x2="170" y2="320" stroke="#0a0a0c" strokeWidth="6" />
                          <line x1={170 - currentShape.shoulderWidth * 90} y1="260" x2={170 + currentShape.shoulderWidth * 90} y2="260" stroke="#0a0a0c" strokeWidth="6" />
                        </>
                      ) : (
                        <>
                          <rect
                            x={170 - currentShape.shoulderWidth * 90}
                            y={200}
                            width={currentShape.shoulderWidth * 180}
                            height="120"
                            rx="16"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                          />
                          <line x1="170" y1="200" x2="170" y2="320" stroke="#fff" strokeWidth="1.5" />
                        </>
                      )}
                    </g>
                  )}
                </svg>

              </div>

              {/* Custom Spin controls */}
              <div className="flex items-center justify-between mt-auto z-10 select-none">
                <button
                  id="toggle-spin"
                  onClick={() => setIsSpinning(!isSpinning)}
                  className={`flex items-center gap-1.5 px-4 py-1.8 rounded-full text-xs font-semibold tracking-wider transition-all duration-200 border cursor-pointer ${
                    isSpinning 
                      ? 'bg-[#3b82f6] border-[#3b82f6] hover:bg-[#2563eb] text-white shadow-lg' 
                      : 'bg-[#0a0a0c] border-white/10 text-[#94a3b8] hover:bg-white/5'
                  }`}
                >
                  {isSpinning ? <Pause size={13} /> : <Play size={13} />}
                  {isSpinning ? 'FREEZE 3D' : 'SPIN 360°'}
                </button>

                <button
                  id="reset-canvas"
                  onClick={onReset}
                  className="px-3.5 py-1.8 rounded-full text-xs font-semibold border border-white/10 bg-[#0a0a0c] text-[#94a3b8] hover:bg-white/5 hover:text-white flex items-center gap-1 transition-all duration-200 cursor-pointer"
                >
                  <RefreshCw size={11} /> RESET SPEC
                </button>
              </div>

            </div>

            {/* Specifications metrics recap */}
            <div className="w-full mt-4 bg-[#16161a] border border-white/10 rounded-2xl p-4 shadow-sm grid grid-cols-3 gap-2 text-center text-[#94a3b8]">
              <div>
                <span className="block font-mono text-[10px] tracking-widest text-white/40 mb-1">HEIGHT DIMENSION</span>
                <span className="font-serif text-base font-semibold text-white">{currentShape.totalHeightCm} cm</span>
              </div>
              <div className="border-x border-white/10">
                <span className="block font-mono text-[10px] tracking-widest text-white/40 mb-1">SHELL MATERIAL</span>
                <span className="text-xs font-semibold text-white truncate block px-0.5">{clayDetails.name}</span>
              </div>
              <div>
                <span className="block font-mono text-[10px] tracking-widest text-white/40 mb-1">TREATMENT FINISH</span>
                <span className="text-xs font-semibold text-white truncate block px-0.5">{glazeDetails.name.split(' ')[0]}</span>
              </div>
            </div>
          </div>

          {/* Configuration Sliders & Material Coaters (Right Column) */}
          <div className="lg:col-span-6 flex flex-col h-full justify-between">
            <div className="bg-[#16161a] border border-white/10 rounded-3xl p-6 shadow-xs space-y-6">
              
              {/* Product type selectors */}
              <div className="space-y-2 text-left">
                <span className="block font-mono text-[10px] tracking-widest text-white/40 font-semibold uppercase">Choose Article Template</span>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'lamp', label: 'Desk Lamp', icon: <Lamp size={14} /> },
                    { id: 'chair', label: 'Lounge Chair', icon: <Home size={14} /> },
                    { id: 'carafe', label: 'Coffee Carafe', icon: <Coffee size={14} /> },
                    { id: 'organizer', label: 'Desk Tray', icon: <Sliders size={14} /> },
                  ].map((art) => (
                    <button
                      key={art.id}
                      id={`article-select-${art.id}`}
                      onClick={() => setSelectedArticle(art.id as any)}
                      className={`p-2.5 rounded-xl border text-[10px] font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        selectedArticle === art.id
                          ? 'border-[#3b82f6] bg-[#3b82f6]/10 text-[#3b82f6]'
                          : 'border-white/5 bg-[#0a0a0c]/40 text-slate-400 hover:border-[#3b82f6]/30 hover:text-white'
                      }`}
                    >
                      {art.icon}
                      <span className="truncate w-full text-center">{art.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tabs for adjusting current product parameters */}
              <div className="flex border-b border-white/10">
                <button
                  id="tab-form-sculpt"
                  onClick={() => setActiveTab('form')}
                  className={`flex-1 pb-3 text-sm font-bold tracking-wider uppercase transition-all duration-200 border-b-2 text-center cursor-pointer ${
                    activeTab === 'form'
                      ? 'border-[#3b82f6] text-[#3b82f6]'
                      : 'border-transparent text-[#94a3b8] hover:text-white'
                  }`}
                >
                  1. Size & Ratios
                </button>
                <button
                  id="tab-clay-glaze"
                  onClick={() => setActiveTab('material')}
                  className={`flex-1 pb-3 text-sm font-bold tracking-wider uppercase transition-all duration-200 border-b-2 text-center cursor-pointer ${
                    activeTab === 'material'
                      ? 'border-[#3b82f6] text-[#3b82f6]'
                      : 'border-transparent text-[#94a3b8] hover:text-white'
                  }`}
                >
                  2. Materials & Finish
                </button>
              </div>

              {/* TAB 1: DESIGN RATIO SLIDERS */}
              {activeTab === 'form' && (
                <div id="product-ratio-sliders" className="space-y-4 animate-fade-in text-left">
                  <p className="text-xs text-[#94a3b8] leading-relaxed">
                    Tune the geometry coordinates of your selected product to achieve custom postural ergonomics and storage layouts.
                  </p>

                  {/* Base scale slider height */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#3b82f6] flex items-center gap-1">
                        <Scale size={13} /> Height Dimension Scale
                      </span>
                      <span className="font-mono font-bold text-[#3b82f6]">{currentShape.totalHeightCm} cm</span>
                    </div>
                    <input
                      id="slide-product-height"
                      type="range"
                      min="15"
                      max="110"
                      step="1"
                      value={currentShape.totalHeightCm}
                      onChange={(e) => handleSliderChange('totalHeightCm', parseInt(e.target.value))}
                      className="w-full h-1 bg-[#0a0a0c] rounded-lg cursor-pointer accent-[#3b82f6]"
                    />
                  </div>

                  {/* Width coordinate slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-400">Primary Core Breadth</span>
                      <span className="font-mono text-[#3b82f6] font-semibold">{(currentShape.neckWidth * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      id="slide-neck-width"
                      type="range"
                      min="0.25"
                      max="0.95"
                      step="0.01"
                      value={currentShape.neckWidth}
                      onChange={(e) => handleSliderChange('neckWidth', parseFloat(e.target.value))}
                      className="w-full h-1 bg-[#0a0a0c] rounded-lg cursor-pointer accent-[#3b82f6]"
                    />
                  </div>

                  {/* Sliders B */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-400">Frame Spacing / Alignment</span>
                      <span className="font-mono text-[#3b82f6] font-semibold">{(currentShape.shoulderWidth * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      id="slide-shoulder-width"
                      type="range"
                      min="0.35"
                      max="1.20"
                      step="0.01"
                      value={currentShape.shoulderWidth}
                      onChange={(e) => handleSliderChange('shoulderWidth', parseFloat(e.target.value))}
                      className="w-full h-1 bg-[#0a0a0c] rounded-lg cursor-pointer accent-[#3b82f6]"
                    />
                  </div>

                  {/* Bottom footprint base width */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-400">Ground Footprint Stance</span>
                      <span className="font-mono text-[#3b82f6] font-semibold">{(currentShape.baseWidth * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      id="slide-base-width"
                      type="range"
                      min="0.22"
                      max="0.75"
                      step="0.01"
                      value={currentShape.baseWidth}
                      onChange={(e) => handleSliderChange('baseWidth', parseFloat(e.target.value))}
                      className="w-full h-1 bg-[#0a0a0c] rounded-lg cursor-pointer accent-[#3b82f6]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: MATERIALS SELECTOR */}
              {activeTab === 'material' && (
                <div id="product-material-selectors" className="space-y-5 animate-fade-in text-left">
                  
                  {/* Part A: Primary Material choice */}
                  <div className="space-y-2.5">
                    <span className="block font-mono text-[10px] tracking-widest text-[#94a3b8] font-bold uppercase">1. Select Core Shell Material</span>
                    <div className="grid grid-cols-5 gap-2">
                      {(Object.keys(ClayBody) as Array<keyof typeof ClayBody>).map((key) => {
                        const clayVal = ClayBody[key];
                        const isSelected = currentClay === clayVal;
                        let dotColor = 'bg-[#E3C161]'; // Brass
                        if (clayVal === ClayBody.STONEWARE_GREY) dotColor = 'bg-[#88919E]'; // Steel
                        if (clayVal === ClayBody.SANDSTONE_BUFF) dotColor = 'bg-[#BAA385]'; // Ashwood
                        if (clayVal === ClayBody.PORCELAIN_WHITE) dotColor = 'bg-[#F5F7FA] border border-gray-400'; // Marble
                        if (clayVal === ClayBody.OBSIDIAN_BLACK) dotColor = 'bg-[#1F2226]'; // Carbon fiber

                        return (
                          <button
                            key={clayVal}
                            id={`article-material-${clayVal.toLowerCase()}`}
                            onClick={() => onChangeClay(clayVal)}
                            className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1.5 border text-[10px] font-bold tracking-wide transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? 'border-[#3b82f6] bg-[#0a0a0c] text-[#3b82f6]'
                                : 'border-white/5 bg-[#0a0a0c]/40 text-slate-400 hover:border-white/25'
                            }`}
                          >
                            <span className={`w-3 h-3 rounded-full ${dotColor} shadow-inner shrink-0`} />
                            <span className="truncate w-full text-center">{key.replace('_', ' ').split(' ')[0]}</span>
                          </button>
                        );
                      })}
                    </div>
                <div className="bg-[#0a0a0c] px-3.5 py-3 rounded-xl border border-white/5 text-[11px] leading-relaxed text-[#94a3b8]">
                  <strong className="text-white block mb-0.5">{clayDetails.name} Compound</strong>
                  {clayDetails.desc}
                </div>
                  </div>

                  {/* Part B: Surface Finishes */}
                  <div className="space-y-2.5 pt-2 border-t border-white/5">
                    <span className="block font-mono text-[10px] tracking-widest text-[#94a3b8] font-bold uppercase">2. Select Applied Finish</span>
                    <div className="grid grid-cols-4 gap-2">
                      {(Object.keys(GlazeType) as Array<keyof typeof GlazeType>).slice(0, 4).map((key) => {
                        const glazeVal = GlazeType[key];
                        const isSelected = currentGlaze === glazeVal;
                        return (
                          <button
                            key={glazeVal}
                            id={`article-finish-${glazeVal.toLowerCase()}`}
                            onClick={() => onChangeGlaze(glazeVal)}
                            className={`p-2 rounded-xl border flex flex-col justify-between text-center h-[62px] transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#3b82f6] bg-[#3b82f6]/5 text-[#3b82f6]'
                                : 'border-white/5 bg-[#0a0a0c]/40 text-slate-400 hover:border-[#3b82f6]/20'
                            }`}
                          >
                            <span className="block font-semibold text-[9px] uppercase tracking-wider truncate w-full text-slate-400">
                              {key.replace('_', ' ').split(' ')[0]}
                            </span>
                            <div className="w-2.5 h-2.5 rounded-full mx-auto border border-white/10"
                                 style={{
                                   backgroundColor:
                                     glazeVal === GlazeType.CRACKLE_CELADON ? '#8395A7' :
                                     glazeVal === GlazeType.TENMOKU_RUST ? '#3B2A1E' :
                                     glazeVal === GlazeType.COBALT_LUSTRE ? '#1E272C' :
                                     '#D4AF37'
                                 }}
                            />
                          </button>
                        );
                      })}
                    </div>
                <div className="bg-[#0a0a0c] px-3.5 py-3 rounded-xl border border-white/5 text-[11px] leading-relaxed text-[#94a3b8]">
                  <strong className="text-white block mb-0.5">{glazeDetails.name} Finish</strong>
                  {glazeDetails.desc}
                </div>
                  </div>

                </div>
              )}

            </div>

            {/* Price Quote Ordering Block */}
            <div className="mt-6 bg-gradient-to-br from-[#16161a] to-[#0a0a0c] text-white rounded-3xl p-6 shadow-md border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[9px] tracking-widest text-[#94a3b8] font-bold uppercase">ARTISAN SHOP ASSEMBLY ESTIMATE</span>
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-[#3b82f6] text-white tracking-wide">
                    {estimates.complexity}
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5 col-span-3">
                  <span className="text-3xl font-serif text-white font-medium">${estimates.quotedCost}</span>
                  <span className="text-xs text-[#94a3b8]">USD</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[#94a3b8]/90 pt-1 border-t border-white/5 mt-1">
                  <span>Net Weight: {estimates.weightKg} kg</span>
                  <span>Fabrication Time: {estimates.kilnHours} Hours</span>
                </div>
              </div>

              <button
                id="order-custom-commission"
                onClick={() => onSave({
                  title: `${selectedArticle.toUpperCase()} [${title || 'Bespoke design'}]`,
                  shape: currentShape,
                  clay: currentClay,
                  glaze: currentGlaze,
                  estimatedPrice: estimates.quotedCost,
                  description: `${selectedArticle.toUpperCase()} configured custom. Base: ${clayDetails.name}. Finish: ${glazeDetails.name}. Height dimension scale: ${currentShape.totalHeightCm}cm.`
                })}
                className="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold text-xs tracking-wider uppercase px-5 py-3.5 rounded-2xl flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-lg"
              >
                <ShoppingCart size={13} /> Submit Design Brief
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
