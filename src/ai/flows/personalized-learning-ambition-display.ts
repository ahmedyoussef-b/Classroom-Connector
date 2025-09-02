// src/ai/flows/personalized-learning-ambition-display.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a personalized learning page based on a student's career ambitions.
 *
 * The flow takes a student's profile information, including their career ambitions, and uses an LLM to generate
 * content and resources relevant to their chosen field. The output is a JSON object containing the personalized content.
 *
 * @interface PersonalizedLearningAmbitionInput - The input schema for the personalized learning ambition flow.
 * @interface PersonalizedLearningAmbitionOutput - The output schema for the personalized learning ambition flow.
 * @function personalizedLearningAmbitionDisplay - The main function that triggers the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedLearningAmbitionInputSchema = z.object({
  studentId: z.string().describe('The unique identifier for the student.'),
  careerAmbitions: z
    .string()
    .describe(
      'A description of the student\'s career ambitions and interests.'
    ),
  name: z.string().describe('The name of the student.'),
});
export type PersonalizedLearningAmbitionInput = z.infer<
  typeof PersonalizedLearningAmbitionInputSchema
>;

const PersonalizedLearningAmbitionOutputSchema = z.object({
  personalizedContent: z
    .string()
    .describe(
      'Personalized content for the student, including relevant information, graphics, and resources related to their career ambitions.'
    ),
});

export type PersonalizedLearningAmbitionOutput = z.infer<
  typeof PersonalizedLearningAmbitionOutputSchema
>;

export async function personalizedLearningAmbitionDisplay(
  input: PersonalizedLearningAmbitionInput
): Promise<PersonalizedLearningAmbitionOutput> {
  return personalizedLearningAmbitionFlow(input);
}

const personalizedLearningAmbitionPrompt = ai.definePrompt({
  name: 'personalizedLearningAmbitionPrompt',
  input: {schema: PersonalizedLearningAmbitionInputSchema},
  output: {schema: PersonalizedLearningAmbitionOutputSchema},
  prompt: `You are an AI assistant designed to create personalized learning experiences for students.

  Based on the student's career ambitions, generate personalized content including relevant information, graphics, and resources.

  Student Name: {{{name}}}
  Student Career Ambitions: {{{careerAmbitions}}}
  Student ID: {{{studentId}}}

  Create personalized content that would be displayed on the student's page when they log in.  This should be in markdown format.  Include links to external resources that would be helpful to the student.
  `,
});

const personalizedLearningAmbitionFlow = ai.defineFlow(
  {
    name: 'personalizedLearningAmbitionFlow',
    inputSchema: PersonalizedLearningAmbitionInputSchema,
    outputSchema: PersonalizedLearningAmbitionOutputSchema,
  },
  async input => {
    const {output} = await personalizedLearningAmbitionPrompt(input);
    return output!;
  }
);
