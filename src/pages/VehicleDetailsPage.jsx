import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useVehicles } from '@/hooks/useVehicles';
import { 
  ArrowLeft, 
  MessageCircle, 
  Calendar, 
  Fuel, 
  Settings, 
  Palette, 
  Gauge,
  Shield,
  Phone
} from 'lucide-react';

const VehicleDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getVehicleById, loading } = useVehicles();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const vehicle = getVehicleById(id);

  // Mostrar loading enquanto carrega os dados
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
          <h1 className="text-xl font-medium text-foreground mt-4">Carregando veículo...</h1>
        </div>
        <Footer />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Veículo não encontrado</h1>
          <Button onClick={() => navigate('/')}>Voltar ao catálogo</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleWhatsAppClick = () => {
    const message = `Olá! Tenho interesse no ${vehicle.marca} ${vehicle.modelo} ${vehicle.ano} por ${formatPrice(vehicle.preco)}. Gostaria de agendar uma visita para conhecer o veículo.`;
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCallClick = () => {
    window.open('tel:+5511999999999', '_self');
  };

  return (
    <>
      <Helmet>
        <title>{`${vehicle.marca} ${vehicle.modelo} ${vehicle.ano} - AutoPrime`}</title>
        <meta name="description" content={`${vehicle.marca} ${vehicle.modelo} ${vehicle.ano} por ${formatPrice(vehicle.preco)}. ${vehicle.descricao}`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <div className="container mx-auto px-4 py-8">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao catálogo
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-4"
              >
                <img
                  src={vehicle.imagens[currentImageIndex]}
                  alt={`${vehicle.marca} ${vehicle.modelo} - Imagem ${currentImageIndex + 1}`}
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                />
              </motion.div>

              {vehicle.imagens.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {vehicle.imagens.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === index 
                          ? 'border-primary ring-2 ring-primary/30' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Miniatura ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                      {vehicle.categoria}
                    </span>
                    {vehicle.quilometragem === 0 && (
                      <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        0 KM
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                    {vehicle.marca} {vehicle.modelo}
                  </h1>
                  <p className="text-4xl font-bold text-primary mb-4">
                    {formatPrice(vehicle.preco)}
                  </p>
                </div>

                <Card className="mb-6">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      Especificações Técnicas
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Ano</p>
                          <p className="font-semibold text-foreground">{vehicle.ano}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Fuel className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Combustível</p>
                          <p className="font-semibold text-foreground">{vehicle.combustivel}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Settings className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Câmbio</p>
                          <p className="font-semibold text-foreground">{vehicle.cambio}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Palette className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Cor</p>
                          <p className="font-semibold text-foreground">{vehicle.cor}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Gauge className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Quilometragem</p>
                          <p className="font-semibold text-foreground">
                            {vehicle.quilometragem === 0 ? '0 KM' : `${vehicle.quilometragem.toLocaleString()} km`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Garantia</p>
                          <p className="font-semibold text-foreground">12 meses</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mb-6">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      Descrição
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {vehicle.descricao}
                    </p>
                  </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row gap-4 mobile-action-buttons">
                  <Button
                    onClick={handleWhatsAppClick}
                    className="whatsapp-btn text-white flex items-center justify-center gap-2 flex-1"
                    size="lg"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Falar no WhatsApp
                  </Button>
                  <Button
                    onClick={handleCallClick}
                    variant="outline"
                    className="flex items-center justify-center gap-2 flex-1"
                    size="lg"
                  >
                    <Phone className="w-5 h-5" />
                    Ligar Agora
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default VehicleDetailsPage;