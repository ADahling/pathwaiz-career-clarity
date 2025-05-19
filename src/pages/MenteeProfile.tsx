
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { User, Briefcase, Target, Upload } from 'lucide-react';

const careerInterestOptions = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Marketing',
  'Engineering', 'Design', 'Business', 'Science', 'Arts'
];

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  careerInterests: z.array(z.string()).min(1, { message: "Select at least one career interest." }),
  careerGoals: z.string().min(10, { message: "Career goals must be at least 10 characters." }),
  profileImage: z.any().optional()
});

const MenteeProfile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      careerInterests: [],
      careerGoals: '',
      profileImage: undefined
    }
  });

  useEffect(() => {
    const fetchExistingProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('mentee_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          form.setValue('name', data.name || '');
          form.setValue('careerGoals', data.career_goals || '');
          if (data.career_interests && Array.isArray(data.career_interests)) {
            form.setValue('careerInterests', data.career_interests);
            setSelectedInterests(data.career_interests);
          }
          if (data.profile_image) {
            setProfileImageUrl(data.profile_image);
          }
        }
      } catch (error: any) {
        console.error('Error fetching profile:', error.message);
        toast.error('Failed to load profile data');
      }
    };

    fetchExistingProfile();
  }, [user, form]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setProfileImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setProfileImageUrl(objectUrl);
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => {
      if (prev.includes(interest)) {
        const newInterests = prev.filter(i => i !== interest);
        form.setValue('careerInterests', newInterests);
        return newInterests;
      } else {
        const newInterests = [...prev, interest];
        form.setValue('careerInterests', newInterests);
        return newInterests;
      }
    });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error('You must be logged in');
      navigate('/auth');
      return;
    }

    setIsSubmitting(true);
    
    try {
      let profileImagePath = profileImageUrl;

      // Upload image if a new one was selected
      if (profileImageFile) {
        const fileExt = profileImageFile.name.split('.').pop();
        const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `profile-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('profiles')
          .upload(filePath, profileImageFile);

        if (uploadError) {
          throw uploadError;
        }

        // Get the public URL for the uploaded image
        const { data } = supabase.storage.from('profiles').getPublicUrl(filePath);
        profileImagePath = data.publicUrl;
      }

      // Update or insert mentee profile
      const { error } = await supabase
        .from('mentee_profiles')
        .upsert({
          id: user.id,
          name: values.name,
          career_interests: values.careerInterests,
          career_goals: values.careerGoals,
          profile_image: profileImagePath,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Profile updated successfully');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error updating profile:', error.message);
      toast.error(error.message || 'Error updating profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="container-custom flex-grow my-8">
        <h1 className="text-3xl font-bold mb-6">Complete Your Mentee Profile</h1>
        <p className="text-lg mb-6">
          Tell us about yourself so we can help match you with the right mentors.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel className="flex items-center gap-2 mb-2">
                <Briefcase className="h-4 w-4" />
                Career Interests
              </FormLabel>
              <div className="flex flex-wrap gap-2 mt-1">
                {careerInterestOptions.map((interest) => (
                  <Button
                    key={interest}
                    type="button"
                    variant={selectedInterests.includes(interest) ? "default" : "outline"}
                    className="mb-2"
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </Button>
                ))}
              </div>
              {form.formState.errors.careerInterests && (
                <p className="text-sm font-medium text-destructive mt-1">
                  {form.formState.errors.careerInterests.message}
                </p>
              )}
            </div>

            <FormField
              control={form.control}
              name="careerGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Career Goals
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your career goals and what you hope to achieve" 
                      className="min-h-[120px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel className="flex items-center gap-2 mb-2">
                <Upload className="h-4 w-4" />
                Profile Image (Optional)
              </FormLabel>
              <div className="mt-1 flex items-center space-x-4">
                <div className="border border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                  {profileImageUrl ? (
                    <img 
                      src={profileImageUrl} 
                      alt="Profile" 
                      className="w-32 h-32 object-cover rounded-full mb-2"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                      <Upload className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <Input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('profile-image')?.click()}
                  >
                    {profileImageUrl ? 'Change Image' : 'Upload Image'}
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default MenteeProfile;
