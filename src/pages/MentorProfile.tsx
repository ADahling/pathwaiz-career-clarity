
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import NavBar from '@/components/NavBar';
import { Loader2, Upload } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

// Define form schema
const mentorProfileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  jobTitle: z.string().min(2, { message: "Job title must be at least 2 characters." }),
  industry: z.string().min(2, { message: "Industry must be at least 2 characters." }),
  yearsExperience: z.coerce.number().min(0, { message: "Years of experience must be 0 or greater." }),
  hourlyRate: z.coerce.number().min(0, { message: "Hourly rate must be 0 or greater." }),
  bio: z.string().min(10, { message: "Bio must be at least 10 characters." }).max(500, { message: "Bio must not exceed 500 characters." }),
});

const MentorProfile: React.FC = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<any>(null);

  const form = useForm<z.infer<typeof mentorProfileSchema>>({
    resolver: zodResolver(mentorProfileSchema),
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
    if (userRole !== 'mentor') {
      toast.error('You are not authorized to view this page');
      navigate('/');
      return;
    }

    const fetchMentorProfile = async () => {
      setIsLoading(true);
      try {
        if (!user) return;

        const { data, error } = await supabase
          .from('mentor_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          // PGRST116 is the code for "no rows returned" which is expected for new users
          throw error;
        }

        if (data) {
          setProfileData(data);
          // Set form values from fetched data
          form.reset({
            name: data.name || "",
            jobTitle: data.job_title || "",
            industry: data.industry || "",
            yearsExperience: data.years_experience || 0,
            hourlyRate: data.hourly_rate || 0,
            bio: data.bio || "",
          });

          // Set image preview if exists
          if (data.profile_image) {
            setImagePreview(data.profile_image);
          }
        }
      } catch (error: any) {
        console.error('Error fetching mentor profile:', error.message);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentorProfile();
  }, [user, userRole, navigate, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should not exceed 5MB');
        return;
      }
      
      // Check file type
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        toast.error('Only JPEG, JPG and PNG formats are supported');
        return;
      }
      
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!profileImage || !user) return imagePreview;
    
    setIsUploading(true);
    try {
      // Create a unique file path with user ID as folder name
      const fileExt = profileImage.name.split('.').pop();
      const filePath = `${user.id}/${uuidv4()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('mentor-images')
        .upload(filePath, profileImage);

      if (uploadError) throw uploadError;

      // Get the public URL for the uploaded image
      const { data } = supabase.storage
        .from('mentor-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error.message);
      toast.error('Failed to upload image');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof mentorProfileSchema>) => {
    if (!user) {
      toast.error('You must be logged in to update your profile');
      return;
    }

    setIsLoading(true);

    try {
      // Upload image if selected
      let imageUrl = imagePreview;
      if (profileImage) {
        imageUrl = await uploadImage();
      }

      // Prepare the profile data
      const profileUpdate = {
        id: user.id,
        name: values.name,
        job_title: values.jobTitle,
        industry: values.industry,
        years_experience: values.yearsExperience,
        hourly_rate: values.hourlyRate,
        bio: values.bio,
        profile_image: imageUrl
      };

      // Update or insert the mentor profile
      const { error } = await supabase
        .from('mentor_profiles')
        .upsert(profileUpdate);

      if (error) throw error;

      toast.success('Profile saved successfully');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error saving mentor profile:', error.message);
      toast.error(error.message || 'Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !profileData) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="container-custom flex-grow flex items-center justify-center">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="container-custom flex-grow my-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Your Mentor Profile</h1>
          <p className="text-gray-600 mb-8">
            Complete your profile to help mentees understand your expertise and how you can help them.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Senior Software Engineer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Technology, Finance" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="yearsExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hourlyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hourly Rate (USD)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell mentees about your background, expertise, and how you can help them..." 
                            className="min-h-[120px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="md:col-span-2">
                  <FormLabel className="block mb-2">Profile Picture</FormLabel>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
                    {imagePreview && (
                      <div className="relative w-24 h-24 overflow-hidden rounded-full border border-gray-200">
                        <img 
                          src={imagePreview} 
                          alt="Profile preview" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}
                    <div className="flex-grow">
                      <div className="relative">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="w-full flex items-center justify-center gap-2"
                          onClick={() => document.getElementById('profile-image')?.click()}
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              {imagePreview ? 'Change Image' : 'Upload Image'}
                            </>
                          )}
                        </Button>
                        <input
                          type="file"
                          id="profile-image"
                          accept="image/png, image/jpeg, image/jpg"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Max 5MB. JPG, JPEG, or PNG.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading || isUploading}
                  className="bg-pathwaiz-blue"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    'Save Profile'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default MentorProfile;
