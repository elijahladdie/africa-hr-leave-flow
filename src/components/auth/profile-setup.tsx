
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/auth-context";
import { CircleCheck, CircleUser } from "lucide-react";
import { toast } from "sonner";

// Define teams and roles
const teams = ["Engineering", "HR", "Finance", "Marketing", "Operations", "Leadership"];
const roles = ["Staff", "Manager", "Admin", "Department Head", "Executive"];

const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUserProfile } = useAuth();
  const [selectedTeam, setSelectedTeam] = useState<string | undefined>(user?.team);
  const [selectedRole, setSelectedRole] = useState<string | undefined>(user?.role);
  const [loading, setLoading] = useState(false);

  const isFormValid = selectedTeam && selectedRole;

  const handleContinue = async () => {
    if (!isFormValid) return;
    
    setLoading(true);

    try {
      // In a real app, you might call an API here
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
      
      updateUserProfile({
        team: selectedTeam,
        role: selectedRole,
        hasCompletedProfile: true
      });

      // Redirect to dashboard
      navigate('/');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile", {
        description: "Please try again or contact support",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    toast.info("You can complete your profile later from settings", {
      description: "You'll be reminded on your next login",
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-africa-terracotta text-white mb-4">
              <span className="font-bold text-xl">AHR</span>
            </div>
          </div>
          <h1 className="text-3xl font-semibold text-africa-dark">Complete Your Profile</h1>
          <p className="text-muted-foreground mt-2">Help us personalize your experience</p>
        </div>

        <Card className="animate-fade-in shadow-lg border-africa-cream">
          <CardHeader className="pb-2">
            {/* Progress indicator */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <div className="flex items-center">
                  <CircleCheck className="w-4 h-4 mr-1 text-africa-sage" /> Authentication
                </div>
                <div className="flex items-center">
                  <CircleUser className="w-4 h-4 mr-1 text-africa-terracotta" /> Team & Role
                </div>
              </div>
              <Progress value={50} className="h-2" />
            </div>
            
            <h2 className="text-xl font-medium text-center">Welcome, {user?.name}</h2>
            <p className="text-center text-muted-foreground text-sm">
              Please tell us about your role at IST
            </p>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="team">Department / Team</Label>
              <Select
                value={selectedTeam} 
                onValueChange={setSelectedTeam}
              >
                <SelectTrigger id="team" className="w-full">
                  <SelectValue placeholder="Select your department" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team} value={team}>{team}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Your Role</Label>
              <Select
                value={selectedRole} 
                onValueChange={setSelectedRole}
              >
                <SelectTrigger id="role" className="w-full">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
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
              This information helps us customize your experience and permissions
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSetup;
