import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, PlusCircle, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector, type RootState } from "@/store";
import {
  createTeamMember,
  deleteTeamMember,
  getAllTeamMembers,
} from "@/store/slices/teamMemberSlice";
import { TeamMemberDTO } from "@/types/dto";
import { formatDistance } from "date-fns";
import { createTeam, getAllTeams } from "@/store/slices/teamSlice";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "recharts";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getAllDepartments } from "@/store/slices/departmentSlice";
import AddTeamMemberForm from "@/components/team/add-team-member-dialog";
import CreateTeamForm from "@/components/team/create-team-dialog";
import { fetchUsers } from "@/store/slices/usersSlice";
export default function Team() {
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const { departments } = useAppSelector((state) => state.departments);
  const { users } = useAppSelector((state) => state.users);
  const { teams } = useAppSelector((state) => state.teams);

  const teamMembers = useSelector(
    (state: RootState) => state.teamMembers.teamMembers
  );
  const error = useSelector((state: RootState) => state.teams.error);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  console.log(users, ">>>>>>>>");
  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setIsLoading(true);
        const params = { page: 1, limit: 30 };
        await dispatch(getAllTeamMembers()).unwrap();
        await dispatch(getAllDepartments()).unwrap();
        await dispatch(getAllTeams()).unwrap();
        await dispatch(fetchUsers(params)).unwrap();
      } catch (err) {
        toast.error(err.resp_msg || "Failed to load team members");
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
    if (!name) return "N/A";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const onSubmit = async (memberData: TeamMemberDTO) => {
    setIsLoading(true);
    try {
      const response = await dispatch(
        createTeamMember({
          ...memberData,
          joinedAt: new Date().toISOString(),
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

  // Handle creating a team
  const handleCreateTeam = (data) => {
    console.log(data, ">>>>>>><<<<<<");
    const newTeam = {
      id: `team-${Date.now()}`,
      name: data.name,
      description: data.description,
      departmentId: data.departmentId,
      managerId: data.managerId,
    };

    // Also create team members
    if (data.teamMemberIds && data.teamMemberIds.length > 0) {
      const newMembers = data.teamMemberIds.map((userId) => {
        const user = users.find((u) => u.id === userId);
        const department = departments.find((d) => d.id === data.departmentId);

        return {
          id: `member-${Date.now()}-${userId}`,
          name: user.fullName,
          role: "Team Member",
          user: { email: user.email },
          team: {
            name: data.name,
            department: { name: department?.name || "Unknown" },
          },
          profilePictureUrl: "",
          joinedAt: new Date(),
        };
      });

      // setTeamMembers([...teamMembers, ...newMembers]);
    }
  };

  // Handle adding a team member
  const handleAddMember = (data) => {
    const user = users.find((u) => u.id === data.userId);
    const team = teams.find((t) => t.id === data.teamId);
    const department = departments.find((d) => d.id === team.departmentId);

    const newMember = {
      id: `member-${Date.now()}`,
      name: user.name,
      role: data.role,
      user: { email: user.email },
      team: {
        name: team.name,
        department: { name: department?.name || "Unknown" },
      },
      profilePictureUrl: "",
      joinedAt: new Date(),
    };

    // setTeamMembers([...teamMembers, newMember]);
  };
  console.log("Team members:", teamMembers);

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

        <div className="flex justify-start space-x-8  items-center mb-6">
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-africa-terracotta" />
            <h2 className="text-xl font-medium">Team Members</h2>
          </div>
          {/* <div className="flex items-center space-x-8"> */}
          <AddTeamMemberForm
            teams={teams}
            availableUsers={users}
            onAddMember={handleAddMember}
          />

          <CreateTeamForm
            departments={departments}
            users={users}
            onCreateTeam={handleCreateTeam}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMembers.map((member) => (
            <Card key={member.id} className="africa-card animate-fade-in">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.profilePictureUrl} />
                    <AvatarFallback className="bg-africa-terracotta/20 text-africa-terracotta">
                      {getInitials(member.team.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">
                      {member.team.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {member.user.role}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-muted-foreground inline">
                      Department:
                    </dt>{" "}
                    <dd className="inline font-medium">
                      {member.team?.department?.name}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground inline">Email:</dt>{" "}
                    <dd className="inline font-medium">{member.user?.email}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground inline">Join Date:</dt>{" "}
                    <dd className="inline font-medium">
                      {new Date(member.joinedAt).toLocaleDateString()}
                      {/* {formatDistance(member?.joinedAt , )} */}
                    </dd>
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
