import { useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { Database } from '../types/supabase';

export function useSupabase() {
  // Membros
  const getMembers = useCallback(async () => {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }, []);

  const addMember = useCallback(async (member: Database['public']['Tables']['members']['Insert']) => {
    const { data, error } = await supabase
      .from('members')
      .insert(member)
      .select()
      .single();

    if (error) throw error;
    return data;
  }, []);

  const updateMember = useCallback(async (
    id: string,
    member: Database['public']['Tables']['members']['Update']
  ) => {
    const { data, error } = await supabase
      .from('members')
      .update(member)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }, []);

  // Inventário
  const getInventory = useCallback(async () => {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }, []);

  const addInventoryItem = useCallback(async (
    item: Database['public']['Tables']['inventory_items']['Insert']
  ) => {
    const { data, error } = await supabase
      .from('inventory_items')
      .insert(item)
      .select()
      .single();

    if (error) throw error;
    return data;
  }, []);

  const updateInventoryItem = useCallback(async (
    id: string,
    item: Database['public']['Tables']['inventory_items']['Update']
  ) => {
    const { data, error } = await supabase
      .from('inventory_items')
      .update(item)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }, []);

  // Transações
  const getTransactions = useCallback(async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  }, []);

  const addTransaction = useCallback(async (
    transaction: Database['public']['Tables']['transactions']['Insert']
  ) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single();

    if (error) throw error;
    return data;
  }, []);

  const updateTransaction = useCallback(async (
    id: string,
    transaction: Database['public']['Tables']['transactions']['Update']
  ) => {
    const { data, error } = await supabase
      .from('transactions')
      .update(transaction)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }, []);

  return {
    supabase,
    getMembers,
    addMember,
    updateMember,
    getInventory,
    addInventoryItem,
    updateInventoryItem,
    getTransactions,
    addTransaction,
    updateTransaction,
  };
}