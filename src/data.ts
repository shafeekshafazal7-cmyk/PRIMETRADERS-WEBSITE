/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WholesaleProduct {
  id: string;
  name: string;
  category: 'household' | 'packing';
  subCategory: string; // e.g., Cleaning, Kitchen accessories, Plastic items, Storage containers, Bubble wrap, Tape, Corrugated boxes, Carry bags, Packaging rolls
  description: string;
  tagline: string;
  wholesalePrice: number; // in INR per bundle/pack
  unitName: string; // e.g. "Pack of 50", "Roll of 100m", "Carton of 25"
  minOrderQty: number; // minimum bundles/units
  gstRate: number; // typically 18% or 12%
  isAvailable: boolean;
  specifications: { [key: string]: string };
  blueprintShape: {
    neckWidth: number;
    neckLength: number;
    shoulderWidth: number;
    shoulderHeight: number;
    bellyWidth: number;
    bellyHeight: number;
    baseWidth: number;
    totalHeightCm: number;
  };
}

export const FEATURED_BRANDS = [
  { name: 'Supreme Polymers', logo: 'SP' },
  { name: 'Milma Co-op Supplies', logo: 'MC' },
  { name: 'Cello Housewares', logo: 'CH' },
  { name: 'Kollam Polymers Ltd', logo: 'KP' },
  { name: 'Prestige Commercial', logo: 'PC' },
  { name: '3M Industrial Kerala', logo: '3M' }
];

export const KERALA_DISTRICTS = [
  'Thiruvananthapuram',
  'Kollam'
];

export const WHOLESALE_PRODUCTS: WholesaleProduct[] = [
  // --- HOUSEHOLD ITEMS ---
  {
    id: 'h-01',
    name: 'Heavy-Duty Commercial Floor Squeegee',
    category: 'household',
    subCategory: 'Cleaning products',
    tagline: 'Dual-lip vulcanized rubber squeegee for commercial floors and spas.',
    description: 'Constructed from powder-coated high-gauge steel with a reinforced 60cm twin-foam rubber blade. Ideal for large tiles, hospitality floors, and Kerala high-humidity monsoon drying cycles.',
    wholesalePrice: 420,
    unitName: 'Carton of 10 units',
    minOrderQty: 5,
    gstRate: 18,
    isAvailable: true,
    specifications: {
      'Blade Width': '60 cm',
      'Material': 'Anodized Steel + Foam Rubber',
      'Handle Compatibility': '25mm standard thread',
      'Durability Rating': 'Ultra Tough Grade'
    },
    blueprintShape: {
      neckWidth: 0.25,
      neckLength: 0.15,
      shoulderWidth: 0.95,
      shoulderHeight: 0.70,
      bellyWidth: 0.45,
      bellyHeight: 0.20,
      baseWidth: 0.75,
      totalHeightCm: 120
    }
  },
  {
    id: 'h-02',
    name: 'Airtight Stackable Dry Food Storage Canisters',
    category: 'household',
    subCategory: 'Storage containers',
    tagline: 'Premium modular space-saving storage jars with silicone airtight lock.',
    description: 'Made of virgin bpa-free shockproof acrylic, featuring our dual-action airtight latch lock. Excellent storage integrity for sugar, spices, flour, and tea powder in coastal retail supermarkets.',
    wholesalePrice: 1850,
    unitName: 'Set of 6 Jars (Box Pack)',
    minOrderQty: 10,
    gstRate: 18,
    isAvailable: true,
    specifications: {
      'Volume Spec': '1.2L, 0.8L, 0.5L Jars',
      'Seal Compound': 'Food-Grade Silicone',
      'Stackability': 'Modular Interlock',
      'Transparency': 'Stained Crystal Clear'
    },
    blueprintShape: {
      neckWidth: 0.75,
      neckLength: 0.10,
      shoulderWidth: 0.65,
      shoulderHeight: 0.45,
      bellyWidth: 0.82,
      bellyHeight: 0.35,
      baseWidth: 0.60,
      totalHeightCm: 28
    }
  },
  {
    id: 'h-03',
    name: 'Unbreakable Commercial Water Basins (65L)',
    category: 'household',
    subCategory: 'Plastic items',
    tagline: 'Industrial virgin polymer washing tubs with thick-walled reinforcement rims.',
    description: 'High-capacity heavy washing buckets utilizing flex-core virgin HDPE. Resistant to chemical bleach, deep hot-temperature baths, and heavy load transit for commercial catering and luxury hotels.',
    wholesalePrice: 3200,
    unitName: 'Bundle of 15 Basins',
    minOrderQty: 3,
    gstRate: 18,
    isAvailable: true,
    specifications: {
      'Capacity': '65 Liters',
      'Material': 'Virgin HDPE Polymer',
      'Load Index': 'Up to 120 kg Static',
      'Color Option': 'Deep Navy / Traffic Orange'
    },
    blueprintShape: {
      neckWidth: 0.90,
      neckLength: 0.12,
      shoulderWidth: 0.80,
      shoulderHeight: 0.55,
      bellyWidth: 1.10,
      bellyHeight: 0.40,
      baseWidth: 0.72,
      totalHeightCm: 45
    }
  },
  {
    id: 'h-04',
    name: 'Premium Brushed Stainless Steel Pedal Bins',
    category: 'household',
    subCategory: 'Kitchen accessories',
    tagline: 'Fingerprint-proof silent-close metal dustbins for hotels & kitchens.',
    description: 'Fitted with a solid steel step pedal mechanism engineered for over 100,000 presses and a slow-closing safety damper lid. Perfect for restaurant washrooms, luxury suites, and domestic pantries.',
    wholesalePrice: 1450,
    unitName: 'Individual Premium Carton',
    minOrderQty: 12,
    gstRate: 18,
    isAvailable: true,
    specifications: {
      'Capacity': '12 Liters',
      'Mechanism': 'Steel Pedal & Air Damper',
      'Finish': 'Polished Stainless Steel Anti-Smudge',
      'Inner Bucket': 'Removable PP with Bag Lock'
    },
    blueprintShape: {
      neckWidth: 0.50,
      neckLength: 0.15,
      shoulderWidth: 0.55,
      shoulderHeight: 0.65,
      bellyWidth: 0.60,
      bellyHeight: 0.30,
      baseWidth: 0.52,
      totalHeightCm: 42
    }
  },

  // --- PACKING MATERIALS ---
  {
    id: 'p-01',
    name: 'Double-Layer Transit Bubble Wrap Roll',
    category: 'packing',
    subCategory: 'Bubble wrap',
    tagline: 'High-burst-strength dual laminate protective cushioning wrapping.',
    description: '10mm bubble diameter with uniform gas retention barriers. Ensures continuous cushioning pressure against severe shunts and transit vibration for sensitive household glassware and industrial items.',
    wholesalePrice: 950,
    unitName: 'Roll (1.2m Width x 100m Length)',
    minOrderQty: 8,
    gstRate: 12,
    isAvailable: true,
    specifications: {
      'Bubble Diameter': '10 mm',
      'Roll Width': '1.2 Meters',
      'Total Length': '100 Meters',
      'Cushion Ply': 'Double Layer Laminated'
    },
    blueprintShape: {
      neckWidth: 0.35,
      neckLength: 0.25,
      shoulderWidth: 0.35,
      shoulderHeight: 0.50,
      bellyWidth: 0.70,
      bellyHeight: 0.30,
      baseWidth: 0.70,
      totalHeightCm: 120
    }
  },
  {
    id: 'p-02',
    name: 'Ultra-Adhesive Brown Carton Tape (3-Inch)',
    category: 'packing',
    subCategory: 'Tape',
    tagline: '50-micron high-bond acrylic tape for heavy corrugated cardboard box sealing.',
    description: 'Water-resistant polymer film with heavy hot-melt aggressive adhesive backing. Stays bonded under high moisture, humid Kerala export transits, and refrigeration climates without popping loose.',
    wholesalePrice: 780,
    unitName: 'Box of 24 Heavy Rolls',
    minOrderQty: 5,
    gstRate: 18,
    isAvailable: true,
    specifications: {
      'Tape Width': '72 mm (3 Inches)',
      'Film Gauge': '50 Microns',
      'Roll Core': 'Thick Hardened Kraft Paperboard',
      'Adhesive': 'Aggressive Moisture-Guard Acrylic'
    },
    blueprintShape: {
      neckWidth: 0.45,
      neckLength: 0.20,
      shoulderWidth: 0.50,
      shoulderHeight: 0.45,
      bellyWidth: 0.60,
      bellyHeight: 0.25,
      baseWidth: 0.55,
      totalHeightCm: 10
    }
  },
  {
    id: 'p-03',
    name: 'Heavy-Duty 5-Ply Corrugated Shipping Boxes',
    category: 'packing',
    subCategory: 'Corrugated boxes',
    tagline: 'Flute-reinforced high burst factor structural packing cartons.',
    description: 'Reinforced BC double-wall flute boards built from 100% biodegradable unbleached organic pine wood pulp. Protects heavy goods, domestic electrical, and packed products during stacking and logistics loading.',
    wholesalePrice: 2400,
    unitName: 'Bundle of 50 Flat Boxes',
    minOrderQty: 4,
    gstRate: 12,
    isAvailable: true,
    specifications: {
      'Metric Size': '45cm x 45cm x 45cm',
      'Bursting Factor': '24 kgF/cm²',
      'Ply Rating': '5-Ply (Double Fluted Wall)',
      'Structural Capacity': 'Up to 35 kg Stack Limit'
    },
    blueprintShape: {
      neckWidth: 0.40,
      neckLength: 0.30,
      shoulderWidth: 0.80,
      shoulderHeight: 0.50,
      bellyWidth: 0.90,
      bellyHeight: 0.35,
      baseWidth: 0.85,
      totalHeightCm: 45
    }
  },
  {
    id: 'p-04',
    name: 'Premium Cast Stretch Film Packaging Rolls',
    category: 'packing',
    subCategory: 'Packaging rolls',
    tagline: 'High-stretch elastic pallet stretch film for heavy cargo consolidation.',
    description: 'Made of linear low-density polyethylene (LLDPE) ensuring massive puncture resistance and quiet high stretch ratios up to 300%. Protects wholesale cardboard stacks from moisture, rain, and scuffing.',
    wholesalePrice: 1650,
    unitName: 'Box of 4 Industrial Rolls',
    minOrderQty: 6,
    gstRate: 18,
    isAvailable: true,
    specifications: {
      'Roll Width': '50 cm',
      'Film Thickness': '23 Microns Super-Puncture',
      'Elongation Limit': '300% Multi-Stretch',
      'Weight Per Roll': '3.2 kg Commercial'
    },
    blueprintShape: {
      neckWidth: 0.30,
      neckLength: 0.22,
      shoulderWidth: 0.30,
      shoulderHeight: 0.40,
      bellyWidth: 0.45,
      bellyHeight: 0.25,
      baseWidth: 0.45,
      totalHeightCm: 50
    }
  },
  {
    id: 'p-05',
    name: 'Durable Recyclable Loop-Handle Carry Bags',
    category: 'packing',
    subCategory: 'Carry bags',
    tagline: 'Degradable eco-certified heavy-gauge grocery checkout carry bags.',
    description: 'Gusseted-wall shopping carry bags designed with comfortable robust welded loop handles. Formulated for high weight support, food contact safety, and quick retail supermarket checkouts across Kerala.',
    wholesalePrice: 1120,
    unitName: 'Bale of 1000 Premium Bags',
    minOrderQty: 10,
    gstRate: 18,
    isAvailable: true,
    specifications: {
      'Bag Dimension': '16 x 20 Inches + 4 Inch Gusset',
      'Thickness Gauge': '55 Microns Reinforced',
      'Certification': 'ISO Eco-Cycle Degradability',
      'Box Pack Count': '10 Packs of 100 bags'
    },
    blueprintShape: {
      neckWidth: 0.65,
      neckLength: 0.20,
      shoulderWidth: 0.85,
      shoulderHeight: 0.45,
      bellyWidth: 1.05,
      bellyHeight: 0.30,
      baseWidth: 0.65,
      totalHeightCm: 50
    }
  }
];

export function getWhatsAppUrl(productName: string, queryType: string = 'pre-launch wholesale enquiry') {
  const adminPhone = '919446051515'; // Professional Kerala wholesale partner contact
  const text = `Hello Prime Traders Thiruvananthapuram! I see your shop is debuting soon at Chalai Bazaar. I want to pre-register/make a ${queryType} for: "${productName}". Please send wholesale price list and pre-launch terms. Thank you!`;
  return `https://wa.me/${adminPhone}?text=${encodeURIComponent(text)}`;
}

export function getCartWhatsAppUrl(cartItems: Array<{ product: WholesaleProduct; qty: number }>, businessInfo: { shopName: string; location: string; phone: string }) {
  const adminPhone = '919446051515';
  let listText = '';
  let subtotal = 0;
  cartItems.forEach((item, idx) => {
    const itemTotal = item.product.wholesalePrice * item.qty;
    subtotal += itemTotal;
    listText += `\n${idx + 1}. ${item.product.name} (Qty: ${item.qty} x ₹${item.product.wholesalePrice} = ₹${itemTotal})`;
  });

  const gstValue = Math.round(subtotal * 0.18); // General avg 18% GST estimate
  const finalEstimate = subtotal + gstValue;

  const text = `*PRIME TRADERS THIRUVANANTHAPURAM (CHALAI) - PRE-LAUNCH B2B ENQUIRY BRIEF*
  
*Distributor Details:*
🏬 Shop/Hotel Name: ${businessInfo.shopName || 'Not Specified'}
📍 Delivery Location Selected: ${businessInfo.location || 'Thiruvananthapuram'}
📞 Phone Contact: ${businessInfo.phone || 'Provided'}

*Pre-Registered Items List:*${listText}

*Financial Estimations:*
📈 Net Wholesale Subtotal: ₹${subtotal.toLocaleString('en-IN')}
🧾 Est. GST (18% Avg): ₹${gstValue.toLocaleString('en-IN')}
🪙 Est. Invoice Value: *₹${finalEstimate.toLocaleString('en-IN')}*

Please register our B2B interest. We want to be first in line when the Prime Traders Chalai branch opens! Thank you.`;

  return `https://wa.me/${adminPhone}?text=${encodeURIComponent(text)}`;
}
