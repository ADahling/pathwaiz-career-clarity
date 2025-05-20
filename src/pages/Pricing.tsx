import React from 'react';
import { Layout } from '@/components/Layout';
import { Link } from 'react-router-dom';
import { Clock, BadgeDollarSign, ArrowRight, Check } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const PricingPage: React.FC = () => {
  // Updated pricing options to reflect broader mentorship focus
  const pricingOptions = [
    {
      duration: 15,
      title: "Quick Advice",
      averagePrice: "$20-50",
      description: "Get targeted advice on a specific question",
      bestFor: [
        "Specific questions",
        "Quick decision validation",
        "Brief feedback sessions"
      ],
      featured: false
    },
    {
      duration: 30,
      title: "Deep Dive",
      averagePrice: "$40-100",
      description: "Explore topics in greater depth",
      bestFor: [
        "Problem-solving sessions",
        "Strategy discussions",
        "Detailed feedback"
      ],
      featured: true
    },
    {
      duration: 60,
      title: "Comprehensive Session",
      averagePrice: "$80-200",
      description: "Full mentoring session with detailed feedback",
      bestFor: [
        "In-depth discussions",
        "Comprehensive analysis",
        "Detailed planning sessions"
      ],
      featured: false
    }
  ];

  // Expanded mentorship categories
  const mentorshipCategories = [
    {
      title: "Career Development",
      description: "Career transitions, job hunting, and professional growth",
      icon: "briefcase"
    },
    {
      title: "Skill Building",
      description: "Develop specific skills with expert guidance",
      icon: "tool"
    },
    {
      title: "Personal Growth",
      description: "Life coaching, personal development, and goal setting",
      icon: "user"
    },
    {
      title: "Business Advice",
      description: "Entrepreneurship, startups, and business strategy",
      icon: "building"
    },
    {
      title: "Creative Pursuits",
      description: "Art, writing, music, and other creative endeavors",
      icon: "palette"
    },
    {
      title: "Technical Expertise",
      description: "Software development, design, and technical skills",
      icon: "code"
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 premium-gradient-text">
              Simple Pricing for Real Advice
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Connect with professionals who've been where you want to go. Our transparent pricing ensures you know exactly what you're paying for.
            </p>
          </div>
        </div>
      </section>

      {/* Mentorship Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-4">Explore Mentorship Categories</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Find mentors across various domains to help you grow personally and professionally
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentorshipCategories.map((category, index) => (
              <div key={index} className="premium-card p-6 hover:border-blue-300 border-2 border-transparent animate-float">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <span className="text-blue-600 text-xl">
                    {category.icon === "briefcase" && <i className="fas fa-briefcase"></i>}
                    {category.icon === "tool" && <i className="fas fa-tools"></i>}
                    {category.icon === "user" && <i className="fas fa-user"></i>}
                    {category.icon === "building" && <i className="fas fa-building"></i>}
                    {category.icon === "palette" && <i className="fas fa-palette"></i>}
                    {category.icon === "code" && <i className="fas fa-code"></i>}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <Button asChild variant="ghost" className="text-blue-600 p-0 hover:bg-transparent hover:text-blue-800">
                  <Link to={`/find-a-mentor?category=${category.title.toLowerCase().replace(/\s+/g, '-')}`} className="flex items-center">
                    Explore mentors
                    <ArrowRight size={16} className="ml-1" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-4">Choose Your Session Type</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Select the session length that best fits your needs and budget
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pricingOptions.map((option, index) => (
              <Card key={index} 
                className={`premium-card transform transition-all duration-300 hover:scale-105 ${
                  option.featured ? 'border-blue-400 shadow-lg relative overflow-hidden' : 'border-gray-200'
                }`}
              >
                {option.featured && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-lg font-medium text-sm">
                    Popular
                  </div>
                )}
                <CardHeader className={`${option.featured ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <Clock size={24} className={option.featured ? 'text-white' : 'text-blue-600'} />
                    <span className="text-xl font-bold">{option.duration} min</span>
                  </div>
                  <CardTitle className="text-2xl">{option.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow pt-6">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BadgeDollarSign className="text-blue-600" size={24} />
                      <span className="text-2xl font-bold premium-gradient-text">{option.averagePrice}</span>
                    </div>
                    <p className="text-gray-600">{option.description}</p>
                  </div>
                  <div className="mt-6">
                    <h4 className="font-medium mb-2">Best for:</h4>
                    <ul className="space-y-2">
                      {option.bestFor.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <Check size={16} className="text-blue-600 mr-2 mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className={`w-full ${option.featured ? 'premium-gradient-bg text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                    <Link to="/find-a-mentor" className="flex items-center justify-center">
                      Browse Mentors
                      <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-8">Compare Session Options</h2>
          
          <div className="overflow-x-auto rounded-lg border border-gray-200 premium-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[150px] font-bold">Duration</TableHead>
                  <TableHead className="font-bold">Description</TableHead>
                  <TableHead className="font-bold">Price Range</TableHead>
                  <TableHead className="font-bold">Best For</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pricingOptions.map((option) => (
                  <TableRow key={option.duration} 
                    className={`${option.featured ? 'bg-blue-50' : ''} hover:bg-gray-50 transition-colors`}>
                    <TableCell className="font-medium">
                      {option.duration} minutes
                    </TableCell>
                    <TableCell>{option.description}</TableCell>
                    <TableCell className="font-medium">{option.averagePrice}</TableCell>
                    <TableCell>{option.bestFor.join(", ")}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" 
                        className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                        <Link to="/find-a-mentor">
                          Select
                          <ArrowRight size={16} className="ml-1" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      {/* Pricing Notes */}
      <section className="py-16 bg-white">
        <div className="container-custom max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-6">How Pricing Works</h2>
          
          <div className="premium-card p-8 mb-8">
            <p className="text-lg mb-4">
              <strong>Mentors set their own rates.</strong> The platform takes a 20% commission to cover 
              transaction costs and maintain the service.
            </p>
            <p className="text-gray-600">
              Prices vary based on mentor experience level, domain expertise, and availability.
              All payments are processed securely, and you're only charged after the session is completed.
            </p>
          </div>
          
          <Button asChild size="lg" className="premium-gradient-bg text-white hover:shadow-lg transition-all">
            <Link to="/find-a-mentor" className="flex items-center">
              Browse Available Mentors 
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default PricingPage;
