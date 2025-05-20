import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Users, 
  Award, 
  Clock, 
  Calendar, 
  CheckCircle, 
  ArrowRight,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

const BecomeAMentorPage: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 premium-gradient-text">
              Share Your Expertise as a Mentor
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Join our community of mentors and make a meaningful impact by sharing your knowledge and experience with others.
            </p>
            <Button size="lg" asChild className="premium-gradient-bg text-white">
              <Link to="/auth?role=mentor">Apply to Become a Mentor</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Become a Mentor?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="premium-card">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Make an Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Share your knowledge and experience to help others grow and achieve their goals. Make a lasting impact on someone's personal or professional journey.
                </p>
              </CardContent>
            </Card>
            
            <Card className="premium-card">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Earn Income</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Set your own rates and schedule. Earn additional income while doing something meaningful and rewarding on your own terms.
                </p>
              </CardContent>
            </Card>
            
            <Card className="premium-card">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Build Your Reputation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Establish yourself as a thought leader in your field. Enhance your professional profile and expand your network with like-minded individuals.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-blue-200"></div>
              
              {/* Steps */}
              <div className="space-y-12">
                {/* Step 1 */}
                <div className="relative flex flex-col md:flex-row items-center md:justify-between">
                  <div className="flex-1 md:pr-8 md:text-right order-2 md:order-1">
                    <h3 className="text-xl font-bold mb-2">Apply</h3>
                    <p className="text-gray-600">
                      Complete our application form with your expertise, experience, and the areas where you can provide mentorship.
                    </p>
                  </div>
                  <div className="order-1 md:order-2 mb-4 md:mb-0">
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold z-10 relative">
                      1
                    </div>
                  </div>
                  <div className="flex-1 md:pl-8 order-3">
                    {/* Empty div for layout */}
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="relative flex flex-col md:flex-row items-center md:justify-between">
                  <div className="flex-1 md:pr-8 order-2 md:order-1">
                    {/* Empty div for layout */}
                  </div>
                  <div className="order-1 md:order-2 mb-4 md:mb-0">
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold z-10 relative">
                      2
                    </div>
                  </div>
                  <div className="flex-1 md:pl-8 md:text-left order-3">
                    <h3 className="text-xl font-bold mb-2">Profile Review</h3>
                    <p className="text-gray-600">
                      Our team reviews your application to ensure quality and expertise. We may request additional information or verification.
                    </p>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="relative flex flex-col md:flex-row items-center md:justify-between">
                  <div className="flex-1 md:pr-8 md:text-right order-2 md:order-1">
                    <h3 className="text-xl font-bold mb-2">Set Up Your Profile</h3>
                    <p className="text-gray-600">
                      Once approved, create your mentor profile with your bio, expertise, availability, and session rates.
                    </p>
                  </div>
                  <div className="order-1 md:order-2 mb-4 md:mb-0">
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold z-10 relative">
                      3
                    </div>
                  </div>
                  <div className="flex-1 md:pl-8 order-3">
                    {/* Empty div for layout */}
                  </div>
                </div>
                
                {/* Step 4 */}
                <div className="relative flex flex-col md:flex-row items-center md:justify-between">
                  <div className="flex-1 md:pr-8 order-2 md:order-1">
                    {/* Empty div for layout */}
                  </div>
                  <div className="order-1 md:order-2 mb-4 md:mb-0">
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold z-10 relative">
                      4
                    </div>
                  </div>
                  <div className="flex-1 md:pl-8 md:text-left order-3">
                    <h3 className="text-xl font-bold mb-2">Start Mentoring</h3>
                    <p className="text-gray-600">
                      Begin receiving session requests from mentees. Conduct sessions via our platform and get paid for your expertise.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mentorship Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Mentorship Categories</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            We welcome mentors from various backgrounds and expertise areas. Here are some of the categories where mentors can make an impact:
          </p>
          
          <Tabs defaultValue="career" className="max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-8">
              <TabsTrigger value="career">Career</TabsTrigger>
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
              <TabsTrigger value="creative">Creative</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
            </TabsList>
            
            <TabsContent value="career" className="premium-card p-6">
              <h3 className="text-xl font-bold mb-4">Career Development</h3>
              <p className="text-gray-600 mb-4">
                Help mentees navigate their career paths, prepare for interviews, negotiate salaries, or transition to new roles or industries.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Career Transitions</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Resume Building</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Interview Preparation</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Salary Negotiation</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Leadership Development</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Workplace Navigation</span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="personal" className="premium-card p-6">
              <h3 className="text-xl font-bold mb-4">Personal Growth</h3>
              <p className="text-gray-600 mb-4">
                Guide mentees in their personal development journey, helping them set and achieve goals, build confidence, and improve their overall well-being.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Goal Setting</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Confidence Building</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Work-Life Balance</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Stress Management</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Habit Formation</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Mindfulness Practice</span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="business" className="premium-card p-6">
              <h3 className="text-xl font-bold mb-4">Business Advice</h3>
              <p className="text-gray-600 mb-4">
                Share your business expertise with entrepreneurs and professionals looking to start or grow their businesses, improve operations, or solve specific challenges.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Startup Guidance</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Business Strategy</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Marketing & Sales</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Financial Planning</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Operations</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Fundraising</span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="creative" className="premium-card p-6">
              <h3 className="text-xl font-bold mb-4">Creative Pursuits</h3>
              <p className="text-gray-600 mb-4">
                Guide mentees in developing their creative skills, building portfolios, finding their unique voice, or navigating the creative industry.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Portfolio Development</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Creative Direction</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Writing & Publishing</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Visual Arts</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Music & Performance</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Design & UX</span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="technical" className="premium-card p-6">
              <h3 className="text-xl font-bold mb-4">Technical Expertise</h3>
              <p className="text-gray-600 mb-4">
                Share your technical knowledge with those looking to develop their skills, solve specific technical challenges, or advance in technical fields.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Software Development</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Data Science</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">AI & Machine Learning</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">DevOps & Cloud</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Cybersecurity</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Engineering</span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="skills" className="premium-card p-6">
              <h3 className="text-xl font-bold mb-4">Skill Building</h3>
              <p className="text-gray-600 mb-4">
                Help mentees develop specific skills that can enhance their personal or professional lives, from public speaking to financial literacy.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Public Speaking</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Negotiation</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Financial Literacy</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Time Management</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Communication</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Leadership</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Mentors Say</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="premium-card">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="premium-avatar h-12 w-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src="https://randomuser.me/api/portraits/women/45.jpg" 
                      alt="Mentor" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Jennifer Lee</CardTitle>
                    <CardDescription>Marketing Executive</CardDescription>
                  </div>
                </div>
                <div className="flex text-yellow-500 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 italic">
                  "Being a mentor on Pathwaiz has been incredibly rewarding. I've connected with amazing mentees who are passionate about marketing, and I've been able to share my knowledge while also learning from their fresh perspectives."
                </p>
              </CardContent>
            </Card>
            
            <Card className="premium-card">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="premium-avatar h-12 w-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src="https://randomuser.me/api/portraits/men/32.jpg" 
                      alt="Mentor" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Marcus Johnson</CardTitle>
                    <CardDescription>Software Engineer</CardDescription>
                  </div>
                </div>
                <div className="flex text-yellow-500 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 italic">
                  "The platform makes it easy to manage my schedule and connect with mentees. I've been able to help junior developers navigate their careers while earning additional income on my own terms."
                </p>
              </CardContent>
            </Card>
            
            <Card className="premium-card">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="premium-avatar h-12 w-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src="https://randomuser.me/api/portraits/women/68.jpg" 
                      alt="Mentor" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Sophia Rodriguez</CardTitle>
                    <CardDescription>Life Coach</CardDescription>
                  </div>
                </div>
                <div className="flex text-yellow-500 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 italic">
                  "Pathwaiz has expanded my coaching practice and allowed me to reach people I wouldn't have otherwise. The platform handles all the logistics so I can focus on what I do best—helping people achieve their personal growth goals."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="text-lg">How much can I earn as a mentor?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  You set your own rates based on your expertise and experience. Mentors on our platform charge anywhere from $20 to $200+ per hour, with the average being around $75-100 per hour.
                </p>
              </CardContent>
            </Card>
            
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="text-lg">How much time do I need to commit?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  It's completely flexible. You can set your own availability and accept as many or as few sessions as you'd like. Some mentors dedicate a few hours per week, while others make it a significant part of their professional activities.
                </p>
              </CardContent>
            </Card>
            
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="text-lg">What are the requirements to become a mentor?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We look for mentors with significant experience and expertise in their field (typically 5+ years), strong communication skills, and a genuine desire to help others. We review all applications to ensure quality.
                </p>
              </CardContent>
            </Card>
            
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="text-lg">How do I get paid?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Payments are processed securely through our platform. We handle all payment processing and you receive payouts via direct deposit or PayPal. Our platform fee is 15% of the session cost.
                </p>
              </CardContent>
            </Card>
            
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="text-lg">What if I need to cancel a session?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We understand that things come up. You can reschedule or cancel sessions with at least 24 hours' notice without penalty. For last-minute cancellations, our standard cancellation policy applies.
                </p>
              </CardContent>
            </Card>
            
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="text-lg">How are sessions conducted?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Sessions are typically conducted via our integrated video platform. You can also use screen sharing for demonstrations or reviews. All communication with mentees is handled securely through our platform.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make an Impact?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community of mentors and start sharing your expertise today.
          </p>
          <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-gray-100">
            <Link to="/auth?role=mentor" className="flex items-center">
              Apply Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default BecomeAMentorPage;
