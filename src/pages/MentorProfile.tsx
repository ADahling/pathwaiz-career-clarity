import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { StarRating } from '@/components/reviews/StarRating';
import { ReviewList } from '@/components/reviews/ReviewList';
import { BookingForm } from '@/components/booking/BookingForm';
import { AvailabilityCalendar } from '@/components/booking/AvailabilityCalendar';

// Premium styling imports
import '../styles/premium-design-system.css';

const MentorProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        setLoading(true);
        // Placeholder for actual API call
        const { data, error } = await supabase
          .from('mentors')
          .select('*, profiles(*), reviews(*)')
          .eq('id', id)
          .single();

        if (error) throw error;

        // If no data from API, use placeholder data
        if (!data) {
          setMentor({
            id: id,
            name: 'Alex Johnson',
            title: 'Senior Product Manager',
            company: 'Tech Innovations Inc.',
            bio: 'Experienced product leader with 10+ years in tech. Passionate about mentoring the next generation of product managers and helping them navigate their career paths.',
            expertise: ['Product Strategy', 'Career Transitions', 'Leadership', 'UX Design'],
            hourlyRate: 75,
            rating: 4.8,
            reviewCount: 24,
            availability: [
              { day: 'Monday', slots: ['10:00 AM', '2:00 PM', '4:00 PM'] },
              { day: 'Wednesday', slots: ['11:00 AM', '3:00 PM'] },
              { day: 'Friday', slots: ['9:00 AM', '1:00 PM', '5:00 PM'] }
            ],
            profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
            categories: ['Career Development', 'Leadership', 'Product Management'],
            education: [
              { institution: 'Stanford University', degree: 'MBA', year: '2015' },
              { institution: 'University of California', degree: 'BS Computer Science', year: '2010' }
            ],
            experience: [
              { 
                company: 'Tech Innovations Inc.', 
                role: 'Senior Product Manager', 
                duration: '2018 - Present',
                description: 'Leading product strategy and development for enterprise SaaS solutions.'
              },
              { 
                company: 'StartupXYZ', 
                role: 'Product Manager', 
                duration: '2015 - 2018',
                description: 'Managed the development of mobile applications with over 1M downloads.'
              }
            ],
            reviews: [
              {
                id: '1',
                userId: 'user1',
                userName: 'Sarah M.',
                rating: 5,
                date: '2023-04-15',
                comment: 'Alex provided invaluable insights for my career transition into product management. Highly recommend!'
              },
              {
                id: '2',
                userId: 'user2',
                userName: 'Michael T.',
                rating: 4,
                date: '2023-03-22',
                comment: 'Great session focused on product strategy. Alex shared practical frameworks I could immediately apply.'
              }
            ]
          });
        } else {
          setMentor(data);
        }
      } catch (error) {
        console.error('Error fetching mentor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentor();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="premium-loader">
          <div className="spinner"></div>
          <p className="mt-4 text-gray-600">Loading mentor profile...</p>
        </div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="premium-error-card">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Mentor Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the mentor you're looking for. They may have removed their profile or the URL might be incorrect.</p>
          <a href="/find-a-mentor" className="premium-button-primary">
            Browse Mentors
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section with Glassmorphism */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600 opacity-10 z-0"></div>
        <div className="premium-container relative z-10 pt-12 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="premium-profile-header">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className="premium-avatar-container">
                <img 
                  src={mentor.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg'} 
                  alt={mentor.name} 
                  className="premium-avatar"
                />
                <div className="premium-avatar-badge">
                  <StarRating rating={mentor.rating || 4.8} size="sm" />
                  <span className="text-sm font-medium ml-1">{mentor.reviewCount || 24} reviews</span>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="premium-heading-1 mb-2">{mentor.name}</h1>
                    <p className="premium-subheading mb-3">{mentor.title} at {mentor.company}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {mentor.categories && mentor.categories.map((category, index) => (
                        <span key={index} className="premium-badge">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => setShowBookingModal(true)}
                      className="premium-button-primary"
                    >
                      Book a Session
                    </button>
                    <button className="premium-button-secondary">
                      Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="premium-container px-4 sm:px-6 lg:px-8">
        <div className="premium-tabs">
          <button 
            className={`premium-tab ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
          <button 
            className={`premium-tab ${activeTab === 'experience' ? 'active' : ''}`}
            onClick={() => setActiveTab('experience')}
          >
            Experience
          </button>
          <button 
            className={`premium-tab ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </button>
          <button 
            className={`premium-tab ${activeTab === 'availability' ? 'active' : ''}`}
            onClick={() => setActiveTab('availability')}
          >
            Availability
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="premium-container px-4 sm:px-6 lg:px-8 pb-16">
        <div className="premium-tab-content">
          {activeTab === 'about' && (
            <div className="premium-card">
              <h2 className="premium-heading-2 mb-4">About Me</h2>
              <p className="premium-text mb-8">{mentor.bio}</p>
              
              <h3 className="premium-heading-3 mb-3">Areas of Expertise</h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {mentor.expertise && mentor.expertise.map((skill, index) => (
                  <span key={index} className="premium-chip">
                    {skill}
                  </span>
                ))}
              </div>
              
              <div className="premium-divider my-8"></div>
              
              <h3 className="premium-heading-3 mb-3">Education</h3>
              <div className="space-y-4 mb-8">
                {mentor.education && mentor.education.map((edu, index) => (
                  <div key={index} className="premium-list-item">
                    <div className="premium-list-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="premium-heading-4">{edu.institution}</h4>
                      <p className="premium-text-sm">{edu.degree}, {edu.year}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <h3 className="premium-heading-3 mb-3">Session Rate</h3>
              <div className="premium-pricing-card">
                <div className="flex items-center">
                  <span className="premium-price">${mentor.hourlyRate}</span>
                  <span className="premium-text-sm ml-2">/ hour</span>
                </div>
                <button 
                  onClick={() => setShowBookingModal(true)}
                  className="premium-button-primary mt-4"
                >
                  Book a Session
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'experience' && (
            <div className="premium-card">
              <h2 className="premium-heading-2 mb-6">Professional Experience</h2>
              
              <div className="premium-timeline">
                {mentor.experience && mentor.experience.map((exp, index) => (
                  <div key={index} className="premium-timeline-item">
                    <div className="premium-timeline-marker"></div>
                    <div className="premium-timeline-content">
                      <h3 className="premium-heading-3">{exp.role}</h3>
                      <div className="flex items-center premium-text-sm text-gray-600 mb-2">
                        <span>{exp.company}</span>
                        <span className="mx-2">•</span>
                        <span>{exp.duration}</span>
                      </div>
                      <p className="premium-text">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div className="premium-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="premium-heading-2">Reviews</h2>
                <div className="flex items-center">
                  <StarRating rating={mentor.rating || 4.8} size="md" />
                  <span className="ml-2 premium-text-sm font-medium">{mentor.rating} ({mentor.reviewCount} reviews)</span>
                </div>
              </div>
              
              <ReviewList reviews={mentor.reviews} />
            </div>
          )}
          
          {activeTab === 'availability' && (
            <div className="premium-card">
              <h2 className="premium-heading-2 mb-6">Availability</h2>
              <AvailabilityCalendar mentorId={mentor.id} availability={mentor.availability} />
              
              <div className="premium-info-card mt-8">
                <div className="flex items-start">
                  <div className="premium-info-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="premium-heading-4">Booking Information</h4>
                    <p className="premium-text-sm mt-1">Sessions are 60 minutes by default. You can book up to 2 weeks in advance. Cancellations are free up to 24 hours before the scheduled time.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Booking Modal */}
      {showBookingModal && (
        <div className="premium-modal">
          <div className="premium-modal-overlay" onClick={() => setShowBookingModal(false)}></div>
          <div className="premium-modal-container">
            <div className="premium-modal-header">
              <h3 className="premium-heading-3">Book a Session with {mentor.name}</h3>
              <button 
                className="premium-modal-close"
                onClick={() => setShowBookingModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="premium-modal-body">
              <BookingForm mentor={mentor} onClose={() => setShowBookingModal(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorProfile;
