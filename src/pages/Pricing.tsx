
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowRight, Clock, BadgeDollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const PricingPage: React.FC = () => {
  const pricingOptions = [
    {
      duration: 15,
      title: "Quick Advice",
      description: "Get targeted advice on a specific question",
      averagePrice: "$20-50",
      bestFor: ["Specific questions", "Career direction validation", "Quick resume feedback"]
    },
    {
      duration: 30,
      title: "Deep Dive",
      description: "Explore topics in greater depth",
      averagePrice: "$40-100",
      bestFor: ["Interview preparation", "Career transition strategy", "Portfolio review"],
      featured: true
    },
    {
      duration: 60,
      title: "Comprehensive Session",
      description: "Full mentoring session with detailed feedback",
      averagePrice: "$80-200",
      bestFor: ["In-depth career planning", "Skill gap analysis", "Extensive portfolio review", "Detailed project feedback"]
    }
  ];

  return (
    <>
      <NavBar />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="py-16 bg-pathwaiz-blue bg-opacity-5">
          <div className="container-custom text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Simple Pricing for Real Advice</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
              Connect with industry professionals who've been where you want to go.
              Our transparent pricing ensures you know exactly what you're paying for.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="grid md:grid-cols-3 gap-8">
              {pricingOptions.map((option) => (
                <Card key={option.duration} 
                  className={`flex flex-col ${option.featured ? 'border-pathwaiz-blue shadow-lg' : 'border-gray-200'}`}>
                  <CardHeader className={`${option.featured ? 'bg-pathwaiz-blue text-white' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <Clock size={24} className={option.featured ? 'text-white' : 'text-pathwaiz-blue'} />
                      <span className="text-xl font-bold">{option.duration} min</span>
                    </div>
                    <CardTitle className="text-2xl">{option.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow pt-6">
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <BadgeDollarSign className="text-pathwaiz-blue" size={24} />
                        <span className="text-2xl font-bold">{option.averagePrice}</span>
                      </div>
                      <p className="text-gray-600">{option.description}</p>
                    </div>
                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Best for:</h4>
                      <ul className="space-y-2">
                        {option.bestFor.map((item, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-pathwaiz-blue mr-2">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full bg-pathwaiz-blue hover:bg-opacity-90">
                      <Link to="/find-a-mentor">Browse Mentors</Link>
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
            
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Duration</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Price Range</TableHead>
                    <TableHead>Best For</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pricingOptions.map((option) => (
                    <TableRow key={option.duration} 
                      className={option.featured ? 'bg-blue-50' : ''}>
                      <TableCell className="font-medium">
                        {option.duration} minutes
                      </TableCell>
                      <TableCell>{option.description}</TableCell>
                      <TableCell>{option.averagePrice}</TableCell>
                      <TableCell>{option.bestFor.join(", ")}</TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="outline" 
                          className="border-pathwaiz-blue text-pathwaiz-blue hover:bg-pathwaiz-blue hover:text-white">
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
            
            <div className="bg-gray-50 p-6 rounded-xl mb-8">
              <p className="text-lg mb-4">
                <strong>Mentors set their own rates.</strong> The platform takes a 20% commission to cover 
                transaction costs and maintain the service.
              </p>
              <p className="text-gray-600">
                Prices vary based on mentor experience level, industry, and expertise.
                All payments are processed securely, and you're only charged after the session is completed.
              </p>
            </div>
            
            <Button asChild size="lg" className="bg-pathwaiz-blue hover:bg-opacity-90">
              <Link to="/find-a-mentor" className="flex items-center">
                Browse Available Mentors 
                <ArrowRight size={20} className="ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default PricingPage;
