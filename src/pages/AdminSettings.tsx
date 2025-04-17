
import { LeaveTypeManagement } from "@/components/admin/leave-type-management";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Sliders, Users, Database, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminSettings() {
  return (
    <div className="flex-1 p-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-africa-terracotta">Admin Settings</h1>
          <p className="text-muted-foreground mt-1">Configure the leave management system settings.</p>
        </div>
        
        <Tabs defaultValue="leave-types" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="leave-types" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Leave Types
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="departments" className="flex items-center">
              <Database className="h-4 w-4 mr-2" />
              Departments
            </TabsTrigger>
            <TabsTrigger value="general" className="flex items-center">
              <Sliders className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="leave-types" className="mt-0">
            <LeaveTypeManagement />
          </TabsContent>
          
          <TabsContent value="users" className="mt-0">
            <Card className="africa-card animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg font-medium">User Management</CardTitle>
              </CardHeader>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">User management interface will be available soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="departments" className="mt-0">
            <Card className="africa-card animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Department Management</CardTitle>
              </CardHeader>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">Department management interface will be available soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="general" className="mt-0">
            <Card className="africa-card animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg font-medium">General Settings</CardTitle>
              </CardHeader>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">General settings interface will be available soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
