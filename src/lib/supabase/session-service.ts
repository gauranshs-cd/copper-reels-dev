import { supabase } from '@/integrations/supabase/client';
import { Database } from './database.types';

type Session = Database['public']['Tables']['sessions']['Row'];
type CreativeBrief = Database['public']['Tables']['creative_briefs']['Row'];
type Idea = Database['public']['Tables']['ideas']['Row'];

export class SessionService {
  // Create a new session
  async createSession(userId: string, channelId?: string) {
    const { data, error } = await supabase
      .from('sessions')
      .insert({
        user_id: userId,
        channel_id: channelId,
        status: 'active',
        metadata: {}
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get active session for user
  async getActiveSession(userId: string): Promise<Session | null> {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('started_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  // Get all sessions for user (history)
  async getUserSessions(userId: string, limit = 10) {
    const { data, error } = await supabase
      .from('sessions')
      .select(`
        *,
        channels (
          name,
          umbrella_statement
        ),
        creative_briefs (
          id,
          foundation
        )
      `)
      .eq('user_id', userId)
      .order('started_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  // Update session activity
  async updateSessionActivity(sessionId: string) {
    const { error } = await supabase
      .from('sessions')
      .update({ last_activity_at: new Date().toISOString() })
      .eq('id', sessionId);

    if (error) throw error;
  }

  // Complete a session
  async completeSession(sessionId: string) {
    const { error } = await supabase
      .from('sessions')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (error) throw error;
  }

  // Create or update creative brief
  async upsertCreativeBrief(
    sessionId: string, 
    channelId: string,
    foundation: any,
    styleGuide?: any
  ) {
    const { data, error } = await supabase
      .from('creative_briefs')
      .upsert({
        session_id: sessionId,
        channel_id: channelId,
        foundation,
        style_guide: styleGuide || {},
        pattern_bank_stale: false,
        ideas_stale: false,
        planning_stale: false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get creative brief by session
  async getCreativeBrief(sessionId: string): Promise<CreativeBrief | null> {
    const { data, error } = await supabase
      .from('creative_briefs')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  // Save ideas to database
  async saveIdeas(creativeBriefId: string, ideas: any[]) {
    const ideaRecords = ideas.map(idea => ({
      creative_brief_id: creativeBriefId,
      concept: idea.concept,
      angle: idea.angle,
      why_it_will_click: idea.whyItWillClick,
      difficulty: idea.difficulty,
      thumbnail_hint: idea.thumbnailHint,
      stage: idea.stage,
      notes: idea.notes,
      status: 'generated' as const
    }));

    const { data, error } = await supabase
      .from('ideas')
      .insert(ideaRecords)
      .select();

    if (error) throw error;
    return data;
  }

  // Update idea status
  async updateIdeaStatus(
    ideaId: string, 
    status: 'generated' | 'shortlisted' | 'selected' | 'rejected'
  ) {
    const { error } = await supabase
      .from('ideas')
      .update({ status })
      .eq('id', ideaId);

    if (error) throw error;
  }

  // Get ideas for a creative brief
  async getIdeas(creativeBriefId: string): Promise<Idea[]> {
    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .eq('creative_brief_id', creativeBriefId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Log AI generation
  async logGeneration(params: {
    sessionId?: string;
    botType: string;
    success: boolean;
    durationMs?: number;
    errorMessage?: string;
    requestPayload?: any;
    responsePayload?: any;
  }) {
    const { error } = await supabase
      .from('generation_logs')
      .insert({
        session_id: params.sessionId,
        bot_type: params.botType,
        success: params.success,
        duration_ms: params.durationMs,
        error_message: params.errorMessage,
        request_payload: params.requestPayload,
        response_payload: params.responsePayload
      });

    if (error) console.error('Failed to log generation:', error);
  }

  // Mark sections as stale when upstream changes
  async markSectionsStale(
    creativeBriefId: string,
    sections: {
      patternBank?: boolean;
      ideas?: boolean;
      planning?: boolean;
    }
  ) {
    const updates: any = {};
    if (sections.patternBank !== undefined) updates.pattern_bank_stale = sections.patternBank;
    if (sections.ideas !== undefined) updates.ideas_stale = sections.ideas;
    if (sections.planning !== undefined) updates.planning_stale = sections.planning;

    const { error } = await supabase
      .from('creative_briefs')
      .update(updates)
      .eq('id', creativeBriefId);

    if (error) throw error;
  }
}

// Export singleton instance
export const sessionService = new SessionService();