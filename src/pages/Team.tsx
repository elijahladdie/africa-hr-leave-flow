import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { useAppDispatch, type RootState } from '@/store';
import { createTeamMember, deleteTeamMember, getAllTeamMembers } from "@/store/slices/teamMemberSlice";
import { TeamMemberDTO } from "@/types/dto";

export default function Team() {
    const dispatch = useAppDispatch()
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');

  const teamMembers = useSelector((state: RootState) => state.teamMembers.teamMembers);
  const error = useSelector((state: RootState) => state.teams.error);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setIsLoading(true);
        const response = await dispatch(getAllTeamMembers()).unwrap();
        console.log('Team members loaded:', response);
      } catch (err) {
        toast.error('Failed to load team members');
        console.error('Team loading error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamData();

    // Cleanup function
    return () => {
      // Reset any subscriptions or pending state
    };
  }, [dispatch]);

  // Function to get avatar initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const handleAddTeamMember = async (memberData: TeamMemberDTO) => {
    setIsLoading(true);
    try {
      const response = await dispatch(
        createTeamMember({
          ...memberData,
          joinedAt: new Date().toISOString()
        })
      ).unwrap();
      console.log("New team member added:", response);
      toast.success("Team member added successfully");
    } catch (err) {
      toast.error("Failed to add team member");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRemoveTeamMember = async (memberId: string) => {
    try {
      const response = await dispatch(deleteTeamMember(memberId)).unwrap();
      console.log("Team member removed:", response);
      toast.success("Team member removed successfully");
    } catch (err) {
      toast.error("Failed to remove team member");
    }
  };

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link
              to="/"
              className="flex items-center text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-africa-terracotta">
            Team Management
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage your team members
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-africa-terracotta" />
            <h2 className="text-xl font-medium">Team Members</h2>
          </div>
          <Button className="bg-africa-terracotta hover:bg-africa-terracotta/90">
            Add New Member
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMembers.map((member) => (
            <Card key={member.id} className="africa-card animate-fade-in">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="bg-africa-terracotta/20 text-africa-terracotta">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {member.role}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-muted-foreground inline">Department:</dt>{" "}
                    <dd className="inline font-medium">{member.department}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground inline">Email:</dt>{" "}
                    <dd className="inline font-medium">{member.email}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground inline">Join Date:</dt>{" "}
                    <dd className="inline font-medium">{member.joinDate}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
