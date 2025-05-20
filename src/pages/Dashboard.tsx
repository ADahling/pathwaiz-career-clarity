import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/sonner';
import { ArrowRight, Calendar, Briefcase, TrendingUp, Users } from 'lucide-react';
import Layout from '@/components/Layout';

interface Session {
  id: string;
  date: string;
  title: string;
  status: string;
  with: string;
}

interface MentorStats {
  totalSessions: number;
  totalEarnings: number;
  upcomingSessions: Session[];
}

interface MenteeStats {
  pastSessions: Session[];
}

const Dashboard: React.FC = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [mentorStats, setMentorStats] = useState<MentorStats>({
    totalSessions: 0,
    totalEarnings: 0,
    upcomingSessions: []
  });
  const [menteeStats, setMenteeStats] = useState<MenteeStats>({
    pastSessions: []
  });

  const handleEditProfile = () => {
    if (userRole === 'mentee') {
      navigate('/mentee-profile');
    } else if (userRole === 'mentor') {
      navigate('/mentor-profile');
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        if (userRole === 'mentor') {
          // For now, use mock data for mentor statistics
          // In a real app, you would fetch this from Supabase
          setMentorStats({
            totalSessions: 12,
            totalEarnings: 1250,
            upcomingSessions: [
              { id: '1', date: '2025-05-21', title: 'Career Guidance', status: 'Confirmed', with: 'Alex Johnson' },
              { id: '2', date: '2025-05-24', title: 'Resume Review', status: 'Pending', with: 'Maria Garcia' },
              { id: '3', date: '2025-05-28', title: 'Interview Prep', status: 'Confirmed', with: 'James Wilson' }
            ]
          });
        } else if (userRole === 'mentee') {
          // For now, use mock data for mentee statistics
          // In a real app, you would fetch this from Supabase
          setMenteeStats({
            pastSessions: [
              { id: '1', date: '2025-05-10', title: 'Career Planning', status: 'Completed', with: 'Dr. Robert Chen' },
              { id: '2', date: '2025-05-05', title: 'Resume Building', status: 'Completed', with: 'Emma Thompson' }
            ]
          });
        }
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error.message);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    if (user && userRole) {
      fetchDashboardData();
    }
  }, [user, userRole]);

  const renderMentorDashboard = () => (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="text-green-600" />
            Earnings Summary
          </CardTitle>
          <CardDescription>Your current earnings and session statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-3xl font-bold">${mentorStats.totalEarnings}</p>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sessions</p>
                <p className="text-xl font-semibold">{mentorStats.totalSessions}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-xl font-semibold">{mentorStats.upcomingSessions.length}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full flex items-center justify-center gap-2">
            View Full Report <ArrowRight size={16} />
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="text-blue-600" />
            Upcoming Sessions
          </CardTitle>
          <CardDescription>Your scheduled mentoring sessions</CardDescription>
        </CardHeader>
        <CardContent>
          {mentorStats.upcomingSessions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Topic</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mentorStats.upcomingSessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>{new Date(session.date).toLocaleDateString()}</TableCell>
                      <TableCell>{session.title}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          session.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {session.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-gray-500 py-4 text-center">No upcoming sessions scheduled.</p>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full flex items-center justify-center gap-2">
            Manage Sessions <ArrowRight size={16} />
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="text-purple-600" />
            Your Mentees
          </CardTitle>
          <CardDescription>People you're currently mentoring</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            You have 5 active mentee relationships. Check in with them regularly to track their progress.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full flex items-center justify-center gap-2">
            View Mentees <ArrowRight size={16} />
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="text-amber-600" />
            Your Profile
          </CardTitle>
          <CardDescription>Manage your mentor profile</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Keep your profile updated to attract qualified mentees looking for your expertise.
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            onClick={handleEditProfile}
            className="w-full flex items-center justify-center gap-2"
          >
            Edit Profile <ArrowRight size={16} />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  const renderMenteeDashboard = () => (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="text-blue-600" />
            Find Mentors
          </CardTitle>
          <CardDescription>Connect with experienced professionals</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Browse our directory of qualified mentors who can help guide your career journey.
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full flex items-center justify-center gap-2">
            Browse Mentors <ArrowRight size={16} />
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="text-purple-600" />
            Past Sessions
          </CardTitle>
          <CardDescription>Your completed mentoring sessions</CardDescription>
        </CardHeader>
        <CardContent>
          {menteeStats.pastSessions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Topic</TableHead>
                    <TableHead>Mentor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menteeStats.pastSessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>{new Date(session.date).toLocaleDateString()}</TableCell>
                      <TableCell>{session.title}</TableCell>
                      <TableCell>{session.with}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-gray-500 py-4 text-center">No past sessions found.</p>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full flex items-center justify-center gap-2">
            View All History <ArrowRight size={16} />
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="text-amber-600" />
            Your Profile
          </CardTitle>
          <CardDescription>Manage your mentee profile</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Keep your profile updated to help mentors understand your career goals and interests.
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            onClick={handleEditProfile}
            className="w-full flex items-center justify-center gap-2"
          >
            Edit Profile <ArrowRight size={16} />
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="text-green-600" />
            Career Progress
          </CardTitle>
          <CardDescription>Track your professional development</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Monitor your progress toward your career goals and achievements.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full flex items-center justify-center gap-2">
            View Progress <ArrowRight size={16} />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  return (
    <Layout>
      <div className="container-custom flex-grow my-8">
        <h1 className="text-3xl font-bold mb-6">Welcome to Your Dashboard</h1>
        
        {isLoading ? (
          <div className="py-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {userRole === 'mentor' && renderMentorDashboard()}
            {userRole === 'mentee' && renderMenteeDashboard()}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
