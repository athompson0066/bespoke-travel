
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
    console.error("Error: VITE_GEMINI_API_KEY is not defined in the environment.");
    process.exit(1);
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

const modelsToTest = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-flash-latest",
    "gemini-2.0-flash-001",
    "gemini-2.0-flash-lite-001",
    "gemini-2.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash"
];

const testModel = async (modelName) => {
    console.log(`Testing model: ${modelName}...`);
    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: "Hello",
        });
        console.log(`✅ SUCCESS: ${modelName}`);
        return true;
    } catch (error) {
        console.log(`❌ FAILED: ${modelName} - ${error.message || error}`);
        if (error.status) console.log(`   Status: ${error.status}`);
        return false;
    }
};

const run = async () => {
    for (const model of models) {
        const success = await testModel(model);
        if (success) {
            console.log(`\n🎉 Found working model: ${model}`);
            // We could stop here, or test all to see options. Let's stop to be fast.
            process.exit(0);
        }
    }
    console.log("\n😭 No working models found.");
    process.exit(1);
};

const models = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-flash-latest",
    "gemini-2.0-flash-001",
    "gemini-2.0-flash-lite-001",
    "gemini-2.5-flash",
    "gemini-1.5-flash"
];

run();
