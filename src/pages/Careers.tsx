import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, Award, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Layout from '@/components/Layout';

const Careers: React.FC = () => {
  // Sample open roles data
  const openRoles = [
    {
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time"
    },
    {
      title: "UX/UI Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time"
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "Remote / San Francisco",
      type: "Full-time"
    },
    {
      title: "Growth Marketing Specialist",
      department: "Marketing",
      location: "Remote",
      type: "Full-time"
    }
  ];

  // Benefits data
  const benefits = [
    {
      icon: <Award className="h-10 w-10 text-pathwaiz-blue" />,
      title: "Flexible Work Environment",
      description: "Work from anywhere with flexible hours."
    },
    {
      icon: <Award className="h-10 w-10 text-pathwaiz-blue" />,
      title: "Competitive Compensation",
      description: "Salary packages in the top 25% of the market."
    },
    {
      icon: <Award className="h-10 w-10 text-pathwaiz-blue" />,
      title: "Health & Wellness",
      description: "Comprehensive health coverage and wellness stipend."
    },
    {
      icon: <Award className="h-10 w-10 text-pathwaiz-blue" />,
      title: "Professional Growth",
      description: "Learning budget and career development opportunities."
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-white to-blue-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Join Our <span className="text-pathwaiz-blue">Mission</span>
            </h1>
            <p className="text-xl text-gray-700 mb-10">
              Help us transform career guidance by connecting people with mentors who've walked the path before.
            </p>
            <Button 
              className="text-lg bg-pathwaiz-blue text-white px-8 py-6 rounded-lg font-medium hover:bg-opacity-90"
              onClick={() => {
                const applySection = document.getElementById('apply');
                applySection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              View Open Positions
            </Button>
          </div>
        </div>
      </section>

      {/* Why Work at Pathwaiz */}
      <section className="py-16 px-4 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/3">
                <div className="bg-blue-50 p-6 rounded-full inline-flex items-center justify-center">
                  <Briefcase size={64} className="text-pathwaiz-blue" />
                </div>
              </div>
              <div className="md:w-2/3">
                <h2 className="text-3xl font-bold mb-4">Why Work at Pathwaiz?</h2>
                <p className="text-lg text-gray-700 mb-4">
                  At Pathwaiz, we're building the future of career guidance. We believe that everyone deserves access to personalized career advice from professionals who've been there before.
                </p>
                <p className="text-lg text-gray-700">
                  When you join Pathwaiz, you're not just building a product — you're helping people make life-changing career decisions with confidence and clarity. We're a small but growing team that values impact, innovation, and work-life balance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section id="open-roles" className="py-16 px-4 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-start gap-8 mb-10">
              <div className="md:w-1/4 flex justify-center">
                <FileText size={48} className="text-pathwaiz-blue" />
              </div>
              <div className="md:w-3/4">
                <h2 className="text-3xl font-bold mb-4">Open Roles</h2>
                <p className="text-lg text-gray-700">
                  Join our team of passionate individuals who are reshaping career guidance. Here are our current opportunities:
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Position</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {openRoles.map((role, index) => (
                    <TableRow key={index} className="hover:bg-blue-50 cursor-pointer">
                      <TableCell className="font-medium text-pathwaiz-blue">{role.title}</TableCell>
                      <TableCell>{role.department}</TableCell>
                      <TableCell>{role.location}</TableCell>
                      <TableCell>{role.type}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Overview */}
      <section className="py-16 px-4 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Benefits & Perks</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              We believe in taking care of our team so they can focus on what matters most.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <CardTitle>{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Apply Now CTA */}
      <section id="apply" className="py-16 px-4 bg-pathwaiz-blue bg-opacity-5">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Us?</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-10">
            We're always looking for talented individuals who are passionate about making a difference in people's careers.
          </p>
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <div className="flex justify-center mb-6">
              <Mail size={48} className="text-pathwaiz-blue" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Apply Now</h3>
            <p className="text-gray-600 mb-6">
              Send your resume and tell us why you're excited about Pathwaiz.
            </p>
            <Button className="w-full bg-pathwaiz-blue text-white text-lg py-6 rounded-lg hover:bg-opacity-90">
              careers@pathwaiz.com
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Careers;
