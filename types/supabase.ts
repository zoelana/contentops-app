export type Database = {
  public: {
    Tables: {
      organisations: {
        Row: {
          id: string
          name: string
          timezone: string
          owner_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          timezone?: string
          owner_id: string
          created_at?: string
        }
        Update: {
          name?: string
          timezone?: string
        }
      }

      organisation_members: {
        Row: {
          id: string
          organisation_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member'
          created_at: string
        }
        Insert: {
          id?: string
          organisation_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member'
          created_at?: string
        }
        Update: {
          role?: 'owner' | 'admin' | 'member'
        }
      }
    }

    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}
