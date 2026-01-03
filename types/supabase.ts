export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      organisations: {
        Row: {
          id: string;
          name: string;
          owner_id: string;
          timezone: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          owner_id: string;
          timezone?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          owner_id?: string;
          timezone?: string;
          created_at?: string;
        };
      };
      organisation_members: {
        Row: {
          id: string;
          organisation_id: string;
          user_id: string;
          role: 'owner' | 'admin' | 'member';
          created_at: string;
        };
        Insert: {
          id?: string;
          organisation_id: string;
          user_id: string;
          role: 'owner' | 'admin' | 'member';
          created_at?: string;
        };
        Update: {
          id?: string;
          organisation_id?: string;
          user_id?: string;
          role?: 'owner' | 'admin' | 'member';
          created_at?: string;
        };
      };
      content_items: {
        Row: {
          id: string;
          organisation_id: string;
          idea_id: string | null;
          body: string;
          metadata: Json;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          organisation_id: string;
          idea_id?: string | null;
          body: string;
          metadata?: Json;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          organisation_id?: string;
          idea_id?: string | null;
          body?: string;
          metadata?: Json;
          status?: string;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
