// CreateTeamForm.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Users } from "lucide-react";
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
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const CreateTeamForm = ({ departments, users, onCreateTeam }) => {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
  const [selectedMembers, setSelectedMembers] = useState([]);


  const onSubmit = (data) => {
    // Add selected members to the data
    data.teamMemberIds = selectedMembers;
    
    // Submit the data
    onCreateTeam(data);
    
    // Close dialog and reset form
    setOpen(false);
    reset();
    setSelectedMembers([]);
  };

  const handleSelectMember = (userId) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-africa-terracotta hover:bg-africa-terracotta/90">
          <Plus className="h-4 w-4 mr-2" />
          Create Team
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a New Team</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Team Name</Label>
            <Input 
              id="name" 
              {...register("name", { required: true })} 
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-xs text-red-500">Team name is required</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select onValueChange={(value) => setValue("departmentId", value)}>
              <SelectTrigger id="department">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="manager">Manager</Label>
            <Select onValueChange={(value) => setValue("managerId", value)}>
              <SelectTrigger id="manager">
                <SelectValue placeholder="Select Manager" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Team Members</Label>
            <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
              {users.map((user) => (
                <div key={user.id} className="flex items-center space-x-2 p-1">
                  <input
                    type="checkbox"
                    id={`user-${user.id}`}
                    checked={selectedMembers.includes(user.id)}
                    onChange={() => handleSelectMember(user.id)}
                    className="rounded"
                  />
                  <label htmlFor={`user-${user.id}`} className="text-sm">{user.fullName}</label>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-africa-terracotta hover:bg-africa-terracotta/90">
              Create Team
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default CreateTeamForm;