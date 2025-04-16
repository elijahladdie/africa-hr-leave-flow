
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from 'lucide-react';

interface LeaveBalanceCardProps {
  leaveType: string;
  usedDays: number;
  totalDays: number;
  accrued?: number;
  expiring?: number;
}

export function LeaveBalanceCard({
  leaveType,
  usedDays,
  totalDays,
  accrued,
  expiring
}: LeaveBalanceCardProps) {
  const balanceDays = totalDays - usedDays;
  const progressPercentage = (usedDays / totalDays) * 100;
  
  let progressColor = "bg-africa-sage";
  if (progressPercentage > 75) {
    progressColor = "bg-africa-red";
  } else if (progressPercentage > 50) {
    progressColor = "bg-africa-yellow";
  }

  return (
    <Card className="africa-card overflow-hidden animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">{leaveType}</CardTitle>
          {expiring && expiring > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <span className="text-xs px-2 py-0.5 bg-africa-yellow/20 text-africa-yellow rounded-full flex items-center">
                    <Info className="h-3 w-3 mr-1" />
                    {expiring} days expiring
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">You have {expiring} days expiring at the end of the year.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between mb-2">
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-africa-terracotta">{balanceDays}</span>
            <span className="text-sm text-muted-foreground ml-1">/ {totalDays} days</span>
          </div>
          
          {accrued !== undefined && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <span className="text-xs text-muted-foreground flex items-center">
                    <span className="inline-block h-2 w-2 bg-africa-blue rounded-full mr-1"></span>
                    Accruing {accrued} days/month
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">You accrue {accrued} leave days per month.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        <div className="leave-progress-container mt-2">
          <div 
            className={`leave-progress-bar ${progressColor}`} 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Used: {usedDays} days</span>
          <span>Remaining: {balanceDays} days</span>
        </div>
      </CardContent>
    </Card>
  );
}
