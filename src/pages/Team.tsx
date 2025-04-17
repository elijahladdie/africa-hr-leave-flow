
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Sample team members data
const teamMembers = [
  {
    id: "1",
    name: "John Doe",
    role: "Software Engineer",
    department: "Engineering",
    email: "john.doe@example.com",
    avatar: undefined,
    joinDate: "Jan 15, 2022",
  },
  {
    id: "2",
    name: "Jane Smith",
    role: "Product Manager",
    department: "Product",
    email: "jane.smith@example.com",
    avatar: undefined,
    joinDate: "Mar 5, 2021",
  },
  {
    id: "3",
    name: "Michael Johnson",
    role: "UX Designer",
    department: "Design",
    email: "michael.johnson@example.com",
    avatar: undefined,
    joinDate: "Oct 12, 2022",
  },
  {
    id: "4",
    name: "Sarah Williams",
    role: "Marketing Specialist",
    department: "Marketing",
    email: "sarah.williams@example.com",
    avatar: undefined,
    joinDate: "Feb 28, 2023",
  },
  {
    id: "5",
    name: "David Brown",
    role: "DevOps Engineer",
    department: "Engineering",
    email: "david.brown@example.com",
    avatar: undefined,
    joinDate: "Jun 10, 2022",
  },
  {
    id: "6",
    name: "Emily Davis",
    role: "HR Manager",
    department: "HR",
    email: "emily.davis@example.com",
    avatar: undefined,
    joinDate: "Apr 15, 2021",
  },
];

export default function Team() {
  // Function to get avatar initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
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
