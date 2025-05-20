import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Users, DollarSign, Calendar, BarChart, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userData, setUserData] = useState<any[]>([]);
  const [bookingData, setBookingData] = useState<any[]>([]);
  const [paymentData, setPaymentData] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>({});

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
      try {
        // This is a placeholder implementation
        // In a real implementation, we would check if the user has admin role
        
        // For now, we'll assume the user is an admin if they're accessing this page
        // In a real implementation, we would redirect non-admin users
      } catch (error) {
        console.error('Error checking admin status:', error);
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to access the admin dashboard.',
          variant: 'destructive',
        });
      }
    };

    checkAdminStatus();
  }, [user, toast]);

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setLoading(true);
      
      try {
        // This is a placeholder implementation
        // In a real implementation, we would fetch data from Supabase based on the active tab
        
        switch (activeTab) {
          case 'users':
            // Mock user data
            const mockUsers = [
              {
                id: '1',
                email: 'john.doe@example.com',
                first_name: 'John',
                last_name: 'Doe',
                role: 'mentor',
                created_at: '2025-03-15T10:30:00Z',
                is_verified: true,
                is_active: true,
              },
              {
                id: '2',
                email: 'jane.smith@example.com',
                first_name: 'Jane',
                last_name: 'Smith',
                role: 'mentee',
                created_at: '2025-03-20T14:45:00Z',
                is_verified: true,
                is_active: true,
              },
              {
                id: '3',
                email: 'michael.johnson@example.com',
                first_name: 'Michael',
                last_name: 'Johnson',
                role: 'mentor',
                created_at: '2025-03-25T09:15:00Z',
                is_verified: false,
                is_active: true,
              },
              {
                id: '4',
                email: 'sarah.williams@example.com',
                first_name: 'Sarah',
                last_name: 'Williams',
                role: 'mentee',
                created_at: '2025-04-01T16:20:00Z',
                is_verified: true,
                is_active: true,
              },
              {
                id: '5',
                email: 'david.brown@example.com',
                first_name: 'David',
                last_name: 'Brown',
                role: 'mentor',
                created_at: '2025-04-05T11:10:00Z',
                is_verified: true,
                is_active: false,
              },
            ];
            
            setUserData(mockUsers);
            break;
            
          case 'bookings':
            // Mock booking data
            const mockBookings = [
              {
                id: '1',
                mentor_name: 'John Doe',
                mentee_name: 'Jane Smith',
                start_time: '2025-05-15T10:00:00Z',
                duration: 60,
                status: 'confirmed',
                created_at: '2025-05-10T14:30:00Z',
              },
              {
                id: '2',
                mentor_name: 'David Brown',
                mentee_name: 'Sarah Williams',
                start_time: '2025-05-16T15:30:00Z',
                duration: 30,
                status: 'completed',
                created_at: '2025-05-12T09:45:00Z',
              },
              {
                id: '3',
                mentor_name: 'Michael Johnson',
                mentee_name: 'Jane Smith',
                start_time: '2025-05-18T11:00:00Z',
                duration: 90,
                status: 'pending',
                created_at: '2025-05-14T16:20:00Z',
              },
              {
                id: '4',
                mentor_name: 'John Doe',
                mentee_name: 'Sarah Williams',
                start_time: '2025-05-20T14:00:00Z',
                duration: 60,
                status: 'cancelled',
                created_at: '2025-05-15T10:10:00Z',
              },
              {
                id: '5',
                mentor_name: 'David Brown',
                mentee_name: 'Jane Smith',
                start_time: '2025-05-22T09:30:00Z',
                duration: 120,
                status: 'confirmed',
                created_at: '2025-05-18T13:25:00Z',
              },
            ];
            
            setBookingData(mockBookings);
            break;
            
          case 'payments':
            // Mock payment data
            const mockPayments = [
              {
                id: '1',
                booking_id: '2',
                amount: 75.00,
                platform_fee: 15.00,
                mentor_payout: 60.00,
                status: 'completed',
                created_at: '2025-05-12T09:50:00Z',
              },
              {
                id: '2',
                booking_id: '1',
                amount: 100.00,
                platform_fee: 20.00,
                mentor_payout: 80.00,
                status: 'pending',
                created_at: '2025-05-10T14:35:00Z',
              },
              {
                id: '3',
                booking_id: '5',
                amount: 200.00,
                platform_fee: 40.00,
                mentor_payout: 160.00,
                status: 'completed',
                created_at: '2025-05-18T13:30:00Z',
              },
              {
                id: '4',
                booking_id: '4',
                amount: 100.00,
                platform_fee: 20.00,
                mentor_payout: 80.00,
                status: 'refunded',
                created_at: '2025-05-15T10:15:00Z',
              },
              {
                id: '5',
                booking_id: '3',
                amount: 150.00,
                platform_fee: 30.00,
                mentor_payout: 120.00,
                status: 'pending',
                created_at: '2025-05-14T16:25:00Z',
              },
            ];
            
            setPaymentData(mockPayments);
            break;
            
          case 'analytics':
            // Mock analytics data
            const mockAnalytics = {
              totalUsers: 250,
              newUsersThisMonth: 45,
              usersByRole: {
                mentor: 75,
                mentee: 175,
              },
              totalBookings: 320,
              bookingsByStatus: {
                pending: 35,
                confirmed: 120,
                completed: 150,
                cancelled: 15,
              },
              totalRevenue: 32500,
              revenueByMonth: {
                'Jan 2025': 3500,
                'Feb 2025': 4200,
                'Mar 2025': 5100,
                'Apr 2025': 8700,
                'May 2025': 11000,
              },
              topCategories: [
                { name: 'Software Development', sessions: 85 },
                { name: 'Business', sessions: 65 },
                { name: 'Design', sessions: 50 },
                { name: 'Marketing', sessions: 45 },
                { name: 'Finance', sessions: 40 },
              ],
            };
            
            setAnalyticsData(mockAnalytics);
            break;
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab} data:`, error);
        toast({
          title: 'Error',
          description: `Failed to load ${activeTab} data. Please try again.`,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, user, toast]);

  // Filter data based on search query
  const filteredUserData = userData.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBookingData = bookingData.filter(booking => 
    booking.mentor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.mentee_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPaymentData = paymentData.filter(payment => 
    payment.booking_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Admin Dashboard</CardTitle>
        <CardDescription>
          Manage users, bookings, payments, and view analytics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center">
              <BarChart className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-4 mb-4">
            {activeTab !== 'analytics' && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}
          </div>
          
          <TabsContent value="users">
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUserData.length > 0 ? (
                      filteredUserData.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.first_name} {user.last_name}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <span className="capitalize">{user.role}</span>
                          </TableCell>
                          <TableCell>{formatDate(user.created_at)}</TableCell>
                          <TableCell>
                            {user.is_active ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Inactive
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="bookings">
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mentor</TableHead>
                      <TableHead>Mentee</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookingData.length > 0 ? (
                      filteredBookingData.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">
                            {booking.mentor_name}
                          </TableCell>
                          <TableCell>{booking.mentee_name}</TableCell>
                          <TableCell>
                            {formatDate(booking.start_time)}
                            <br />
                            <span className="text-xs text-muted-foreground">
                              {formatTime(booking.start_time)}
                            </span>
                          </TableCell>
                          <TableCell>{booking.duration} min</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                booking.status === 'confirmed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : booking.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : booking.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              <span className="capitalize">{booking.status}</span>
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          No bookings found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="payments">
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Platform Fee</TableHead>
                      <TableHead>Mentor Payout</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPaymentData.length > 0 ? (
                      filteredPaymentData.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">
                            {payment.booking_id}
                          </TableCell>
                          <TableCell>${payment.amount.toFixed(2)}</TableCell>
                          <TableCell>${payment.platform_fee.toFixed(2)}</TableCell>
                          <TableCell>${payment.mentor_payout.toFixed(2)}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                payment.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : payment.status === 'refunded'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              <span className="capitalize">{payment.status}</span>
                            </span>
                          </TableCell>
                          <TableCell>{formatDate(payment.created_at)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          No payments found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="analytics">
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">User Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Total Users</span>
                        <span className="font-bold">{analyticsData.totalUsers}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">New Users (This Month)</span>
                        <span className="font-bold">{analyticsData.newUsersThisMonth}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Mentors</span>
                        <span className="font-bold">{analyticsData.usersByRole?.mentor}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Mentees</span>
                        <span className="font-bold">{analyticsData.usersByRole?.mentee}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Booking Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Total Bookings</span>
                        <span className="font-bold">{analyticsData.totalBookings}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Pending</span>
                        <span className="font-bold">{analyticsData.bookingsByStatus?.pending}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Confirmed</span>
                        <span className="font-bold">{analyticsData.bookingsByStatus?.confirmed}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Completed</span>
                        <span className="font-bold">{analyticsData.bookingsByStatus?.completed}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Total Revenue</span>
                        <span className="font-bold">${analyticsData.totalRevenue?.toFixed(2)}</span>
                      </div>
                      {analyticsData.revenueByMonth && Object.entries(analyticsData.revenueByMonth).map(([month, revenue]) => (
                        <div key={month} className="flex justify-between items-center">
                          <span className="text-muted-foreground">{month}</span>
                          <span className="font-bold">${(revenue as number).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Top Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.topCategories?.map((category, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-muted-foreground">{category.name}</span>
                          <span className="font-bold">{category.sessions} sessions</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground text-center">
        <p>
          Note: This is a placeholder admin dashboard. In a real implementation, this would be connected to Supabase for real-time data.
        </p>
      </CardFooter>
    </Card>
  );
};

export default AdminDashboard;
