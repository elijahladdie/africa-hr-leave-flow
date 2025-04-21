import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSelector } from 'react-redux';
import { selectAuthError } from '@/store/slices/authSlice';
import { AlertCircle } from 'lucide-react';

const ExternalLoginFailure: React.FC = () => {
  const navigate = useNavigate();
  const error = useSelector(selectAuthError);

  const handleRetry = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6">
      <div className="w-full max-w-md">
        <Card className="animate-fade-in shadow-lg border-destructive">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <AlertCircle className="w-12 h-12 text-destructive" />
            </div>
            <h1 className="text-2xl font-semibold text-destructive">Microsoft Login Failed</h1>
            <p className="text-muted-foreground text-sm">
              {error || "An unexpected error occurred during Microsoft login. Please try again."}
            </p>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-center text-muted-foreground">
              This issue might be temporary or due to your Microsoft account settings.
            </p>
          </CardContent>

          <CardFooter className="flex justify-center pt-4">
            <Button onClick={handleRetry}>Try Again</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ExternalLoginFailure;
