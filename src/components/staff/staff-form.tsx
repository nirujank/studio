
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
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import React, { useState, useCallback, useId } from 'react';
import { ResumeUploader } from './resume-uploader';
import type { ExtractInfoFromResumeOutput } from '@/ai/flows/extract-info-from-resume';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Combobox } from '../ui/combobox';

type StaffFormProps = {
  staffMember?: StaffMember;
};

type EducationEntry = { id: string; degree: string; university: string; year?: number };
type ExperienceEntry = { id: string; position: string; company: string; startDate?: string; endDate?: string; summary?: string };


const jobCategories = [
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Design', label: 'Design' },
    { value: 'Product', label: 'Product' },
    { value: 'PCO', label: 'PCO' },
    { value: 'Marketing', label: 'Marketing' },
];

const employmentJobCategories = [
    { value: 'Intern', label: 'Intern' },
    { value: 'Casual', label: 'Casual' },
    { value: 'Permanent', label: 'Permanent' },
    { value: 'On Contract', label: 'On Contract' },
];

const employmentTypes = [
    { value: 'Full-time', label: 'Full-time' },
    { value: 'Part-time', label: 'Part-time' },
];

const regions = [
    { value: 'NA', label: 'NA' },
    { value: 'EMEA', label: 'EMEA' },
    { value: 'APAC', label: 'APAC' },
    { value: 'LATAM', label: 'LATAM' },
    { value: 'Central', label: 'Central' },
    { value: 'Eastern', label: 'Eastern' },
];

// In a real app, this would come from an API
const countries = [
    { value: 'USA', label: 'USA' },
    { value: 'United Kingdom', label: 'United Kingdom' },
    { value: 'Singapore', label: 'Singapore' },
    { value: 'Germany', label: 'Germany' },
    { value: 'Canada', label: 'Canada' },
    { value: 'Australia', label: 'Australia' },
];

const homeOffices = [
    { value: 'San Francisco, CA', label: 'San Francisco, CA' },
    { value: 'London, UK', label: 'London, UK' },
    { value: 'Singapore', label: 'Singapore' },
    { value: 'New York, NY', label: 'New York, NY' },
    { value: 'Berlin, DE', label: 'Berlin, DE' },
    { value: 'Remote', label: 'Remote' },
];


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
    emergencyContact: staffMember?.profile.personal.emergencyContact || '',
    contactPriority: staffMember?.profile.personal.contactPriority || '',
    specialNeeds: staffMember?.profile.personal.specialNeeds || '',
    tenantId: staffMember?.tenantId || '',
    jobTitle: staffMember?.jobTitle || '',
    jobCategory: staffMember?.jobCategory || '',
    category: staffMember?.category || '',
    employmentType: staffMember?.employmentType || '',
    homeOffice: staffMember?.homeOffice || '',
    contractualOffice: staffMember?.contractualOffice || '',
    country: staffMember?.country || '',
    region: staffMember?.region || '',
  });

  const [keySkills, setKeySkills] = useState<string[]>(staffMember?.profile.skills || []);
  const [techSkills, setTechSkills] = useState<string[]>([]); // Assuming no initial tech skills for simplicity
  const [education, setEducation] = useState<EducationEntry[]>(
    staffMember?.profile.education.map((e, i) => ({ ...e, id: `${uniqueId}-edu-${i}` })) || []
  );
  const [experience, setExperience] = useState<ExperienceEntry[]>(
    staffMember?.jobHistory.map((e, i) => ({ ...e, endDate: e.endDate ?? '', position: e.position, company: e.company, startDate: e.startDate, summary: 'summary' in e ? (e as any).summary : '', id: `${uniqueId}-exp-${i}` })) || []
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
  
  const tenantOptions = tenantData.map(tenant => ({ value: tenant.id, label: tenant.name }));

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
               <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input id="emergencyContact" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPriority">Contact Priority</Label>
                <Input id="contactPriority" name="contactPriority" value={formData.contactPriority} onChange={handleChange} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="specialNeeds">Special Need or Accessibility</Label>
                <Input id="specialNeeds" name="specialNeeds" value={formData.specialNeeds} onChange={handleChange} />
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
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input id="jobTitle" name="jobTitle" value={formData.jobTitle} onChange={handleChange} />
              </div>
               <div className="space-y-2">
                <Label>Tenant</Label>
                <Combobox
                  options={tenantOptions}
                  selectedValue={formData.tenantId}
                  onSelect={(value) => handleSelectChange('tenantId', value)}
                  placeholder="Select tenant"
                  searchPlaceholder="Search tenants..."
                  notFoundText="No tenant found."
                 />
              </div>
               <div className="space-y-2">
                <Label>Job Category (Functional)</Label>
                 <Combobox
                  options={jobCategories}
                  selectedValue={formData.category}
                  onSelect={(value) => handleSelectChange('category', value)}
                  placeholder="Select job category"
                  searchPlaceholder="Search categories..."
                  notFoundText="No category found."
                 />
              </div>
              <div className="space-y-2">
                <Label>Job Category (Employment)</Label>
                <Combobox
                  options={employmentJobCategories}
                  selectedValue={formData.jobCategory}
                  onSelect={(value) => handleSelectChange('jobCategory', value)}
                  placeholder="Select category"
                  searchPlaceholder="Search categories..."
                  notFoundText="No category found."
                 />
              </div>
               <div className="space-y-2">
                <Label>Employment Type</Label>
                <Combobox
                  options={employmentTypes}
                  selectedValue={formData.employmentType}
                  onSelect={(value) => handleSelectChange('employmentType', value)}
                  placeholder="Select type"
                  searchPlaceholder="Search types..."
                  notFoundText="No type found."
                 />
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                 <Combobox
                  options={countries}
                  selectedValue={formData.country}
                  onSelect={(value) => handleSelectChange('country', value)}
                  placeholder="Select country"
                  searchPlaceholder="Search countries..."
                  notFoundText="No country found."
                 />
              </div>
              <div className="space-y-2">
                <Label>Region</Label>
                 <Combobox
                  options={regions}
                  selectedValue={formData.region}
                  onSelect={(value) => handleSelectChange('region', value)}
                  placeholder="Select region"
                  searchPlaceholder="Search regions..."
                  notFoundText="No region found."
                 />
              </div>
               <div className="space-y-2">
                <Label htmlFor="homeOffice">Home Office</Label>
                 <Combobox
                  options={homeOffices}
                  selectedValue={formData.homeOffice}
                  onSelect={(value) => handleSelectChange('homeOffice', value)}
                  placeholder="Select home office"
                  searchPlaceholder="Search offices..."
                  notFoundText="No office found."
                 />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contractualOffice">Contractual Office</Label>
                <Input id="contractualOffice" name="contractualOffice" value={formData.contractualOffice} onChange={handleChange} />
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
                      <Input value={exp.endDate || ''} onChange={(e) => handleDynamicChange(experience, setExperience, exp.id, 'endDate', e.target.value)} placeholder="YYYY-MM-DD or Present" />
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
