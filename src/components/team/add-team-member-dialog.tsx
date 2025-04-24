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
    data.user = { id: data.userId };
    if (data.userId) delete data.userId;
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
                {availableUsers
                  ?.filter((user) => user.role === "STAFF")
                  .map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.fullName}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
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
