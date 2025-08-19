export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      channels: {
        Row: {
          id: string
          user_id: string
          name: string
          umbrella_statement: string
          channel_about: string | null
          primary_goal: string | null
          viewer_type: 'LEARNER' | 'ENTHUSIAST' | 'EXPERT' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          umbrella_statement: string
          channel_about?: string | null
          primary_goal?: string | null
          viewer_type?: 'LEARNER' | 'ENTHUSIAST' | 'EXPERT' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          umbrella_statement?: string
          channel_about?: string | null
          primary_goal?: string | null
          viewer_type?: 'LEARNER' | 'ENTHUSIAST' | 'EXPERT' | null
          created_at?: string
          updated_at?: string
        }
      }
      sessions: {
        Row: {
          id: string
          user_id: string
          channel_id: string | null
          status: 'active' | 'completed' | 'abandoned'
          started_at: string
          completed_at: string | null
          last_activity_at: string
          metadata: Json
        }
        Insert: {
          id?: string
          user_id: string
          channel_id?: string | null
          status?: 'active' | 'completed' | 'abandoned'
          started_at?: string
          completed_at?: string | null
          last_activity_at?: string
          metadata?: Json
        }
        Update: {
          id?: string
          user_id?: string
          channel_id?: string | null
          status?: 'active' | 'completed' | 'abandoned'
          started_at?: string
          completed_at?: string | null
          last_activity_at?: string
          metadata?: Json
        }
      }
      creative_briefs: {
        Row: {
          id: string
          session_id: string
          channel_id: string
          foundation: Json
          style_guide: Json
          pattern_bank_stale: boolean
          ideas_stale: boolean
          planning_stale: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          session_id: string
          channel_id: string
          foundation?: Json
          style_guide?: Json
          pattern_bank_stale?: boolean
          ideas_stale?: boolean
          planning_stale?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          channel_id?: string
          foundation?: Json
          style_guide?: Json
          pattern_bank_stale?: boolean
          ideas_stale?: boolean
          planning_stale?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      ideas: {
        Row: {
          id: string
          creative_brief_id: string
          pillar_id: string | null
          concept: string
          angle: string | null
          why_it_will_click: string | null
          difficulty: number | null
          thumbnail_hint: string | null
          status: 'generated' | 'shortlisted' | 'selected' | 'rejected'
          stage: 'new' | 'stuck' | 'leveling_up' | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          creative_brief_id: string
          pillar_id?: string | null
          concept: string
          angle?: string | null
          why_it_will_click?: string | null
          difficulty?: number | null
          thumbnail_hint?: string | null
          status?: 'generated' | 'shortlisted' | 'selected' | 'rejected'
          stage?: 'new' | 'stuck' | 'leveling_up' | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          creative_brief_id?: string
          pillar_id?: string | null
          concept?: string
          angle?: string | null
          why_it_will_click?: string | null
          difficulty?: number | null
          thumbnail_hint?: string | null
          status?: 'generated' | 'shortlisted' | 'selected' | 'rejected'
          stage?: 'new' | 'stuck' | 'leveling_up' | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      generation_logs: {
        Row: {
          id: string
          session_id: string | null
          bot_type: string
          input_tokens: number | null
          output_tokens: number | null
          duration_ms: number | null
          success: boolean
          error_message: string | null
          request_payload: Json | null
          response_payload: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id?: string | null
          bot_type: string
          input_tokens?: number | null
          output_tokens?: number | null
          duration_ms?: number | null
          success?: boolean
          error_message?: string | null
          request_payload?: Json | null
          response_payload?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string | null
          bot_type?: string
          input_tokens?: number | null
          output_tokens?: number | null
          duration_ms?: number | null
          success?: boolean
          error_message?: string | null
          request_payload?: Json | null
          response_payload?: Json | null
          created_at?: string
        }
      }
    }
  }
}