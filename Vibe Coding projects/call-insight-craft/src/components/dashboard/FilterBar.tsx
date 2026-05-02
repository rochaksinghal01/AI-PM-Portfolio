import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { teams, bpos, rootCauses } from "@/lib/mockData";

interface FilterBarProps {
  onFilterChange: (filters: any) => void;
}

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [selectedBpos, setSelectedBpos] = useState<string[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedRootCauses, setSelectedRootCauses] = useState<string[]>([]);

  const handleBpoToggle = (bpo: string) => {
    setSelectedBpos((prev) =>
      prev.includes(bpo) ? prev.filter((b) => b !== bpo) : [...prev, bpo]
    );
  };

  const handleTeamToggle = (team: string) => {
    setSelectedTeams((prev) =>
      prev.includes(team) ? prev.filter((t) => t !== team) : [...prev, team]
    );
  };

  const clearFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    setSelectedBpos([]);
    setSelectedTeams([]);
    setSelectedRootCauses([]);
  };

  const hasActiveFilters = dateRange.from || selectedBpos.length > 0 || selectedTeams.length > 0 || selectedRootCauses.length > 0;

  return (
    <div className="dashboard-card mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-base font-semibold text-foreground">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        {/* Date Range */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal min-w-[240px]",
                !dateRange.from && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                "Select date range"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              selected={dateRange}
              onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        {/* BPO Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              BPO
              {selectedBpos.length > 0 && (
                <span className="ml-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {selectedBpos.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48" align="start">
            <div className="space-y-3">
              {bpos.map((bpo) => (
                <div key={bpo} className="flex items-center space-x-2">
                  <Checkbox
                    id={bpo}
                    checked={selectedBpos.includes(bpo)}
                    onCheckedChange={() => handleBpoToggle(bpo)}
                  />
                  <Label htmlFor={bpo} className="text-sm cursor-pointer">{bpo}</Label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Team Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              Team
              {selectedTeams.length > 0 && (
                <span className="ml-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {selectedTeams.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56" align="start">
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {teams.map((team) => (
                <div key={team} className="flex items-center space-x-2">
                  <Checkbox
                    id={team}
                    checked={selectedTeams.includes(team)}
                    onCheckedChange={() => handleTeamToggle(team)}
                  />
                  <Label htmlFor={team} className="text-sm cursor-pointer">{team}</Label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Root Cause Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              Root Cause
              {selectedRootCauses.length > 0 && (
                <span className="ml-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {selectedRootCauses.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="start">
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {rootCauses.map((cause) => (
                <div key={cause} className="flex items-center space-x-2">
                  <Checkbox
                    id={cause}
                    checked={selectedRootCauses.includes(cause)}
                    onCheckedChange={() => {
                      setSelectedRootCauses((prev) =>
                        prev.includes(cause) ? prev.filter((c) => c !== cause) : [...prev, cause]
                      );
                    }}
                  />
                  <Label htmlFor={cause} className="text-sm cursor-pointer capitalize">
                    {cause.replace(/_/g, " ")}
                  </Label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
