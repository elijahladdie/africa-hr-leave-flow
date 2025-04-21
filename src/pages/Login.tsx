import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { MicrosoftIcon } from "@/components/icons/microsoft-icon";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store";
import { loginExternal, loginInternal } from "@/store/slices/authSlice";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [useEmailLogin, setUseEmailLogin] = useState(false);

  const handleMicrosoftLogin = async () => await loginExternal();

  const handleEmailLogin = async () => {
    try {
      const resp = await dispatch(loginInternal({ email, password })).unwrap();

      toast.success(resp.resp_msg);

      if (!resp.data.user.teams.length) {
        navigate(
          "/auth/callback?token=" + resp.data.token + "&disableRedirect=true "
        );
      } else {
        navigate("/");
      }
    } catch (err: any) {
      toast.error(err?.response?.resp_msg || "Invalid credentials", {
        description: err?.response?.resp_msg || "Invalid credentials",
      });
    }
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
            IST Africa
          </h1>
          <p className="text-muted-foreground mt-2">Leave Management System</p>
        </div>

        <Card className="animate-fade-in shadow-lg border-africa-cream">
          <CardHeader className="pb-2 text-center">
            <h2 className="text-xl font-medium">Welcome Back</h2>
            <p className="text-muted-foreground text-sm">
              Sign in to access your portal
            </p>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">
            {useEmailLogin ? (
              <>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  className="w-full h-11 bg-africa-blue hover:bg-africa-blue/90 text-white"
                  onClick={handleEmailLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in with Email"
                  )}
                </Button>
              </>
            ) : (
              <Button
                onClick={handleMicrosoftLogin}
                className="w-full h-12 bg-[#2F2F2F] hover:bg-[#1E1E1E] text-white relative group"
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
                    <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-white transition-all duration-300 group-hover:w-full" />
                  </>
                )}
              </Button>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked) => {
                  if (typeof checked === "boolean") {
                    setRememberMe(checked);
                  }
                }}
              />
              <Label htmlFor="rememberMe" className="text-sm cursor-pointer">
                Remember me
              </Label>
            </div>

            <div className="text-center text-xs text-muted-foreground pt-2">
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
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setUseEmailLogin(!useEmailLogin)}
                className="text-sm text-africa-blue hover:underline transition"
              >
                {useEmailLogin
                  ? "Use Microsoft login instead"
                  : "Use Email and Password instead"}
              </button>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-0">
            <Separator />
            <div className="flex flex-col items-center justify-center text-sm w-full">
              <button
                className="text-africa-blue hover:underline transition-all duration-200"
                onClick={() =>
                  toast.info(
                    "Please contact your administrator to reset your password."
                  )
                }
              >
                Forgot your password?
              </button>
              <p className="text-xs text-muted-foreground mt-4">
                © {new Date().getFullYear()} IST Africa Ltd. All rights
                reserved.
              </p>
            </div>
          </CardFooter>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground animate-fade-in">
          <p>Need help? Contact IT Support at support@ist.com</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
