import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Building2, Users, AlertCircle, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { DashboardFilters as Filters } from '@/types/callEvaluation';
import { TEAMS, ROOT_CAUSES, BPOS } from '@/data/callEvaluationMock';
import { format } from 'date-fns';

interface DashboardFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export function DashboardFilters({ filters, onFiltersChange }: DashboardFiltersProps) {
  const [dateOpen, setDateOpen] = useState(false);

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayItem = (key: 'bpos' | 'teams' | 'rootCauses', item: string) => {
    const current = filters[key];
    const updated = current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item];
    updateFilter(key, updated);
  };

  const clearFilters = () => {
    onFiltersChange({
      dateRange: { start: null, end: null },
      bpos: [],
      teams: [],
      rootCauses: [],
    });
  };

  const activeFiltersCount = 
    (filters.dateRange.start ? 1 : 0) +
    filters.bpos.length +
    filters.teams.length +
    filters.rootCauses.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-3 items-center p-4 bg-card rounded-xl border border-border/50"
    >
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Filter className="w-4 h-4" />
        Filters
      </div>

      {/* Date Range */}
      <Popover open={dateOpen} onOpenChange={setDateOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="w-4 h-4" />
            {filters.dateRange.start && filters.dateRange.end
              ? `${format(filters.dateRange.start, 'MMM d')} - ${format(filters.dateRange.end, 'MMM d')}`
              : 'Date Range'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="range"
            selected={{
              from: filters.dateRange.start || undefined,
              to: filters.dateRange.end || undefined,
            }}
            onSelect={(range) => {
              updateFilter('dateRange', {
                start: range?.from || null,
                end: range?.to || null,
              });
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      {/* BPO Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Building2 className="w-4 h-4" />
            BPO
            {filters.bpos.length > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                {filters.bpos.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56" align="start">
          <div className="space-y-2">
            {BPOS.map(bpo => (
              <div key={bpo.id} className="flex items-center space-x-2">
                <Checkbox
                  id={bpo.id}
                  checked={filters.bpos.includes(bpo.id)}
                  onCheckedChange={() => toggleArrayItem('bpos', bpo.id)}
                />
                <Label htmlFor={bpo.id} className="text-sm cursor-pointer">
                  {bpo.name}
                </Label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Team Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Users className="w-4 h-4" />
            Team
            {filters.teams.length > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                {filters.teams.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="start">
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {TEAMS.map(team => (
              <div key={team.id} className="flex items-center space-x-2">
                <Checkbox
                  id={team.id}
                  checked={filters.teams.includes(team.id)}
                  onCheckedChange={() => toggleArrayItem('teams', team.id)}
                />
                <Label htmlFor={team.id} className="text-sm cursor-pointer">
                  {team.name}
                </Label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Root Cause Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <AlertCircle className="w-4 h-4" />
            Root Cause
            {filters.rootCauses.length > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                {filters.rootCauses.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="start">
          <div className="space-y-2 max-h-[250px] overflow-y-auto">
            {ROOT_CAUSES.map(cause => (
              <div key={cause} className="flex items-center space-x-2">
                <Checkbox
                  id={cause}
                  checked={filters.rootCauses.includes(cause)}
                  onCheckedChange={() => toggleArrayItem('rootCauses', cause)}
                />
                <Label htmlFor={cause} className="text-sm cursor-pointer capitalize">
                  {cause.replace(/_/g, ' ')}
                </Label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-muted-foreground hover:text-destructive"
        >
          <X className="w-4 h-4 mr-1" />
          Clear ({activeFiltersCount})
        </Button>
      )}
    </motion.div>
  );
}
