import { supabase } from '@/integrations/supabase/client';

export interface Channel {
  id: string;
  user_id: string;
  name: string;
  umbrella: string;
  viewer_type: 'LEARNER' | 'ENTHUSIAST' | 'EXPERT';
  created_at: string;
  updated_at: string;
}

export interface AudienceAvatar {
  id: string;
  channel_id: string;
  demographics: any;
  psychographics: any;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Pillar {
  id: string;
  channel_id: string;
  name: string;
  summary: string;
  created_at: string;
  updated_at: string;
}

export interface Idea {
  id: string;
  channel_id: string;
  pillar_id: string;
  concept: string;
  chosen_title: string;
  chosen_thumb: string;
  status: string;
  prompt: string;
  metrics: any;
  created_at: string;
  updated_at: string;
}

export interface VideoPlan {
  id: string;
  idea_id: string;
  storyboard: any;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface Brick {
  id: string;
  plan_id: string;
  type: string;
  content: any;
  order_index: number;
  created_at: string;
  updated_at: string;
}

// Channel operations
export const channelService = {
  async getChannels() {
    const { data, error } = await supabase
      .from('channels')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createChannel(name: string, umbrella: string, viewer_type: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('channels')
      .insert({
        name,
        umbrella,
        viewer_type,
        user_id: user.id
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateChannel(id: string, updates: Partial<Channel>) {
    const { data, error } = await supabase
      .from('channels')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Audience Avatar operations
export const avatarService = {
  async getAvatar(channelId: string) {
    const { data, error } = await supabase
      .from('audience_avatars')
      .select('*')
      .eq('channel_id', channelId)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async createOrUpdateAvatar(channelId: string, avatar: Partial<AudienceAvatar>) {
    const { data: existing } = await supabase
      .from('audience_avatars')
      .select('id')
      .eq('channel_id', channelId)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from('audience_avatars')
        .update(avatar)
        .eq('channel_id', channelId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('audience_avatars')
        .insert({
          ...avatar,
          channel_id: channelId
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  }
};

// Pillar operations
export const pillarService = {
  async getPillars(channelId: string) {
    const { data, error } = await supabase
      .from('pillars')
      .select('*')
      .eq('channel_id', channelId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async createPillar(channelId: string, name: string, summary: string) {
    const { data, error } = await supabase
      .from('pillars')
      .insert({
        channel_id: channelId,
        name,
        summary
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updatePillar(id: string, updates: Partial<Pillar>) {
    const { data, error } = await supabase
      .from('pillars')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Idea operations
export const ideaService = {
  async getIdeas(channelId: string) {
    const { data, error } = await supabase
      .from('ideas')
      .select(`
        *,
        pillar:pillars(name)
      `)
      .eq('channel_id', channelId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createIdea(channelId: string, idea: Partial<Idea> & { concept: string }) {
    const { data, error } = await supabase
      .from('ideas')
      .insert({
        ...idea,
        channel_id: channelId,
        concept: idea.concept
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateIdea(id: string, updates: Partial<Idea>) {
    const { data, error } = await supabase
      .from('ideas')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Video Plan operations
export const videoPlanService = {
  async getVideoPlan(ideaId: string) {
    const { data, error } = await supabase
      .from('video_plans')
      .select(`
        *,
        bricks(*)
      `)
      .eq('idea_id', ideaId)
      .order('version', { ascending: false })
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async createVideoPlan(ideaId: string, storyboard: any) {
    const { data, error } = await supabase
      .from('video_plans')
      .insert({
        idea_id: ideaId,
        storyboard
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateVideoPlan(id: string, updates: Partial<VideoPlan>) {
    const { data, error } = await supabase
      .from('video_plans')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Brick operations
export const brickService = {
  async getBricks(planId: string) {
    const { data, error } = await supabase
      .from('bricks')
      .select('*')
      .eq('plan_id', planId)
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async createBrick(planId: string, brick: Partial<Brick> & { type: string; content: any; order_index: number }) {
    const { data, error } = await supabase
      .from('bricks')
      .insert({
        ...brick,
        plan_id: planId,
        type: brick.type,
        content: brick.content,
        order_index: brick.order_index
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateBrick(id: string, updates: Partial<Brick>) {
    const { data, error } = await supabase
      .from('bricks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateBricksOrder(bricks: Array<{ id: string; order_index: number }>) {
    const updates = bricks.map(brick => 
      supabase
        .from('bricks')
        .update({ order_index: brick.order_index })
        .eq('id', brick.id)
    );

    const results = await Promise.all(updates);
    const errors = results.filter(result => result.error);
    
    if (errors.length > 0) {
      throw errors[0].error;
    }
    
    return results.map(result => result.data);
  }
};