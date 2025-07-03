import React, { useState } from 'react';
import { useSupabase } from '../../hooks/useSupabase';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageUrlChange: (url: string) => void;
  bucketName: string;
  folder: string;
  placeholder?: string;
  maxSizeMB?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImageUrl = '',
  onImageUrlChange,
  bucketName,
  folder,
  placeholder = 'Selecione uma imagem...',
  maxSizeMB = 5
}) => {
  const { supabase } = useSupabase();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [manualUrl, setManualUrl] = useState(currentImageUrl);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem (PNG, JPG, etc.)');
        return;
      }

      // Validar tamanho
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        alert(`O arquivo é muito grande. Tamanho máximo: ${maxSizeMB}MB`);
        return;
      }

      setSelectedFile(file);
      
      // Mostrar preview local
      const previewUrl = URL.createObjectURL(file);
      onImageUrlChange(previewUrl);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      // Criar nome único para o arquivo
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${folder}_${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Upload para Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        if (uploadError.message.includes('Bucket not found')) {
          alert(`Bucket "${bucketName}" não encontrado. Configure o Storage no Supabase.`);
        } else {
          alert('Erro ao fazer upload: ' + uploadError.message);
        }
        return;
      }

      if (uploadData) {
        // Obter URL pública
        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(uploadData.path);
        
        onImageUrlChange(publicUrl);
        setSelectedFile(null);
        console.log('✅ Upload realizado:', publicUrl);
        alert('Imagem enviada com sucesso!');
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro inesperado no upload');
    } finally {
      setUploading(false);
    }
  };

  const handleManualUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setManualUrl(url);
    onImageUrlChange(url);
    setSelectedFile(null); // Limpar arquivo selecionado se usar URL manual
  };

  const displayImageUrl = selectedFile 
    ? URL.createObjectURL(selectedFile) 
    : currentImageUrl || manualUrl;

  return (
    <div className="space-y-4">
      {/* Preview da imagem */}
      <div className="flex justify-center">
        <div className="w-32 h-32 border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
          {displayImageUrl ? (
            <img
              src={displayImageUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Sem imagem</span>
            </div>
          )}
        </div>
      </div>

      {/* Upload de arquivo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          📁 Enviar do computador
        </label>
        <div className="flex gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="flex-1 text-sm text-gray-500 dark:text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              dark:file:bg-blue-900 dark:file:text-blue-300"
          />
          {selectedFile && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 text-sm"
            >
              {uploading ? '📤 Enviando...' : '📤 Enviar'}
            </button>
          )}
        </div>
        {selectedFile && (
          <p className="mt-1 text-xs text-green-600 dark:text-green-400">
            ✅ Arquivo selecionado: {selectedFile.name}
          </p>
        )}
      </div>

      {/* Separador */}
      <div className="flex items-center">
        <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
        <span className="px-3 text-sm text-gray-500 dark:text-gray-400">OU</span>
        <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
      </div>

      {/* URL manual */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          🔗 URL da imagem
        </label>
        <input
          type="url"
          value={manualUrl}
          onChange={handleManualUrlChange}
          placeholder="https://exemplo.com/imagem.jpg"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Cole a URL de uma imagem online como alternativa
        </p>
      </div>
    </div>
  );
};

export default ImageUpload;
