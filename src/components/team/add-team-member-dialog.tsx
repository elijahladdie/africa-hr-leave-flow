// AddTeamMemberForm.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const AddTeamMemberForm = ({ teams, availableUsers, onAddMember }) => {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // Submit the data
    onAddMember(data);

    // Close dialog and reset form
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-africa-terracotta hover:bg-africa-terracotta/90">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Team Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="team">Select Team</Label>
            <Select
              onValueChange={(value) => setValue("teamId", value)}
              required
            >
              <SelectTrigger id="team">
                <SelectValue placeholder="Select Team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="user">Select User</Label>
            <Select
              onValueChange={(value) => setValue("userId", value)}
              required
            >
              <SelectTrigger id="user">
                <SelectValue placeholder="Select User" />
              </SelectTrigger>
              <SelectContent>
                {availableUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Select Role</Label>
            <Select onValueChange={(value) => setValue("role", value)} required>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key={"STAFF"} value={"STAFF"}>
                  Staff
                </SelectItem>
                <SelectItem key={"MANAGER"} value={"MANAGER"}>
                  Manager
                </SelectItem>
                <SelectItem key={"ADMIN"} value={"ADMIN"}>
                  Admin
                </SelectItem>
              </SelectContent>
            </Select>

            {errors.role && (
              <p className="text-xs text-red-500">Role is required</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-africa-terracotta hover:bg-africa-terracotta/90"
            >
              Add Member
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default AddTeamMemberForm;
