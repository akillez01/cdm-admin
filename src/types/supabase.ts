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
      members: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone: string | null
          address: string | null
          birth_date: string | null
          baptism_date: string | null
          join_date: string
          status: 'active' | 'inactive' | 'visitor'
          groups: string[] | null
          ministries: string[] | null
          skills: string[] | null
          notes: string | null
          photo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          address?: string | null
          birth_date?: string | null
          baptism_date?: string | null
          join_date?: string
          status: 'active' | 'inactive' | 'visitor'
          groups?: string[] | null
          ministries?: string[] | null
          skills?: string[] | null
          notes?: string | null
          photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          address?: string | null
          birth_date?: string | null
          baptism_date?: string | null
          join_date?: string
          status?: 'active' | 'inactive' | 'visitor'
          groups?: string[] | null
          ministries?: string[] | null
          skills?: string[] | null
          notes?: string | null
          photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      inventory_items: {
        Row: {
          id: string
          name: string
          category: string
          quantity: number
          location: string
          value: number
          supplier: string | null
          purchase_date: string | null
          min_quantity: number | null
          status: 'available' | 'low' | 'depleted'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          quantity: number
          location: string
          value: number
          supplier?: string | null
          purchase_date?: string | null
          min_quantity?: number | null
          status: 'available' | 'low' | 'depleted'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          quantity?: number
          location?: string
          value?: number
          supplier?: string | null
          purchase_date?: string | null
          min_quantity?: number | null
          status?: 'available' | 'low' | 'depleted'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}