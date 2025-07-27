import { useState, useEffect } from 'react';
import API from '@/lib/api';

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Buscar veículos ativos para o frontend
  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await API.get('/vehicles');
      setVehicles(response.data.vehicles || []);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar veículos:', err);
      setError('Erro ao carregar veículos');
    } finally {
      setLoading(false);
    }
  };

  // Criar novo veículo (requer JWT de admin)
  const addVehicle = async (vehicleData) => {
    try {
      const response = await API.post('/vehicles', vehicleData);
      await fetchVehicles(); // Atualiza após criar
      return response.data.vehicle;
    } catch (error) {
      console.error('Erro ao adicionar veículo:', error);
      throw error;
    }
  };

  // Atualizar veículo existente
  const updateVehicle = async (id, updatedData) => {
    try {
      await API.put(`/vehicles/${id}`, updatedData);
      await fetchVehicles();
    } catch (error) {
      console.error('Erro ao atualizar veículo:', error);
      throw error;
    }
  };

  // Deletar (soft delete)
  const deleteVehicle = async (id) => {
    try {
      await API.delete(`/vehicles/${id}`);
      await fetchVehicles();
    } catch (error) {
      console.error('Erro ao excluir veículo:', error);
      throw error;
    }
  };

  // Buscar veículo da lista por ID (útil no form de edição)
  const getVehicleById = (id) => {
    return vehicles.find(v => v.id.toString() === id);
  };

  return {
    vehicles,
    loading,
    error,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    getVehicleById,
    fetchVehicles,
  };
};
