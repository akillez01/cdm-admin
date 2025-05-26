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
  const [saving, setSaving] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAvatarChange = e => {
    if (e.target.files && e.target.files[0]) setAvatarFile(e.target.files[0]);
  };

  const handleSave = async () => {
    setSaving(true);
    let avatarUrl = form.avatar_url;
    if (avatarFile) {
      // Upload para Supabase Storage (ajuste o bucket se necessário)
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(`admin/${user.id}_${Date.now()}`, avatarFile, { upsert: true });
      if (!error && data) {
        const { publicURL } = supabase.storage.from('avatars').getPublicUrl(data.path);
        avatarUrl = publicURL;
      }
    }
    // Atualiza metadados do usuário
    await supabase.auth.updateUser({
      data: { name: form.name, avatar_url: avatarUrl }
    });
    setSaving(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Perfil" size="md">
      <div className="space-y-4">
        <div className="flex flex-col items-center">
          <img
            src={avatarFile ? URL.createObjectURL(avatarFile) : form.avatar_url || 'https://randomuser.me/api/portraits/men/1.jpg'}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover mb-2"
          />
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
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
          <button className="btn btn-outline" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AdminProfileModal;