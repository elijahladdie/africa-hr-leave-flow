
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarPlus, Clock, FileText, Upload } from "lucide-react";
import { Link } from "react-router-dom";

export function QuickActions() {
  const actions = [
    { 
      title: 'Apply for Leave',
      description: 'Request time off',
      icon: CalendarPlus,
      link: '/apply',
      primary: true
    },
    { 
      title: 'View Requests',
      description: 'Check your applications',
      icon: FileText,
      link: '/my-requests',
      primary: false
    },
    { 
      title: 'Upload Document',
      description: 'Submit supporting files',
      icon: Upload,
      link: '/upload-document',
      primary: false
    },
    { 
      title: 'Leave History',
      description: 'Review past requests',
      icon: Clock,
      link: '/history',
      primary: false
    }
  ];

  return (
    <Card className="africa-card animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((action) => (
            <Link to={action.link} key={action.title}>
              <Button 
                variant={action.primary ? "default" : "outline"}
                className={`w-full flex items-center justify-start h-auto py-3 px-4 ${
                  action.primary ? 'bg-africa-terracotta hover:bg-africa-terracotta/90' : ''
                }`}
              >
                <action.icon className="h-4 w-4 mr-2" />
                <div className="text-left">
                  <div className="text-sm font-medium">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
