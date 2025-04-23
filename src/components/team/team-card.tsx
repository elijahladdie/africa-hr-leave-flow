import { Team } from "@/types/team";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Users } from "lucide-react";
// import { EditTeamDialog } from "./add-team-member-dialog";
// import { EditTeamDialog } from "./edit-team-dialog";

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">{team.name}</CardTitle>
    
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Department</p>
            <p className="font-medium">{team.department}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Manager</p>
            <p className="font-medium">{team.manager?.name || "No manager assigned"}</p>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {team.members?.length || 0} members
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}