import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserCog } from "lucide-react";
import { Link } from "react-router-dom";

interface UserProfileProps {
  name: string;
  role: string;
  department: string;
  manager: string;
  avatarUrl?: string;
  joinDate: string;
  isLinkHidden?: boolean; // Optional prop to hide the link
}

export function UserProfile({
  name,
  role,
  department,
  manager,
  avatarUrl,
  joinDate,
  isLinkHidden = false,
}: UserProfileProps) {
  // Get initials from name
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="africa-card animate-fade-in">
      <CardHeader className="pb-0">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 border-2 border-africa-terracotta/20">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-africa-terracotta/10 text-africa-terracotta text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-lg">{name}</h3>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Department:</span>
            <span className="font-medium">{department}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Manager:</span>
            <span className="font-medium">{manager}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Join Date:</span>
            <span className="font-medium">{joinDate}</span>
          </div>
          <div className={`pt-3 ${isLinkHidden ? "hidden" : ""}`}>
            <Link
              to="/profile"
              className="text-sm text-africa-blue hover:text-africa-blue/80 flex items-center transition-colors"
            >
              <UserCog className="h-3.5 w-3.5 mr-1" />
              Manage profile
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
