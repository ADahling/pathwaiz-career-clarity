import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

// Premium styling imports
import '../styles/premium-design-system.css';

const MenteeProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // Placeholder for actual API call
        const { data: menteeProfile, error } = await supabase.from('mentee_profiles').select('*').eq('id', user.id).single();

        if (error) throw error;

        // If no data from API, use placeholder data
        if (!menteeProfile) {
          setProfile({
            id: user?.id,
            name: 'Jamie Smith',
            title: 'Marketing Specialist',
            bio: 'Passionate about digital marketing and looking to grow my career in the tech industry. Seeking mentorship to help navigate my next career move.',
            interests: ['Digital Marketing', 'Content Strategy', 'Brand Development', 'Social Media'],
            goals: [
              'Transition to a senior marketing role',
              'Develop leadership skills',
              'Learn advanced analytics'
            ],
            profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
            location: 'San Francisco, CA',
            education: [
              { institution: 'University of California, Berkeley', degree: 'BA Marketing', year: '2018' }
            ],
            upcomingSessions: [
              {
                id: '1',
                mentorName: 'Alex Johnson',
                mentorTitle: 'Senior Product Manager',
                mentorImage: 'https://randomuser.me/api/portraits/men/32.jpg',
                date: '2023-05-25',
                time: '10:00 AM',
                duration: 60,
                topic: 'Career Transition Strategy'
              }
            ],
            pastSessions: [
              {
                id: '2',
                mentorName: 'Sarah Williams',
                mentorTitle: 'Marketing Director',
                mentorImage: 'https://randomuser.me/api/portraits/women/68.jpg',
                date: '2023-04-15',
                time: '2:00 PM',
                duration: 30,
                topic: 'Digital Marketing Trends',
                rating: 5,
                feedback: 'Great session! Sarah provided valuable insights on current marketing trends.'
              }
            ]
          });
        } else {
          setProfile(menteeProfile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="premium-loader">
          <div className="spinner"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="premium-error-card">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find your profile. Please complete your profile setup to continue.</p>
          <Link to="/onboarding" className="premium-button-primary">
            Complete Profile
          </Link>
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
                  src={profile.profileImage || 'https://randomuser.me/api/portraits/women/44.jpg'} 
                  alt={profile.name} 
                  className="premium-avatar"
                />
                <div className="premium-avatar-badge">
                  <span className="text-sm font-medium">Mentee</span>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="premium-heading-1 mb-2">{profile.name}</h1>
                    <p className="premium-subheading mb-3">{profile.title}</p>
                    <p className="premium-text-sm text-gray-600 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {profile.location}
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link to="/edit-profile" className="premium-button-primary">
                      Edit Profile
                    </Link>
                    <Link to="/find-a-mentor" className="premium-button-secondary">
                      Find Mentors
                    </Link>
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
            className={`premium-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button 
            className={`premium-tab ${activeTab === 'sessions' ? 'active' : ''}`}
            onClick={() => setActiveTab('sessions')}
          >
            Sessions
          </button>
          <button 
            className={`premium-tab ${activeTab === 'goals' ? 'active' : ''}`}
            onClick={() => setActiveTab('goals')}
          >
            Goals
          </button>
          <button 
            className={`premium-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="premium-container px-4 sm:px-6 lg:px-8 pb-16">
        <div className="premium-tab-content">
          {activeTab === 'profile' && (
            <div className="premium-card">
              <h2 className="premium-heading-2 mb-4">About Me</h2>
              <p className="premium-text mb-8">{profile.bio}</p>
              
              <h3 className="premium-heading-3 mb-3">Interests</h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {profile.interests && profile.interests.map((interest, index) => (
                  <span key={index} className="premium-chip">
                    {interest}
                  </span>
                ))}
              </div>
              
              <div className="premium-divider my-8"></div>
              
              <h3 className="premium-heading-3 mb-3">Education</h3>
              <div className="space-y-4">
                {profile.education && profile.education.map((edu, index) => (
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
            </div>
          )}
          
          {activeTab === 'sessions' && (
            <div>
              <div className="premium-card mb-8">
                <h2 className="premium-heading-2 mb-6">Upcoming Sessions</h2>
                
                {profile.upcomingSessions && profile.upcomingSessions.length > 0 ? (
                  <div className="space-y-6">
                    {profile.upcomingSessions.map((session, index) => (
                      <div key={index} className="premium-session-card">
                        <div className="flex items-center gap-4">
                          <img 
                            src={session.mentorImage} 
                            alt={session.mentorName} 
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="premium-heading-3">{session.mentorName}</h3>
                            <p className="premium-text-sm text-gray-600">{session.mentorTitle}</p>
                          </div>
                        </div>
                        
                        <div className="premium-divider my-4"></div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="premium-text-sm text-gray-500">Date & Time</p>
                            <p className="premium-text">
                              {new Date(session.date).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                            <p className="premium-text">{session.time} ({session.duration} min)</p>
                          </div>
                          
                          <div>
                            <p className="premium-text-sm text-gray-500">Topic</p>
                            <p className="premium-text">{session.topic}</p>
                          </div>
                          
                          <div className="flex items-end justify-end">
                            <div className="flex gap-2">
                              <button className="premium-button-secondary">Reschedule</button>
                              <button className="premium-button-primary">Join Call</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="premium-empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="premium-heading-3 mb-2">No Upcoming Sessions</h3>
                    <p className="premium-text-sm text-gray-600 mb-6">You don't have any upcoming mentoring sessions scheduled.</p>
                    <Link to="/find-a-mentor" className="premium-button-primary">
                      Find a Mentor
                    </Link>
                  </div>
                )}
              </div>
              
              <div className="premium-card">
                <h2 className="premium-heading-2 mb-6">Past Sessions</h2>
                
                {profile.pastSessions && profile.pastSessions.length > 0 ? (
                  <div className="space-y-6">
                    {profile.pastSessions.map((session, index) => (
                      <div key={index} className="premium-session-card">
                        <div className="flex items-center gap-4">
                          <img 
                            src={session.mentorImage} 
                            alt={session.mentorName} 
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="premium-heading-3">{session.mentorName}</h3>
                            <p className="premium-text-sm text-gray-600">{session.mentorTitle}</p>
                          </div>
                        </div>
                        
                        <div className="premium-divider my-4"></div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="premium-text-sm text-gray-500">Date & Time</p>
                            <p className="premium-text">
                              {new Date(session.date).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                            <p className="premium-text">{session.time} ({session.duration} min)</p>
                            
                            <div className="mt-3">
                              <p className="premium-text-sm text-gray-500">Topic</p>
                              <p className="premium-text">{session.topic}</p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="premium-text-sm text-gray-500">Your Feedback</p>
                            <div className="flex items-center mb-2">
                              {[...Array(5)].map((_, i) => (
                                <svg 
                                  key={i}
                                  xmlns="http://www.w3.org/2000/svg" 
                                  className={`h-5 w-5 ${i < session.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                  viewBox="0 0 20 20" 
                                  fill="currentColor"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <p className="premium-text">{session.feedback}</p>
                            
                            <div className="mt-4 flex justify-end">
                              <button className="premium-button-secondary">Book Again</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="premium-empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="premium-heading-3 mb-2">No Past Sessions</h3>
                    <p className="premium-text-sm text-gray-600 mb-6">You haven't completed any mentoring sessions yet.</p>
                    <Link to="/find-a-mentor" className="premium-button-primary">
                      Find a Mentor
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'goals' && (
            <div className="premium-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="premium-heading-2">My Goals</h2>
                <button className="premium-button-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Goal
                </button>
              </div>
              
              {profile.goals && profile.goals.length > 0 ? (
                <div className="space-y-4">
                  {profile.goals.map((goal, index) => (
                    <div key={index} className="premium-goal-card">
                      <div className="flex items-start">
                        <div className="premium-checkbox">
                          <input type="checkbox" id={`goal-${index}`} />
                          <label htmlFor={`goal-${index}`}></label>
                        </div>
                        <div className="ml-3">
                          <h3 className="premium-heading-4">{goal}</h3>
                          <div className="flex items-center mt-2">
                            <div className="premium-progress-bar">
                              <div 
                                className="premium-progress-fill" 
                                style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                              ></div>
                            </div>
                            <button className="premium-icon-button ml-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="premium-empty-state">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  <h3 className="premium-heading-3 mb-2">No Goals Set</h3>
                  <p className="premium-text-sm text-gray-600 mb-6">You haven't set any goals yet. Setting clear goals helps your mentors guide you more effectively.</p>
                  <button className="premium-button-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Your First Goal
                  </button>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="premium-card">
              <h2 className="premium-heading-2 mb-6">Account Settings</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="premium-heading-3 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="premium-form-group">
                      <label className="premium-label">Full Name</label>
                      <input type="text" className="premium-input" value={profile.name} readOnly />
                    </div>
                    <div className="premium-form-group">
                      <label className="premium-label">Email Address</label>
                      <input type="email" className="premium-input" value="jamie.smith@example.com" readOnly />
                    </div>
                    <div className="premium-form-group">
                      <label className="premium-label">Phone Number</label>
                      <input type="tel" className="premium-input" placeholder="Add your phone number" />
                    </div>
                    <div className="premium-form-group">
                      <label className="premium-label">Location</label>
                      <input type="text" className="premium-input" value={profile.location} readOnly />
                    </div>
                  </div>
                </div>
                
                <div className="premium-divider"></div>
                
                <div>
                  <h3 className="premium-heading-3 mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    <div className="premium-toggle-group">
                      <div>
                        <h4 className="premium-heading-4">Email Notifications</h4>
                        <p className="premium-text-sm text-gray-600">Receive emails about session reminders, messages, and updates</p>
                      </div>
                      <div className="premium-toggle">
                        <input type="checkbox" id="email-notifications" defaultChecked />
                        <label htmlFor="email-notifications"></label>
                      </div>
                    </div>
                    
                    <div className="premium-toggle-group">
                      <div>
                        <h4 className="premium-heading-4">SMS Notifications</h4>
                        <p className="premium-text-sm text-gray-600">Receive text messages for session reminders</p>
                      </div>
                      <div className="premium-toggle">
                        <input type="checkbox" id="sms-notifications" />
                        <label htmlFor="sms-notifications"></label>
                      </div>
                    </div>
                    
                    <div className="premium-toggle-group">
                      <div>
                        <h4 className="premium-heading-4">Marketing Communications</h4>
                        <p className="premium-text-sm text-gray-600">Receive updates about new features and mentors</p>
                      </div>
                      <div className="premium-toggle">
                        <input type="checkbox" id="marketing-communications" defaultChecked />
                        <label htmlFor="marketing-communications"></label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="premium-divider"></div>
                
                <div>
                  <h3 className="premium-heading-3 mb-4">Account Security</h3>
                  <div className="space-y-4">
                    <button className="premium-button-secondary">
                      Change Password
                    </button>
                    <button className="premium-button-secondary">
                      Enable Two-Factor Authentication
                    </button>
                  </div>
                </div>
                
                <div className="premium-divider"></div>
                
                <div className="flex justify-end">
                  <button className="premium-button-primary">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenteeProfile;
