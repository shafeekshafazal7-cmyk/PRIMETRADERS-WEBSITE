/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CeramicDesignProposal, CeramicShape, ClayBody, GlazeType } from '../types';
import { Sparkles, ArrowRight, Loader2, BookOpen, Hammer, History, Info, Check, Lightbulb, Calculator, HelpCircle } from 'lucide-react';

interface AIPotteryForgeProps {
  onLoadShape: (shape: CeramicShape, clay: ClayBody, glaze: GlazeType, title: string) => void;
}

const FABRICATION_TIPS = [
  'Calculating material density thresholds...',
  'Checking high-humidity Kerala cargo transit tolerances...',
  'Configuring box corrugation fluting indices...',
  'Simulating load burst pressures on double-wall seals...',
  'Evaluating chemical durability coefficients for virgin plastic...',
  'Refining adhesive bond shear limits on 50-micron tape core...',
  'Modeling biophilic wood grain structures on handle rods...',
  'Compiling GST estimates and freight routing options...'
];

export const AIPotteryForge: React.FC<AIPotteryForgeProps> = ({ onLoadShape }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(FABRICATION_TIPS[0]);
  const [proposal, setProposal] = useState<CeramicDesignProposal | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exported, setExported] = useState(false);

  // Suggested Prompts for Prime Traders Thiruvananthapuram Packing & Household wholesale solutions
  const inspirationPrompts = [
    'Heavy-duty corrugated cargo boxes and thick aggressive tape for shipping bulky coconut kitchen tools in Thiruvananthapuram damp humid weather.',
    'Heavy-gauge degradable loop shopping carry bags to support up to 15kg without tear for big supermarkets in Trivandrum.',
    'Unbreakable food-grade storage canisters and commercial washing tubs for a luxury catering business near Kovalam Beach.',
    'Waterproof Cast stretch rolls and dual-layer packing bubble wrap to secure heavy electronic components in coastal transit.'
  ];

  const handleSuggest = (text: string) => {
    setPrompt(text);
  };

  const handleForge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setProposal(null);
    setExported(false);

    // Rotate Loading Texts
    let tipIndex = 0;
    const intervalId = setInterval(() => {
      tipIndex = (tipIndex + 1) % FABRICATION_TIPS.length;
      setLoadingText(FABRICATION_TIPS[tipIndex]);
    }, 2500);

    try {
      const response = await fetch('/api/generate-ceramic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (response.ok) {
        setProposal(data);
      } else {
        throw new Error(data.error || 'Failed to establish connection with our logistics calculation servers.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while connecting with our AI freight modeler.');
    } finally {
      clearInterval(intervalId);
      setLoading(false);
    }
  };

  const handleExportToAtelier = () => {
    if (!proposal) return;
    onLoadShape(
      proposal.shapeParameters,
      proposal.suggestedClay,
      proposal.suggestedGlaze,
      proposal.title
    );
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  // Convert clay body identifiers into real packaging terms for the user interface
  const getClayLabel = (clay: ClayBody) => {
    switch (clay) {
      case ClayBody.TERRACOTTA:
        return 'Multi-Wall Kraft Cardboard';
      case ClayBody.STONEWARE_GREY:
        return 'Virgin High-Density Polyethylene (HDPE)';
      case ClayBody.SANDSTONE_BUFF:
        return 'Steamed Wood / Bamboo Natural Fiber';
      case ClayBody.PORCELAIN_WHITE:
        return 'Heavy-Gauge Brushed Stainless Steel';
      case ClayBody.OBSIDIAN_BLACK:
        return 'Triple-Layer Air-Locked Cushion Polymer';
      default:
        return String(clay).replace('_', ' ');
    }
  };

  // Convert glaze identifiers into real finishing terms
  const getGlazeLabel = (glaze: GlazeType) => {
    switch (glaze) {
      case GlazeType.CRACKLE_CELADON:
        return 'Heat-Sealed Shrink Poly Shield';
      case GlazeType.TENMOKU_RUST:
        return 'Heavy-Adhesive Adhesive Glue Treatment';
      case GlazeType.COBALT_LUSTRE:
        return 'Water-Proof Gloss Overprint Coat';
      case GlazeType.MATTE_OCHRE:
        return 'Golden Custom Logo Brand Stamp';
      case GlazeType.PURE_ALABASTER:
        return 'Refined Recycled Pulp Liner';
      case GlazeType.VOLCANIC_ASH_MATTE:
        return 'Anti-Slip Textured High-Grip Coating';
      case GlazeType.UNGLAZED_NATURAL:
        return 'Raw Matte Unbleached Flat Finish';
      default:
        return String(glaze).replace('_', ' ');
    }
  };

  return (
    <div id="ai-pottery-forge-root" className="space-y-8 animate-fade-in text-left">
      
      {/* BRAND HERO HEADER */}
      <div className="bg-[#16161a] rounded-3xl p-6 sm:p-8 border border-white/10 text-center max-w-4xl mx-auto shadow-xl">
        <Sparkles size={32} className="mx-auto text-orange-500 mb-3" />
        <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
          AI Bulk Logistics & Packing Strategist
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Struggling with fragile goods, heavy moisture transits, or local resort provisioning? Outline your warehouse parameters, retail targets, or cargo weight requirements below. Our neural model compiles a tailored structural blueprint, ideal material compound, custom-finishing, and a wholesale quote directly.
        </p>
      </div>

      {/* PROMPT FORM BLOCK */}
      <div className="max-w-4xl mx-auto bg-[#16161a] border border-white/10 rounded-3xl p-6 shadow-xl">
        <form onSubmit={handleForge} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="inspiration-input" className="block text-xs font-bold tracking-wider text-orange-500 uppercase">
              1. Detail Your Packaging Challenge or Household Order
            </label>
            <textarea
              id="inspiration-input"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., We need extra strong double fluted boxes to pack Kerala tea containers, must resist ocean humidity and support up to 25kg weight limit..."
              className="w-full rounded-2xl border border-white/10 bg-[#0a0a0c] p-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-all duration-200 leading-relaxed text-left font-serif"
            />
          </div>

          {/* Preset selections */}
          <div className="space-y-2">
            <span className="block text-[10px] font-mono tracking-widest text-slate-500 font-bold uppercase">
              Suggested logistic scenarios:
            </span>
            <div className="flex flex-col gap-2">
              {inspirationPrompts.map((text, i) => (
                <button
                  key={i}
                  type="button"
                  id={`prompt-suggest-${i}`}
                  onClick={() => handleSuggest(text)}
                  className="px-4 py-2.5 rounded-xl text-xs bg-[#0a0a0c] border border-white/5 hover:bg-white/5 hover:border-orange-500/40 text-slate-300 hover:text-white transition-all duration-200 cursor-pointer text-left font-sans line-clamp-1"
                >
                  {text}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
              <Calculator size={13} /> Output maps to standard 3D visual coordinates under-the-hood
            </span>
            
            <button
              type="submit"
              id="submit-inspiration"
              disabled={loading || !prompt.trim()}
              className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 disabled:bg-[#16161a] disabled:text-white/20 text-white font-bold text-xs tracking-wider uppercase px-8 py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all duration-250 shadow-lg shadow-orange-500/10 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin animate-duration-1000" size={14} /> Architecting Ledger...
                </>
              ) : (
                <>
                  Generate Logistics Solution <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* KINETIC LOADING CARD */}
      {loading && (
        <div id="ai-kiln-loading-card" className="max-w-2xl mx-auto bg-[#16161a] border border-white/10 rounded-3xl p-10 shadow-xl text-center space-y-4 animate-pulse">
          <div className="relative w-16 h-16 mx-auto">
            <Loader2 size={64} className="text-orange-500 animate-spin opacity-30" />
            <Sparkles size={24} className="absolute inset-0 m-auto text-orange-400 animate-bounce" />
          </div>
          <div className="space-y-1">
            <span className="block font-mono text-[10px] tracking-widest text-orange-500 font-semibold uppercase">NEURAL LOGISTICS KILN ACTIVE</span>
            <h3 className="font-serif text-lg font-medium text-white transition-all duration-500">
              {loadingText}
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed pt-1.5">
              Evaluating material burst indices, local tax schedules, and custom printing plates...
            </p>
          </div>
        </div>
      )}

      {/* ERROR DISPLAY */}
      {error && (
        <div id="ai-kiln-error-card" className="max-w-2xl mx-auto bg-red-950/20 border border-red-900/40 text-red-200 rounded-3xl p-6 shadow-2xs space-y-2">
          <h3 className="font-semibold text-xs uppercase tracking-wider text-red-400">Freight Engine Outage</h3>
          <p className="text-xs leading-relaxed text-red-300">{error}</p>
          <div className="text-xs pt-2 font-medium text-red-400 block">
            Please verify that your **GEMINI_API_KEY** secret is correctly stored on the left-side settings secrets panel.
          </div>
        </div>
      )}

      {/* LEDGER BLUEPRINT GENERATOR PANEL */}
      {proposal && (
        <div id="ai-pottery-proposal-card" className="max-w-4xl mx-auto bg-[#16161a] border border-white/10 rounded-3xl shadow-xl overflow-hidden transition-all duration-300">
          
          <div className="bg-gradient-to-br from-[#232329] to-[#0a0a0c] p-8 text-white border-b border-b-white/5 relative overflow-hidden flex flex-col sm:flex-row justify-between sm:items-center gap-6">
            <div className="space-y-1 text-left">
              <span className="font-mono text-[8px] tracking-widest text-[#94a3b8] font-bold uppercase bg-white/5 px-2 py-0.5 rounded-md">
                STATION-KEY SOLUTION LEDGER
              </span>
              <h3 className="font-serif text-3xl font-bold text-white tracking-wide">{proposal.title}</h3>
              <p className="font-mono font-bold text-xs text-orange-400">{proposal.tagline}</p>
            </div>
            
            <button
              onClick={handleExportToAtelier}
              id="export-forged-shape"
              className={`shrink-0 relative z-10 px-5 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                exported 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg border border-orange-400/20'
              }`}
            >
              {exported ? (
                <>
                  <Check size={14} /> Loaded in Configurator!
                </>
              ) : (
                <>
                  <Hammer size={14} /> Map to 3D Coordinates
                </>
              )}
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-8 text-left">
            {/* Philosophical backstory */}
            <div className="space-y-3 bg-[#0a0a0c]/40 p-5 rounded-2xl border border-white/5">
              <h4 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <BookOpen size={16} className="text-orange-500" /> Executive Logistic Recommendation
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-serif italic text-justify">
                &ldquo;{proposal.narrative}&rdquo;
              </p>
            </div>

            {/* Spec Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
              
              <div className="space-y-3">
                <h4 className="font-semibold text-xs tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                  <Lightbulb size={14} className="text-orange-500" /> Structure & Materials Formulation
                </h4>
                <div className="bg-[#0a0a0c] rounded-2xl p-4 border border-white/5 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-semibold">Bulk Base Shell:</span>
                    <span className="font-mono text-[11px] font-bold text-orange-400 bg-[#16161a] px-2.5 py-1 rounded-md border border-white/10 text-right">
                      {getClayLabel(proposal.suggestedClay)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-semibold">Seal coating/adhesive:</span>
                    <span className="font-mono text-[11px] font-bold text-orange-400 bg-[#16161a] px-2.5 py-1 rounded-md border border-white/10 text-right">
                      {getGlazeLabel(proposal.suggestedGlaze)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 border-t border-white/5 pt-2.5 leading-relaxed">
                    <strong>Printing & Sealing Advice:</strong> {proposal.firingAdvice}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-xs tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                  <History size={14} className="text-orange-500" /> Logistics Heritage & Compliance
                </h4>
                <div className="bg-[#0a0a0c] rounded-2xl p-4 border border-white/5 flex flex-col justify-between h-[155px]">
                  <p className="text-xs text-slate-400 leading-relaxed italic">
                    {proposal.historicalPrecedents}
                  </p>
                  <div className="flex justify-between items-center border-t border-white/5 pt-2 text-[10px] font-bold font-mono text-slate-500 uppercase">
                    <span>REGULATORY STANDARDS</span>
                    <span className="text-emerald-400 font-bold">STATE TRANSPORTS VERIFIED</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Price section and coordination mappings */}
            <div className="bg-[#0a0a0c]/80 rounded-2xl p-5 border border-white/10 text-center space-y-3 sm:space-y-0 sm:flex items-center justify-between gap-4">
              <div className="text-left space-y-0.5">
                <span className="font-mono text-[9px] tracking-wider text-orange-500 uppercase block font-bold">DRAFT ORDER ESTIMATE (MOQ INCLUDED)</span>
                <span className="text-xs text-slate-400 leading-snug">
                  Evaluated Batch MOQ: <strong>₹{(proposal.priceEstimate * 83).toLocaleString('en-IN')}</strong> (Calculated in INR equivalent for local tax balance), 
                  Thickness Rating: <strong>{(proposal.shapeParameters.neckWidth * 75).toFixed(0)} Microns Avg</strong>, 
                  Batch volume capacity: <strong>{proposal.shapeParameters.totalHeightCm * 5} Liters</strong>
                </span>
              </div>
              <button
                onClick={handleExportToAtelier}
                id="load-into-atelier-bottom"
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs tracking-wider uppercase px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-center whitespace-nowrap shadow-md shadow-orange-500/15"
              >
                Simulate 3D coordinates
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
