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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      commission_events: {
        Row: {
          amount: number
          created_at: string
          event_type: string
          gym_id: string
          id: string
          subscription_id: string | null
          trainer_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          event_type: string
          gym_id: string
          id?: string
          subscription_id?: string | null
          trainer_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          event_type?: string
          gym_id?: string
          id?: string
          subscription_id?: string | null
          trainer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "commission_events_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_events_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_events_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "trainers"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_rules: {
        Row: {
          activation_amount: number
          activation_type: string
          cap_per_month: number | null
          created_at: string
          gym_id: string
          id: string
          renewal_amount: number
          renewal_type: string
          trainer_id: string | null
        }
        Insert: {
          activation_amount?: number
          activation_type?: string
          cap_per_month?: number | null
          created_at?: string
          gym_id: string
          id?: string
          renewal_amount?: number
          renewal_type?: string
          trainer_id?: string | null
        }
        Update: {
          activation_amount?: number
          activation_type?: string
          cap_per_month?: number | null
          created_at?: string
          gym_id?: string
          id?: string
          renewal_amount?: number
          renewal_type?: string
          trainer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commission_rules_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_rules_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "trainers"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          code: string
          coupon_type: string
          created_at: string
          expires_at: string | null
          gym_id: string
          id: string
          max_redemptions: number
          pool_id: string | null
          recipient_email: string | null
          recipient_name: string | null
          recipient_phone: string | null
          redemptions: number
          status: string
          trainer_id: string | null
        }
        Insert: {
          code: string
          coupon_type?: string
          created_at?: string
          expires_at?: string | null
          gym_id: string
          id?: string
          max_redemptions?: number
          pool_id?: string | null
          recipient_email?: string | null
          recipient_name?: string | null
          recipient_phone?: string | null
          redemptions?: number
          status?: string
          trainer_id?: string | null
        }
        Update: {
          code?: string
          coupon_type?: string
          created_at?: string
          expires_at?: string | null
          gym_id?: string
          id?: string
          max_redemptions?: number
          pool_id?: string | null
          recipient_email?: string | null
          recipient_name?: string | null
          recipient_phone?: string | null
          redemptions?: number
          status?: string
          trainer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coupons_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupons_pool_id_fkey"
            columns: ["pool_id"]
            isOneToOne: false
            referencedRelation: "license_pools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupons_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "trainers"
            referencedColumns: ["id"]
          },
        ]
      }
      gyms: {
        Row: {
          address: string | null
          branch: string | null
          city: string | null
          created_at: string
          id: string
          name: string
          owner_user_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          branch?: string | null
          city?: string | null
          created_at?: string
          id?: string
          name: string
          owner_user_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          branch?: string | null
          city?: string | null
          created_at?: string
          id?: string
          name?: string
          owner_user_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      license_pools: {
        Row: {
          created_at: string
          expires_at: string | null
          gym_id: string
          id: string
          plan_name: string
          quantity: number
          redeemed: number
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          gym_id: string
          id?: string
          plan_name: string
          quantity?: number
          redeemed?: number
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          gym_id?: string
          id?: string
          plan_name?: string
          quantity?: number
          redeemed?: number
        }
        Relationships: [
          {
            foreignKeyName: "license_pools_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
        ]
      }
      member_gym_links: {
        Row: {
          gym_id: string
          id: string
          joined_at: string
          member_id: string
          status: string
          trainer_id: string | null
        }
        Insert: {
          gym_id: string
          id?: string
          joined_at?: string
          member_id: string
          status?: string
          trainer_id?: string | null
        }
        Update: {
          gym_id?: string
          id?: string
          joined_at?: string
          member_id?: string
          status?: string
          trainer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "member_gym_links_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_gym_links_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "trainers"
            referencedColumns: ["id"]
          },
        ]
      }
      member_onboarding: {
        Row: {
          activity_level: string | null
          allergies: string[] | null
          cooking_frequency: string | null
          cooking_setup: string | null
          created_at: string | null
          culinary_skill: string | null
          date_of_birth: string | null
          diet_type: string | null
          dislikes: string[] | null
          gender: string | null
          health_goals: string[] | null
          height_cm: number | null
          id: string
          non_veg_days: string[] | null
          onboarding_completed: boolean | null
          preferred_cuisines: string[] | null
          target_weight_kg: number | null
          updated_at: string | null
          user_id: string
          veg_days: string[] | null
          weekly_food_budget: number | null
          weight_kg: number | null
          weight_loss_pace: string | null
        }
        Insert: {
          activity_level?: string | null
          allergies?: string[] | null
          cooking_frequency?: string | null
          cooking_setup?: string | null
          created_at?: string | null
          culinary_skill?: string | null
          date_of_birth?: string | null
          diet_type?: string | null
          dislikes?: string[] | null
          gender?: string | null
          health_goals?: string[] | null
          height_cm?: number | null
          id?: string
          non_veg_days?: string[] | null
          onboarding_completed?: boolean | null
          preferred_cuisines?: string[] | null
          target_weight_kg?: number | null
          updated_at?: string | null
          user_id: string
          veg_days?: string[] | null
          weekly_food_budget?: number | null
          weight_kg?: number | null
          weight_loss_pace?: string | null
        }
        Update: {
          activity_level?: string | null
          allergies?: string[] | null
          cooking_frequency?: string | null
          cooking_setup?: string | null
          created_at?: string | null
          culinary_skill?: string | null
          date_of_birth?: string | null
          diet_type?: string | null
          dislikes?: string[] | null
          gender?: string | null
          health_goals?: string[] | null
          height_cm?: number | null
          id?: string
          non_veg_days?: string[] | null
          onboarding_completed?: boolean | null
          preferred_cuisines?: string[] | null
          target_weight_kg?: number | null
          updated_at?: string | null
          user_id?: string
          veg_days?: string[] | null
          weekly_food_budget?: number | null
          weight_kg?: number | null
          weight_loss_pace?: string | null
        }
        Relationships: []
      }
      nutrition_plan_assets: {
        Row: {
          created_at: string
          duration: string | null
          file_url: string
          goal_tag: string | null
          gym_id: string
          id: string
          status: string
          title: string
          version: number
        }
        Insert: {
          created_at?: string
          duration?: string | null
          file_url: string
          goal_tag?: string | null
          gym_id: string
          id?: string
          status?: string
          title: string
          version?: number
        }
        Update: {
          created_at?: string
          duration?: string | null
          file_url?: string
          goal_tag?: string | null
          gym_id?: string
          id?: string
          status?: string
          title?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "nutrition_plan_assets_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrition_plan_assignments: {
        Row: {
          asset_id: string
          assigned_to_gym: boolean | null
          assigned_to_member_id: string | null
          assigned_to_trainer_id: string | null
          created_at: string
          id: string
          viewed: boolean | null
          viewed_at: string | null
        }
        Insert: {
          asset_id: string
          assigned_to_gym?: boolean | null
          assigned_to_member_id?: string | null
          assigned_to_trainer_id?: string | null
          created_at?: string
          id?: string
          viewed?: boolean | null
          viewed_at?: string | null
        }
        Update: {
          asset_id?: string
          assigned_to_gym?: boolean | null
          assigned_to_member_id?: string | null
          assigned_to_trainer_id?: string | null
          created_at?: string
          id?: string
          viewed?: boolean | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nutrition_plan_assignments_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "nutrition_plan_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nutrition_plan_assignments_assigned_to_trainer_id_fkey"
            columns: ["assigned_to_trainer_id"]
            isOneToOne: false
            referencedRelation: "trainers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          coupon_id: string | null
          created_at: string
          end_at: string
          gym_id: string | null
          id: string
          member_id: string
          plan_name: string
          renewal_count: number
          source: string | null
          start_at: string
          status: string
          trainer_id: string | null
        }
        Insert: {
          coupon_id?: string | null
          created_at?: string
          end_at: string
          gym_id?: string | null
          id?: string
          member_id: string
          plan_name: string
          renewal_count?: number
          source?: string | null
          start_at?: string
          status?: string
          trainer_id?: string | null
        }
        Update: {
          coupon_id?: string | null
          created_at?: string
          end_at?: string
          gym_id?: string | null
          id?: string
          member_id?: string
          plan_name?: string
          renewal_count?: number
          source?: string | null
          start_at?: string
          status?: string
          trainer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "trainers"
            referencedColumns: ["id"]
          },
        ]
      }
      trainers: {
        Row: {
          created_at: string
          email: string | null
          gym_id: string
          id: string
          name: string
          phone: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          gym_id: string
          id?: string
          name: string
          phone?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          gym_id?: string
          id?: string
          name?: string
          phone?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trainers_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      redeem_coupon: { Args: { p_code: string }; Returns: Json }
    }
    Enums: {
      app_role: "super_admin" | "gym_owner" | "trainer" | "member"
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
    Enums: {
      app_role: ["super_admin", "gym_owner", "trainer", "member"],
    },
  },
} as const
