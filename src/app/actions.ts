
'use server';

import { extractSkillsFromResume } from '@/ai/flows/extract-skills-from-resume';
import { extractInfoFromResume } from '@/ai/flows/extract-info-from-resume';
import { calculateProjectFitScore } from '@/ai/flows/calculate-project-fit-score';
import { z } from 'zod';
import { staffData } from './lib/data';

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

