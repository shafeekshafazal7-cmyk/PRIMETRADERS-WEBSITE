/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initializer for Gemini client to avoid crashes on startup if key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY environment variable is not defined. Please configure it in your Settings secrets.');
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// REST API endpoint: AI Household Spec Generator
app.post('/api/generate-ceramic', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Inspiration prompt is required.' });
      return;
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are a legendary industrial packaging designer and commercial fleet product expert at "Prime Agencies Kerala" (motto: "Everyday Essentials Delivered, Quality Products at Wholesale Prices"). 
Your role is to translate a business client's packing challenge, wholesale kitchenware stocking request, supermarket item inventory specification, or cargo transit demand in Kerala into a customized packing bulk-specification ledger, custom-branded box setup, high-strength eco-carrybag layout, or durable bulk household utility recommendation.
You provide an evocative name (e.g. 'Ernakulam Premium Catering Crates', 'Malabar Multi-ply Cargo Box', 'Bio-Shield Eco Tote Batch', 'High-Bond Sealing Roll Pack'), a highly useful commercial tagline, a professional narrative explaining load tests, bubble thickness, burst margins, and moisture-guard layers, and suggested structural material mappings.
Keep everything commercial, highly technical, and strictly focused on Kerala wholesale, retailers, supermarkets, hotels, and packaging supply. Translate the materials as follows:
- suggestedClay: TERRACOTTA=Multi-wall Kraft Cardboard, STONEWARE_GREY=Virgin High-Density Polyethylene, SANDSTONE_BUFF=Steamed Bamboo/Wood Fibres, PORCELAIN_WHITE=Heavy-Gauge Stainless Steel, OBSIDIAN_BLACK=Triple-Layer Air-locked Cushion Polymer.
- suggestedGlaze: CRACKLE_CELADON=Heat-Sealed Shrink Poly, TENMOKU_RUST=Heavy-Duty Hot-Melt Adhesive, COBALT_LUSTRE=Water-Resistant Gloss Overprint, MATTE_OCHRE=Golden Custom Brand Stamp, PURE_ALABASTER=Refined Recycled Liner, VOLCANIC_ASH_MATTE=Anti-Slip Textured Coating, UNGLAZED_NATURAL=Raw Sanded Unbleached Organic.`;

    const ceramicSchema = {
      type: Type.OBJECT,
      properties: {
        title: { 
          type: Type.STRING, 
          description: "An evocative, high-end title for this bespoke wholesale household or packing item (e.g., 'Ernakulam Premium Food-Grade Tub', 'Malabar Multi-Ply Cargo Box')." 
        },
        tagline: { 
          type: Type.STRING, 
          description: "A refined product tagline (e.g., 'An biodegradable, heavy-weight bio-shield carry solution for boutique supermarkets in Kochi')." 
        },
        narrative: { 
          type: Type.STRING, 
          description: "An technical backstory outlining the load tests, burst tolerances, water-resistance grades, thermal capacities, or thickness ratios." 
        },
        suggestedClay: {
          type: Type.STRING,
          enum: ["TERRACOTTA", "STONEWARE_GREY", "SANDSTONE_BUFF", "PORCELAIN_WHITE", "OBSIDIAN_BLACK"],
          description: "Proposed structural material. Maps as: TERRACOTTA=Multi-Wall Kraft Cardboard, STONEWARE_GREY=Virgin High-Density Polyethylene, SANDSTONE_BUFF=Steamed Bamboo/Wood Fibres, PORCELAIN_WHITE=Heavy-Gauge Stainless Steel, OBSIDIAN_BLACK=Triple-Layer Cushion Polymer."
        },
        suggestedGlaze: {
          type: Type.STRING,
          enum: ["CRACKLE_CELADON", "TENMOKU_RUST", "COBALT_LUSTRE", "MATTE_OCHRE", "PURE_ALABASTER", "VOLCANIC_ASH_MATTE", "UNGLAZED_NATURAL"],
          description: "Primary accent treating finish. Maps as: CRACKLE_CELADON=Heat-Sealed Shrink Poly, TENMOKU_RUST=Heavy-Duty Hot-Melt Adhesive, COBALT_LUSTRE=Water-Resistant Gloss Overprint, MATTE_OCHRE=Custom Brand Stamp, PURE_ALABASTER=Refined Recycled Liner, VOLCANIC_ASH_MATTE=Anti-Slip Textured Coating, UNGLAZED_NATURAL=Raw Unbleached Organic Flat."
        },
        shapeParameters: {
          type: Type.OBJECT,
          description: "Proportional coordinates layout forming the article silhouette.",
          properties: {
            neckWidth: { type: Type.NUMBER, description: "Secondary flare ratio. Range [0.25 to 0.90]." },
            neckLength: { type: Type.NUMBER, description: "Vertical spacing ratio. Range [0.10 to 0.50]." },
            shoulderWidth: { type: Type.NUMBER, description: "Maximum primary span ratio. Range [0.35 to 1.20]." },
            shoulderHeight: { type: Type.NUMBER, description: "Ground elevation altitude ratio. Range [0.40 to 0.78]." },
            bellyWidth: { type: Type.NUMBER, description: "Core thickness ratio. Range [0.45 to 1.35]." },
            bellyHeight: { type: Type.NUMBER, description: "Internal depth / layout ratio. Range [0.18 to 0.48]." },
            baseWidth: { type: Type.NUMBER, description: "Ground supporting foot stance footprint. Range [0.22 to 0.75]." },
            totalHeightCm: { type: Type.INTEGER, description: "Absolute scale dimension in cm. Range [15 to 110]." }
          },
          required: ["neckWidth", "neckLength", "shoulderWidth", "shoulderHeight", "bellyWidth", "bellyHeight", "baseWidth", "totalHeightCm"]
        },
        firingAdvice: { 
          type: Type.STRING, 
          description: "Fabrication instructions, extrusion temperature tolerances, corrugation slotting specifications, and adhesive setting seconds." 
        },
        historicalPrecedents: { 
          type: Type.STRING, 
          description: "Logistical and load-distribution history (e.g., standard Eurorack pellet stack sizing, high-humidity coastal Kerala shelf-life specs)." 
        },
        priceEstimate: { 
          type: Type.INTEGER, 
          description: "Tailored custom wholesale estimate in USD ($150 to $3200)." 
        }
      },
      required: [
        "title", 
        "tagline", 
        "narrative", 
        "suggestedClay", 
        "suggestedGlaze", 
        "shapeParameters", 
        "firingAdvice", 
        "historicalPrecedents", 
        "priceEstimate"
      ]
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Design an exquisite piece of contemporary household article inspired by this inspiration brief: "${prompt}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: ceramicSchema,
        temperature: 0.82
      }
    });

    const parsedData = JSON.parse(response.text || '{}');
    res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini API Error in /api/generate-ceramic:", error);
    res.status(500).json({ 
      error: error.message || "An unexpected error occurred during creative spec generation.",
      needsApiKey: !process.env.GEMINI_API_KEY
    });
  }
});

// App environment configurations
async function start() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting developer express server with Vite integration...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting production express server serving dist folder...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Prime Agency Server active at http://0.0.0.0:${PORT}`);
  });
}

start();
