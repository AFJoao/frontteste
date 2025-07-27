import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, X, Upload, Image } from 'lucide-react';

const VehicleFormImages = ({ formData, setFormData }) => {
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleFileChange = (index, file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImages = [...formData.imagens];
        newImages[index] = e.target.result;
        setFormData(prev => ({ ...prev, imagens: newImages }));
        
        // Armazenar o arquivo para envio ao backend
        const newUploadedImages = [...uploadedImages];
        newUploadedImages[index] = file;
        setUploadedImages(newUploadedImages);
      };
      reader.readAsDataURL(file);
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Imagens do Veículo * (Máximo 10 fotos)</Label>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formData.imagens.map((image, index) => (
          <div key={index} className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <div className="flex flex-col items-center space-y-3">
              {image ? (
                <div className="relative w-full">
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeImageField(index)}
                    className="absolute top-2 right-2"
                    disabled={formData.imagens.length === 1}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="w-full h-32 flex flex-col items-center justify-center text-gray-500">
                  <Image className="w-8 h-8 mb-2" />
                  <span className="text-sm">Nenhuma imagem selecionada</span>
                </div>
              )}
              
              <div className="w-full">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(index, e.target.files[0])}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
              </div>
              
              {index === 0 && (
                <span className="text-xs text-primary font-medium">Imagem principal</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Selecione até 10 imagens do veículo. A primeira imagem será usada como capa. Formatos aceitos: JPG, PNG, GIF.
      </p>
    </div>
  );
};

export default VehicleFormImages;