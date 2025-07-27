import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

const VehicleFormImages = ({ formData, setFormData }) => {
  const handleImageChange = (index, value) => {
    const newImages = [...formData.imagens];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, imagens: newImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, imagens: [...prev.imagens, ''] }));
  };

  const removeImageField = (index) => {
    if (formData.imagens.length > 1) {
      const newImages = formData.imagens.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, imagens: newImages }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Imagens do Veículo *</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addImageField}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Adicionar Imagem
        </Button>
      </div>
      <div className="space-y-3">
        {formData.imagens.map((image, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={image || ''}
              onChange={(e) => handleImageChange(index, e.target.value)}
              placeholder="URL da imagem"
              className="flex-1"
            />
            {formData.imagens.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeImageField(index)}
                className="text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Adicione URLs de imagens do veículo. A primeira imagem será usada como capa.
      </p>
    </div>
  );
};

export default VehicleFormImages;