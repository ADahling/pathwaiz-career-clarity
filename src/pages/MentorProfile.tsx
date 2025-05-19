
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { 
  User, 
  Briefcase,
  Building, 
  Calendar, 
  DollarSign, 
  FileText,
  Image as ImageIcon,
  Save
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  jobTitle: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
  industry: z.string().min(2, {
    message: "Industry must be at least 2 characters.",
  }),
  yearsExperience: z.coerce.number().min(0, {
    message: "Years of experience must be a positive number.",
  }),
  hourlyRate: z.coerce.number().min(0, {
    message: "Hourly rate must be a positive number.",
  }),
  bio: z.string().min(10, {
    message: "Bio must be at least 10 characters.",
  }),
});

const MentorProfile: React.FC = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingData, setExistingData] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      jobTitle: "",
      industry: "",
      yearsExperience: 0,
      hourlyRate: 0,
      bio: "",
    },
  });

  useEffect(() => {
    if (user) {
      fetchExistingProfile();
    }
  }, [user]);

  useEffect(() => {
    if (existingData) {
      form.reset({
        name: existingData.name || "",
        jobTitle: existingData.job_title || "",
        industry: existingData.industry || "",
        yearsExperience: existingData.years_experience || 0,
        hourlyRate: existingData.hourly_rate || 0,
        bio: existingData.bio || "",
      });
      
      if (existingData.profile_image) {
        setImagePreview(existingData.profile_image);
      }
    }
  }, [existingData, form]);

  const fetchExistingProfile = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('mentor_profiles')
        .select('*')
        .eq('id', user!.id)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        // PGRST116 means no rows returned
        throw error;
      }
      
      if (data) {
        setExistingData(data);
      }
    } catch (error: any) {
      console.error('Error fetching mentor profile:', error.message);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!profileImage || !user) return null;
    
    try {
      const fileExt = profileImage.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `profile-images/${fileName}`;
      
      const { error: uploadError } = await supabase
        .storage
        .from('mentor-images')
        .upload(filePath, profileImage);
        
      if (uploadError) throw uploadError;
      
      const { data } = supabase
        .storage
        .from('mentor-images')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error.message);
      toast.error('Failed to upload profile image');
      return null;
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      
      if (!user) {
        toast.error('You must be logged in');
        navigate('/auth');
        return;
      }

      let imageUrl = existingData?.profile_image || null;
      
      if (profileImage) {
        imageUrl = await uploadImage();
        if (!imageUrl) {
          toast.error('Failed to upload profile image');
          return;
        }
      }
      
      const profileData = {
        id: user.id,
        name: values.name,
        job_title: values.jobTitle,
        industry: values.industry,
        years_experience: values.yearsExperience,
        hourly_rate: values.hourlyRate,
        bio: values.bio,
        profile_image: imageUrl,
      };
      
      let operation;
      if (existingData) {
        operation = supabase
          .from('mentor_profiles')
          .update(profileData)
          .eq('id', user.id);
      } else {
        operation = supabase
          .from('mentor_profiles')
          .insert([profileData]);
      }
      
      const { error } = await operation;
      
      if (error) throw error;
      
      toast.success(existingData ? 'Profile updated successfully!' : 'Profile created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error saving mentor profile:', error.message);
      toast.error('Failed to save profile data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="container-custom flex-grow my-8">
        <h1 className="text-3xl font-bold mb-6">
          {existingData ? 'Update Your Mentor Profile' : 'Create Your Mentor Profile'}
        </h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Profile Image Upload */}
              <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 mb-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-2">
                    {imagePreview ? (
                      <AvatarImage src={imagePreview} alt="Profile preview" />
                    ) : (
                      <AvatarFallback className="text-lg">
                        {form.getValues().name?.[0]?.toUpperCase() || 'M'}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  <label htmlFor="profile-image" className="cursor-pointer flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800">
                    <ImageIcon className="h-4 w-4" />
                    {imagePreview ? 'Change Image' : 'Upload Image'}
                  </label>
                  <input 
                    id="profile-image" 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
                  <p className="text-gray-600 text-sm mb-4">
                    This information will be visible to potential mentees looking for guidance.
                  </p>
                </div>
              </div>
              
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="h-4 w-4" /> Full Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Job Title */}
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" /> Job Title
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. Senior Software Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Industry */}
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Building className="h-4 w-4" /> Industry
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. Technology, Healthcare, Finance" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Years of Experience */}
              <FormField
                control={form.control}
                name="yearsExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Years of Experience
                    </FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Hourly Rate */}
              <FormField
                control={form.control}
                name="hourlyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" /> Hourly Rate (USD)
                    </FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Bio */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <FileText className="h-4 w-4" /> Biography
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell potential mentees about your experience, expertise, and mentoring style..." 
                        className="min-h-[150px]" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" disabled={loading} className="w-full sm:w-auto flex items-center gap-2">
                <Save className="h-4 w-4" />
                {loading ? 'Saving...' : 'Save Profile'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default MentorProfile;
