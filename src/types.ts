/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Materials for elite household articles
export enum ClayBody {
  TERRACOTTA = 'TERRACOTTA', // Brushed Brass / Copper Metal
  STONEWARE_GREY = 'STONEWARE_GREY', // Anodized Steel / Aluminum
  SANDSTONE_BUFF = 'SANDSTONE_BUFF', // Danish White Ash / Beechwood
  PORCELAIN_WHITE = 'PORCELAIN_WHITE', // Carved Carrara Marble
  OBSIDIAN_BLACK = 'OBSIDIAN_BLACK' // Matte Carbon Filament / Leather
}

// Fine finishing coats for premium housewares
export enum GlazeType {
  CRACKLE_CELADON = 'CRACKLE_CELADON', // Smoked Acid-Etched Glass
  TENMOKU_RUST = 'TENMOKU_RUST', // Hand-Honed Artisan Walnut Oil
  COBALT_LUSTRE = 'COBALT_LUSTRE', // Mirror Cobalt Electropolish
  MATTE_OCHRE = 'MATTE_OCHRE', // Matte Brushed Champagne Gold
  PURE_ALABASTER = 'PURE_ALABASTER', // Satin Cream Alabaster Dust
  VOLCANIC_ASH_MATTE = 'VOLCANIC_ASH_MATTE', // Sandblasted Anthracite Grip
  UNGLAZED_NATURAL = 'UNGLAZED_NATURAL' // Natural Matte Beadblast Finish
}

// Categories of high-fidelity household articles we configure
export enum HouseholdArticleType {
  DESK_LAMP = 'DESK_LAMP',
  LOUNGE_CHAIR = 'LOUNGE_CHAIR',
  KITCHEN_CARAFE = 'KITCHEN_CARAFE',
  MODULAR_ORGANIZER = 'MODULAR_ORGANIZER'
}

export interface CeramicShape {
  neckWidth: number;      // e.g., Shade Flare / Seat Pitch
  neckLength: number;     // e.g., Stem Length / Cushion Depth
  shoulderWidth: number;  // e.g., Armrest Span / Frame Breadth
  shoulderHeight: number; // e.g., Base Elevation / Seat Elevation
  bellyWidth: number;     // e.g., Central Bulb / Core Width
  bellyHeight: number;    // e.g., Lower Support / Core Vertical Layout
  baseWidth: number;      // e.g., Leg Stance / Ground Footing
  totalHeightCm: number;  // absolute dimension scale (e.g. 15 to 110cm)
}

// Custom brand logo configurator template parameters
export interface LogoSpecification {
  iconType: 'house' | 'chair' | 'lamp' | 'carafe' | 'utensils';
  frameStyle: 'circle' | 'squircle' | 'hexagon' | 'none';
  colorTheme: 'azure' | 'bronze' | 'laurel' | 'charcoal' | 'brick';
  brandName: string;
  tagline: string;
  iconSize: number;
  strokeWidth: number;
  fontSize: number;
}

export interface CeramicPiece {
  id: string;
  title: string;
  tagline?: string;
  description: string;
  shape: CeramicShape;
  clay: ClayBody; // mapped to HouseholdMaterial
  glaze: GlazeType; // mapped to HouseholdFinish
  creator: string;
  isCustomized: boolean;
  estimatedPrice: number;
  firingLogs?: string[]; // mapped to Manufacturing Logs
  historicalBrief?: string;
  articleType?: HouseholdArticleType;
}

export interface CeramicDesignProposal {
  title: string;
  tagline: string;
  narrative: string;
  suggestedClay: ClayBody;
  suggestedGlaze: GlazeType;
  shapeParameters: CeramicShape;
  firingAdvice: string; // mapped to Fabrication Advice
  historicalPrecedents: string;
  priceEstimate: number;
}
