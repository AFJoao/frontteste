import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';

const VehicleFormDetails = ({ formData, handleInputChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="categoria">Categoria</Label>
        <Select
          id="categoria"
          value={formData.categoria}
          onChange={(e) => handleInputChange('categoria', e.target.value)}
        >
          <option value="Hatch">Hatch</option>
          <option value="Sedan">Sedan</option>
          <option value="SUV">SUV</option>
          <option value="Picape">Picape</option>
          <option value="Conversível">Conversível</option>
          <option value="Esportivo">Esportivo</option>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="cor">Cor</Label>
        <Input
          id="cor"
          value={formData.cor}
          onChange={(e) => handleInputChange('cor', e.target.value)}
          placeholder="Ex: Branco"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="combustivel">Combustível</Label>
        <Select
          id="combustivel"
          value={formData.combustivel}
          onChange={(e) => handleInputChange('combustivel', e.target.value)}
        >
          <option value="Flex">Flex</option>
          <option value="Gasolina">Gasolina</option>
          <option value="Etanol">Etanol</option>
          <option value="Diesel">Diesel</option>
          <option value="Elétrico">Elétrico</option>
          <option value="Híbrido">Híbrido</option>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="cambio">Câmbio</Label>
        <Select
          id="cambio"
          value={formData.cambio}
          onChange={(e) => handleInputChange('cambio', e.target.value)}
        >
          <option value="Manual">Manual</option>
          <option value="Automático">Automático</option>
          <option value="CVT">CVT</option>
          <option value="Automatizado">Automatizado</option>
        </Select>
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="quilometragem">Quilometragem (km)</Label>
        <Input
          id="quilometragem"
          type="number"
          min="0"
          value={formData.quilometragem}
          onChange={(e) => handleInputChange('quilometragem', e.target.value)}
          placeholder="Ex: 15000 (0 para veículo novo)"
        />
      </div>
    </div>
  );
};

export default VehicleFormDetails;