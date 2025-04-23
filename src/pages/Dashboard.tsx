import { LeaveBalanceCard } from "@/components/dashboard/leave-balance-card";
import { UpcomingLeaves } from "@/components/dashboard/upcoming-leaves";
import { UserProfile } from "@/components/dashboard/user-profile";
import { getUserProfile } from "@/store/slices/userSlice";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import { useAuth } from "@/contexts/auth-context";
import { getTeamActiveRequests } from "@/store/slices/leaveSlice";
import { fetchLeaveHistory } from "@/store/slices/leaveHistorySlice";

export default function Dashboard() {
  // Sample leave balance data with more realistic values

  // Sample team leave data with African holidays and events

  const { user: calledfromAuth } = useAuth();
  const dispatch = useAppDispatch();
    const { requests } = useAppSelector((state) => state.leaveHistory);
  
  const { user } = useAppSelector((state) => state.user);
  const [leaveBalances, setLeaveBalances] = useState([]);
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        await dispatch(getUserProfile()).unwrap();
        await dispatch(fetchLeaveHistory()).unwrap();
        if (calledfromAuth?.teams && calledfromAuth?.teams?.length !== 0) {
          console.log(calledfromAuth?.teams?.[0]?.id, "team id");
          dispatch(getTeamActiveRequests(calledfromAuth?.teams?.[0]?.id)).unwrap();
        }
      } catch (err) {
        toast.error(
          err.response.data.resp_msg || "FaiLed to load user profile"
        );
      }
    };
  
    if (user?.leaveBalances?.length !== 0) {
      setLeaveBalances(user?.leaveBalances);
    }
    fetchUserProfile();
  }, []);

  return (
    <div className="flex-1 p-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-africa-terracotta">
          Dashboard
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Middle and right columns - now with responsive grid */}
          <div className="col-span-1 lg:col-span-2">
            <div className="grid grid-cols-2  gap-6 mb-4">
              <UserProfile
                name={user?.fullName}
                role={user?.role}
                department={
                  user?.role === "ADMIN"
                    ? "ADMIN"
                    : user?.teams?.[0]?.department?.name
                    ? user?.teams?.[0]?.department?.name
                    : "N/A"
                }
                manager={user?.teams?.[0]?.managerName}
                joinDate={new Date(user?.createdAt).toLocaleDateString()}
              />
              <UpcomingLeaves leaves={requests} />
            </div>
            {/* Leave balance cards in a responsive 2-column grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              {leaveBalances?.map((balance, index) => (
                <LeaveBalanceCard key={index} {...balance} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
