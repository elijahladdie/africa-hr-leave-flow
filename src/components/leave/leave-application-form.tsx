import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, HelpCircle, Upload } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { getLeaveTypes, submitLeaveRequest } from "@/store/slices/leaveSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store";

const requiresDocumentation = (leaveType: string): boolean => {
  return ["SICK", "OTHER"].includes(leaveType);
};

// Form schema
const today = new Date();
today.setHours(0, 0, 0, 0); // normalize time

const formSchema = z
  .object({
    leaveType: z.string({
      required_error: "Please select a leave type",
    }),
    startDate: z.date({
      required_error: "Please select a start date",
    }),
    endDate: z.date({
      required_error: "Please select an end date",
    }),
    reason: z.string().optional(),
    halfDay: z.boolean().default(false),
    documentUpload: z.any().optional(),
  })
  .refine((data) => data.startDate >= today, {
    message: "Start date cannot be in the past",
    path: ["startDate"],
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date cannot be before start date",
    path: ["endDate"],
  });

type LeaveFormValues = z.infer<typeof formSchema>;

export function LeaveApplicationForm() {
  const [selectedLeaveType, setSelectedLeaveType] = useState<string | null>(
    null
  );
  const dispatch = useAppDispatch();
  const { leaveTypes } = useAppSelector((state) => state.leave);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log("Leave types from Redux:", leaveTypes);
  // Initialize the form
  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      halfDay: false,
      reason: "",
    },
  });

  useEffect(() => {
    const fetchleaveTypes = async () => {
      try {
        await dispatch(getLeaveTypes()).unwrap();
      } catch (err) {
        toast.error("Failed to load Leave Types approvals");
        console.error("Approvals loading error:", err);
      }
    };
    fetchleaveTypes();

    return () => {
      // Cleanup if needed
    };
  }, []);
  // Watch for leave type changes
  const watchLeaveType = form.watch("leaveType");
  const needsDocumentation = selectedLeaveType
    ? requiresDocumentation(selectedLeaveType)
    : false;

  const handleLeaveSubmission = async (data: LeaveFormValues) => {
    setIsSubmitting(true);
    try {
      // Prepare the leave request DTO
      const leaveRequestDTO = {
        leaveType: data.leaveType,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
        halfDay: data.halfDay,
        reason: data.reason || "",
        submittedAt: new Date().toISOString(),
      };

      // Prepare the payload
      const payload = {
        leaveRequest: leaveRequestDTO,
        document:
          data.documentUpload instanceof File ? data.documentUpload : undefined,
      };

      const response = await dispatch(submitLeaveRequest(payload)).unwrap();

      console.log("Leave request submitted:", response);
      toast.success("Leave request submitted successfully");
      navigate("/my-requests");
    } catch (err) {
      toast.error(err?.resp_msg || "Failed to submit leave request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="africa-card max-w-2xl mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-africa-terracotta">
          Apply for Leave
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleLeaveSubmission)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="leaveType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave Type</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedLeaveType(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select leave type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {leaveTypes.map((type, index) => (
                        <SelectItem key={index} value={type.leaveType}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the type of leave you are requesting
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={(date) => date < today || date == today}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={(date) => {
                            const startDate = form.getValues("startDate");
                            return startDate && date < startDate;
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="halfDay"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Half Day</FormLabel>
                    <FormDescription>
                      Request just half a day off
                    </FormDescription>
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
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please provide a reason for your leave request"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {needsDocumentation && (
              <FormField
                control={form.control}
                name="documentUpload"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel>Supporting Document</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs text-xs">
                              {selectedLeaveType === "sick"
                                ? "Please upload a medical certificate for sick leave exceeding 3 days."
                                : selectedLeaveType === "maternity"
                                ? "Please upload relevant medical documentation."
                                : selectedLeaveType === "compassionate"
                                ? "Please upload documentation supporting your request."
                                : "Please upload relevant documentation."}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormControl>
                      <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:border-africa-terracotta/50 transition-colors">
                        <label className="flex flex-col items-center cursor-pointer">
                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                          <span className="text-sm font-medium">
                            Click to upload or drag and drop
                          </span>
                          <span className="text-xs text-muted-foreground mt-1">
                            PDF, JPG, PNG (max 5MB)
                          </span>
                          <Input
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              field.onChange(e.target.files?.[0]);
                            }}
                          />
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-africa-terracotta hover:bg-africa-terracotta/90"
              >
                Submit Leave Request
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
