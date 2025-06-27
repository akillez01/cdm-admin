import { useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { DaimeInventoryInsert, DaimeInventoryUpdate } from '../types';
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

  const deleteMember = useCallback(async (id: string) => {
    const { error } = await supabase.from('members').delete().eq('id', id);
    if (error) throw error;
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

  const deleteInventoryItem = useCallback(async (id: string) => {
    const { error } = await supabase.from('inventory_items').delete().eq('id', id);
    if (error) throw error;
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
    transaction: Record<string, unknown>
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
    transaction: Record<string, unknown> // Tipo genérico por enquanto
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

  // Inventário do Daime
  const getDaimeInventory = useCallback(async () => {
    const { data, error } = await supabase
      .from('daime_inventory')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Mapear os nomes dos campos do banco para os nomes TypeScript
    return data.map(item => ({
      id: item.id,
      codigo: item.codigo,
      graduacao: item.graduacao,
      litros: parseFloat(item.litros),
      dataFeitio: item.data_feitio,
      responsavelFeitio: item.responsavel_feitio,
      localFeitio: item.local_feitio,
      tipoFeitio: item.tipo_feitio,
      panela: item.panela,
      observacoes: item.observacoes,
      status: item.status,
      dataValidade: item.data_validade,
      localArmazenamento: item.local_armazenamento,
      temperatura: item.temperatura ? parseFloat(item.temperatura) : undefined,
      ph: item.ph ? parseFloat(item.ph) : undefined,
      cor: item.cor,
      consistencia: item.consistencia,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
  }, []);

  const addDaimeInventoryItem = useCallback(async (item: DaimeInventoryInsert) => {
    // Mapear campos TypeScript para campos do banco
    const dbItem = {
      codigo: item.codigo,
      graduacao: item.graduacao,
      litros: item.litros,
      data_feitio: item.dataFeitio,
      responsavel_feitio: item.responsavelFeitio,
      local_feitio: item.localFeitio,
      tipo_feitio: item.tipoFeitio || 'Novo',
      panela: item.panela,
      observacoes: item.observacoes,
      status: item.status || 'disponivel',
      data_validade: item.dataValidade,
      local_armazenamento: item.localArmazenamento,
      temperatura: item.temperatura,
      ph: item.ph,
      cor: item.cor || 'Amarelo',
      consistencia: item.consistencia || 'Líquida'
    };

    const { data, error } = await supabase
      .from('daime_inventory')
      .insert(dbItem)
      .select()
      .single();

    if (error) throw error;
    
    // Mapear resposta do banco para TypeScript
    return {
      id: data.id,
      codigo: data.codigo,
      graduacao: data.graduacao,
      litros: parseFloat(data.litros),
      dataFeitio: data.data_feitio,
      responsavelFeitio: data.responsavel_feitio,
      localFeitio: data.local_feitio,
      tipoFeitio: data.tipo_feitio,
      panela: data.panela,
      observacoes: data.observacoes,
      status: data.status,
      dataValidade: data.data_validade,
      localArmazenamento: data.local_armazenamento,
      temperatura: data.temperatura ? parseFloat(data.temperatura) : undefined,
      ph: data.ph ? parseFloat(data.ph) : undefined,
      cor: data.cor,
      consistencia: data.consistencia,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }, []);

  const updateDaimeInventoryItem = useCallback(async (
    id: string,
    item: DaimeInventoryUpdate
  ) => {
    // Mapear campos TypeScript para campos do banco
    const dbItem: Record<string, unknown> = {};
    if (item.codigo !== undefined) dbItem.codigo = item.codigo;
    if (item.graduacao !== undefined) dbItem.graduacao = item.graduacao;
    if (item.litros !== undefined) dbItem.litros = item.litros;
    if (item.dataFeitio !== undefined) dbItem.data_feitio = item.dataFeitio;
    if (item.responsavelFeitio !== undefined) dbItem.responsavel_feitio = item.responsavelFeitio;
    if (item.localFeitio !== undefined) dbItem.local_feitio = item.localFeitio;
    if (item.tipoFeitio !== undefined) dbItem.tipo_feitio = item.tipoFeitio;
    if (item.panela !== undefined) dbItem.panela = item.panela;
    if (item.observacoes !== undefined) dbItem.observacoes = item.observacoes;
    if (item.status !== undefined) dbItem.status = item.status;
    if (item.dataValidade !== undefined) dbItem.data_validade = item.dataValidade;
    if (item.localArmazenamento !== undefined) dbItem.local_armazenamento = item.localArmazenamento;
    if (item.temperatura !== undefined) dbItem.temperatura = item.temperatura;
    if (item.ph !== undefined) dbItem.ph = item.ph;
    if (item.cor !== undefined) dbItem.cor = item.cor;
    if (item.consistencia !== undefined) dbItem.consistencia = item.consistencia;

    const { data, error } = await supabase
      .from('daime_inventory')
      .update(dbItem)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    // Mapear resposta do banco para TypeScript
    return {
      id: data.id,
      codigo: data.codigo,
      graduacao: data.graduacao,
      litros: parseFloat(data.litros),
      dataFeitio: data.data_feitio,
      responsavelFeitio: data.responsavel_feitio,
      localFeitio: data.local_feitio,
      tipoFeitio: data.tipo_feitio,
      panela: data.panela,
      observacoes: data.observacoes,
      status: data.status,
      dataValidade: data.data_validade,
      localArmazenamento: data.local_armazenamento,
      temperatura: data.temperatura ? parseFloat(data.temperatura) : undefined,
      ph: data.ph ? parseFloat(data.ph) : undefined,
      cor: data.cor,
      consistencia: data.consistencia,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }, []);

  const deleteDaimeInventoryItem = useCallback(async (id: string) => {
    const { error } = await supabase.from('daime_inventory').delete().eq('id', id);
    if (error) throw error;
  }, []);

  return {
    supabase,
    getMembers,
    addMember,
    updateMember,
    deleteMember,
    getInventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    getTransactions,
    addTransaction,
    updateTransaction,
    // Inventário do Daime
    getDaimeInventory,
    addDaimeInventoryItem,
    updateDaimeInventoryItem,
    deleteDaimeInventoryItem,
  };
}