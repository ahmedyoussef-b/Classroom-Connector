// src/lib/ai-actions.ts
'use server';

import { personalizedLearningAmbitionDisplay } from "@/ai/flows/personalized-learning-ambition-display";
import type { PersonalizedLearningAmbitionInput } from "@/ai/flows/personalized-learning-ambition-display";

/**
 * Server action to generate personalized content for a student.
 * This acts as a safe bridge between the client component and the server-side Genkit flow.
 * @param input - The input data for the personalized learning ambition flow.
 * @returns The result from the personalized learning ambition flow.
 */
export async function generatePersonalizedContent(input: PersonalizedLearningAmbitionInput) {
  const result = await personalizedLearningAmbitionDisplay(input);
  return result;
}
