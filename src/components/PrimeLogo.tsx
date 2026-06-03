/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface PrimeLogoProps {
  className?: string;
  size?: number;
  textColor?: string;
  houseColor?: string;
  showText?: boolean;
  maskColor?: string; // Color to mask the roof split line (transparent cutout proxy)
}

export const PrimeLogo: React.FC<PrimeLogoProps> = ({
  className = '',
  size = 140,
  textColor = 'text-[#043259]',
  houseColor = '#043259',
  showText = true,
  maskColor = '#FAF8F2',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
      {/* 
        Prime Traders Official Logo SVG
        Matches the provided image: Deep navy house silhouette split down the roof peak 
        enclosing bold elegant serif letters "PT" in custom contrast.
      */}
      <svg
        id="prime-traders-identity-logo"
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-all duration-300 hover:scale-105"
      >
        {/* Deep Navy House Silhouette with clean geometry */}
        {/* We use mask/g/path elements to draw the house with the specific split and PT cutout */}
        <g id="house-logo-group">
          {/* Main House Base: clean bold rect with peaked roof */}
          {/* Let's construct the path for the house structure */}
          <path
            d="M 100 28 
               L 19 86 
               L 33 86 
               L 33 162 
               L 167 162 
               L 167 86 
               L 181 86 
               Z"
            fill={houseColor}
          />
          
          {/* Vertical Roof Split down the middle at x=100 from top down to y=86 */}
          {/* This matches the elegant gap in the upper core of the roof peak of the logo */}
          <line 
            x1="100" 
            y1="24" 
            x2="100" 
            y2="88" 
            stroke={maskColor} 
            strokeWidth="5" 
            className="dark-split-mask"
          />

          {/* Bold Serif 'P' and 'T' letters placed within the house interior */}
          {/* Staggered and fitted beautifully like the brand image */}
          {/* Left letter: P */}
          <text 
            x="76" 
            y="132" 
            fill="#ffffff" 
            fontFamily="'Fraunces', Georgia, 'Times New Roman', serif" 
            fontSize="54" 
            fontWeight="900" 
            textAnchor="middle"
            letterSpacing="-0.05em"
          >
            P
          </text>

          {/* Right letter: T */}
          <text 
            x="122" 
            y="132" 
            fill="#ffffff" 
            fontFamily="'Fraunces', Georgia, 'Times New Roman', serif" 
            fontSize="54" 
            fontWeight="900" 
            textAnchor="middle"
            letterSpacing="-0.05em"
          >
            T
          </text>
        </g>
      </svg>

      {/* Brand logo title written underneath matching the given image */}
      {showText && (
        <div className="flex flex-col items-center mt-3 text-center">
          <span 
            className={`font-sans tracking-tight text-[26px] font-normal transition-colors ${textColor}`}
            style={{ letterSpacing: '-0.025em', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif' }}
          >
            <span className="font-semibold">Prime</span>{' '}
            <span className="font-light">Traders</span>
          </span>
          <span className="font-sans text-[10px] sm:text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-[#e35a11] mt-2 max-w-[280px] leading-relaxed mx-auto">
            YOUR TRUSTED WHOLESALE PARTNER FOR
            <br />
            EVERY HOME
          </span>
        </div>
      )}
    </div>
  );
};
