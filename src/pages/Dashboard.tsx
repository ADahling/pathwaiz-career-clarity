import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
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
import {
  Users,
  Calendar,
  Clock,
  Briefcase,
  TrendingUp,
  MessageSquare,
  Star,
  ArrowRight,
  ChevronRight,
  Activity,
  Award,
  BarChart2,
  DollarSign,
  Video,
  Zap,
  Bell,
  Settings,
  User,
  Bookmark,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
  BookOpen
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Simulated data - would come from API in real implementation
  const mentorStats = {
    totalSessions: 24,
    upcomingSessions: [
      { id: 1, date: '2025-05-22T14:00:00', title: 'Career Strategy Session', with: 'Alex Johnson' },
      { id: 2, date: '2025-05-24T10:30:00', title: 'Resume Review', with: 'Sarah Williams' },
      { id: 3, date: '2025-05-25T16:00:00', title: 'Interview Preparation', with: 'Michael Chen' }
    ],
    earnings: {
      total: 2450,
      thisMonth: 750,
      lastMonth: 600
    },
    ratings: 4.8,
    reviewCount: 18,
    sessionsByCategory: [
      { name: 'Career Advice', value: 12 },
      { name: 'Resume Review', value: 5 },
      { name: 'Interview Prep', value: 4 },
      { name: 'Skill Development', value: 3 }
    ],
    monthlyEarnings: [
      { month: 'Jan', amount: 350 },
      { month: 'Feb', amount: 420 },
      { month: 'Mar', amount: 380 },
      { month: 'Apr', amount: 600 },
      { month: 'May', amount: 750 }
    ],
    recentReviews: [
      { id: 1, author: 'Alex Johnson', rating: 5, comment: 'Incredibly helpful session! Provided actionable advice that helped me land my dream job.', date: '2025-05-15' },
      { id: 2, author: 'Sarah Williams', rating: 5, comment: 'Great insights and personalized feedback on my resume. Highly recommend!', date: '2025-05-10' }
    ],
    notifications: [
      { id: 1, type: 'booking', message: 'New session request from Taylor Smith', time: '2 hours ago', read: false },
      { id: 2, type: 'review', message: 'New 5-star review from Alex Johnson', time: '1 day ago', read: true },
      { id: 3, type: 'payment', message: 'Payment of $120 received', time: '2 days ago', read: true }
    ]
  };

  const menteeStats = {
    totalSessions: 8,
    upcomingSessions: [
      { id: 1, date: '2025-05-23T15:00:00', title: 'Career Transition Strategy', with: 'Dr. Emily Chen' }
    ],
    pastSessions: [
      { id: 1, date: '2025-05-10T14:00:00', title: 'Resume Review', with: 'James Wilson' },
      { id: 2, date: '2025-05-03T10:30:00', title: 'Interview Preparation', with: 'Dr. Emily Chen' }
    ],
    favoriteCategories: [
      { name: 'Career Development', value: 5 },
      { name: 'Leadership', value: 3 },
      { name: 'Technical Skills', value: 2 }
    ],
    goalProgress: 65,
    savedMentors: [
      { id: 1, name: 'Dr. Emily Chen', expertise: 'Career Development', rating: 4.9 },
      { id: 2, name: 'James Wilson', expertise: 'Resume Writing', rating: 4.7 }
    ],
    notifications: [
      { id: 1, type: 'reminder', message: 'Upcoming session with Dr. Emily Chen tomorrow', time: '12 hours ago', read: false },
      { id: 2, type: 'message', message: 'New message from James Wilson', time: '2 days ago', read: true }
    ]
  };

  // Simulated API call
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleEditProfile = () => {
    navigate(userRole === 'mentor' ? '/mentor-profile' : '/mentee-profile');
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const renderMentorDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="premium-card bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.email || 'Mentor'}</h2>
            <p className="opacity-90">You have {mentorStats.upcomingSessions.length} upcoming sessions and {mentorStats.notifications.filter(n => !n.read).length} new notifications</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm">
              <Calendar className="mr-2 h-4 w-4" />
              View Schedule
            </Button>
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="premium-card hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-blue-500 mr-3" />
                  <div>
                    <div className="text-3xl font-bold">{mentorStats.totalSessions}</div>
                    <p className="text-xs text-muted-foreground">+3 this month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="premium-card hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-green-500 mr-3" />
                  <div>
                    <div className="text-3xl font-bold">${mentorStats.earnings.total}</div>
                    <p className="text-xs text-muted-foreground">+${mentorStats.earnings.thisMonth} this month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="premium-card hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Star className="h-8 w-8 text-amber-500 mr-3 fill-amber-500" />
                  <div>
                    <div className="text-3xl font-bold">{mentorStats.ratings}</div>
                    <p className="text-xs text-muted-foreground">from {mentorStats.reviewCount} reviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="premium-card hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Response Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Zap className="h-8 w-8 text-purple-500 mr-3" />
                  <div>
                    <div className="text-3xl font-bold">98%</div>
                    <p className="text-xs text-muted-foreground">Avg. response: 2h</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle>Session Categories</CardTitle>
                <CardDescription>Distribution of your mentoring sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mentorStats.sessionsByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {mentorStats.sessionsByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="premium-card">
              <CardHeader>
                <CardTitle>Monthly Earnings</CardTitle>
                <CardDescription>Your earnings over the past months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={mentorStats.monthlyEarnings}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Area type="monotone" dataKey="amount" stroke="#8884d8" fillOpacity={1} fill="url(#colorAmount)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Upcoming Sessions */}
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
              <CardDescription>Your scheduled mentoring sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {mentorStats.upcomingSessions.length > 0 ? (
                <div className="space-y-4">
                  {mentorStats.upcomingSessions.map((session) => (
                    <div key={session.id} className="flex items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="bg-blue-100 p-3 rounded-full mr-4">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium">{session.title}</h4>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(session.date).toLocaleString()}
                          <span className="mx-2">•</span>
                          <User className="h-3 w-3 mr-1" />
                          {session.with}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium">No upcoming sessions</h3>
                  <p className="text-gray-500 mb-4">You don't have any sessions scheduled yet.</p>
                  <Button variant="outline">View Availability</Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View All Sessions</Button>
            </CardFooter>
          </Card>
          
          {/* Recent Reviews */}
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
              <CardDescription>What your mentees are saying</CardDescription>
            </CardHeader>
            <CardContent>
              {mentorStats.recentReviews.length > 0 ? (
                <div className="space-y-4">
                  {mentorStats.recentReviews.map((review) => (
                    <div key={review.id} className="p-4 rounded-lg border border-gray-100">
                      <div className="flex items-center mb-2">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${review.author}`} />
                          <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{review.author}</div>
                          <div className="text-sm text-gray-500">{review.date}</div>
                        </div>
                        <div className="ml-auto flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium">No reviews yet</h3>
                  <p className="text-gray-500">Once you complete sessions, mentees can leave reviews.</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View All Reviews</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Sessions Tab */}
        <TabsContent value="sessions" className="space-y-6">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Session Management</CardTitle>
              <CardDescription>Manage your upcoming and past sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upcoming">
                <TabsList className="mb-4">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="past">Past</TabsTrigger>
                  <TabsTrigger value="availability">Availability</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upcoming">
                  {mentorStats.upcomingSessions.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Session Type</TableHead>
                            <TableHead>Mentee</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mentorStats.upcomingSessions.map((session) => (
                            <TableRow key={session.id}>
                              <TableCell>{new Date(session.date).toLocaleString()}</TableCell>
                              <TableCell>{session.title}</TableCell>
                              <TableCell>{session.with}</TableCell>
                              <TableCell>
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                  Confirmed
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm">
                                    <Video className="h-4 w-4 mr-1" />
                                    Join
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <MessageSquare className="h-4 w-4 mr-1" />
                                    Message
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-lg font-medium">No upcoming sessions</h3>
                      <p className="text-gray-500">You don't have any sessions scheduled yet.</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="past">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Session Type</TableHead>
                          <TableHead>Mentee</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>May 15, 2025, 2:00 PM</TableCell>
                          <TableCell>Career Strategy</TableCell>
                          <TableCell>Alex Johnson</TableCell>
                          <TableCell>
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                              Completed
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              View Notes
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>May 10, 2025, 10:30 AM</TableCell>
                          <TableCell>Resume Review</TableCell>
                          <TableCell>Sarah Williams</TableCell>
                          <TableCell>
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                              Completed
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              View Notes
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="availability">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Your Availability Schedule</h3>
                      <Button>
                        <Calendar className="h-4 w-4 mr-2" />
                        Edit Schedule
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Weekdays</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span>Monday</span>
                              <span className="text-sm">9:00 AM - 5:00 PM</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Tuesday</span>
                              <span className="text-sm">9:00 AM - 5:00 PM</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Wednesday</span>
                              <span className="text-sm">9:00 AM - 5:00 PM</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Thursday</span>
                              <span className="text-sm">9:00 AM - 5:00 PM</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Friday</span>
                              <span className="text-sm">9:00 AM - 3:00 PM</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Weekends</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span>Saturday</span>
                              <span className="text-sm">10:00 AM - 2:00 PM</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Sunday</span>
                              <span className="text-sm">Not Available</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="font-medium mb-2">Blocked Dates</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">May 25-27, 2025</Badge>
                        <Badge variant="outline">June 10, 2025</Badge>
                        <Button variant="outline" size="sm" className="h-6">
                          + Add Date
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Earnings Tab */}
        <TabsContent value="earnings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="premium-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-green-500 mr-3" />
                  <div className="text-3xl font-bold">${mentorStats.earnings.total}</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="premium-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-blue-500 mr-3" />
                  <div>
                    <div className="text-3xl font-bold">${mentorStats.earnings.thisMonth}</div>
                    <p className="text-xs text-green-500">+25% vs last month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="premium-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Average Per Session</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-purple-500 mr-3" />
                  <div className="text-3xl font-bold">$102</div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Earnings History</CardTitle>
              <CardDescription>Your earnings over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={mentorStats.monthlyEarnings}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Earnings']} />
                    <Bar dataKey="amount" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your recent earnings activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Session</TableHead>
                      <TableHead>Mentee</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>May 15, 2025</TableCell>
                      <TableCell>Career Strategy Session</TableCell>
                      <TableCell>Alex Johnson</TableCell>
                      <TableCell>$120.00</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Paid</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>May 10, 2025</TableCell>
                      <TableCell>Resume Review</TableCell>
                      <TableCell>Sarah Williams</TableCell>
                      <TableCell>$80.00</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Paid</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>May 5, 2025</TableCell>
                      <TableCell>Interview Preparation</TableCell>
                      <TableCell>Michael Chen</TableCell>
                      <TableCell>$150.00</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Paid</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>May 1, 2025</TableCell>
                      <TableCell>Career Transition Strategy</TableCell>
                      <TableCell>Jessica Lee</TableCell>
                      <TableCell>$200.00</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Paid</Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View All Transactions</Button>
            </CardFooter>
          </Card>
          
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Manage your payment methods and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Direct Deposit</h4>
                      <p className="text-sm text-gray-500">Payments sent on the 1st and 15th</p>
                    </div>
                  </div>
                  <Badge>Default</Badge>
                </div>
                
                <Button className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Payment Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="premium-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Overall Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-5xl font-bold mr-4">{mentorStats.ratings}</div>
                  <div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < Math.floor(mentorStats.ratings) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">From {mentorStats.reviewCount} reviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="premium-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Response Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <MessageSquare className="h-8 w-8 text-blue-500 mr-3" />
                  <div>
                    <div className="text-3xl font-bold">98%</div>
                    <p className="text-xs text-muted-foreground">Excellent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="premium-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Repeat Mentees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-green-500 mr-3" />
                  <div>
                    <div className="text-3xl font-bold">65%</div>
                    <p className="text-xs text-muted-foreground">Return rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Rating Breakdown</CardTitle>
              <CardDescription>How mentees are rating your sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-12 text-sm">5 stars</div>
                  <div className="flex-grow mx-3">
                    <Progress value={75} className="h-2" />
                  </div>
                  <div className="w-12 text-sm text-right">75%</div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 text-sm">4 stars</div>
                  <div className="flex-grow mx-3">
                    <Progress value={20} className="h-2" />
                  </div>
                  <div className="w-12 text-sm text-right">20%</div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 text-sm">3 stars</div>
                  <div className="flex-grow mx-3">
                    <Progress value={5} className="h-2" />
                  </div>
                  <div className="w-12 text-sm text-right">5%</div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 text-sm">2 stars</div>
                  <div className="flex-grow mx-3">
                    <Progress value={0} className="h-2" />
                  </div>
                  <div className="w-12 text-sm text-right">0%</div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 text-sm">1 star</div>
                  <div className="flex-grow mx-3">
                    <Progress value={0} className="h-2" />
                  </div>
                  <div className="w-12 text-sm text-right">0%</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>All Reviews</CardTitle>
              <CardDescription>What your mentees are saying about your sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mentorStats.recentReviews.map((review) => (
                  <div key={review.id} className="p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center mb-2">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${review.author}`} />
                        <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{review.author}</div>
                        <div className="text-sm text-gray-500">{review.date}</div>
                      </div>
                      <div className="ml-auto flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-sm text-gray-500">Session: Career Strategy Session</span>
                      <Button variant="ghost" size="sm">
                        Reply
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="p-4 rounded-lg border border-gray-100">
                  <div className="flex items-center mb-2">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=Michael Chen" />
                      <AvatarFallback>MC</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">Michael Chen</div>
                      <div className="text-sm text-gray-500">May 5, 2025</div>
                    </div>
                    <div className="ml-auto flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < 5 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600">The interview preparation session was incredibly helpful. I felt much more confident going into my interviews and ended up receiving two job offers! Thank you for your guidance and support.</p>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm text-gray-500">Session: Interview Preparation</span>
                    <Button variant="ghost" size="sm">
                      Reply
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg border border-gray-100">
                  <div className="flex items-center mb-2">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=Jessica Lee" />
                      <AvatarFallback>JL</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">Jessica Lee</div>
                      <div className="text-sm text-gray-500">May 1, 2025</div>
                    </div>
                    <div className="ml-auto flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600">I was feeling stuck in my career and unsure about making a transition. Our session helped me clarify my goals and create a practical plan for moving forward. I appreciate the personalized advice and industry insights.</p>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm text-gray-500">Session: Career Transition Strategy</span>
                    <Button variant="ghost" size="sm">
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Load More Reviews</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderMenteeDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="premium-card bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.email || 'Mentee'}</h2>
            <p className="opacity-90">You have {menteeStats.upcomingSessions.length} upcoming sessions and {menteeStats.notifications.filter(n => !n.read).length} new notifications</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm">
              <Calendar className="mr-2 h-4 w-4" />
              View Schedule
            </Button>
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="mentors">My Mentors</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="premium-card hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-blue-500 mr-3" />
                  <div>
                    <div className="text-3xl font-bold">{menteeStats.totalSessions}</div>
                    <p className="text-xs text-muted-foreground">Lifetime sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="premium-card hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Goal Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Career Development Plan</span>
                    <span className="text-sm font-medium">{menteeStats.goalProgress}%</span>
                  </div>
                  <Progress value={menteeStats.goalProgress} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="premium-card hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Saved Mentors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-purple-500 mr-3" />
                  <div>
                    <div className="text-3xl font-bold">{menteeStats.savedMentors.length}</div>
                    <p className="text-xs text-muted-foreground">Favorite mentors</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Upcoming Sessions */}
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
              <CardDescription>Your scheduled mentoring sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {menteeStats.upcomingSessions.length > 0 ? (
                <div className="space-y-4">
                  {menteeStats.upcomingSessions.map((session) => (
                    <div key={session.id} className="flex items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="bg-blue-100 p-3 rounded-full mr-4">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium">{session.title}</h4>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(session.date).toLocaleString()}
                          <span className="mx-2">•</span>
                          <User className="h-3 w-3 mr-1" />
                          {session.with}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                        <Button size="sm">
                          <Video className="h-4 w-4 mr-1" />
                          Join
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium">No upcoming sessions</h3>
                  <p className="text-gray-500 mb-4">You don't have any sessions scheduled yet.</p>
                  <Button>Find a Mentor</Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View All Sessions</Button>
            </CardFooter>
          </Card>
          
          {/* Favorite Categories */}
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Your Interests</CardTitle>
              <CardDescription>Mentorship categories you're exploring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={menteeStats.favoriteCategories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {menteeStats.favoriteCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Update Interests</Button>
            </CardFooter>
          </Card>
          
          {/* Saved Mentors */}
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Saved Mentors</CardTitle>
              <CardDescription>Mentors you've bookmarked</CardDescription>
            </CardHeader>
            <CardContent>
              {menteeStats.savedMentors.length > 0 ? (
                <div className="space-y-4">
                  {menteeStats.savedMentors.map((mentor) => (
                    <div key={mentor.id} className="flex items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${mentor.name}`} />
                        <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <h4 className="font-medium">{mentor.name}</h4>
                        <div className="flex items-center text-sm text-gray-500">
                          <Briefcase className="h-3 w-3 mr-1" />
                          {mentor.expertise}
                          <span className="mx-2">•</span>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                            {mentor.rating}
                          </div>
                        </div>
                      </div>
                      <Button size="sm">
                        Book Session
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium">No saved mentors</h3>
                  <p className="text-gray-500 mb-4">You haven't saved any mentors yet.</p>
                  <Button>Browse Mentors</Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View All Saved Mentors</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Sessions Tab */}
        <TabsContent value="sessions" className="space-y-6">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Session History</CardTitle>
              <CardDescription>Your past and upcoming mentoring sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upcoming">
                <TabsList className="mb-4">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="past">Past</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upcoming">
                  {menteeStats.upcomingSessions.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Session Type</TableHead>
                            <TableHead>Mentor</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {menteeStats.upcomingSessions.map((session) => (
                            <TableRow key={session.id}>
                              <TableCell>{new Date(session.date).toLocaleString()}</TableCell>
                              <TableCell>{session.title}</TableCell>
                              <TableCell>{session.with}</TableCell>
                              <TableCell>
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                  Confirmed
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm">
                                    <Video className="h-4 w-4 mr-1" />
                                    Join
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <MessageSquare className="h-4 w-4 mr-1" />
                                    Message
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-lg font-medium">No upcoming sessions</h3>
                      <p className="text-gray-500">You don't have any sessions scheduled yet.</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="past">
                  {menteeStats.pastSessions.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Session Type</TableHead>
                            <TableHead>Mentor</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {menteeStats.pastSessions.map((session) => (
                            <TableRow key={session.id}>
                              <TableCell>{new Date(session.date).toLocaleString()}</TableCell>
                              <TableCell>{session.title}</TableCell>
                              <TableCell>{session.with}</TableCell>
                              <TableCell>
                                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                                  Completed
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm">
                                    <Star className="h-4 w-4 mr-1" />
                                    Review
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <MessageSquare className="h-4 w-4 mr-1" />
                                    Message
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-lg font-medium">No past sessions</h3>
                      <p className="text-gray-500">You haven't completed any sessions yet.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Book a New Session</Button>
            </CardFooter>
          </Card>
          
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Session Notes</CardTitle>
              <CardDescription>Your notes from past sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {menteeStats.pastSessions.length > 0 ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">Resume Review</h4>
                        <p className="text-sm text-gray-500">with James Wilson • May 10, 2025</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-gray-600">Key points from our session:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
                        <li>Restructure experience section to highlight achievements</li>
                        <li>Add quantifiable metrics to demonstrate impact</li>
                        <li>Customize resume for each application</li>
                        <li>Follow up with portfolio website updates</li>
                      </ul>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                      <Button variant="outline" size="sm">
                        Edit Notes
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">Interview Preparation</h4>
                        <p className="text-sm text-gray-500">with Dr. Emily Chen • May 3, 2025</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-gray-600">Key points from our session:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
                        <li>Practice STAR method for behavioral questions</li>
                        <li>Research company culture and values before interview</li>
                        <li>Prepare 3-5 thoughtful questions to ask interviewer</li>
                        <li>Follow up with thank you email within 24 hours</li>
                      </ul>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                      <Button variant="outline" size="sm">
                        Edit Notes
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium">No session notes</h3>
                  <p className="text-gray-500">You haven't added any notes from your sessions yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Mentors Tab */}
        <TabsContent value="mentors" className="space-y-6">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>My Mentors</CardTitle>
              <CardDescription>Mentors you've worked with</CardDescription>
            </CardHeader>
            <CardContent>
              {menteeStats.savedMentors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {menteeStats.savedMentors.map((mentor) => (
                    <Card key={mentor.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/3 bg-gradient-to-br from-blue-100 to-indigo-100 p-4 flex items-center justify-center">
                          <Avatar className="h-20 w-20">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${mentor.name}`} />
                            <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="w-full md:w-2/3 p-4">
                          <h3 className="font-medium text-lg">{mentor.name}</h3>
                          <p className="text-sm text-gray-500 mb-2">{mentor.expertise}</p>
                          <div className="flex items-center mb-3">
                            <div className="flex mr-2">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-4 w-4 ${i < Math.floor(mentor.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">{mentor.rating}</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm">
                              Book Session
                            </Button>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Message
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium">No mentors yet</h3>
                  <p className="text-gray-500 mb-4">You haven't worked with any mentors yet.</p>
                  <Button>Find a Mentor</Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Browse More Mentors</Button>
            </CardFooter>
          </Card>
          
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Recommended Mentors</CardTitle>
              <CardDescription>Based on your interests and goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/3 bg-gradient-to-br from-purple-100 to-pink-100 p-4 flex items-center justify-center">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=David Thompson" />
                        <AvatarFallback>DT</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="w-full md:w-2/3 p-4">
                      <h3 className="font-medium text-lg">David Thompson</h3>
                      <p className="text-sm text-gray-500 mb-2">Leadership Development</p>
                      <div className="flex items-center mb-3">
                        <div className="flex mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < 5 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">5.0</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm">
                          View Profile
                        </Button>
                        <Button variant="outline" size="sm">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
                
                <Card className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/3 bg-gradient-to-br from-amber-100 to-orange-100 p-4 flex items-center justify-center">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=Sophia Rodriguez" />
                        <AvatarFallback>SR</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="w-full md:w-2/3 p-4">
                      <h3 className="font-medium text-lg">Sophia Rodriguez</h3>
                      <p className="text-sm text-gray-500 mb-2">Career Transitions</p>
                      <div className="flex items-center mb-3">
                        <div className="flex mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < 4.8 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">4.8</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm">
                          View Profile
                        </Button>
                        <Button variant="outline" size="sm">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View All Recommendations</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-6">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Career Development Goals</CardTitle>
              <CardDescription>Track your progress toward your career objectives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Overall Progress</h3>
                    <span className="text-sm font-medium">{menteeStats.goalProgress}%</span>
                  </div>
                  <Progress value={menteeStats.goalProgress} className="h-2" />
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">Improve Resume and LinkedIn Profile</h4>
                        <p className="text-sm text-gray-500">Due: June 15, 2025</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <Progress value={100} className="h-2" />
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-600">Completed with help from James Wilson on May 10, 2025</p>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">Prepare for Technical Interviews</h4>
                        <p className="text-sm text-gray-500">Due: July 1, 2025</p>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800">
                        <Clock className="h-3 w-3 mr-1" />
                        In Progress
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <Progress value={60} className="h-2" />
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-600">Next session with Dr. Emily Chen on May 23, 2025</p>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">Develop Leadership Skills</h4>
                        <p className="text-sm text-gray-500">Due: August 15, 2025</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Not Started
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <Progress value={0} className="h-2" />
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-600">Recommended mentor: David Thompson</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                View Timeline
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Goal
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Skill Development</CardTitle>
              <CardDescription>Track your progress in developing key skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Technical Skills</h4>
                    <span className="text-sm font-medium">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Communication</h4>
                    <span className="text-sm font-medium">60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Leadership</h4>
                    <span className="text-sm font-medium">40%</span>
                  </div>
                  <Progress value={40} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Project Management</h4>
                    <span className="text-sm font-medium">80%</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Update Skills Assessment</Button>
            </CardFooter>
          </Card>
          
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Career Resources</CardTitle>
              <CardDescription>Recommended resources for your career development</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <Award className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Technical Interview Preparation Guide</h4>
                      <p className="text-sm text-gray-500 mb-2">Recommended by Dr. Emily Chen</p>
                      <Button variant="outline" size="sm">
                        View Resource
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                      <BookOpen className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Effective Communication in the Workplace</h4>
                      <p className="text-sm text-gray-500 mb-2">Recommended by James Wilson</p>
                      <Button variant="outline" size="sm">
                        View Resource
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start">
                    <div className="bg-amber-100 p-2 rounded-full mr-3">
                      <Video className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Leadership Skills Masterclass</h4>
                      <p className="text-sm text-gray-500 mb-2">Recommended based on your goals</p>
                      <Button variant="outline" size="sm">
                        View Resource
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Browse All Resources</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="container-custom flex-grow my-8">
      <h1 className="text-3xl font-bold mb-6 premium-gradient-text">Your Dashboard</h1>
      
      {isLoading ? (
        <div className="py-12 flex justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-500">Loading your dashboard...</p>
          </div>
        </div>
      ) : (
        <>
          {userRole === 'mentor' && renderMentorDashboard()}
          {userRole === 'mentee' && renderMenteeDashboard()}
        </>
      )}
    </div>
  );
};

export default Dashboard;
