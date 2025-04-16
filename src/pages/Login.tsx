
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MicrosoftIcon } from "@/components/icons/microsoft-icon";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const handleMicrosoftLogin = async () => {
    setIsLoading(true);
    
    // Simulate Microsoft authentication process with a delay
    setTimeout(async () => {
      try {
        // In a real implementation, this would be the email from Microsoft Auth
        const email = "demo@ist.com";
        
        // Use the login function from our AuthContext
        const success = await login(email);
        
        if (success) {
          // Redirect to dashboard after successful login
          setTimeout(() => {
            setIsLoading(false);
            navigate('/');
          }, 1000);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        toast.error("Authentication failed", {
          description: "Please try again or contact support",
        });
      }
    }, 1500);
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
          <h1 className="text-3xl font-semibold text-africa-dark">Africa HR</h1>
          <p className="text-muted-foreground mt-2">Leave Management System</p>
        </div>
        
        <Card className="animate-fade-in shadow-lg border-africa-cream">
          <CardHeader className="pb-2">
            <h2 className="text-xl font-medium text-center">Welcome Back</h2>
            <p className="text-center text-muted-foreground text-sm">
              Sign in to access your leave management portal
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-center justify-center h-20">
              <Button
                onClick={handleMicrosoftLogin}
                className="w-full h-12 bg-[#2F2F2F] hover:bg-[#1E1E1E] text-white transition-all duration-300 relative group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <MicrosoftIcon className="mr-2 h-5 w-5" />
                    Sign in with Microsoft
                    <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
                  </>
                )}
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked) => {
                  if (typeof checked === 'boolean') {
                    setRememberMe(checked);
                  }
                }}
              />
              <Label htmlFor="rememberMe" className="text-sm cursor-pointer">
                Remember me
              </Label>
            </div>
            
            <div className="pt-2 text-center">
              <p className="text-xs text-muted-foreground">
                <span className="inline-flex items-center">
                  <svg 
                    className="w-3 h-3 mr-1 text-africa-sage" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" 
                      clipRule="evenodd"
                    />
                  </svg>
                  Only @ist.com domain emails are accepted
                </span>
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 pt-0">
            <Separator />
            <div className="flex flex-col items-center justify-center text-sm w-full">
              <button
                className="text-africa-blue hover:underline transition-all duration-200"
                onClick={() => toast.info("Please contact your administrator to reset your password.")}
              >
                Forgot your password?
              </button>
              <p className="text-xs text-muted-foreground mt-4">
                © {new Date().getFullYear()} Africa HR Ltd. All rights reserved.
              </p>
            </div>
          </CardFooter>
        </Card>
        
        <div className="mt-8 text-center text-sm text-muted-foreground animate-fade-in">
          <p>Need help? Contact IT Support at support@africahr.com</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
