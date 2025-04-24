import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Edit, PlusCircle, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  createLeaveType,
  deleteLeaveType,
  getLeaveTypes,
  updateLeaveType,
} from "@/store/slices/leaveSlice";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store";
import { Skeleton } from "../ui/skeleton";

// Sample leave type data

// Form schema for leave type form
const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  allowance: z.number().min(0, { message: "Allowance must be non-negative" }),
  description: z.string().optional(),
  requiresApproval: z.boolean().default(true),
  isPaid: z.boolean().default(false),
  active: z.boolean().default(true),
});

type LeaveTypeFormValues = z.infer<typeof formSchema>;

export function LeaveTypeManagement() {
  const dispatch = useAppDispatch();
  const { leaveTypes, isLoading } = useAppSelector((state) => state.leave);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Initialize the form with existing code...

  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        await dispatch(getLeaveTypes()).unwrap();
      } catch (err) {
        toast.error("Failed to load leave types");
        console.error("Leave types loading error:", err);
      }
    };

    fetchLeaveTypes();
  }, [dispatch]); // Initialize the form
  async function onSubmit(data: LeaveTypeFormValues) {
    try {
      if (editingId) {
        await dispatch(
          updateLeaveType({
            id: editingId,
            ...data,
          })
        ).unwrap();
        toast.success("Leave type updated successfully");
      } else {
        await dispatch(createLeaveType(data)).unwrap();
        toast.success("Leave type created successfully");
      }
      setIsDialogOpen(false);
      setEditingId(null);
      form.reset();
    } catch (err) {
      toast.error("Failed to save leave type");
      console.error("Leave type save error:", err);
    }
  }

  // Handle edit click
  const handleEdit = (id: string) => {
    const leaveType = leaveTypes.find((type) => type.id === id);
    if (leaveType) {
      setEditingId(id);
      form.reset(leaveType);
      setIsDialogOpen(true);
    }
  };

  // Handle delete click
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this leave type?")) {
      try {
        await dispatch(deleteLeaveType(id)).unwrap();
        toast.success("Leave type deleted successfully");
      } catch (err) {
        toast.error("Failed to delete leave type");
        console.error("Leave type deletion error:", err);
      }
    }
  };

  const form = useForm<LeaveTypeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      allowance: 0,
      description: "",
      requiresApproval: true,
      isPaid: false,
      active: true,
    },
  });

  // Handle form submission
  // function onSubmit(data: LeaveTypeFormValues) {
  //   if (editingId) {
  //     setLeaveTypes(
  //       leaveTypes.map((type) =>
  //         type.id === editingId
  //           ? {
  //               ...type,
  //               name: data.name,
  //               allowance: data.allowance,
  //               description: data.description || "",
  //               requiresApproval: data.requiresApproval,
  //               isPaid: data.isPaid,
  //               active: data.active,
  //             }
  //           : type
  //       )
  //     );
  //   } else {
  //     setLeaveTypes([
  //       ...leaveTypes,
  //       {
  //         id: Date.now().toString(),
  //         name: data.name,
  //         allowance: data.allowance,
  //         description: data.description || "",
  //         requiresApproval: data.requiresApproval,
  //         isPaid: data.isPaid,
  //         active: data.active,
  //       },
  //     ]);
  //   }
  //   setIsDialogOpen(false);
  //   setEditingId(null);
  //   form.reset();
  // }

  // Handle edit click
  // const handleEdit = (id: string) => {
  //   const leaveType = leaveTypes.find((type) => type.id === id);
  //   if (leaveType) {
  //     setEditingId(id);
  //     form.reset(leaveType);
  //     setIsDialogOpen(true);
  //   }
  // };

  // // Handle delete click
  // const handleDelete = (id: string) => {
  //   if (confirm("Are you sure you want to delete this leave type?")) {
  //     setLeaveTypes(leaveTypes.filter((type) => type.id !== id));
  //   }
  // };

  // Handle dialog close
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingId(null);
    form.reset();
  };

  return (
    <Card className="africa-card animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Leave Types</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="default"
                size="sm"
                className="bg-africa-terracotta hover:bg-africa-terracotta/90"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Leave Type
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Edit Leave Type" : "Add Leave Type"}
                </DialogTitle>
                <DialogDescription>
                  {editingId
                    ? "Update the details of this leave type"
                    : "Add a new leave type to the system"}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g., Personal Time Off"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="allowance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Allowance (days)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Maximum number of days allowed per year
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Brief description of this leave type"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="requiresApproval"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md border p-3">
                          <div>
                            <FormLabel>Requires Approval</FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="isPaid"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md border p-3">
                          <div>
                            <FormLabel>Is Paid</FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
               
                  <DialogFooter className="pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDialogClose}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Save</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-16" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Allowance</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Description
                  </TableHead>
                  <TableHead className="whitespace-nowrap">Requires Approval</TableHead>
                  <TableHead>Is Paid</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveTypes.map((type) => (
                  <TableRow key={type.id}>
                    <TableCell className="font-medium">{type.name}</TableCell>
                    <TableCell>{type.defaultDays} days</TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs truncate">
                      {type.description}
                    </TableCell>
                    <TableCell>
                      {type.requiresApproval ? "Required" : "Not Required"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex h-2 w-2 rounded-full ${
                          type.isPaid ? "bg-africa-sage" : "bg-gray-300"
                        } mr-1`}
                      ></span>
                      {type.isPaid ? "Yes" : "No"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
