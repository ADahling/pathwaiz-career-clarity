import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, MapPin, Clock, BadgeDollarSign, ChevronDown } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const FindAMentorPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [priceRange, setPriceRange] = React.useState([20, 200]);
  const [availabilityFilter, setAvailabilityFilter] = React.useState<string[]>([]);
  const [experienceFilter, setExperienceFilter] = React.useState<string[]>([]);
  const [showFilters, setShowFilters] = React.useState(false);

  // Expanded mentorship categories
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'career-development', name: 'Career Development' },
    { id: 'personal-growth', name: 'Personal Growth' },
    { id: 'business-advice', name: 'Business Advice' },
    { id: 'creative-pursuits', name: 'Creative Pursuits' },
    { id: 'technical-expertise', name: 'Technical Expertise' },
    { id: 'skill-building', name: 'Skill Building' },
  ];

  // Sample mentors data with expanded focus areas
  const mentors = [
    {
      id: 1,
      name: 'Alex Johnson',
      title: 'Career Coach & Personal Development Mentor',
      rating: 4.9,
      reviews: 124,
      hourlyRate: 85,
      location: 'San Francisco, CA',
      categories: ['career-development', 'personal-growth'],
      availability: ['Weekdays', 'Evenings'],
      experience: 8,
      imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
      bio: 'Helping professionals navigate career transitions and personal growth challenges with actionable strategies.',
      specialties: ['Career Transitions', 'Work-Life Balance', 'Leadership Development']
    },
    {
      id: 2,
      name: 'Sarah Chen',
      title: 'Business Strategist & Startup Advisor',
      rating: 4.8,
      reviews: 98,
      hourlyRate: 120,
      location: 'New York, NY',
      categories: ['business-advice', 'career-development'],
      availability: ['Weekends', 'Evenings'],
      experience: 12,
      imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
      bio: 'Former startup founder and business executive helping entrepreneurs build sustainable businesses.',
      specialties: ['Business Strategy', 'Fundraising', 'Market Analysis']
    },
    {
      id: 3,
      name: 'Michael Rivera',
      title: 'Creative Director & Artistic Mentor',
      rating: 4.7,
      reviews: 56,
      hourlyRate: 75,
      location: 'Los Angeles, CA',
      categories: ['creative-pursuits', 'skill-building'],
      availability: ['Weekdays', 'Weekends'],
      experience: 15,
      imageUrl: 'https://randomuser.me/api/portraits/men/67.jpg',
      bio: 'Award-winning creative director helping artists and designers develop their unique voice and portfolio.',
      specialties: ['Portfolio Development', 'Creative Direction', 'Artistic Growth']
    },
    {
      id: 4,
      name: 'Emily Patel',
      title: 'Software Engineer & Technical Coach',
      rating: 4.9,
      reviews: 87,
      hourlyRate: 95,
      location: 'Seattle, WA',
      categories: ['technical-expertise', 'skill-building'],
      availability: ['Weekdays', 'Evenings'],
      experience: 10,
      imageUrl: 'https://randomuser.me/api/portraits/women/33.jpg',
      bio: 'Senior engineer at a major tech company helping developers level up their technical skills and career.',
      specialties: ['Software Architecture', 'Technical Interviews', 'Career Growth in Tech']
    },
    {
      id: 5,
      name: 'David Wilson',
      title: 'Life Coach & Wellness Mentor',
      rating: 4.8,
      reviews: 112,
      hourlyRate: 65,
      location: 'Austin, TX',
      categories: ['personal-growth', 'skill-building'],
      availability: ['Weekends', 'Evenings'],
      experience: 7,
      imageUrl: 'https://randomuser.me/api/portraits/men/22.jpg',
      bio: 'Certified life coach helping people achieve balance, set meaningful goals, and develop healthy habits.',
      specialties: ['Goal Setting', 'Habit Formation', 'Mindfulness Practice']
    },
    {
      id: 6,
      name: 'Olivia Martinez',
      title: 'Financial Advisor & Wealth Coach',
      rating: 4.7,
      reviews: 76,
      hourlyRate: 110,
      location: 'Chicago, IL',
      categories: ['business-advice', 'personal-growth'],
      availability: ['Weekdays'],
      experience: 14,
      imageUrl: 'https://randomuser.me/api/portraits/women/17.jpg',
      bio: 'Helping individuals and small business owners make sound financial decisions and build wealth.',
      specialties: ['Financial Planning', 'Investment Strategy', 'Business Finance']
    }
  ];

  // Filter mentors based on selected filters
  const filteredMentors = mentors.filter(mentor => {
    // Filter by search query
    if (searchQuery && !mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !mentor.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !mentor.bio.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !mentor.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    
    // Filter by category
    if (selectedCategory !== 'all' && !mentor.categories.includes(selectedCategory)) {
      return false;
    }
    
    // Filter by price range
    if (mentor.hourlyRate < priceRange[0] || mentor.hourlyRate > priceRange[1]) {
      return false;
    }
    
    // Filter by availability
    if (availabilityFilter.length > 0 && !availabilityFilter.some(a => mentor.availability.includes(a))) {
      return false;
    }
    
    // Filter by experience
    if (experienceFilter.length > 0) {
      const experienceYears = mentor.experience;
      if (experienceFilter.includes('0-3') && (experienceYears < 0 || experienceYears > 3)) {
        if (!experienceFilter.includes('4-7') && !experienceFilter.includes('8-12') && !experienceFilter.includes('13+')) {
          return false;
        }
      }
      if (experienceFilter.includes('4-7') && (experienceYears < 4 || experienceYears > 7)) {
        if (!experienceFilter.includes('0-3') && !experienceFilter.includes('8-12') && !experienceFilter.includes('13+')) {
          return false;
        }
      }
      if (experienceFilter.includes('8-12') && (experienceYears < 8 || experienceYears > 12)) {
        if (!experienceFilter.includes('0-3') && !experienceFilter.includes('4-7') && !experienceFilter.includes('13+')) {
          return false;
        }
      }
      if (experienceFilter.includes('13+') && experienceYears < 13) {
        if (!experienceFilter.includes('0-3') && !experienceFilter.includes('4-7') && !experienceFilter.includes('8-12')) {
          return false;
        }
      }
    }
    
    return true;
  });

  const toggleAvailabilityFilter = (value: string) => {
    setAvailabilityFilter(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value) 
        : [...prev, value]
    );
  };

  const toggleExperienceFilter = (value: string) => {
    setExperienceFilter(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value) 
        : [...prev, value]
    );
  };

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 premium-gradient-text">
              Find Your Perfect Mentor
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Connect with experienced mentors across various domains who can help you grow personally and professionally.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name, expertise, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="premium-input pl-10 py-6 text-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <div className="sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Filters</h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setPriceRange([20, 200]);
                      setAvailabilityFilter([]);
                      setExperienceFilter([]);
                    }}
                  >
                    Reset All
                  </Button>
                </div>

                <div className="lg:hidden mb-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowFilters(!showFilters)}
                    className="w-full flex items-center justify-between"
                  >
                    <span>Show Filters</span>
                    <Filter size={16} />
                  </Button>
                </div>

                <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                  {/* Category Filter */}
                  <div className="premium-card p-4">
                    <h3 className="font-medium mb-3">Category</h3>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="premium-input">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="premium-dropdown">
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range Filter */}
                  <div className="premium-card p-4">
                    <h3 className="font-medium mb-3">Price Range</h3>
                    <div className="px-2">
                      <Slider
                        defaultValue={[20, 200]}
                        min={20}
                        max={200}
                        step={5}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        className="my-6"
                      />
                      <div className="flex items-center justify-between text-sm">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Availability Filter */}
                  <div className="premium-card p-4">
                    <h3 className="font-medium mb-3">Availability</h3>
                    <div className="space-y-2">
                      {['Weekdays', 'Weekends', 'Evenings'].map((item) => (
                        <div key={item} className="flex items-center">
                          <Checkbox
                            id={`availability-${item}`}
                            checked={availabilityFilter.includes(item)}
                            onCheckedChange={() => toggleAvailabilityFilter(item)}
                            className="mr-2"
                          />
                          <Label htmlFor={`availability-${item}`} className="text-sm cursor-pointer">
                            {item}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Experience Filter */}
                  <div className="premium-card p-4">
                    <h3 className="font-medium mb-3">Experience</h3>
                    <div className="space-y-2">
                      {['0-3', '4-7', '8-12', '13+'].map((item) => (
                        <div key={item} className="flex items-center">
                          <Checkbox
                            id={`experience-${item}`}
                            checked={experienceFilter.includes(item)}
                            onCheckedChange={() => toggleExperienceFilter(item)}
                            className="mr-2"
                          />
                          <Label htmlFor={`experience-${item}`} className="text-sm cursor-pointer">
                            {item === '13+' ? '13+ years' : `${item} years`}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mentors List */}
            <div className="lg:w-3/4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  {filteredMentors.length} {filteredMentors.length === 1 ? 'Mentor' : 'Mentors'} Available
                </h2>
                <Select defaultValue="recommended">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="premium-dropdown">
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="experience">Most Experienced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filteredMentors.length === 0 ? (
                <div className="premium-card p-8 text-center">
                  <h3 className="text-lg font-medium mb-2">No mentors found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters or search query</p>
                  <Button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setPriceRange([20, 200]);
                      setAvailabilityFilter([]);
                      setExperienceFilter([]);
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredMentors.map((mentor) => (
                    <Card key={mentor.id} className="premium-card overflow-hidden">
                      <CardHeader className="pb-0">
                        <div className="flex items-start gap-4">
                          <div className="premium-avatar h-16 w-16 rounded-full overflow-hidden">
                            <img 
                              src={mentor.imageUrl} 
                              alt={mentor.name} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg">{mentor.name}</CardTitle>
                            <CardDescription className="text-sm mt-1">{mentor.title}</CardDescription>
                            <div className="flex items-center mt-2">
                              <div className="flex items-center text-yellow-500 mr-2">
                                <Star className="fill-current h-4 w-4" />
                                <span className="ml-1 text-sm font-medium">{mentor.rating}</span>
                              </div>
                              <span className="text-sm text-gray-500">({mentor.reviews} reviews)</span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {mentor.categories.map((category) => {
                            const categoryName = categories.find(c => c.id === category)?.name || category;
                            return (
                              <Badge key={category} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                                {categoryName}
                              </Badge>
                            );
                          })}
                        </div>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{mentor.bio}</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-gray-600">
                            <BadgeDollarSign className="h-4 w-4 mr-2 text-blue-600" />
                            <span>${mentor.hourlyRate}/hour</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                            <span>{mentor.location}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-2 text-blue-600" />
                            <span>{mentor.availability.join(', ')}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button asChild className="w-full premium-gradient-bg text-white">
                          <Link to={`/mentor/${mentor.id}`}>View Profile</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="premium-card">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  How do I choose the right mentor?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  Consider your specific goals, the mentor's expertise, and their experience. 
                  You can filter mentors by category, read their profiles, and check reviews from other mentees. 
                  Many mentors also offer a brief introductory session to ensure it's a good fit.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="premium-card">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  How much does mentorship cost?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  Mentors set their own rates based on their experience and expertise. 
                  Rates typically range from $20 to $200+ per hour. You can filter mentors by price range 
                  to find someone who fits your budget.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="premium-card">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  How do mentorship sessions work?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  Sessions are typically conducted via video call. After booking, you'll receive a confirmation 
                  with a link to join the session. You can also message your mentor beforehand to discuss 
                  specific topics you'd like to cover.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4" className="premium-card">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  What if I'm not satisfied with my session?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  We have a satisfaction guarantee. If you're not satisfied with your session, 
                  contact our support team within 24 hours, and we'll help resolve the issue or 
                  provide a refund according to our policy.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5" className="premium-card">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  Can I become a mentor on Pathwaiz?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  Yes! If you have expertise and experience you'd like to share, we welcome you to apply. 
                  Visit our "Become a Mentor" page to learn more about the application process and requirements.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Growth Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Connect with mentors who can help you achieve your personal and professional goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-gray-100">
              <Link to="/auth">Sign Up Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
              <Link to="/how-it-works">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default FindAMentorPage;
