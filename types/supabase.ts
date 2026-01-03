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
          timezone: string;
          owner_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          timezone?: string;
          owner_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          timezone?: string;
          owner_id?: string;
          created_at?: string;
        };
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
      };
    };

    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
