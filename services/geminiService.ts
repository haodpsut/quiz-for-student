
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Question, Quiz, ApiConfig, Provider } from '../types';

// NOTE: This service is architected for Gemini. OpenRouter calls would need a different SDK/fetch implementation.
// The ApiConfig is passed to show how it *would* be used, but only the geminiKey is currently active.

function getApiKey(apiConfig: ApiConfig): string {
    if (apiConfig.provider === Provider.Gemini) {
        return apiConfig.geminiKey;
    }
    // In a real OpenRouter implementation, you'd use the OpenRouter key.
    // For this example, we will stick to the Gemini SDK.
    return apiConfig.geminiKey; 
}

export const generateQuiz = async (subject: string, apiConfig: ApiConfig): Promise<Quiz> => {
    const apiKey = getApiKey(apiConfig);
    if (!apiKey) throw new Error("API Key not found.");
    
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Generate a 5-question quiz about "${subject}". The questions should be suitable for an undergraduate IT student. For each question, provide the question text, 4 options in an array, and specify the correct answer text. The question type should be 'multiple-choice'. Return the response as a JSON object.`;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            subject: { type: Type.STRING },
            questions: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.INTEGER },
                        question: { type: Type.STRING },
                        options: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        answer: { type: Type.STRING },
                        type: { type: Type.STRING }
                    },
                    required: ["id", "question", "options", "answer", "type"]
                }
            }
        },
        required: ["subject", "questions"]
    };

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash", 
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const text = response.text.trim();
        const quizData: Omit<Quiz, 'questions'> & { questions: Omit<Question, 'id'>[] } = JSON.parse(text);

        // Add IDs to questions as the model might not generate them reliably
        const questionsWithIds: Question[] = quizData.questions.map((q, index) => ({
            ...q,
            id: index,
            type: 'multiple-choice' // Enforce type
        }));
        
        return { ...quizData, questions: questionsWithIds };
    } catch (error) {
        console.error("Error generating quiz:", error);
        throw new Error("Failed to generate quiz. Check your API key and network connection.");
    }
};

export const checkAnswer = async (question: Question, userAnswer: string, apiConfig: ApiConfig): Promise<{ isCorrect: boolean; explanation: string; }> => {
    const apiKey = getApiKey(apiConfig);
    if (!apiKey) throw new Error("API Key not found.");

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `A student is answering a quiz question.
    Question: "${question.question}"
    Options: ${JSON.stringify(question.options)}
    The correct answer is: "${question.answer}"
    The student's submitted answer was: "${userAnswer}"

    Is the student's answer correct? Provide an explanation for why the correct answer is right. If the student was wrong, also explain why their answer is incorrect. Be encouraging.`;

     const responseSchema = {
        type: Type.OBJECT,
        properties: {
            isCorrect: { type: Type.BOOLEAN },
            explanation: { type: Type.STRING }
        },
        required: ["isCorrect", "explanation"]
    };

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        const text = response.text.trim();
        return JSON.parse(text);
    } catch (error) {
        console.error("Error checking answer:", error);
        throw new Error("Failed to get feedback for the answer.");
    }
};

export const getExplanation = async (context: { question: string; answer: string; }, studentQuery: string, apiConfig: ApiConfig): Promise<string> => {
    const apiKey = getApiKey(apiConfig);
    if (!apiKey) throw new Error("API Key not found.");

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are an expert AI tutor for university IT students.
    A student needs help understanding a concept from a quiz.
    
    Original Quiz Question: "${context.question}"
    The Correct Answer Was: "${context.answer}"

    The student is now asking: "${studentQuery}"

    Please provide a clear, detailed, and helpful explanation to answer the student's question. Address their query directly and break down complex topics into simple terms.`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error getting explanation:", error);
        throw new Error("Failed to get an explanation.");
    }
};
