import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
  getAllDepartments,
  updateDepartment,
} from "@/store/slices/departmentSlice";
import { getAllUsers, updateUserRole } from "@/store/slices/userSlice";
import type { DepartmentDTO, UserRoleUpdateDTO } from "@/types/admin";
import { useAppDispatch, useAppSelector, type RootState } from "@/store";
import { LeaveTypeManagement } from "@/components/admin/leave-type-management";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Sliders, Users, Database, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminSettings() {
  const dispatch = useAppDispatch();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Get data from Redux store
  const departments = useAppSelector(
    (state: RootState) => state.departments.departments
  );
  const users = useAppSelector((state: RootState) => state.user.users);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          dispatch(getAllDepartments()).unwrap(),
          dispatch(getAllUsers()).unwrap(),
        ]);
      } catch (error) {
        toast.error("Failed to load initial data");
        console.error("Error loading initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [dispatch]);
  const handleDepartmentUpdate = (department) => {
    setSelectedDepartment(department);
    setIsEditDialogOpen(true);
  };
  const saveDepartmentChanges = async () => {
    if (!selectedDepartment) return;

    try {
      setIsSaving(true);
      await dispatch(
        updateDepartment({
          id: selectedDepartment.id,
          data: selectedDepartment,
        })
      ).unwrap();
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Failed to update department:", error);
    } finally {
      setIsSaving(false);
    }
  };


  const handleUserRoleUpdate = async (
    userId: string,
    role: "STAFF" | "ADMIN" | "MANAGER"
  ) => {
    try {
      const data: UserRoleUpdateDTO = { userId, role };
      const response = await dispatch(updateUserRole(data)).unwrap();
      toast.success("User role updated successfully");
    } catch (err) {
      toast.error("Failed to update user role");
      console.error("User role update error:", err);
    }
  };

  // Update the Users TabsContent to show actual data
  const renderUsersContent = () => (
    <Card className="africa-card animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg font-medium">User Management</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-10 text-center">
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded"
              >
                <div>
                  <p className="font-medium">{`${user.firstName} ${user.lastName}`}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <select
                  value={user.role}
                  onChange={(e: any) =>
                    handleUserRoleUpdate(user.id, e.target.value)
                  }
                  className="p-2 border rounded"
                >
                  <option value="STAFF">User</option>
                  <option value="ADMIN">Admin</option>
                  <option value="MANAGER">Manager</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Update the Departments TabsContent to show actual data
  const renderDepartmentsContent = () => (
    <Card className="africa-card animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Department Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-10 text-center">
            <p className="text-muted-foreground">Loading departments...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {departments.map((department) => (
              <div key={department.id} className="p-4 border rounded">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{department.name}</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDepartmentUpdate(department)}
                    disabled={isSaving}
                  >
                    Edit
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {department.description}
                </p>
              </div>
            ))}
          </div>
        )}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Department</DialogTitle>
            </DialogHeader>
            {selectedDepartment && (
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium">Department Name</label>
                  <input
                    type="text"
                    value={selectedDepartment.name}
                    onChange={(e) =>
                      setSelectedDepartment({
                        ...selectedDepartment,
                        name: e.target.value,
                      })
                    }
                    className="w-full border p-2 rounded mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    value={selectedDepartment.description}
                    onChange={(e) =>
                      setSelectedDepartment({
                        ...selectedDepartment,
                        description: e.target.value,
                      })
                    }
                    className="w-full border p-2 rounded mt-1"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => saveDepartmentChanges()}
                    disabled={isSaving}
                  >
                    Save
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );

  // Update the return statement to use the new content renderers
  return (
    <div className="flex-1 p-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link
              to="/"
              className="flex items-center text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-africa-terracotta">
            Admin Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure the leave management system settings.
          </p>
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
          </TabsList>

          <TabsContent value="leave-types" className="mt-0">
            <LeaveTypeManagement />
          </TabsContent>

          <TabsContent value="users" className="mt-0">
            {renderUsersContent()}
          </TabsContent>

          <TabsContent value="departments" className="mt-0">
            {renderDepartmentsContent()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
