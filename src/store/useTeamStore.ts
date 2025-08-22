import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  teamService, 
  Team, 
  TeamMember, 
  TeamInvitation, 
  TeamRole,
  SharedContent 
} from '@/lib/supabase/team-service';

interface TeamState {
  // Current team context
  currentTeam: Team | null;
  userRole: TeamRole | null;
  teams: Team[];
  
  // Team members
  members: TeamMember[];
  invitations: TeamInvitation[];
  
  // Shared content
  sharedContent: SharedContent[];
  
  // Loading states
  isLoading: boolean;
  isInviting: boolean;
  
  // Actions - Team Management
  setCurrentTeam: (team: Team | null) => void;
  switchTeam: (teamId: string) => Promise<void>;
  loadUserTeams: () => Promise<void>;
  createTeam: (name: string) => Promise<Team>;
  updateTeam: (teamId: string, updates: Partial<Team>) => Promise<void>;
  deleteTeam: (teamId: string) => Promise<void>;
  
  // Actions - Member Management
  loadTeamMembers: (teamId: string) => Promise<void>;
  inviteMember: (email: string, role: TeamRole) => Promise<void>;
  removeMember: (memberId: string) => Promise<void>;
  updateMemberRole: (memberId: string, role: TeamRole) => Promise<void>;
  acceptInvitation: (token: string) => Promise<void>;
  
  // Actions - Content Management
  loadSharedContent: () => Promise<void>;
  shareContent: (
    contentType: 'foundation' | 'idea' | 'script' | 'project',
    contentData: any,
    title?: string,
    description?: string
  ) => Promise<void>;
  
  // Utility
  hasPermission: (requiredRoles: TeamRole[]) => boolean;
  reset: () => void;
}

const initialState = {
  currentTeam: null,
  userRole: null,
  teams: [],
  members: [],
  invitations: [],
  sharedContent: [],
  isLoading: false,
  isInviting: false,
};

export const useTeamStore = create<TeamState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentTeam: (team) => set({ currentTeam: team }),

      switchTeam: async (teamId) => {
        set({ isLoading: true });
        try {
          const team = await teamService.getTeam(teamId);
          const members = await teamService.getTeamMembers(teamId);
          
          // Find current user's role
          const currentUserMember = members.find(m => m.user_id === team.owner_id);
          const userRole = currentUserMember?.role || null;
          
          set({ 
            currentTeam: team, 
            members,
            userRole,
            isLoading: false 
          });
          
          // Load shared content for the team
          await get().loadSharedContent();
        } catch (error) {
          console.error('Failed to switch team:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      loadUserTeams: async () => {
        set({ isLoading: true });
        try {
          const teams = await teamService.getUserTeams();
          set({ teams, isLoading: false });
          
          // If no current team, set the first one
          if (!get().currentTeam && teams.length > 0) {
            await get().switchTeam(teams[0].id);
          }
        } catch (error) {
          console.error('Failed to load teams:', error);
          set({ isLoading: false });
        }
      },

      createTeam: async (name) => {
        set({ isLoading: true });
        try {
          const team = await teamService.createTeam(name);
          const teams = [...get().teams, team];
          set({ teams, currentTeam: team, isLoading: false });
          
          // Switch to the new team
          await get().switchTeam(team.id);
          
          return team;
        } catch (error) {
          console.error('Failed to create team:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      updateTeam: async (teamId, updates) => {
        set({ isLoading: true });
        try {
          const updatedTeam = await teamService.updateTeam(teamId, updates);
          const teams = get().teams.map(t => 
            t.id === teamId ? updatedTeam : t
          );
          
          set({ 
            teams,
            currentTeam: get().currentTeam?.id === teamId ? updatedTeam : get().currentTeam,
            isLoading: false 
          });
        } catch (error) {
          console.error('Failed to update team:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      deleteTeam: async (teamId) => {
        set({ isLoading: true });
        try {
          await teamService.deleteTeam(teamId);
          const teams = get().teams.filter(t => t.id !== teamId);
          
          set({ 
            teams,
            currentTeam: get().currentTeam?.id === teamId ? null : get().currentTeam,
            isLoading: false 
          });
          
          // Switch to another team if current was deleted
          if (get().currentTeam?.id === teamId && teams.length > 0) {
            await get().switchTeam(teams[0].id);
          }
        } catch (error) {
          console.error('Failed to delete team:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      loadTeamMembers: async (teamId) => {
        try {
          const members = await teamService.getTeamMembers(teamId);
          set({ members });
        } catch (error) {
          console.error('Failed to load team members:', error);
        }
      },

      inviteMember: async (email, role) => {
        const { currentTeam } = get();
        if (!currentTeam) throw new Error('No team selected');
        
        set({ isInviting: true });
        try {
          const invitation = await teamService.inviteMember(currentTeam.id, email, role);
          set({ 
            invitations: [...get().invitations, invitation],
            isInviting: false 
          });
        } catch (error) {
          console.error('Failed to invite member:', error);
          set({ isInviting: false });
          throw error;
        }
      },

      removeMember: async (userId) => {
        const { currentTeam } = get();
        if (!currentTeam) throw new Error('No team selected');
        
        try {
          await teamService.removeMember(currentTeam.id, userId);
          const members = get().members.filter(m => m.user_id !== userId);
          set({ members });
        } catch (error) {
          console.error('Failed to remove member:', error);
          throw error;
        }
      },

      updateMemberRole: async (userId, role) => {
        const { currentTeam } = get();
        if (!currentTeam) throw new Error('No team selected');
        
        try {
          await teamService.updateMemberRole(currentTeam.id, userId, role);
          const members = get().members.map(m => 
            m.user_id === userId ? { ...m, role } : m
          );
          set({ members });
        } catch (error) {
          console.error('Failed to update member role:', error);
          throw error;
        }
      },

      acceptInvitation: async (token) => {
        try {
          await teamService.acceptInvitation(token);
          // Reload teams after accepting invitation
          await get().loadUserTeams();
        } catch (error) {
          console.error('Failed to accept invitation:', error);
          throw error;
        }
      },

      loadSharedContent: async () => {
        const { currentTeam } = get();
        if (!currentTeam) return;
        
        try {
          const content = await teamService.getSharedContent(currentTeam.id);
          set({ sharedContent: content });
        } catch (error) {
          console.error('Failed to load shared content:', error);
        }
      },

      shareContent: async (contentType, contentData, title, description) => {
        const { currentTeam } = get();
        if (!currentTeam) throw new Error('No team selected');
        
        try {
          const content = await teamService.shareContent(
            currentTeam.id,
            contentType,
            contentData,
            title,
            description
          );
          set({ sharedContent: [...get().sharedContent, content] });
        } catch (error) {
          console.error('Failed to share content:', error);
          throw error;
        }
      },

      hasPermission: (requiredRoles) => {
        const { userRole } = get();
        if (!userRole) return false;
        
        const roleHierarchy: Record<TeamRole, number> = {
          owner: 4,
          admin: 3,
          editor: 2,
          viewer: 1
        };
        
        const userLevel = roleHierarchy[userRole];
        const requiredLevel = Math.min(...requiredRoles.map(r => roleHierarchy[r]));
        
        return userLevel >= requiredLevel;
      },

      reset: () => set(initialState),
    }),
    {
      name: 'team-storage',
      partialize: (state) => ({
        currentTeam: state.currentTeam,
        userRole: state.userRole,
      }),
    }
  )
);