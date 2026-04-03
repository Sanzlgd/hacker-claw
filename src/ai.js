import { GoogleGenAI } from '@google/genai';
import { getApiKey } from './config.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let aiInstance = null;

export const initializeAI = () => {
    if (!aiInstance) {
        const apiKey = getApiKey();
        if (!apiKey) throw new Error("API key is missing.");
        aiInstance = new GoogleGenAI({ apiKey });
    }
    return aiInstance;
};

export const generateResearch = async (query) => {
    const ai = initializeAI();
    
    // Default fallback instruction
    let systemInstruction = "You are an elite, autonomous CLI research agent. Your purpose is to provide deep, technically accurate, and highly structured answers directly to a developer's terminal. Strictly follow these rules: 1. Tone: Professional, direct, concise, and hacker-esque. Cut the fluff. 2. Formatting: Output responses in clean Markdown. 3. Depth: Break topics down logically (Overview, Core Mechanics, Step-by-Step). 4. Identity: Never break character.";

    // Override with custom instruction from instruction.txt if it exists
    const customInstructionPath = path.join(__dirname, '..', 'instruction.txt');
    try {
        if (fs.existsSync(customInstructionPath)) {
            systemInstruction = fs.readFileSync(customInstructionPath, 'utf8');
        }
    } catch (err) {
        console.error("Failed to read system instructions file:", err.message);
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: query,
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.3
        }
    });

    return response.text;
};
