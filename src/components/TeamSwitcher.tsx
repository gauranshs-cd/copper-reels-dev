import { useState, useEffect } from 'react';
import { useTeamStore } from '@/store/useTeamStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Building2,
  ChevronDown,
  Plus,
  Check,
  Users,
  User,
  Settings,
  Crown,
  Shield,
  Edit3,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export function TeamSwitcher({ className }: { className?: string }) {
  const navigate = useNavigate();
  const {
    currentTeam,
    teams,
    userRole,
    loadUserTeams,
    switchTeam,
    createTeam,
    isLoading
  } = useTeamStore();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadUserTeams();
  }, []);

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) return;

    setCreating(true);
    try {
      await createTeam(newTeamName);
      toast.success('Team created successfully');
      setNewTeamName('');
      setShowCreateDialog(false);
    } catch (error) {
      toast.error('Failed to create team');
    } finally {
      setCreating(false);
    }
  };

  const handleSwitchTeam = async (teamId: string) => {
    if (teamId === currentTeam?.id) return;
    
    try {
      await switchTeam(teamId);
      toast.success('Switched team');
    } catch (error) {
      toast.error('Failed to switch team');
    }
  };

  const getRoleIcon = () => {
    switch (userRole) {
      case 'owner': return <Crown className="w-3 h-3" />;
      case 'admin': return <Shield className="w-3 h-3" />;
      case 'editor': return <Edit3 className="w-3 h-3" />;
      case 'viewer': return <Eye className="w-3 h-3" />;
      default: return null;
    }
  };

  const getRoleColor = () => {
    switch (userRole) {
      case 'owner': return 'text-yellow-600 bg-yellow-500/10';
      case 'admin': return 'text-purple-600 bg-purple-500/10';
      case 'editor': return 'text-blue-600 bg-blue-500/10';
      case 'viewer': return 'text-gray-600 bg-gray-500/10';
      default: return '';
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between",
              className
            )}
            disabled={isLoading}
          >
            <div className="flex items-center gap-2 truncate">
              {teams.length > 1 ? (
                <Building2 className="w-4 h-4 shrink-0" />
              ) : (
                <User className="w-4 h-4 shrink-0" />
              )}
              <span className="truncate">
                {currentTeam?.name || 'Select Team'}
              </span>
              {userRole && (
                <Badge variant="secondary" className={cn("text-xs shrink-0", getRoleColor())}>
                  {getRoleIcon()}
                  <span className="ml-1">{userRole}</span>
                </Badge>
              )}
            </div>
            <ChevronDown className="w-4 h-4 shrink-0 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel>Your Teams</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {teams.map((team) => (
            <DropdownMenuItem
              key={team.id}
              onClick={() => handleSwitchTeam(team.id)}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  {team.name.includes('Personal') ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Users className="w-4 h-4" />
                  )}
                  <span className="truncate">{team.name}</span>
                </div>
                {currentTeam?.id === team.id && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </div>
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem
            onClick={() => setShowCreateDialog(true)}
            className="cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Team
          </DropdownMenuItem>
          
          {currentTeam && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate('/team-settings')}
                className="cursor-pointer"
              >
                <Settings className="w-4 h-4 mr-2" />
                Team Settings
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Create Team Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Team</DialogTitle>
            <DialogDescription>
              Create a new team to collaborate with others
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="team-name">Team Name</Label>
              <Input
                id="team-name"
                placeholder="e.g., Marketing Team"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateDialog(false);
                setNewTeamName('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateTeam}
              disabled={creating || !newTeamName.trim()}
            >
              {creating ? 'Creating...' : 'Create Team'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}