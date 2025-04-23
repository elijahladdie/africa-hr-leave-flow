import { UserProfile } from "@/components/dashboard/user-profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch, useAppSelector } from "@/store";
import { getUserProfile } from "@/store/slices/userSlice";
import { format } from "date-fns";
import { useEffect } from "react";
import { toast } from "sonner";

export default function UserProfilePage() {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.user.user);
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        await dispatch(getUserProfile()).unwrap();
      } catch (err) {
        toast.error(
          err.response.data.resp_msg || "FaiLed to load user profile"
        );
      }
    };
    fetchUserProfile();
  }, []);
  if (!user) {
    return <div>Loading...</div>;
  }

  const primaryTeam = user.teams?.[0];
  const department = primaryTeam?.department?.name || "N/A";
  const manager = primaryTeam?.managerName || "N/A";
  const joinDate = user.createdAt || new Date().toISOString(); // fallback if needed
  const avatarUrl = user.profilePictureUrl || "/images/default-avatar.png";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* User Profile Card */}
      <UserProfile
        name={user.fullName}
        role={user.role}
        department={department}
        manager={manager}
        avatarUrl={avatarUrl}
        joinDate={format(new Date(joinDate), "yyyy-MM-dd")}
        isLinkHidden={true} // Hide the link to the profile page
      />

      {/* Additional Information */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Contact & Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email: </span>
            <span className="font-medium">{user.email}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-muted-foreground">Azure AD ID: </span>
            <span className="font-medium">{user.azureId}</span>
          </div>
          <Separator />
          <div>
            <span className="text-muted-foreground">Teams: </span>
            <ul className="list-disc list-inside mt-1 font-medium">
              {user.teams?.map((team) => (
                <li key={team.id}>
                  {team.name} ({team.department?.name})
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
