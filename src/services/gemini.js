// src/services/gemini.js
import { GoogleGenAI } from '@google/genai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize the SDK. We use a simple check to ensure it doesn't crash if the key is missing initially.
export const ai = new GoogleGenAI(API_KEY ? { apiKey: API_KEY } : {});

// Configuration for consistent JSON output when we need structured data
const jsonConfig = {
    responseMimeType: 'application/json',
};

/**
 * Generate a visual representation of the persona using Google GenAI (Imagen 3).
 */
export async function generatePOVImage(scenario) {
    if (!API_KEY) throw new Error("Missing VITE_GEMINI_API_KEY");

    const prompt = `A highly realistic, cinematic first-person point-of-view eye-level photo of the following person looking directly into the camera lens: 
    Person: ${scenario.persona.demographic}, dressed as a ${scenario.persona.role}. They look ${scenario.persona.mood}.
    Setting: They are physically located at: ${scenario.context.location}.
    Lighting: Natural, cinematic, high quality 4k portrait photography. Shallow depth of field.`;

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-001',
            prompt: prompt,
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '1:1'
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            // The v1.43 SDK returns bytes directly in image.imageBytes
            const base64Bytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64Bytes}`;
        }
        return null;
    } catch (e) {
        console.error("Failed to generate POV Image:", e);
        return null; // Graceful fallback to the mic icon if Imagen fails or quota is hit
    }
}

export async function generateScenario(difficulty = 'easy', userIdea = '', founderName = 'The Founder', customCharacter = '', customEnvironment = '') {
    if (!API_KEY) throw new Error("Missing VITE_GEMINI_API_KEY in environment variables.");

    const model = "gemini-2.5-flash"; // Fast and cheap for structuring

    let difficultyGuidelines = "";
    if (difficulty === 'easy') {
        difficultyGuidelines = "The persona should be friendly, easily impressed, and forgiving. Example: A supportive relative, an enthusiastic early adopter tech friend.";
    } else if (difficulty === 'medium') {
        difficultyGuidelines = "The persona should be realistic, asking standard business/product questions. Expects clarity. Example: A mid-tier Angel Investor, a cautious B2B customer.";
    } else {
        difficultyGuidelines = "The persona is hardcore, impatient, highly skeptical, and looks for reasons to say no. They will interrupt and challenge assumptions heavily. Example: A top-tier Tier 1 VC partner, an angry enterprise procurement officer.";
    }

    const prompt = `
    You are an expert startup advisor and roleplay generator. 
    The user is a founder pitching this idea (if provided, otherwise assume a blank slate): "${userIdea}"
    The founder's name is: "${founderName}"
    
    ${customCharacter ? `Specific Character Requested: The persona MUST be exactly or heavily based on this description: "${customCharacter}"` : ''}
    ${customEnvironment ? `Specific Location Requested: The interaction MUST take place exactly here: "${customEnvironment}"` : ''}

    Generate a highly realistic, specific, and slightly unpredictable roleplay scenario. 
    ${difficultyGuidelines}

    Based on the demographic and gender you decide for this persona, you MUST assign them exactly one of the following voice IDs from our database that best matches their vibe. 
    CRITICAL: You MUST pick a **FEMALE** voice ID for a Female persona, and a **MALE** voice ID for a Male persona! Do not mix genders:
    - "VlQRLHkc5IdFj7o0atT1" (Misa - calm, gentle, serene, Female)
    - "uIZsnBL0YK1S5j69bAih" (Samantha - emotional, soft, intimate, Female)
    - "Bg4N75kZgwrthztCKskg" (Ginger - Energetic, friendly, clear, Female)
    - "u7bRcYbD7visSINTyAT8" (Rahul - Indian, energetic, clear, Male)
    - "AeRdCCKzvd23BpJoofzx" (Nathaniel - British, engaging and calm, Male)
    - "wWWn96OtTHu1sn8SRGEr" (Hale - American, expressive, emotive, deep, Male)

    Return a JSON object with the following structure. These details will be used to generate a real-time reactive video avatar, so be highly specific about their appearance and temperament:
    {
      "persona": {
        "name": "String (e.g., 'Aunt Linda', 'Marcus from Sequoia')",
        "role": "String (e.g., 'Skeptical Relative', 'Aggressive VC')",
        "attitude": "String (e.g., 'Impatient but polite', 'Warm and clueless')",
        "background": "String (A 2 sentence secret background the AI knows to inform its behavior)",
        "mood": "String (e.g., 'Stressed', 'Curious', 'Bored', 'Hostile')",
        "demographic": "String (e.g., 'Late 40s, sharp suit', 'Early 20s, casual hoodie')",
        "knowledgeLevel": "String (e.g., 'Expert in B2B SaaS', 'Thinks AI is just ChatGPT')",
        "voiceId": "String (Exactly one of the specific 6 alphanumeric voice IDs listed above)"
      },
      "context": {
        "location": "String (e.g., 'A loud Starbucks', 'A formal boardroom', 'Thanksgiving dinner table')",
        "timeLimit": "String (e.g., '3 minutes before their train leaves', 'A standard 30 min meeting')",
        "setup": "String (A 1-2 sentence description of how the interaction starts. e.g. 'You just bumped into them while getting coffee.')"
      }
    }
  `;

    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: jsonConfig,
    });

    try {
        let textResponse = response.text;
        if (typeof textResponse === 'object') return textResponse;
        textResponse = textResponse.replace(/^```json\n|\n```$/g, '').trim();
        return JSON.parse(textResponse);
    } catch (e) {
        console.error("Failed to parse Gemini scenario response", e);
        return null;
    }
}

/**
 * Generate a random, slightly challenging startup idea for the user to pitch.
 */
export async function generateRandomIdea() {
    if (!API_KEY) throw new Error("Missing VITE_GEMINI_API_KEY in environment variables.");

    const prompt = `
    You are a startup idea generator. 
    Generate a concise, slightly provocative, or highly technical "MVP idea" that would be challenging but fun to pitch to an investor or customer.

    Return a JSON object with this structure:
    {
      "name": "String (Catchy startup name)",
      "tagline": "String (Short 1 sentence description)",
      "problem": "String (The specific problem it solves)"
    }
  `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: jsonConfig,
    });

    try {
        let textResponse = response.text;
        if (typeof textResponse === 'object') return textResponse;
        textResponse = textResponse.replace(/^```json\n|\n```$/g, '').trim();
        return JSON.parse(textResponse);
    } catch (e) {
        console.error("Failed to parse random idea", e);
        return null;
    }
}

/**
 * Get the initial opening line from the AI persona.
 */
export async function getOpeningLine(scenario, founderName) {
    if (!API_KEY) throw new Error("Missing VITE_GEMINI_API_KEY");

    const prompt = `
    You are roleplaying as: ${scenario.persona.name} (${scenario.persona.role}).
    Your attitude is: ${scenario.persona.attitude}.
    Your background: ${scenario.persona.background}.
    You are currently at: ${scenario.context.location}.
    Setup: ${scenario.context.setup}
    The founder talking to you is named: ${founderName}

    Provide your INITIAL OPENING line to the founder. Keep it short, highly realistic, and in character. Do not break character. 
    DO NOT output any narration or asterisks (*). ONLY output the exact words you are speaking out loud.
    (e.g., if you are in a rush at a coffee shop: "Hey, sorry I'm late, I have a hard stop in 5 mins. What did you want to show me?")
   `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return response.text.replace(/\*/g, '').trim();
}

/**
 * Chat with the persona.
 */
export async function sendChatMessage(scenario, chatHistory, newUserMessage, founderName) {
    if (!API_KEY) throw new Error("Missing VITE_GEMINI_API_KEY");

    // Build the system instructions implicitly by prepending context to the history for the model
    const systemPrompt = `
      You are roleplaying as: ${scenario.persona.name} (${scenario.persona.role}).
      Your attitude is: ${scenario.persona.attitude}.
      Your background secret: ${scenario.persona.background}.
      You are currently at: ${scenario.context.location}.
      The founder speaking to you is named: ${founderName}
      
      CRITICAL RULES:
      1. NEVER break character. You are a real person in this physical location.
      2. Respond naturally to the founder's pitch.
      3. If your attitude is aggressive, push back hard on their assumptions. 
      4. Keep responses conversational, concise, and realistic. Do not give long monologues unless asked.
      5. DO NOT assume you know the founder's name unless they told you OR if it naturally fits the context (like a pre-scheduled meeting). Do not say "[Founder Name]", if you use a name, use "${founderName}".
      6. DO NOT output any narration (e.g. "*I look at my watch*"). DO NOT use asterisks (*). ONLY output the exact words you are speaking out loud.
      7. If they fail to explain the value clearly within a few turns, lose interest.
    `;

    // Construct the formatted history for the new SDK
    const contents = [
        { role: "user", parts: [{ text: `SYSTEM INSTRUCTIONS (DO NOT REPLY TO THIS): ${systemPrompt}` }] },
        { role: "model", parts: [{ text: "Understood. I will begin the roleplay now and never break character." }] }
    ];

    // Push existing history
    for (const msg of chatHistory) {
        contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        });
    }

    // Push the newest message
    contents.push({
        role: "user",
        parts: [{ text: newUserMessage }]
    });

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash", // Flash provides much lower latency for real-time voice conversations
        contents: contents,
    });

    return response.text.replace(/\*/g, '').trim();
}

/**
 * Evaluate the pitch using the Mom Test and general heuristics, plus specific goal evaluation.
 */
export async function evaluatePitch(scenario, chatHistory, userGoal = "") {
    if (!API_KEY) throw new Error("Missing VITE_GEMINI_API_KEY");

    // Format the transcript
    const transcript = chatHistory.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');

    let goalPrompt = "";
    if (userGoal && userGoal.trim() !== "") {
        goalPrompt = `\n4. Goal Achievement (The user's specific goal for this conversation was: "${userGoal}". Did they achieve it? If so, why? If not, why?)\n`;
    }

    const prompt = `
    You are an expert startup advisor and coach evaluating a founder's pitch performance.
    They just pitched to: ${scenario.persona.name} (${scenario.persona.role}) in a simulated roleplay.

    Evaluate their performance based on:
    1. "The Mom Test" framework (Did they ask about past behavior instead of future intent? Did they talk too much about their idea instead of the customer's problem? Did they seek compliments instead of facts?)
    2. Clarity of Value Proposition (Was it easy to understand what they actually do?)
    3. Handling Objections (Did they stay calm? Did they pivot well when challenged?)${goalPrompt}
    
    CRITICAL: You must generate 3 custom scoring metrics specifically tailored to the persona they pitched to (${scenario.persona.role}). 
    For example, if it's an Investor, metrics might be: "Market Conviction", "Traction Proof", "Risk Mitigation". If it's a Customer: "Problem Validation", "Feature Resonance", "Urgency". Give each metric a name and a score out of 100 based on their performance.

    Here is the transcript of the interaction:
    ----
    ${transcript}
    ----

    Return a JSON object with this exact structure:
    {
      "score": Number (0 to 100),
      "dynamicMetrics": [
         { "metricName": "String", "score": Number },
         { "metricName": "String", "score": Number },
         { "metricName": "String", "score": Number }
      ],
      "summary": "String (1-2 sentence overall summary)",
      "momTestAnalysis": {
        "passed": Boolean,
        "feedback": "String (Specific feedback relating to Mom Test principles)"
      },
      "strengths": ["String", "String"],
      "areasForImprovement": ["String", "String"],
      "goalAnalysis": "String (Feedback on whether they hit their specific goal, or 'No specific goal provided' if not applicable)",
      "keyTakeaway": "String (One crucial piece of advice for their next pitch)"
    }
  `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: jsonConfig
    });

    try {
        let textResponse = response.text;
        if (typeof textResponse === 'object') return textResponse;
        textResponse = textResponse.replace(/^```json\n|\n```$/g, '').trim();
        return JSON.parse(textResponse);
    } catch (e) {
        console.error("Failed to parse evaluation", e);
        return null;
    }
}

/**
 * Generate highly realistic speech using ElevenLabs API.
 */
export async function generateSpeech(text, persona, isNarration = false) {
    // The user put it in ELEVENLABS_API_KEY without VITE_ prefix.
    const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || import.meta.env.ELEVENLABS_API_KEY;

    if (!ELEVENLABS_API_KEY) {
        console.warn("Missing VITE_ELEVENLABS_API_KEY, falling back to browser speech.");
        return null; // Signals the frontend to fallback to low-q Web Speech API
    }

    let voiceId = persona.voiceId || "VlQRLHkc5IdFj7o0atT1"; // Default to Misa if missed

    // Emergency Gender Enforcement: Gemini sometimes hallucinates a Male voice ID for a Female character.
    const demoString = persona.demographic?.toLowerCase() || '';
    const isFemale = /\b(female|woman|lady|girl|aunt|jen|mom|sister)\b/.test(demoString) || /\b(jen|sarah|linda|misa|samantha|ginger)\b/.test(persona.name?.toLowerCase() || '');
    const isMale = /\b(male|man|guy|boy|uncle|dad|brother)\b/.test(demoString) || /\b(rahul|nathaniel|hale|adam|george)\b/.test(persona.name?.toLowerCase() || '');

    const femaleVoiceIds = ["VlQRLHkc5IdFj7o0atT1", "uIZsnBL0YK1S5j69bAih", "Bg4N75kZgwrthztCKskg"];
    const maleVoiceIds = ["u7bRcYbD7visSINTyAT8", "AeRdCCKzvd23BpJoofzx", "wWWn96OtTHu1sn8SRGEr"];

    if (isFemale && !femaleVoiceIds.includes(voiceId)) {
        voiceId = "VlQRLHkc5IdFj7o0atT1"; // Force Misa
    } else if (isMale && !maleVoiceIds.includes(voiceId)) {
        voiceId = "u7bRcYbD7visSINTyAT8"; // Force Rahul
    }

    if (isNarration) {
        // Use a distinct, steady narrator voice (e.g. George - 'Warm, Captivating Storyteller')
        voiceId = "JBFqnCBsd6RMkjVDRZzb";
    }

    try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': ELEVENLABS_API_KEY
            },
            body: JSON.stringify({
                text: text,
                model_id: "eleven_multilingual_v2",
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75
                }
            })
        });

        if (!response.ok) {
            throw new Error(`ElevenLabs API error: ${response.status}`);
        }

        const audioBlob = await response.blob();
        return URL.createObjectURL(audioBlob);
    } catch (e) {
        console.error("ElevenLabs speech generation failed:", e);
        return null;
    }
}

// Generate the final Veo video prompt based on the entire conversation
export async function generateVeoPrompt(scenario, chatHistory, founderName, founderGender) {
    try {
        const textLog = chatHistory.map(msg => `${msg.role === 'model' ? scenario.persona.name : 'User'}: ${msg.content}`).join('\n');

        const prompt = `
        You are an expert film director and AI video generation prompt engineer.
        I will give you the underlying context of a roleplay pitch and the chat log.
        Your job is to generate ONE highly detailed, visual-only cinematic prompt suitable for the Google Veo 2.0 video generation model.
        
        The video MUST be from a first-person Point-of-View (POV).
        The camera is the "User" (who is explicitly a ${founderGender}), looking directly at the character (${scenario.persona.name}).
        Only the character should be visible in the frame, reacting naturally to what the unseen user is saying off-camera based on the tone of the chat log. 
        Describe the environment visually based on: ${scenario.context.location} and ${scenario.context.physicalDetails}.
        Describe the character visually based on their demographic: ${scenario.persona.demographic} and role: ${scenario.persona.role}.
        The character should convey a mood that matches how the conversation went: ${scenario.persona.mood}.
        
        Do not include audio instructions or dialogue. Just visual instructions: lighting, camera angle, character expressions, subtle ambient background movements.
        Keep the final output under 100 words. Return ONLY the string prompt, no markdown or intro text.
        
        Chat Log:
        ${textLog}
        `;

        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: "You generate raw, highly detailed cinematic video prompts. You output ONLY the text of the prompt."
            }
        });

        return result.text.trim();
    } catch (e) {
        console.error("Veo prompt generation failed:", e);
        return `A cinematic, realistic first-person POV shot of ${scenario.persona.name} in ${scenario.context.location}, actively listening and reacting. Highly detailed.`;
    }
}
