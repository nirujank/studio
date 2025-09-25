
'use server';

import { extractSkillsFromResume } from '@/ai/flows/extract-skills-from-resume';
import { extractInfoFromResume } from '@/ai/flows/extract-info-from-resume';
import { calculateProjectFitScore } from '@/ai/flows/calculate-project-fit-score';
import { extractProjectInfoFromBrd } from '@/ai/flows/extract-project-info-from-brd';
import { assessLeaveRequest } from '@/ai/flows/assess-leave-request';
import { z } from 'zod';
import { staffData, projectData } from '@/lib/data';
import { differenceInDays } from 'date-fns';

const skillsSchema = z.object({
  resume: z.any(),
});

type SkillsState = {
  skills?: string[];
  error?: string;
};

export async function extractSkillsAction(
  prevState: SkillsState,
  formData: FormData
): Promise<SkillsState> {
  try {
    const validatedFields = skillsSchema.safeParse({
      resume: formData.get('resume'),
    });

    if (!validatedFields.success) {
      return { error: 'Invalid resume file.' };
    }
    
    const file = formData.get('resume') as File;
    if (!file || file.size === 0) {
      return { error: 'Please upload a resume file.' };
    }

    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    const result = await extractSkillsFromResume({
      resumeDataUri: dataUri,
    });
    
    if (result.skills && result.skills.length > 0) {
      return { skills: result.skills };
    } else {
      return { error: "Couldn't extract any skills. Try a different file." };
    }
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}


const infoSchema = z.object({
  resume: z.any(),
});


export type InfoState = {
  data?: any;
  error?: string;
};

export async function extractInfoAction(
  prevState: InfoState,
  formData: FormData
): Promise<InfoState> {
  try {
    const validatedFields = infoSchema.safeParse({
      resume: formData.get('resume'),
    });

    if (!validatedFields.success) {
      return { error: 'Invalid resume file.' };
    }
    
    const file = formData.get('resume') as File;
    if (!file || file.size === 0) {
      return { error: 'Please upload a resume file.' };
    }

    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    const result = await extractInfoFromResume({
      resumeDataUri: dataUri,
    });
    
    if (result) {
      return { data: result };
    } else {
      return { error: "Couldn't extract any information. Try a different file." };
    }
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}

const fitScoreSchema = z.object({
  userId: z.string(),
  projectTechStack: z.array(z.string()),
});

export async function getFitScoreAction(
  userId: string,
  projectTechStack: string[]
) {
   try {
    const validatedFields = fitScoreSchema.safeParse({
      userId,
      projectTechStack,
    });

    if (!validatedFields.success) {
      return { error: 'Invalid input for fit score.' };
    }

    const staffMember = staffData.find(s => s.id === userId);
    if (!staffMember) {
      return { error: 'Staff member not found.' };
    }
    
    const result = await calculateProjectFitScore({
      projectTechStack,
      staffSkills: staffMember.profile.skills || [],
    });

    return { data: result };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred while calculating the fit score.' };
  }
}


const projectInfoSchema = z.object({
  brd: z.any(),
});

export type ProjectInfoState = {
  data?: any;
  error?: string;
};

export async function extractProjectInfoAction(
  prevState: ProjectInfoState,
  formData: FormData
): Promise<ProjectInfoState> {
  try {
    const validatedFields = projectInfoSchema.safeParse({
      brd: formData.get('brd'),
    });

    if (!validatedFields.success) {
      return { error: 'Invalid BRD file.' };
    }
    
    const file = formData.get('brd') as File;
    if (!file || file.size === 0) {
      return { error: 'Please upload a BRD file.' };
    }

    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    const result = await extractProjectInfoFromBrd({
      brdDataUri: dataUri,
    });
    
    if (result) {
      return { data: result };
    } else {
      return { error: "Couldn't extract any information from the BRD. Try a different file." };
    }
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}

const leaveRequestSchema = z.object({
  staffId: z.string().min(1, 'Staff member is required.'),
  leaveType: z.enum(['sick', 'vacation', 'personal'], { required_error: 'Leave type is required.' }),
  startDate: z.string().min(1, 'Start date is required.'),
  endDate: z.string().min(1, 'End date is required.'),
}).refine(data => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date cannot be before start date.",
    path: ["endDate"],
});

export type LeaveRequestState = {
  data?: any;
  error?: string;
}

export async function assessLeaveRequestAction(prevState: LeaveRequestState, formData: FormData) : Promise<LeaveRequestState> {
  if (formData.get('reset')) {
    return { data: null, error: null };
  }
  
  try {
    const validatedFields = leaveRequestSchema.safeParse({
      staffId: formData.get('staffId'),
      leaveType: formData.get('leaveType'),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
    });
    
    if (!validatedFields.success) {
       const errors = validatedFields.error.flatten().fieldErrors;
       const errorMessage = Object.values(errors).flat().join(' ') || 'Invalid leave request data.';
      return { error: errorMessage };
    }

    const { staffId, leaveType, startDate, endDate } = validatedFields.data;
    
    const leaveDays = differenceInDays(new Date(endDate), new Date(startDate)) + 1;

    if (leaveDays <= 0) {
        return { error: 'Leave must be for at least one day.' };
    }

    const result = await assessLeaveRequest({ staffId, leaveType, leaveDays });

    if (result) {
      return { data: result };
    } else {
      return { error: "Couldn't assess the leave request." };
    }

  } catch(e) {
    console.error(e);
    return { error: 'An unexpected error occurred.' };
  }
}
