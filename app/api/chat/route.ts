import { NextRequest, NextResponse } from "next/server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  // get prompt field from the request body
  const reqBody = await req.json();
  const { userPrompt } = reqBody;
  
  // Add environmental education context to the prompt
  const environmentalContext = `You are EcoChat, an AI assistant specialized in environmental education and sustainability. 
  Focus on topics like climate change, renewable energy, waste management, water conservation, biodiversity, 
  sustainable living practices, and environmental science. Provide practical, actionable advice aligned with 
  UN Sustainable Development Goals and India's environmental policies. Always encourage eco-friendly behaviors 
  and real-world environmental action.
  
  User Question: `;
  
  const prompt = environmentalContext + userPrompt;
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);
  const model = genAI.getGenerativeModel({
    model: "gemini-pro",
    generationConfig: { maxOutputTokens: 5000 },
  });

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return NextResponse.json({
      text,
    });
  } catch (error) {
    return NextResponse.json({
      text: "Unable to process the prompt. Please try again.",
    });
  }
}
