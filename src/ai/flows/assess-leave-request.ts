'use server';

/**
 * @fileOverview An AI agent that assesses a staff member's leave request.
 *
 * - assessLeaveRequest - A function that handles the leave assessment.
 * - AssessLeaveRequestInput - The input type for the function.
 * - AssessLeaveRequestOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { staffData, projectData } from '@/lib/data';
import { z } from 'genkit';

const AssessLeaveRequestInputSchema = z.object({
  staffId: z.string().describe('The ID of the staff member requesting leave.'),
  leaveType: z.enum(['sick', 'vacation', 'personal']).describe('The type of leave being requested.'),
  leaveDays: z.number().positive().describe('The number of days being requested for leave.'),
});
export type AssessLeaveRequestInput = z.infer<typeof AssessLeaveRequestInputSchema>;

const AssessLeaveRequestOutputSchema = z.object({
  isEligible: z.boolean().describe('Whether the staff member is eligible for the requested leave.'),
  eligibilityReason: z.string().describe('An explanation of why the staff member is or is not eligible.'),
  projectImpact: z.string().describe('An analysis of the impact the staff member\'s absence will have on their projects.'),
});
export type AssessLeaveRequestOutput = z.infer<typeof AssessLeaveRequestOutputSchema>;

export async function assessLeaveRequest(input: AssessLeaveRequestInput): Promise<AssessLeaveRequestOutput> {
  return assessLeaveRequestFlow(input);
}

const assessLeaveRequestPrompt = ai.definePrompt({
  name: 'assessLeaveRequestPrompt',
  input: {
    schema: z.object({
      staffName: z.string(),
      leaveType: z.string(),
      leaveDays: z.number(),
      remainingLeave: z.number(),
      projects: z.array(z.object({
        name: z.string(),
        role: z.string(),
        allocation: z.number(),
      })),
    })
  },
  output: { schema: AssessLeaveRequestOutputSchema },
  prompt: `You are an expert HR and Project Management assistant. A staff member has requested leave.

Staff Member: {{staffName}}
Leave Request: {{leaveDays}} day(s) of {{leaveType}} leave.
Remaining {{leaveType}} leave balance: {{remainingLeave}} days.
Assigned Projects:
{{#each projects}}
- Project: {{name}}, Role: {{role}}, Allocation: {{allocation}}%
{{else}}
- Not assigned to any active projects.
{{/each}}

1.  **Eligibility**: First, determine if the staff member is eligible. They are eligible if their remaining leave balance is greater than or equal to the requested leave days. Provide a clear reason for the eligibility status in 'eligibilityReason'.

2.  **Project Impact**: Analyze the impact of this absence on their assigned projects. Consider their role and allocation percentage. If they are a lead on a critical project with high allocation, the impact is high. If they have a minor role or low allocation, the impact is lower. If they are on no projects, there is no impact. Summarize this analysis in the 'projectImpact' field.

Provide the result in the requested JSON format.
`,
});

const assessLeaveRequestFlow = ai.defineFlow(
  {
    name: 'assessLeaveRequestFlow',
    inputSchema: AssessLeaveRequestInputSchema,
    outputSchema: AssessLeaveRequestOutputSchema,
  },
  async ({ staffId, leaveType, leaveDays }) => {
    const staffMember = staffData.find((s) => s.id === staffId);
    if (!staffMember) {
      throw new Error('Staff member not found');
    }

    const leaveBalance = staffMember.leave[leaveType];
    const remainingLeave = leaveBalance.entitled - leaveBalance.taken;
    
    const assignedProjects = projectData.reduce((acc, project) => {
        const assignment = project.resources.teamMembers.find(m => m.userId === staffId);
        if (assignment) {
            acc.push({
                name: project.name,
                role: assignment.role,
                allocation: assignment.allocation,
            });
        }
        return acc;
    }, [] as {name: string, role: string, allocation: number}[]);

    const promptInput = {
      staffName: staffMember.name,
      leaveType,
      leaveDays,
      remainingLeave,
      projects: assignedProjects,
    };

    const { output } = await assessLeaveRequestPrompt(promptInput);
    return output!;
  }
);
