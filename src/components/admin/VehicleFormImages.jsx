import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, X, Upload, Image } from 'lucide-react';

const VehicleFormImages = ({ formData, setFormData }) => {
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleFileChange = (index, file) => {
  if (file && file.type.startsWith(\'image/\') && ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-semibold">Imagens do Veículo * (Máximo 10 fotos)</Label>
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
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeImageField(index)}
                    className="absolute -top-2 -right-2 rounded-full w-8 h-8 p-0"
                    disabled={formData.imagens.length === 1}
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
          Formatos aceitos: JPG, PNG, GIF. Tamanho máximo recomendado: 5MB por imagem.
        </p>
      </div>
    </div>
  );
};

export default VehicleFormImages;