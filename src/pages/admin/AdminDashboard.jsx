import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useVehicles } from '@/hooks/useVehicles';
import { useToast } from '@/components/ui/use-toast';
import { 
  Car, 
  Plus, 
  Edit, 
  Trash2, 
  LogOut, 
  BarChart3,
  TrendingUp,
  DollarSign,
  Eye,
  Loader2
} from 'lucide-react';

// Componente de Loading Animado
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="text-muted-foreground">Carregando veículos...</p>
    </div>
  </div>
);

// Componente de Loading para Cards de Estatísticas
const StatsLoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {[...Array(4)].map((_, index) => (
      <Card key={index}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-muted animate-pulse rounded w-20"></div>
              <div className="h-8 bg-muted animate-pulse rounded w-16"></div>
            </div>
            <div className="w-8 h-8 bg-muted animate-pulse rounded"></div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Componente de Loading para Tabela
const TableLoadingSkeleton = () => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="text-left py-3 px-4 font-semibold">Veículo</th>
          <th className="text-left py-3 px-4 font-semibold">Ano</th>
          <th className="text-left py-3 px-4 font-semibold">Preço</th>
          <th className="text-left py-3 px-4 font-semibold">Categoria</th>
          <th className="text-right py-3 px-4 font-semibold">Ações</th>
        </tr>
      </thead>
      <tbody>
        {[...Array(3)].map((_, index) => (
          <tr key={index} className="border-b">
            <td className="py-4 px-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-12 bg-muted animate-pulse rounded-md"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded w-32"></div>
                  <div className="h-3 bg-muted animate-pulse rounded w-24"></div>
                </div>
              </div>
            </td>
            <td className="py-4 px-4">
              <div className="h-4 bg-muted animate-pulse rounded w-12"></div>
            </td>
            <td className="py-4 px-4">
              <div className="h-4 bg-muted animate-pulse rounded w-20"></div>
            </td>
            <td className="py-4 px-4">
              <div className="h-6 bg-muted animate-pulse rounded-full w-16"></div>
            </td>
            <td className="py-4 px-4">
              <div className="flex items-center justify-end gap-2">
                <div className="w-8 h-8 bg-muted animate-pulse rounded"></div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const AdminDashboard = () => {
  const { isAuthenticated, logout } = useAuth();
  const { vehicles, deleteVehicle } = useVehicles();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  // Simular loading inicial e detectar quando os veículos foram carregados
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Mínimo de 1 segundo de loading para melhor UX

    return () => clearTimeout(timer);
  }, [vehicles]);

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logout realizado com sucesso!',
      description: 'Você foi desconectado do sistema.',
    });
    navigate('/');
  };

  const handleDeleteVehicle = (id, vehicleName) => {
    if (window.confirm(`Tem certeza que deseja excluir o veículo ${vehicleName}?`)) {
      deleteVehicle(id);
      toast({
        title: 'Veículo excluído!',
        description: `${vehicleName} foi removido do catálogo.`,
      });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const totalValue = vehicles.reduce((sum, vehicle) => sum + vehicle.preco, 0);
  const averagePrice = vehicles.length > 0 ? totalValue / vehicles.length : 0;

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard Administrativo - AutoPrime</title>
        <meta name="description" content="Painel de controle para gerenciamento de veículos da AutoPrime" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <header className="bg-card shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-primary p-2 rounded-lg">
                  <Car className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">AutoPrime Admin</h1>
                  <p className="text-sm text-muted-foreground">Painel de Controle</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Ver Site
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {isLoading ? (
            <StatsLoadingSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { title: 'Total de Veículos', value: vehicles.length, icon: Car, color: 'text-blue-500' },
                { title: 'Valor Total', value: formatPrice(totalValue), icon: DollarSign, color: 'text-green-500' },
                { title: 'Preço Médio', value: formatPrice(averagePrice), icon: TrendingUp, color: 'text-orange-500' },
                { title: 'Categorias', value: [...new Set(vehicles.map(v => v.categoria))].length, icon: BarChart3, color: 'text-purple-500' },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{item.title}</p>
                          <p className="text-2xl font-bold text-foreground">{item.value}</p>
                        </div>
                        <item.icon className={`w-8 h-8 ${item.color}`} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="text-2xl font-bold">Gerenciar Veículos</CardTitle>
                <Button
                  onClick={() => navigate('/admin/veiculo/novo')}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Veículo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <TableLoadingSkeleton />
              ) : vehicles.length === 0 ? (
                <div className="text-center py-12">
                  <Car className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Nenhum veículo cadastrado
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Comece adicionando seu primeiro veículo ao catálogo
                  </p>
                  <Button
                    onClick={() => navigate('/admin/veiculo/novo')}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Primeiro Veículo
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">Veículo</th>
                        <th className="text-left py-3 px-4 font-semibold">Ano</th>
                        <th className="text-left py-3 px-4 font-semibold">Preço</th>
                        <th className="text-left py-3 px-4 font-semibold">Categoria</th>
                        <th className="text-right py-3 px-4 font-semibold">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicles.map((vehicle, index) => (
                        <motion.tr
                          key={vehicle.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={vehicle.imagens[0]}
                                alt={`${vehicle.marca} ${vehicle.modelo}`}
                                className="w-16 h-12 object-cover rounded-md"
                              />
                              <div>
                                <p className="font-semibold text-foreground">
                                  {vehicle.marca} {vehicle.modelo}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {vehicle.cor} • {vehicle.combustivel}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-muted-foreground">{vehicle.ano}</td>
                          <td className="py-4 px-4 font-semibold text-foreground">
                            {formatPrice(vehicle.preco)}
                          </td>
                          <td className="py-4 px-4">
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                              {vehicle.categoria}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteVehicle(vehicle.id, `${vehicle.marca} ${vehicle.modelo}`)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;

