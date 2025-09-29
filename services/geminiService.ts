
import { GoogleGenAI, Type } from "@google/genai";
import { GenerationResult, LearningModule } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export async function generateTerraform(module: LearningModule, formData: Record<string, string>): Promise<GenerationResult> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const userDetails = Object.entries(formData)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');

  const prompt = `
    You are an expert AWS Terraform engineer and educator. A user wants to create an AWS ${module.title} with these details: ${userDetails}. Your task is to generate a JSON object with two keys: "code" and "explanation".

    1.  "code": A complete and valid Terraform configuration file content ('main.tf') for the requested resource. The code must be a single, ready-to-use file. It must include the 'terraform' configuration block (specifying the required 'aws' provider), the 'provider "aws"' block (with a default region like "us-east-1"), followed by variable definitions for user-provided values, and then the resource block(s). The code must follow best practices and be well-commented.

    2.  "explanation": A clear, step-by-step explanation of the generated code for a Terraform beginner. Use markdown for formatting. Explain each block (terraform, provider, variables, resources), and each important attribute. Also, explain the core concepts related to this resource in AWS and Terraform. Keep it concise but comprehensive.
    `;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            code: {
              type: Type.STRING,
              description: 'The Terraform HCL code.',
            },
            explanation: {
              type: Type.STRING,
              description: 'The explanation of the code in markdown format.',
            },
          },
          required: ['code', 'explanation'],
        },
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    return result as GenerationResult;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate Terraform configuration. Please check the console for more details.");
  }
}
