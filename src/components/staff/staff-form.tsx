'use client';

import type { StaffMember, Tenant } from '@/lib/data';
import { tenantData } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import React, { useState, useCallback } from 'react';
import { ResumeUploader } from './resume-uploader';

type StaffFormProps = {
  staffMember?: StaffMember;
};

export function StaffForm({ staffMember }: StaffFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const isEditMode = !!staffMember;

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

  const handleInfoExtracted = useCallback((info: any) => {
    setFormData((prev) => ({
      ...prev,
      name: info.personal?.name || prev.name,
      email: info.personal?.email || prev.email,
      phone: info.personal?.phone || prev.phone,
      address: info.personal?.address || prev.address,
    }));
    toast({
      title: 'Information Extracted',
      description: 'The form has been populated with data from the resume.',
    });
  }, [toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = useCallback((name: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);


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

          {/* This button submits the form that wraps the cards above */}
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
