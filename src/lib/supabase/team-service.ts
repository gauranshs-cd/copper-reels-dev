import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export type TeamRole = 'owner' | 'admin' | 'editor' | 'viewer';
export type MemberStatus = 'active' | 'suspended';
export type InvitationStatus = 'pending' | 'accepted' | 'expired' | 'cancelled';

export interface Team {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  settings: {
    allow_guest_access: boolean;
    default_role: TeamRole;
    workspace_quota: number;
  };
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: TeamRole;
  joined_at: string;
  invited_by: string | null;
  status: MemberStatus;
  user?: {
    email: string;
    full_name?: string;
    avatar_url?: string;
  };
}

export interface TeamInvitation {
  id: string;
  team_id: string;
  email: string;
  role: TeamRole;
  token: string;
  invited_by: string;
  expires_at: string;
  accepted_at: string | null;
  status: InvitationStatus;
  created_at: string;
}

export interface SharedContent {
  id: string;
  team_id: string;
  content_type: 'foundation' | 'idea' | 'script' | 'project';
  content_data: any;
  created_by: string;
  created_at: string;
  last_modified_by: string | null;
  last_modified_at: string;
  title?: string;
  description?: string;
  permissions: {
    can_edit: string[];
    can_view: string[];
  };
}

class TeamService {
  // Get current user's teams
  async getUserTeams(): Promise<Team[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        team_members!inner(user_id, role, status)
      `)
      .eq('team_members.user_id', user.id)
      .eq('team_members.status', 'active');

    if (error) throw error;
    return data || [];
  }

  // Create a new team
  async createTeam(name: string, slug?: string): Promise<Team> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const teamSlug = slug || this.generateSlug(name);

    // Create team
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .insert({
        name,
        slug: teamSlug,
        owner_id: user.id
      })
      .select()
      .single();

    if (teamError) throw teamError;

    // Add owner as team member
    const { error: memberError } = await supabase
      .from('team_members')
      .insert({
        team_id: team.id,
        user_id: user.id,
        role: 'owner',
        status: 'active'
      });

    if (memberError) throw memberError;

    // Log activity
    await this.logActivity(team.id, 'team_created', { team_name: name });

    return team;
  }

  // Get team by ID
  async getTeam(teamId: string): Promise<Team> {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .single();

    if (error) throw error;
    return data;
  }

  // Update team settings
  async updateTeam(teamId: string, updates: Partial<Team>): Promise<Team> {
    const { data, error } = await supabase
      .from('teams')
      .update(updates)
      .eq('id', teamId)
      .select()
      .single();

    if (error) throw error;

    await this.logActivity(teamId, 'team_updated', { updates });
    return data;
  }

  // Delete team (owner only)
  async deleteTeam(teamId: string): Promise<void> {
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', teamId);

    if (error) throw error;
  }

  // Get team members
  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    const { data, error } = await supabase
      .from('team_members')
      .select(`
        *,
        user:user_id (
          id,
          email,
          raw_user_meta_data
        )
      `)
      .eq('team_id', teamId)
      .eq('status', 'active');

    if (error) throw error;

    return (data || []).map(member => ({
      ...member,
      user: member.user ? {
        email: member.user.email,
        full_name: member.user.raw_user_meta_data?.full_name,
        avatar_url: member.user.raw_user_meta_data?.avatar_url
      } : undefined
    }));
  }

  // Invite team member
  async inviteMember(teamId: string, email: string, role: TeamRole = 'viewer'): Promise<TeamInvitation> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Check if user is already a member
    const { data: existingMember } = await supabase
      .from('team_members')
      .select('*, user:user_id(email)')
      .eq('team_id', teamId)
      .eq('user.email', email)
      .single();

    if (existingMember) {
      throw new Error('User is already a team member');
    }

    // Check for existing pending invitation
    const { data: existingInvite } = await supabase
      .from('team_invitations')
      .select('*')
      .eq('team_id', teamId)
      .eq('email', email)
      .eq('status', 'pending')
      .single();

    if (existingInvite) {
      throw new Error('An invitation is already pending for this email');
    }

    // Create invitation
    const token = this.generateInviteToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    const { data, error } = await supabase
      .from('team_invitations')
      .insert({
        team_id: teamId,
        email,
        role,
        token,
        invited_by: user.id,
        expires_at: expiresAt.toISOString(),
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    // Send invitation email (you'll need to implement this)
    await this.sendInvitationEmail(email, token, teamId);

    await this.logActivity(teamId, 'member_invited', { email, role });
    return data;
  }

  // Accept invitation
  async acceptInvitation(token: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get invitation
    const { data: invitation, error: inviteError } = await supabase
      .from('team_invitations')
      .select('*')
      .eq('token', token)
      .eq('status', 'pending')
      .single();

    if (inviteError || !invitation) {
      throw new Error('Invalid or expired invitation');
    }

    // Check if invitation is expired
    if (new Date(invitation.expires_at) < new Date()) {
      await supabase
        .from('team_invitations')
        .update({ status: 'expired' })
        .eq('id', invitation.id);
      
      throw new Error('Invitation has expired');
    }

    // Add user to team
    const { error: memberError } = await supabase
      .from('team_members')
      .insert({
        team_id: invitation.team_id,
        user_id: user.id,
        role: invitation.role,
        invited_by: invitation.invited_by,
        status: 'active'
      });

    if (memberError) throw memberError;

    // Update invitation status
    await supabase
      .from('team_invitations')
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString(),
        accepted_by: user.id
      })
      .eq('id', invitation.id);

    await this.logActivity(invitation.team_id, 'member_joined', { 
      user_id: user.id,
      email: user.email 
    });
  }

  // Remove team member
  async removeMember(teamId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', teamId)
      .eq('user_id', userId);

    if (error) throw error;

    await this.logActivity(teamId, 'member_removed', { user_id: userId });
  }

  // Update member role
  async updateMemberRole(teamId: string, userId: string, role: TeamRole): Promise<void> {
    const { error } = await supabase
      .from('team_members')
      .update({ role })
      .eq('team_id', teamId)
      .eq('user_id', userId);

    if (error) throw error;

    await this.logActivity(teamId, 'role_updated', { user_id: userId, new_role: role });
  }

  // Share content with team
  async shareContent(
    teamId: string,
    contentType: SharedContent['content_type'],
    contentData: any,
    title?: string,
    description?: string
  ): Promise<SharedContent> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('shared_content')
      .insert({
        team_id: teamId,
        content_type: contentType,
        content_data: contentData,
        created_by: user.id,
        last_modified_by: user.id,
        title,
        description
      })
      .select()
      .single();

    if (error) throw error;

    await this.logActivity(teamId, 'content_shared', { 
      content_type: contentType,
      title 
    });

    return data;
  }

  // Get team's shared content
  async getSharedContent(teamId: string): Promise<SharedContent[]> {
    const { data, error } = await supabase
      .from('shared_content')
      .select('*')
      .eq('team_id', teamId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Check user permission
  async checkPermission(teamId: string, requiredRole: TeamRole[]): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (!data) return false;

    const roleHierarchy: Record<TeamRole, number> = {
      owner: 4,
      admin: 3,
      editor: 2,
      viewer: 1
    };

    const userLevel = roleHierarchy[data.role];
    const requiredLevel = Math.min(...requiredRole.map(r => roleHierarchy[r]));

    return userLevel >= requiredLevel;
  }

  // Get team activity log
  async getTeamActivity(teamId: string, limit = 50): Promise<any[]> {
    const { data, error } = await supabase
      .from('team_activity')
      .select(`
        *,
        user:user_id (
          email,
          raw_user_meta_data
        )
      `)
      .eq('team_id', teamId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  // Private helper methods
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      + '-' + Date.now().toString(36);
  }

  private generateInviteToken(): string {
    return uuidv4() + '-' + Date.now().toString(36);
  }

  private async sendInvitationEmail(email: string, token: string, teamId: string): Promise<void> {
    const inviteLink = `${window.location.origin}/invite/${token}`;
    
    // For development, just log it
    console.log('Invitation link:', inviteLink);
    
    // For production, uncomment this to use Edge Function:
    /*
    const { data: team } = await supabase
      .from('teams')
      .select('name')
      .eq('id', teamId)
      .single();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase.functions.invoke('send-invite', {
      body: {
        email,
        inviteLink,
        teamName: team?.name || 'a team',
        inviterName: user?.email?.split('@')[0] || 'A team member'
      }
    });
    
    if (error) {
      console.error('Failed to send invitation email:', error);
      throw new Error('Failed to send invitation email');
    }
    */
  }

  private async logActivity(teamId: string, action: string, details?: any): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase
      .from('team_activity')
      .insert({
        team_id: teamId,
        user_id: user?.id,
        action,
        details
      });
  }
}

export const teamService = new TeamService();