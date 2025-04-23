// import { Team } from "@/types/team";
// import { TeamCard } from "./team-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Team } from "@/types/team";
import { TeamCard } from "./team-card";

interface TeamListProps {
  teams: Team[];
  isLoading: boolean;
}

export function TeamList({ teams, isLoading }: TeamListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <Skeleton key={n} className="h-[200px]" />
        ))}
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No teams found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  );
}
