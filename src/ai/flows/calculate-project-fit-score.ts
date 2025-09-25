'use server';

/**
 * @fileOverview An AI agent that calculates a fit score for a staff member based on project requirements.
 *
 * - calculateProjectFitScore - A function that handles the fit score calculation.
 * - CalculateProjectFitScoreInput - The input type for the function.
 * - CalculateProjectFitScoreOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateProjectFitScoreInputSchema = z.object({
  projectTechStack: z.array(z.string()).describe("A list of technologies required for the project (e.g., 'React', 'Node.js', 'AWS')."),
  staffSkills: z.array(z.string()).describe("A list of skills the staff member possesses."),
});
export type CalculateProjectFitScoreInput = z.infer<typeof CalculateProjectFitScoreInputSchema>;

const CalculateProjectFitScoreOutputSchema = z.object({
  fitScore: z.number().describe("A percentage score from 0 to 100 representing how well the staff member's skills match the project's tech stack."),
  explanation: z.string().describe("A brief explanation of the score, highlighting key matches and gaps."),
  matchingSkills: z.array(z.string()).describe("A list of skills that the staff member has which match the project requirements."),
  missingSkills: z.array(z.string()).describe("A list of required project skills that the staff member is missing."),
});
export type CalculateProjectFitScoreOutput = z.infer<typeof CalculateProjectFitScoreOutputSchema>;

export async function calculateProjectFitScore(input: CalculateProjectFitScoreInput): Promise<CalculateProjectFitScoreOutput> {
  return calculateProjectFitScoreFlow(input);
}

const calculateProjectFitScorePrompt = ai.definePrompt({
  name: 'calculateProjectFitScorePrompt',
  input: {schema: CalculateProjectFitScoreInputSchema},
  output: {schema: CalculateProjectFitScoreOutputSchema},
  prompt: `You are an expert HR and project management assistant. Your task is to analyze a staff member's skills against a project's required technical stack and provide a "fit score".

  Follow these steps:
  1. Compare the list of staff skills with the list of technologies required for the project.
  2. Calculate a 'fitScore' as a percentage. The score should be (number of matching skills / number of project technologies) * 100.
  3. Identify which skills from the project's tech stack the staff member has ('matchingSkills').
  4. Identify which skills from the project's tech stack the staff member does not have ('missingSkills').
  5. Write a brief 'explanation' summarizing the fit. For example: "Good fit, matching on 3 of 5 key technologies." or "Partial fit, key skills like React are missing."

  Project Tech Stack:
  {{#each projectTechStack}}
  - {{{this}}}
  {{/each}}

  Staff Member's Skills:
  {{#each staffSkills}}
  - {{{this}}}
  {{/each}}
  
  Provide the result in the requested JSON format.
  `, 
});

const calculateProjectFitScoreFlow = ai.defineFlow(
  {
    name: 'calculateProjectFitScoreFlow',
    inputSchema: CalculateProjectFitScoreInputSchema,
    outputSchema: CalculateProjectFitScoreOutputSchema,
  },
  async input => {
    // If there are no required skills, the fit is technically 100% as there's nothing to be missing.
    // Or if the staff has no skills, the fit is 0% unless no skills are required.
    if (input.projectTechStack.length === 0) {
      return {
        fitScore: 100,
        explanation: 'No specific tech stack defined for the project.',
        matchingSkills: [],
        missingSkills: [],
      };
    }
     if (input.staffSkills.length === 0) {
      return {
        fitScore: 0,
        explanation: 'Staff member has no skills listed.',
        matchingSkills: [],
        missingSkills: input.projectTechStack,
      };
    }

    const {output} = await calculateProjectFitScorePrompt(input);
    return output!;
  }
);
