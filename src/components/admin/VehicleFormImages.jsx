import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, X, Upload, Image, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { uploadImageSmart, uploadMultipleImagesSmart, getCdnConfig } from '@/lib/api_updated';
import { useToast } from '@/components/ui/use-toast';

const VehicleFormImages = ({ formData, setFormData, vehicleId }) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [cdnConfig, setCdnConfig] = useState(null);
  const { toast } = useToast();

  // Carregar configuração do CDN ao montar o componente
  useEffect(() => {
    const loadCdnConfig = async () => {
      try {
        const config = await getCdnConfig();
        setCdnConfig(config);
        console.log('Configuração CDN carregada:', config);
      } catch (error) {
        console.warn('CDN não configurado, usando upload local:', error);
      }
    };

    loadCdnConfig();
  }, []);

  const handleFileChange = async (index, file) => {
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/') || 
        !['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      toast({
        title: "Erro",
        description: "Tipo de arquivo não suportado. Use JPG, PNG, GIF ou WebP.",
        variant: "destructive",
      });
      return;
    }

    // Validar tamanho do arquivo (5MB)
    const maxSize = cdnConfig?.max_file_size || 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "Erro",
        description: `Arquivo muito grande. Tamanho máximo: ${Math.round(maxSize / 1024 / 1024)}MB`,
        variant: "destructive",
      });
      return;
    }

    // Mostrar preview imediatamente
    const reader = new FileReader();
    reader.onload = (e) => {
      const newImages = [...formData.imagens];
      newImages[index] = e.target.result;
      setFormData(prev => ({ ...prev, imagens: newImages }));
    };
    reader.readAsDataURL(file);

    // Se temos um vehicleId, fazer upload imediatamente
    if (vehicleId) {
      await uploadSingleImage(file, index);
    } else {
      // Armazenar arquivo para upload posterior
      const newUploadedImages = [...uploadedImages];
      newUploadedImages[index] = file;
      setUploadedImages(newUploadedImages);
    }
  };

  const uploadSingleImage = async (file, index) => {
    setUploading(true);
    setUploadProgress(prev => ({ ...prev, [index]: 0 }));

    try {
      const result = await uploadImageSmart(file, vehicleId);
      
      // Atualizar com URL do CDN ou local
      const newImages = [...formData.imagens];
      newImages[index] = result.image?.cdn_url || result.image?.url || result.urls?.original;
      setFormData(prev => ({ ...prev, imagens: newImages }));

      setUploadProgress(prev => ({ ...prev, [index]: 100 }));
      
      toast({
        title: "Sucesso",
        description: `Imagem ${index + 1} enviada com sucesso!`,
      });

      // Limpar progresso após 2 segundos
      setTimeout(() => {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[index];
          return newProgress;
        });
      }, 2000);

    } catch (error) {
      console.error('Erro no upload:', error);
      setUploadProgress(prev => ({ ...prev, [index]: -1 })); // -1 indica erro
      
      toast({
        title: "Erro no upload",
        description: error.response?.data?.error || "Erro ao enviar imagem",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const uploadAllImages = async () => {
    if (!vehicleId) {
      toast({
        title: "Erro",
        description: "Salve o veículo primeiro antes de fazer upload das imagens",
        variant: "destructive",
      });
      return;
    }

    const filesToUpload = uploadedImages.filter(file => file !== null);
    
    if (filesToUpload.length === 0) {
      toast({
        title: "Aviso",
        description: "Nenhuma imagem para enviar",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const result = await uploadMultipleImagesSmart(filesToUpload, vehicleId);
      
      // Atualizar URLs das imagens
      const newImages = [];
      result.uploaded_images?.forEach((uploadResult, index) => {
        const imageUrl = uploadResult.image?.cdn_url || uploadResult.image?.url || uploadResult.urls?.original;
        newImages.push(imageUrl);
      });

      setFormData(prev => ({ ...prev, imagens: newImages }));
      setUploadedImages([]);

      toast({
        title: "Sucesso",
        description: result.message || "Imagens enviadas com sucesso!",
      });

      if (result.errors && result.errors.length > 0) {
        toast({
          title: "Avisos",
          description: `Alguns arquivos tiveram problemas: ${result.errors.join(', ')}`,
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Erro no upload múltiplo:', error);
      toast({
        title: "Erro no upload",
        description: error.response?.data?.error || "Erro ao enviar imagens",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const addImageField = () => {
    if (formData.imagens.length < 10) {
      setFormData(prev => ({ ...prev, imagens: [...prev.imagens, ''] }));
      setUploadedImages(prev => [...prev, null]);
    }
  };

  const removeImageField = (index) => {
    if (formData.imagens.length > 1) {
      const newImages = formData.imagens.filter((_, i) => i !== index);
      const newUploadedImages = uploadedImages.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, imagens: newImages }));
      setUploadedImages(newUploadedImages);
    }
  };

  const getUploadStatus = (index) => {
    const progress = uploadProgress[index];
    if (progress === undefined) return null;
    if (progress === -1) return 'error';
    if (progress === 100) return 'success';
    return 'uploading';
  };

  const renderUploadStatus = (index) => {
    const status = getUploadStatus(index);
    
    switch (status) {
      case 'uploading':
        return (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
            <div className="text-white text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              <span className="text-sm">Enviando...</span>
            </div>
          </div>
        );
      case 'success':
        return (
          <div className="absolute top-2 right-2">
            <CheckCircle className="w-6 h-6 text-green-500 bg-white rounded-full" />
          </div>
        );
      case 'error':
        return (
          <div className="absolute top-2 right-2">
            <AlertCircle className="w-6 h-6 text-red-500 bg-white rounded-full" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-semibold">Imagens do Veículo * (Máximo 10 fotos)</Label>
        <div className="flex gap-2">
          {!vehicleId && uploadedImages.some(file => file !== null) && (
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={uploadAllImages}
              disabled={uploading}
              className="flex items-center gap-2"
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              Enviar Todas
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addImageField}
            disabled={formData.imagens.length >= 10}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar Imagem
          </Button>
        </div>
      </div>

      {/* Indicador de configuração CDN */}
      {cdnConfig && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800">
            ✅ CDN ImageKit configurado - Upload otimizado ativo
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formData.imagens.map((image, index) => (
          <div key={index} className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center space-y-4">
              {image ? (
                <div className="relative w-full">
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg shadow-sm"
                  />
                  {renderUploadStatus(index)}
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeImageField(index)}
                    className="absolute -top-2 -right-2 rounded-full w-8 h-8 p-0"
                    disabled={formData.imagens.length === 1 || uploading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="w-full h-40 flex flex-col items-center justify-center text-gray-500 bg-white rounded-lg border-2 border-dashed border-gray-200">
                  <Image className="w-12 h-12 mb-3 text-gray-400" />
                  <span className="text-sm font-medium">Nenhuma imagem selecionada</span>
                  <span className="text-xs text-gray-400 mt-1">Clique abaixo para selecionar</span>
                </div>
              )}
              
              <div className="w-full">
                <label className="flex flex-col items-center justify-center w-full h-12 border-2 border-primary border-dashed rounded-lg cursor-pointer bg-primary/5 hover:bg-primary/10 transition-colors">
                  <div className="flex items-center justify-center space-x-2">
                    <Upload className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      {image ? 'Trocar imagem' : 'Selecionar imagem'}
                    </span>
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(index, e.target.files[0])}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
              
              {index === 0 && (
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                  <span className="text-xs font-semibold">Imagem Principal</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Dicas:</strong> Selecione até 10 imagens do veículo. A primeira imagem será usada como capa. 
          Formatos aceitos: JPG, PNG, GIF, WebP. Tamanho máximo: {cdnConfig ? Math.round(cdnConfig.max_file_size / 1024 / 1024) : 5}MB por imagem.
          {vehicleId ? ' As imagens são enviadas automaticamente.' : ' Salve o veículo primeiro para enviar as imagens.'}
        </p>
      </div>
    </div>
  );
};

export default VehicleFormImages;

