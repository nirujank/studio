'use client';

import type { StaffMember, Tenant } from '@/lib/data';
import { tenantData } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import React, { useState, useCallback, useId } from 'react';
import { ResumeUploader } from './resume-uploader';
import type { ExtractInfoFromResumeOutput } from '@/ai/flows/extract-info-from-resume';
import { PlusCircle, Trash2 } from 'lucide-react';

type StaffFormProps = {
  staffMember?: StaffMember;
};

type EducationEntry = { id: string; degree: string; university: string; year?: number };
type ExperienceEntry = { id: string; position: string; company: string; startDate?: string; endDate?: string; summary?: string };

export function StaffForm({ staffMember }: StaffFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const isEditMode = !!staffMember;
  const uniqueId = useId();

  const [formData, setFormData] = useState({
    name: staffMember?.name || '',
    email: staffMember?.email || '',
    phone: staffMember?.profile.personal.phone || '',
    address: staffMember?.profile.personal.address || '',
    tenantId: staffMember?.tenantId || '',
    employmentCategory: staffMember?.employmentCategory || '',
    category: staffMember?.category || '',
    homeOffice: staffMember?.homeOffice || '',
    contractualOffice: staffMember?.contractualOffice || '',
    region: staffMember?.region || '',
  });

  const [keySkills, setKeySkills] = useState<string[]>(staffMember?.profile.skills || []);
  const [techSkills, setTechSkills] = useState<string[]>([]); // Assuming no initial tech skills for simplicity
  const [education, setEducation] = useState<EducationEntry[]>(
    staffMember?.profile.education.map((e, i) => ({ ...e, id: `${uniqueId}-edu-${i}` })) || []
  );
  const [experience, setExperience] = useState<ExperienceEntry[]>(
    staffMember?.jobHistory.map((e, i) => ({ ...e, id: `${uniqueId}-exp-${i}` })) || []
  );

  const handleInfoExtracted = useCallback((info: ExtractInfoFromResumeOutput) => {
    setFormData((prev) => ({
      ...prev,
      name: info.personal?.name || prev.name,
      email: info.personal?.email || prev.email,
      phone: info.personal?.phone || prev.phone,
      address: info.personal?.address || prev.address,
    }));
    setKeySkills(info.skills?.keySkills || []);
    setTechSkills(info.skills?.techSkills || []);
    setEducation(info.education?.map((e, i) => ({ ...e, id: `${uniqueId}-edu-ext-${i}` })) || []);
    setExperience(info.experience?.map((e, i) => ({ ...e, id: `${uniqueId}-exp-ext-${i}` })) || []);

    toast({
      title: 'Information Extracted',
      description: 'The form has been populated with data from the resume.',
    });
  }, [toast, uniqueId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = useCallback((name: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSkillsChange = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setter(e.target.value.split(',').map(s => s.trim()));
  };

  const handleDynamicChange = <T extends { id: string }>(
    list: T[],
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    id: string,
    field: keyof Omit<T, 'id'>,
    value: string | number
  ) => {
    const newList = list.map(item => (item.id === id ? { ...item, [field]: value } : item));
    setter(newList);
  };

  const addDynamicEntry = <T extends { id: string }>(setter: React.Dispatch<React.SetStateAction<T[]>>, newEntry: T) => {
    setter(prev => [...prev, newEntry]);
  };

  const removeDynamicEntry = <T extends { id: string }>(setter: React.Dispatch<React.SetStateAction<T[]>>, id: string) => {
    setter(prev => prev.filter(item => item.id !== id));
  };


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = formData.name;

    toast({
      title: isEditMode ? 'Staff Updated' : 'Staff Added',
      description: `${name}'s profile has been successfully ${isEditMode ? 'updated' : 'created'}.`,
    });

    router.push('/staff');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {!isEditMode && (
          <ResumeUploader onInfoExtracted={handleInfoExtracted} />
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Basic details about the staff member.</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" name="address" value={formData.address} onChange={handleChange} />
              </div>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle>Employment Details</CardTitle>
               <CardDescription>Work-related information.</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
               <div className="space-y-2">
                <Label htmlFor="tenantId">Tenant</Label>
                 <Select name="tenantId" value={formData.tenantId} onValueChange={(value) => handleSelectChange('tenantId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tenant" />
                  </SelectTrigger>
                  <SelectContent>
                    {tenantData.map((tenant: Tenant) => (
                        <SelectItem key={tenant.id} value={tenant.id}>{tenant.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="employmentCategory">Employment Category</Label>
                 <Select name="employmentCategory" value={formData.employmentCategory} onValueChange={(value) => handleSelectChange('employmentCategory', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Job Category</Label>
                 <Select name="category" value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="PCO">PCO</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
                <div className="space-y-2">
                <Label htmlFor="homeOffice">Home Office</Label>
                <Input id="homeOffice" name="homeOffice" value={formData.homeOffice} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contractualOffice">Contractual Office</Label>
                <Input id="contractualOffice" name="contractualOffice" value={formData.contractualOffice} onChange={handleChange} />
              </div>
                <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                 <Select name="region" value={formData.region} onValueChange={(value) => handleSelectChange('region', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NA">NA</SelectItem>
                    <SelectItem value="EMEA">EMEA</SelectItem>
                    <SelectItem value="APAC">APAC</SelectItem>
                    <SelectItem value="LATAM">LATAM</SelectItem>
                    <SelectItem value="Central">Central</SelectItem>
                    <SelectItem value="Eastern">Eastern</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>Enter skills separated by commas.</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="keySkills">Key Skills</Label>
                <Textarea id="keySkills" value={keySkills.join(', ')} onChange={handleSkillsChange(setKeySkills)} placeholder="e.g., Project Management, Leadership" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="techSkills">Technical Skills</Label>
                <Textarea id="techSkills" value={techSkills.join(', ')} onChange={handleSkillsChange(setTechSkills)} placeholder="e.g., React, Node.js, AWS" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
             <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Work Experience</CardTitle>
                <CardDescription>Previous job roles and responsibilities.</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => addDynamicEntry(setExperience, { id: `${uniqueId}-exp-${Date.now()}`, position: '', company: '' })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Experience
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {experience.map(exp => (
                <div key={exp.id} className="p-4 border rounded-md space-y-4 relative">
                  <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive" onClick={() => removeDynamicEntry(setExperience, exp.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Position</Label>
                      <Input value={exp.position} onChange={(e) => handleDynamicChange(experience, setExperience, exp.id, 'position', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Input value={exp.company} onChange={(e) => handleDynamicChange(experience, setExperience, exp.id, 'company', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input value={exp.startDate} onChange={(e) => handleDynamicChange(experience, setExperience, exp.id, 'startDate', e.target.value)} placeholder="YYYY-MM-DD" />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input value={exp.endDate} onChange={(e) => handleDynamicChange(experience, setExperience, exp.id, 'endDate', e.target.value)} placeholder="YYYY-MM-DD or Present" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Summary</Label>
                    <Textarea value={exp.summary} onChange={(e) => handleDynamicChange(experience, setExperience, exp.id, 'summary', e.target.value)} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Educational Qualifications</CardTitle>
                <CardDescription>Degrees and certifications.</CardDescription>
              </div>
               <Button type="button" variant="outline" size="sm" onClick={() => addDynamicEntry(setEducation, { id: `${uniqueId}-edu-${Date.now()}`, degree: '', university: '' })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Education
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {education.map(edu => (
                <div key={edu.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                  <div className="md:col-span-5 space-y-1">
                    <Label className="text-xs">Degree</Label>
                    <Input value={edu.degree} onChange={(e) => handleDynamicChange(education, setEducation, edu.id, 'degree', e.target.value)} placeholder="e.g., B.S. in Computer Science" />
                  </div>
                   <div className="md:col-span-4 space-y-1">
                    <Label className="text-xs">University</Label>
                    <Input value={edu.university} onChange={(e) => handleDynamicChange(education, setEducation, edu.id, 'university', e.target.value)} placeholder="e.g., Stanford University" />
                  </div>
                   <div className="md:col-span-2 space-y-1">
                    <Label className="text-xs">Year</Label>
                    <Input type="number" value={edu.year} onChange={(e) => handleDynamicChange(education, setEducation, edu.id, 'year', parseInt(e.target.value) || 0)} placeholder="e.g., 2020" />
                  </div>
                  <div className="md:col-span-1 flex items-end justify-end h-full">
                    <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => removeDynamicEntry(setEducation, edu.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <Button type="submit" className="w-full">
                    {isEditMode ? 'Save Changes' : 'Add Staff Member'}
                </Button>
            </CardContent>
          </Card>
        </form>
      </div>
      <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Media</CardTitle>
              <CardDescription>Upload necessary documents and a profile picture.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profile-picture">Profile Picture</Label>
                <Input id="profile-picture" type="file" accept="image/*" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resumes">Resumes</Label>
                <Input id="resumes" type="file" multiple />
              </div>
              <div className="space-y-2">
                <Label htmlFor="certificates">Certificates</Label>
                <Input id="certificates" type="file" multiple />
              </div>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
