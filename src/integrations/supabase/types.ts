export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      audience_avatars: {
        Row: {
          channel_id: string
          created_at: string
          demographics: Json | null
          id: string
          notes: string | null
          psychographics: Json | null
          updated_at: string
        }
        Insert: {
          channel_id: string
          created_at?: string
          demographics?: Json | null
          id?: string
          notes?: string | null
          psychographics?: Json | null
          updated_at?: string
        }
        Update: {
          channel_id?: string
          created_at?: string
          demographics?: Json | null
          id?: string
          notes?: string | null
          psychographics?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "audience_avatars_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: true
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
        ]
      }
      bricks: {
        Row: {
          content: Json
          created_at: string
          id: string
          order_index: number
          plan_id: string
          type: string
          updated_at: string
        }
        Insert: {
          content: Json
          created_at?: string
          id?: string
          order_index: number
          plan_id: string
          type: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          order_index?: number
          plan_id?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bricks_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "video_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      channels: {
        Row: {
          created_at: string
          id: string
          name: string
          umbrella: string | null
          updated_at: string
          user_id: string
          viewer_type: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          umbrella?: string | null
          updated_at?: string
          user_id: string
          viewer_type?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          umbrella?: string | null
          updated_at?: string
          user_id?: string
          viewer_type?: string | null
        }
        Relationships: []
      }
      ideas: {
        Row: {
          channel_id: string
          chosen_thumb: string | null
          chosen_title: string | null
          concept: string
          created_at: string
          id: string
          metrics: Json | null
          pillar_id: string | null
          prompt: string | null
          status: string
          updated_at: string
        }
        Insert: {
          channel_id: string
          chosen_thumb?: string | null
          chosen_title?: string | null
          concept: string
          created_at?: string
          id?: string
          metrics?: Json | null
          pillar_id?: string | null
          prompt?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          channel_id?: string
          chosen_thumb?: string | null
          chosen_title?: string | null
          concept?: string
          created_at?: string
          id?: string
          metrics?: Json | null
          pillar_id?: string | null
          prompt?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ideas_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ideas_pillar_id_fkey"
            columns: ["pillar_id"]
            isOneToOne: false
            referencedRelation: "pillars"
            referencedColumns: ["id"]
          },
        ]
      }
      pattern_banks: {
        Row: {
          channel_id: string
          created_at: string
          id: string
          power_words: string[] | null
          sources: Json | null
          thumb_patterns: Json | null
          title_shapes: Json | null
          updated_at: string
        }
        Insert: {
          channel_id: string
          created_at?: string
          id?: string
          power_words?: string[] | null
          sources?: Json | null
          thumb_patterns?: Json | null
          title_shapes?: Json | null
          updated_at?: string
        }
        Update: {
          channel_id?: string
          created_at?: string
          id?: string
          power_words?: string[] | null
          sources?: Json | null
          thumb_patterns?: Json | null
          title_shapes?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pattern_banks_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: true
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
        ]
      }
      pillars: {
        Row: {
          channel_id: string
          created_at: string
          id: string
          name: string
          summary: string | null
          updated_at: string
        }
        Insert: {
          channel_id: string
          created_at?: string
          id?: string
          name: string
          summary?: string | null
          updated_at?: string
        }
        Update: {
          channel_id?: string
          created_at?: string
          id?: string
          name?: string
          summary?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pillars_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
        ]
      }
      thumb_drafts: {
        Row: {
          created_at: string
          id: string
          idea_id: string
          notes: string | null
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          idea_id: string
          notes?: string | null
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          idea_id?: string
          notes?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "thumb_drafts_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      title_drafts: {
        Row: {
          created_at: string
          id: string
          idea_id: string
          score: number | null
          text: string
        }
        Insert: {
          created_at?: string
          id?: string
          idea_id: string
          score?: number | null
          text: string
        }
        Update: {
          created_at?: string
          id?: string
          idea_id?: string
          score?: number | null
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "title_drafts_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      video_plans: {
        Row: {
          created_at: string
          id: string
          idea_id: string
          storyboard: Json | null
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          id?: string
          idea_id: string
          storyboard?: Json | null
          updated_at?: string
          version?: number
        }
        Update: {
          created_at?: string
          id?: string
          idea_id?: string
          storyboard?: Json | null
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "video_plans_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: true
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
