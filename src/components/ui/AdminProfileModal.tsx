import { useState } from 'react';
import { useSupabase } from '../../hooks/useSupabase';
import Modal from './Modal';

const AdminProfileModal = ({ isOpen, onClose, user }) => {
  const { supabase } = useSupabase();
  const [form, setForm] = useState({
    name: user?.user_metadata?.name || '',
    email: user?.email || '',
    avatar_url: user?.user_metadata?.avatar_url || '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validar tipo de arquivo
      if (file.type.startsWith('image/')) {
        setAvatarFile(file);
      } else {
        alert('Por favor, selecione apenas arquivos de imagem (PNG, JPG, etc.)');
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let avatarUrl = form.avatar_url;

      // Se há um arquivo para upload
      if (avatarFile) {
        setUploading(true);
        
        // Criar nome único para o arquivo
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `admin_${user.id}_${Date.now()}.${fileExt}`;
        
        try {
          // Tentar fazer upload para o bucket 'avatars'
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, avatarFile, {
              cacheControl: '3600',
              upsert: true
            });

          if (uploadError) {
            console.error('Erro no upload:', uploadError);
            // Se o bucket não existir, tentar criar automaticamente
            if (uploadError.message.includes('Bucket not found')) {
              console.log('🔧 Bucket não encontrado, tentando criar...');
              alert('Configurando storage... Tente novamente em alguns segundos.');
              return;
            } else {
              throw uploadError;
            }
          }

          if (uploadData) {
            // Obter URL pública da imagem
            const { data: { publicUrl } } = supabase.storage
              .from('avatars')
              .getPublicUrl(uploadData.path);
            
            avatarUrl = publicUrl;
            console.log('✅ Upload realizado:', publicUrl);
          }
        } catch (storageError) {
          console.error('Erro no Supabase Storage:', storageError);
          alert('Erro ao fazer upload da imagem. Verifique se o Storage está configurado.');
          return;
        } finally {
          setUploading(false);
        }
      }

      // Atualizar perfil do usuário
      const { error } = await supabase.auth.updateUser({
        data: { 
          name: form.name,
          avatar_url: avatarUrl
        }
      });

      if (error) {
        console.error('Erro ao atualizar perfil:', error);
        alert('Erro ao salvar perfil: ' + error.message);
      } else {
        console.log('✅ Perfil atualizado com sucesso');
        alert('Perfil atualizado com sucesso!');
        onClose();
        // Limpar arquivo selecionado
        setAvatarFile(null);
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      alert('Erro inesperado ao salvar perfil');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Perfil" size="md">
      <div className="space-y-4">
        <div className="flex flex-col items-center">
          <img
            src={
              avatarFile 
                ? URL.createObjectURL(avatarFile) 
                : form.avatar_url || 'https://randomuser.me/api/portraits/men/1.jpg'
            }
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover mb-2 border-2 border-gray-200 dark:border-gray-600"
          />
          
          {/* Upload de arquivo */}
          <div className="w-full max-w-xs">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              📁 Escolher arquivo do computador
            </label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleAvatarChange}
              className="block w-full text-sm text-gray-500 dark:text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                dark:file:bg-blue-900 dark:file:text-blue-300"
            />
            {avatarFile && (
              <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                ✅ Arquivo selecionado: {avatarFile.name}
              </p>
            )}
          </div>
          
          {/* Separador */}
          <div className="w-full flex items-center my-4">
            <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
            <span className="px-3 text-sm text-gray-500 dark:text-gray-400">OU</span>
            <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          </div>
        </div>
        
        <div>
          <label className="form-label">🔗 URL da imagem (opcional)</label>
          <input 
            className="form-input" 
            name="avatar_url" 
            value={form.avatar_url} 
            onChange={handleChange}
            placeholder="https://exemplo.com/minha-foto.jpg"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Cole a URL de uma imagem online como alternativa ao upload
          </p>
        </div>
        <div>
          <label className="form-label">Nome</label>
          <input className="form-input" name="name" value={form.name} onChange={handleChange} />
        </div>
        <div>
          <label className="form-label">Email</label>
          <input className="form-input" name="email" value={form.email} disabled />
        </div>
        <div className="flex justify-end space-x-3">
          <button 
            className="btn btn-outline" 
            onClick={onClose}
            disabled={saving || uploading}
          >
            Cancelar
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleSave} 
            disabled={saving || uploading}
          >
            {uploading ? (
              <>
                <span className="animate-spin mr-2">🔄</span>
                Enviando imagem...
              </>
            ) : saving ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Salvando...
              </>
            ) : (
              'Salvar Perfil'
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AdminProfileModal;