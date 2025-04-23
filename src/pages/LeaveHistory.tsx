import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { LeaveHistoryList } from "@/components/leave/leave-history-list";
import { Button } from "@/components/ui/button";
import { CalendarPlus, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchLeaveHistory } from "@/store/slices/leaveHistorySlice";
import type { RootState } from "@/store";
import { Skeleton } from "@/components/ui/skeleton";

export default function LeaveHistory() {
  const dispatch = useDispatch();
  const { requests, isLoading, error } = useSelector(
    (state: RootState) => state.leaveHistory
  );


  useEffect(() => {
    const loadLeaveHistory = async () => {
      try {
        await dispatch(fetchLeaveHistory()).unwrap();
      } catch (err) {
        toast.error("Failed to load leave history");
        console.error("Leave history loading error:", err);
      }
    };
    console.log("Leave history loaded:", requests);
    loadLeaveHistory();
  }, [dispatch]);

  return (
    <div className="flex-1 p-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Button variant="ghost" size="sm" asChild className="mb-2 sm:mb-4">
              <Link
                to="/"
                className="flex items-center text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-africa-terracotta">
              Leave Requests
            </h1>
            <p className="text-muted-foreground mt-1">
              View and manage your leave requests.
            </p>
          </div>
          <Button
            asChild
            className="mt-4 sm:mt-0 bg-africa-terracotta hover:bg-africa-terracotta/90 self-start"
          >
            <Link to="/apply" className="flex items-center">
              <CalendarPlus className="h-4 w-4 mr-2" />
              New Request
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-24 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <p>Failed to load leave history. Please try again later.</p>
          </div>
        ) : (
          <LeaveHistoryList leaveRequests={requests} />
        )}
      </div>
    </div>
  );
}
