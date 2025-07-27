
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, X } from 'lucide-react';

const VehicleFilters = ({ vehicles, onFilterChange }) => {
  const [filters, setFilters] = useState({
    search: '',
    marca: '',
    categoria: '',
    anoMin: '',
    anoMax: '',
    precoMin: '',
    precoMax: '',
    combustivel: ''
  });

  const [showFilters, setShowFilters] = useState(false);

  const marcas = [...new Set(vehicles.map(v => v.marca))].sort();
  const categorias = [...new Set(vehicles.map(v => v.categoria))].sort();
  const combustiveis = [...new Set(vehicles.map(v => v.combustivel))].sort();

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    const filteredVehicles = vehicles.filter(vehicle => {
      const matchesSearch = !newFilters.search || 
        `${vehicle.marca} ${vehicle.modelo}`.toLowerCase().includes(newFilters.search.toLowerCase());
      
      const matchesMarca = !newFilters.marca || vehicle.marca === newFilters.marca;
      const matchesCategoria = !newFilters.categoria || vehicle.categoria === newFilters.categoria;
      const matchesCombustivel = !newFilters.combustivel || vehicle.combustivel === newFilters.combustivel;
      
      const matchesAnoMin = !newFilters.anoMin || vehicle.ano >= parseInt(newFilters.anoMin);
      const matchesAnoMax = !newFilters.anoMax || vehicle.ano <= parseInt(newFilters.anoMax);
      
      const matchesPrecoMin = !newFilters.precoMin || vehicle.preco >= parseFloat(newFilters.precoMin);
      const matchesPrecoMax = !newFilters.precoMax || vehicle.preco <= parseFloat(newFilters.precoMax);

      return matchesSearch && matchesMarca && matchesCategoria && matchesCombustivel &&
             matchesAnoMin && matchesAnoMax && matchesPrecoMin && matchesPrecoMax;
    });

    onFilterChange(filteredVehicles);
  };

  const clearFilters = () => {
    const emptyFilters = {
      search: '',
      marca: '',
      categoria: '',
      anoMin: '',
      anoMax: '',
      precoMin: '',
      precoMax: '',
      combustivel: ''
    };
    setFilters(emptyFilters);
    onFilterChange(vehicles);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        {/* Barra de busca principal */}
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por marca ou modelo..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
              Limpar
            </Button>
          )}
        </div>

        {/* Filtros avançados */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t pt-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Marca</label>
                <Select
                  value={filters.marca}
                  onChange={(e) => handleFilterChange('marca', e.target.value)}
                >
                  <option value="">Todas as marcas</option>
                  {marcas.map(marca => (
                    <option key={marca} value={marca}>{marca}</option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Categoria</label>
                <Select
                  value={filters.categoria}
                  onChange={(e) => handleFilterChange('categoria', e.target.value)}
                >
                  <option value="">Todas as categorias</option>
                  {categorias.map(categoria => (
                    <option key={categoria} value={categoria}>{categoria}</option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Combustível</label>
                <Select
                  value={filters.combustivel}
                  onChange={(e) => handleFilterChange('combustivel', e.target.value)}
                >
                  <option value="">Todos os combustíveis</option>
                  {combustiveis.map(combustivel => (
                    <option key={combustivel} value={combustivel}>{combustivel}</option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Ano</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="De"
                    value={filters.anoMin}
                    onChange={(e) => handleFilterChange('anoMin', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Até"
                    value={filters.anoMax}
                    onChange={(e) => handleFilterChange('anoMax', e.target.value)}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Preço (R$)</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Preço mínimo"
                    value={filters.precoMin}
                    onChange={(e) => handleFilterChange('precoMin', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Preço máximo"
                    value={filters.precoMax}
                    onChange={(e) => handleFilterChange('precoMax', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default VehicleFilters;
