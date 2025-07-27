import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useVehicles } from '@/hooks/useVehicles';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Car, Save } from 'lucide-react';
import VehicleFormBasicInfo from '@/components/admin/VehicleFormBasicInfo';
import VehicleFormDetails from '@/components/admin/VehicleFormDetails';
import VehicleFormImages from '@/components/admin/VehicleFormImages';

const AdminVehicleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addVehicle, updateVehicle, getVehicleById } = useVehicles();
  const { toast } = useToast();
  
  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    ano: new Date().getFullYear(),
    preco: '',
    descricao: '',
    imagens: [''],
    combustivel: 'Flex',
    cambio: 'Manual',
    cor: '',
    quilometragem: 0,
    categoria: 'Hatch'
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }

    if (isEditing) {
      const vehicle = getVehicleById(id);
      if (vehicle) {
        setFormData(vehicle);
      } else {
        toast({
          title: 'Veículo não encontrado',
          description: 'O veículo que você está tentando editar não existe.',
          variant: 'destructive',
        });
        navigate('/admin/dashboard');
      }
    }
  }, [isAuthenticated, isEditing, id, getVehicleById, navigate, toast]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.marca || !formData.modelo || !formData.preco) {
        toast({ title: 'Campos obrigatórios', description: 'Preencha todos os campos obrigatórios.', variant: 'destructive' });
        setLoading(false);
        return;
      }

      const validImages = formData.imagens.filter(img => img && img.trim() !== '');
      if (validImages.length === 0) {
        toast({ title: 'Imagem obrigatória', description: 'Adicione pelo menos uma URL de imagem.', variant: 'destructive' });
        setLoading(false);
        return;
      }

      const vehicleData = {
        ...formData,
        preco: parseFloat(formData.preco) || 0,
        ano: parseInt(formData.ano) || new Date().getFullYear(),
        quilometragem: parseInt(formData.quilometragem) || 0,
        imagens: validImages
      };

      if (isEditing) {
        updateVehicle(id, vehicleData);
        toast({ title: 'Veículo atualizado!', description: `${vehicleData.marca} ${vehicleData.modelo} foi atualizado.` });
      } else {
        addVehicle(vehicleData);
        toast({ title: 'Veículo adicionado!', description: `${vehicleData.marca} ${vehicleData.modelo} foi adicionado.` });
      }

      navigate('/admin/dashboard');
    } catch (error) {
      toast({ title: 'Erro ao salvar', description: 'Ocorreu um erro inesperado.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <Helmet>
        <title>{isEditing ? 'Editar Veículo' : 'Adicionar Veículo'} - AutoPrime Admin</title>
        <meta name="description" content={`${isEditing ? 'Editar' : 'Adicionar'} veículo no catálogo da AutoPrime`} />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <header className="bg-card shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
              <div className="flex items-center gap-3">
                <div className="bg-primary p-2 rounded-lg">
                  <Car className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">{isEditing ? 'Editar Veículo' : 'Adicionar Veículo'}</h1>
                  <p className="text-sm text-muted-foreground">{isEditing ? 'Atualize as informações' : 'Adicione um novo veículo'}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <form onSubmit={handleSubmit}>
              <Card className="max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="w-5 h-5" />
                    Informações do Veículo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <VehicleFormBasicInfo formData={formData} handleInputChange={handleInputChange} />
                  <VehicleFormDetails formData={formData} handleInputChange={handleInputChange} />
                  <VehicleFormImages formData={formData} setFormData={setFormData} />
                  <div className="flex gap-4 pt-6">
                    <Button type="button" variant="outline" onClick={() => navigate('/admin/dashboard')} className="flex-1">
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={loading} className="flex-1 flex items-center justify-center gap-2">
                      <Save className="w-4 h-4" />
                      {loading ? 'Salvando...' : (isEditing ? 'Atualizar Veículo' : 'Adicionar Veículo')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AdminVehicleForm;