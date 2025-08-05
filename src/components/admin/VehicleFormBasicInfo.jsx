import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const VehicleFormBasicInfo = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="marca">Marca *</Label>
          <Input
            id="marca"
            value={formData.marca}
            onChange={(e) => handleInputChange('marca', e.target.value)}
            placeholder="Ex: Toyota"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="modelo">Modelo *</Label>
          <Input
            id="modelo"
            value={formData.modelo}
            onChange={(e) => handleInputChange('modelo', e.target.value)}
            placeholder="Ex: Corolla"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ano">Ano *</Label>
          <Input
            id="ano"
            type="number"
            min="1990"
            max={new Date().getFullYear() + 1}
            value={formData.ano}
            onChange={(e) => handleInputChange('ano', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="preco">Preço (R$)</Label>
          <Input
            id="preco"
            type="number"
            min="0"
            step="0.01"
            value={formData.preco}
            onChange={(e) => handleInputChange("preco", e.target.value)}
            placeholder="Ex: 85000"
            disabled={formData.sob_consulta}
          />
          <div className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              id="sob_consulta"
              checked={formData.sob_consulta}
              onChange={(e) => {
                handleInputChange("sob_consulta", e.target.checked);
                if (e.target.checked) {
                  handleInputChange("preco", "");
                }
              }}
              className="form-checkbox h-4 w-4 text-primary rounded"
            />
            <Label htmlFor="sob_consulta">Marcar como "Sob Consulta"</Label>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          value={formData.descricao}
          onChange={(e) => handleInputChange('descricao', e.target.value)}
          placeholder="Descreva as características e diferenciais do veículo..."
          rows={4}
        />
      </div>
    </div>
  );
};

export default VehicleFormBasicInfo;