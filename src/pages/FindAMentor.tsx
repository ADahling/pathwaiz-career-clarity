import React from 'react';
import { Link } from 'react-router-dom';
import { Filter, Search, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/Layout';

const FindAMentor: React.FC = () => {
  // Mock mentor categories for filter preview
  const mentorCategories = [
    {
      title: "Tech & Software",
      count: 48,
      image: "bg-gradient-to-br from-blue-50 to-blue-100"
    },
    {
      title: "Business & Finance",
      count: 32,
      image: "bg-gradient-to-br from-green-50 to-green-100"
    },
    {
      title: "Creative & Design",
      count: 27,
      image: "bg-gradient-to-br from-purple-50 to-purple-100"
    },
    {
      title: "Health & Science",
      count: 19,
      image: "bg-gradient-to-br from-red-50 to-red-100"
    }
  ];

  // Mock testimonials
  const testimonials = [
    {
      quote: "My mentor helped me navigate a career transition from marketing to UX design. Their guidance was invaluable in helping me build the right portfolio.",
      author: "Jamie Chen",
      role: "UX Designer",
      rating: 5
    },
    {
      quote: "I was stuck in my career and didn't know which direction to take. My Pathwaiz mentor helped me discover my strengths and find a path that truly excites me.",
      author: "Marcus Johnson",
      role: "Product Manager",
      rating: 5
    },
    {
      quote: "As someone exploring entrepreneurship, connecting with a mentor who had built and sold multiple startups gave me insights I couldn't find anywhere else.",
      author: "Sophia Rodriguez",
      role: "Tech Entrepreneur",
      rating: 4
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-white to-pathwaiz-gray">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Find a Mentor Who's Done What <span className="text-[#4A90E2]">You Want To Do</span>
            </h1>
            <p className="text-xl text-gray-700 mb-10">
              Connect with professionals who have walked the path you're exploring and get the insights you need to make confident career decisions.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                className="bg-[#4A90E2] hover:bg-[#3A80D2] text-white text-lg rounded-lg flex items-center justify-center gap-2 px-8 py-6"
              >
                Browse All Mentors
                <ArrowRight size={20} />
              </Button>
              <Button
                variant="outline"
                className="border-black text-black hover:bg-gray-100 text-lg rounded-lg px-8 py-6"
              >
                How It Works
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Preview Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Explore Mentors by Category</h2>
            <p className="text-lg text-gray-700">
              Find experts across different fields who can guide your career journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mentorCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0">
                  <div className={`aspect-[3/2] ${category.image} flex items-center justify-center p-6`}>
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md">
                      <Filter size={28} className="text-[#4A90E2]" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                    <p className="text-gray-600">{category.count} mentors available</p>
                    <Button variant="ghost" className="text-[#4A90E2] hover:text-[#3A80D2] p-0 mt-4">
                      Browse Mentors →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 mb-8 bg-gray-50 px-4 py-2 rounded-full">
              <Search size={18} className="text-gray-500" />
              <span className="text-gray-600">Or search by skill, industry, or experience</span>
            </div>
            <div>
              <Button
                className="bg-[#4A90E2] hover:bg-[#3A80D2] text-white px-8 py-3 text-lg rounded-lg flex items-center mx-auto gap-2"
              >
                Advanced Search
                <ArrowRight size={20} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-700">
              Hear from people who found clarity through Pathwaiz mentoring
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        size={20}
                        className={`${
                          starIndex < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 italic mb-6 flex-grow">
                    "{testimonial.quote}"
                  </blockquote>
                  <footer>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </footer>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-[#4A90E2] bg-opacity-5">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Mentor?</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-10">
            Take the first step towards confidently navigating your career path with guidance from experienced professionals.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              className="bg-[#4A90E2] hover:bg-[#3A80D2] text-white text-lg rounded-lg flex items-center justify-center gap-2 px-8 py-6"
            >
              Browse Mentors Now
              <ArrowRight size={20} />
            </Button>
            <Button
              variant="outline"
              className="border-[#4A90E2] text-[#4A90E2] hover:bg-[#4A90E2] hover:bg-opacity-10 text-lg rounded-lg px-8 py-6"
            >
              Become a Mentor
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FindAMentor;
