import { GoogleGenAI } from '@google/genai';
import { getApiKey } from './config.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let aiInstance = null;
let chatSession = null;

/**
 * Initializes the AI instance using the API key from config.
 */
export const initializeAI = () => {
    if (!aiInstance) {
        const apiKey = getApiKey();
        if (!apiKey) throw new Error("API key is missing.");
        aiInstance = new GoogleGenAI({ apiKey });
    }
    return aiInstance;
};

/**
 * Loads system instructions from file, prioritizing system.ixt.txt over instruction.txt.
 * Includes sanitization to remove BOM and white space.
 */
const loadSystemInstruction = () => {
    const systemIxtPath = path.join(__dirname, '..', 'system.ixt.txt');
    const instructionPath = path.join(__dirname, '..', 'instruction.txt');

    try {
        let content = "";
        if (fs.existsSync(systemIxtPath)) {
            content = fs.readFileSync(systemIxtPath, 'utf8');
            // Remove UTF-8 BOM if present
            if (content.charCodeAt(0) === 0xFEFF) {
                content = content.slice(1);
            }
            console.log(`[AI Engine] Loaded system.ixt.txt (${content.length} characters)`);
            return content.trim();
        }
        if (fs.existsSync(instructionPath)) {
            content = fs.readFileSync(instructionPath, 'utf8');
            console.log(`[AI Engine] Loaded instruction.txt (${content.length} characters)`);
            return content.trim();
        }
    } catch (err) {
        console.warn("[AI Engine] Failed to load custom instructions. Using fallback.", err.message);
    }

    return "You are an elite, autonomous CLI research agent. Response format: Markdown.";
};

/**
 * Generates research or answers a query using a persistent chat session.
 * Uses @google/genai SDK patterns.
 */
export const generateResearch = async (query) => {
    const ai = initializeAI();
    
    // Initialize session if it doesn't exist
    if (!chatSession) {
        const systemInstruction = loadSystemInstruction();
        
        console.log(`[AI Engine] Initializing new chat session with model: gemini-2.0-flash`);
        
        chatSession = ai.chats.create({
            model: 'gemini-2.0-flash',
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.1, // Lower temperature for more consistent persona adherence
            }
        });
    }

    try {
        const response = await chatSession.sendMessage({
            message: query
        });

        if (!response || !response.text) {
             throw new Error("Empty response from AI.");
        }

        return response.text;
    } catch (error) {
        if (error.message.includes("SAFETY") || error.message.includes("blocked")) {
             return `[AI Status: Refusal] Safety barrier triggered. Details: ${error.message}`;
        }
        
        // Clear session on fatal error to allow fresh initialization next time
        chatSession = null;
        throw error;
    }
};
