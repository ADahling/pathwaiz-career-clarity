
import React from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Mail, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";

const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const Contact = () => {
  const { toast } = useToast();
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(data: ContactFormValues) {
    toast({
      title: "Form submitted",
      description: "Thank you for reaching out. We'll get back to you soon!",
    });
    form.reset();
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-pathwaiz-blue py-20 text-white">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Have questions about Pathwaiz or need help? We're here to assist you. Reach out to our team.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <p className="text-gray-600 mb-6">
                Fill out the form below and our team will get back to you as soon as possible.
              </p>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="How can we help you?" 
                            className="min-h-[150px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </Form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <p className="text-gray-600 mb-8">
                You can reach out to us directly using the information below or visit our office during business hours.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-pathwaiz-blue p-3 rounded-full text-white">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Office Address</h3>
                    <p className="text-gray-600">
                      123 Innovation Way<br />
                      San Francisco, CA 94107<br />
                      United States
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-pathwaiz-blue p-3 rounded-full text-white">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Email</h3>
                    <p className="text-gray-600">
                      contact@pathwaiz.com<br />
                      support@pathwaiz.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-pathwaiz-blue p-3 rounded-full text-white">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Phone</h3>
                    <p className="text-gray-600">
                      +1 (555) 123-4567
                    </p>
                  </div>
                </div>
              </div>

              {/* Google Maps Embed */}
              <div className="mt-8 rounded-lg overflow-hidden shadow-md h-[300px] bg-gray-100">
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <p className="text-gray-500">Map Embed Would Go Here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to find a mentor?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Browse our network of experienced professionals ready to help you grow in your career.
          </p>
          <Button size="lg" className="bg-pathwaiz-blue hover:bg-opacity-90">
            Explore Mentors
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
