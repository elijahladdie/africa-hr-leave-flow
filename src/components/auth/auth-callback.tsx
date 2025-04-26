import { selectUser, updateUserByMemId } from "@/store/slices/authSlice";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { CircleCheck, CircleUser } from "lucide-react";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import { toast } from "sonner";
import { getAllDepartments } from "@/store/slices/departmentSlice";
import { setData, setToken } from "@/lib/authUtils";
import {
  getUserProfile,
  setUserFromEncodedData,
} from "@/store/slices/userSlice";
import { User } from "@/types";

const AuthCallback: React.FC = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const departments = useAppSelector(
    (state: RootState) => state.departments.departments
  );
  const [selectedDepart, setSelectedDepart] = useState("");
  const [loading, setLoading] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const [userData, setUserData] = useState<User>();
  const encodedData = urlParams.get("data");
  const errorData = urlParams.get("error");

  useEffect(() => {
    if (encodedData) {
      try {
        const decoded = atob(encodedData);
        const user = JSON.parse(decoded);
        setUserData(user);
        dispatch(setUserFromEncodedData(user));
        setData(user);
      } catch (error) {
        console.error("Failed to decode user data:", error);
      }
    } else {
      if (user) {
        setUserData(user);
      }
      if (errorData) {
        toast.error( errorData || "Oops! We had problem validating your identification please try again"
        );
        navigate("/login");
      }
    }
  }, [encodedData]);
  const isFormValid = selectedDepart !== "";
console.log(userData)
  useEffect(() => {
    const handleAuthCallback = async () => {
      if (token) {
        setToken(token);
        dispatch(getUserProfile()).unwrap();
      }
      if (userData && userData?.teams?.length === 0) {
        try {
          await dispatch(getAllDepartments()).unwrap();
          setSelectedDepart("");
        } catch (error) {
          toast.error("Failed to load departments");
        }
      }
    };
    handleAuthCallback();
  }, [dispatch, navigate]);
  useEffect(() => {
    if (userData && userData.teams && userData.teams.length > 0) {
      return window.location.reload();
    }
  }, [userData, navigate]);
  const handleContinue = async () => {
    if (!userData) return;
    setLoading(true);
    try {
      // Send update to backend with team and role
      const response = await dispatch(
        updateUserByMemId({
          memId: userData.id,
          data: {
            department_id: selectedDepart,
            hasCompletedProfile: true,
          },
        })
      ).unwrap();
      if (response.resp_code !== 200) {
        toast.error(response.resp_msg);
      }
      if (response.resp_code == 200) {
        toast.success(response.resp_msg);
        navigate("/");
      }
    } catch (err) {
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-africa-terracotta text-white mb-4">
              <span className="font-bold text-xl">IST</span>
            </div>
          </div>
          <h1 className="text-3xl font-semibold text-africa-dark">
            Complete Your Profile
          </h1>
          <p className="text-muted-foreground mt-2">
            Help us personalize your experience
          </p>
        </div>

        <Card className="animate-fade-in shadow-lg border-africa-cream">
          <CardHeader className="pb-2">
            <div className="mb-6">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <div className="flex items-center">
                  <CircleCheck className="w-4 h-4 mr-1 text-africa-sage" />{" "}
                  Authentication
                </div>
                <div className="flex items-center">
                  <CircleUser className="w-4 h-4 mr-1 text-africa-terracotta" />{" "}
                  Team & Role
                </div>
              </div>
              <Progress value={50} className="h-2" />
            </div>

            <h2 className="text-xl font-medium text-center">
              Welcome, {userData?.firstName} {userData?.lastName}
            </h2>
            <p className="text-center text-muted-foreground text-sm">
              Your email: {userData?.email}
            </p>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="team">Department / Team</Label>
              <Select value={selectedDepart} onValueChange={setSelectedDepart}>
                <SelectTrigger id="team" className="w-full">
                  <SelectValue placeholder="Select your department" />
                </SelectTrigger>
                <SelectContent>
                  {departments?.map((depart) => (
                    <SelectItem key={depart.id} value={depart.id}>
                      {depart.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 pt-2">
            <Button
              className="w-full"
              onClick={handleContinue}
              disabled={!isFormValid || loading}
            >
              {loading ? "Saving..." : "Continue"}
            </Button>
            <Button
              variant="outline"
              className="w-full text-muted-foreground"
              onClick={handleSkip}
            >
              Skip for now
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              This information helps us customize your experience and
              permissions
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AuthCallback;
