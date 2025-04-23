import { UserProfile } from "@/components/dashboard/user-profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function UserProfilePage() {
  const mockUser = {
    name: "Jane Doe",
    role: "Product Manager",
    department: "Product",
    manager: "John Smith",
    avatarUrl: "/images/users/jane.jpg",
    joinDate: "2022-05-10",
    email: "jane.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "Nairobi, Kenya",
    bio: "Driven product leader with a passion for user-centric design and team collaboration.",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* User Profile Card */}
      <UserProfile
        name={mockUser.name}
        role={mockUser.role}
        department={mockUser.department}
        manager={mockUser.manager}
        avatarUrl={mockUser.profilePictureUrlUrl}
        joinDate={mockUser.joinDate}
      />

      {/* Additional Information */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Contact & Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email:</span>
            <span className="font-medium">{mockUser.email}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-muted-foreground">Phone:</span>
            <span className="font-medium">{mockUser.phone}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-muted-foreground">Location:</span>
            <span className="font-medium">{mockUser.location}</span>
          </div>
          <Separator />
          <div>
            <span className="text-muted-foreground">Bio:</span>
            <p className="mt-1 font-medium">{mockUser.bio}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
