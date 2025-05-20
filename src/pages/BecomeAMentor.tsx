import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, DollarSign, Calendar, MessageSquare, Star, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/Layout';

const BecomeAMentor: React.FC = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: <DollarSign className="w-12 h-12 text-[#4A90E2]" />,
      title: "Earn Extra Income",
      description: "Set your own rates and schedule. Earn money sharing knowledge you already have."
    },
    {
      icon: <MessageSquare className="w-12 h-12 text-[#4A90E2]" />,
      title: "Build Your Network",
      description: "Connect with professionals and potential collaborators across various industries."
    },
    {
      icon: <Star className="w-12 h-12 text-[#4A90E2]" />,
      title: "Enhance Your Reputation",
      description: "Establish yourself as a thought leader and expert in your field."
    },
    {
      icon: <Award className="w-12 h-12 text-[#4A90E2]" />,
      title: "Give Back",
      description: "Help others navigate career challenges you've already overcome."
    }
  ];

  const howItWorks = [
    {
      number: "1",
      title: "Create Your Profile",
      description: "Set up your professional profile highlighting your expertise, experience, and the specific insights you can offer mentees."
    },
    {
      number: "2",
      title: "Set Your Availability",
      description: "Define when you're available for mentoring sessions and how much time you can dedicate each week."
    },
    {
      number: "3",
      title: "Set Your Rates",
      description: "Decide how much to charge for your time and expertise. You have complete control over your pricing."
    },
    {
      number: "4",
      title: "Connect With Mentees",
      description: "Accept session requests from mentees who are interested in your expertise and career path."
    },
    {
      number: "5",
      title: "Host Sessions",
      description: "Conduct video mentoring sessions, answer questions, and provide guidance based on your experience."
    },
    {
      number: "6",
      title: "Get Paid",
      description: "Receive payments directly to your account after each successful mentoring session."
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-white to-pathwaiz-gray">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Earn by Sharing Your <span className="text-[#4A90E2]">Career Story</span>
            </h1>
            <p className="text-xl text-gray-700 mb-10">
              Turn your professional experience into a side income. Help others navigate their career paths while earning for your time and expertise.
            </p>
            <Button
              className="bg-[#4A90E2] hover:bg-[#3A80D2] text-white text-lg rounded-lg flex items-center justify-center gap-2 px-8 py-6"
              onClick={() => navigate('/auth')}
            >
              Sign Up as a Mentor
              <ArrowRight size={20} />
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Become a Mentor?</h2>
            <p className="text-lg text-gray-700">
              Share your knowledge, earn income, and make a difference in someone's career
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-[#4A90E2] bg-opacity-10 flex items-center justify-center mb-6">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works for Mentors</h2>
            <p className="text-lg text-gray-700">
              Our simple process makes it easy to start mentoring and earning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-full bg-[#4A90E2] text-white flex items-center justify-center text-xl font-bold mb-6">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Horizontal Timeline for desktop */}
          <div className="hidden lg:block relative mt-16 mb-12">
            <div className="h-1 bg-[#4A90E2] absolute top-12 left-[10%] right-[10%]"></div>
            <div className="flex justify-between max-w-5xl mx-auto px-16">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div key={num} className="flex flex-col items-center relative">
                  <div className="w-12 h-12 rounded-full bg-[#4A90E2] text-white flex items-center justify-center text-xl font-bold z-10">
                    {num}
                  </div>
                  <div className="text-center text-sm mt-3 max-w-[100px]">
                    {howItWorks[num-1].title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">From Our Mentors</h2>
            <p className="text-lg text-gray-700">
              Hear what other professionals say about mentoring on Pathwaiz
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Sharing my journey as a software engineer helps me reflect on my own career while guiding others. The extra income is a nice bonus!",
                author: "David Chen",
                role: "Senior Software Engineer"
              },
              {
                quote: "I love helping people avoid the mistakes I made early in my career. The platform makes scheduling and payments so simple.",
                author: "Maria Rodriguez",
                role: "Marketing Director"
              },
              {
                quote: "As a freelancer, mentoring has become a reliable income stream while allowing me to give back to my creative community.",
                author: "James Wilson",
                role: "UX Designer & Freelancer"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        size={20}
                        className="text-yellow-500 fill-yellow-500"
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
          <h2 className="text-3xl font-bold mb-4">Ready to Become a Mentor?</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-10">
            Join our community of mentors today and start making a difference while earning for your expertise.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              className="bg-[#4A90E2] hover:bg-[#3A80D2] text-white text-lg rounded-lg flex items-center justify-center gap-2 px-8 py-6"
              onClick={() => navigate('/auth')}
            >
              Sign Up as a Mentor
              <ArrowRight size={20} />
            </Button>
            <Button
              variant="outline"
              className="border-[#4A90E2] text-[#4A90E2] hover:bg-[#4A90E2] hover:bg-opacity-10 text-lg rounded-lg px-8 py-6"
              onClick={() => navigate('/how-it-works')}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "How much can I earn as a mentor?",
                answer: "Earnings vary based on your expertise, industry, and how many hours you choose to mentor. Most mentors on our platform charge between $50-$200 per hour."
              },
              {
                question: "Do I need special qualifications to become a mentor?",
                answer: "While formal qualifications aren't required, we do verify your professional experience. The most important qualification is having real-world experience in your field that others can learn from."
              },
              {
                question: "How much time do I need to commit?",
                answer: "It's completely flexible. You set your own availability and can adjust it anytime. Some mentors offer just 1-2 hours per week, while others dedicate more time."
              },
              {
                question: "How do payments work?",
                answer: "Mentees pay through our secure platform. After each successful session, funds are released to your account. You can withdraw earnings to your bank account at any time."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BecomeAMentor;
