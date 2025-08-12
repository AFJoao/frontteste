import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Calendar, Fuel, Settings, Palette, ImageOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VehicleCard = ({ vehicle }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleWhatsAppClick = () => {
    const message = `Olá! Tenho interesse no ${vehicle.marca} ${vehicle.modelo} ${vehicle.ano} ${vehicle.sob_consulta ? 'que está sob consulta' : `por ${formatPrice(vehicle.preco)}`}. Gostaria de mais informações.`;
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleDetailsClick = () => {
    navigate(`/veiculo/${vehicle.id}`);
  };

  // Função para obter a melhor URL de imagem
  const getImageUrl = () => {
    if (!vehicle.imagens || vehicle.imagens.length === 0) {
      return null;
    }

    const firstImage = vehicle.imagens[0];
    
    // Se for uma string simples (URL), usar diretamente
    if (typeof firstImage === 'string') {
      return firstImage;
    }

    // Se for um objeto com URLs (do CDN), usar a versão medium
    if (typeof firstImage === 'object' && firstImage.urls) {
      return firstImage.urls.webp_medium || firstImage.urls.medium || firstImage.urls.original;
    }

    // Fallback
    return firstImage;
  };

  // Função para obter URL de thumbnail para carregamento mais rápido
  const getThumbnailUrl = () => {
    if (!vehicle.imagens || vehicle.imagens.length === 0) {
      return null;
    }

    const firstImage = vehicle.imagens[0];
    
    // Se for um objeto com URLs (do CDN), usar thumbnail
    if (typeof firstImage === 'object' && firstImage.urls) {
      return firstImage.urls.webp_thumbnail || firstImage.urls.thumbnail;
    }

    // Para URLs simples, tentar adicionar transformação do ImageKit
    if (typeof firstImage === 'string' && firstImage.includes('ik.imagekit.io')) {
      return `${firstImage}?tr=w-300,h-200,c-maintain_ratio,f-webp`;
    }

    return firstImage;
  };

  const imageUrl = getImageUrl();
  const thumbnailUrl = getThumbnailUrl();

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card className="car-card-hover overflow-hidden bg-card shadow-lg border">
        <div className="relative">
          {imageUrl && !imageError ? (
            <img
              src={thumbnailUrl || imageUrl}
              alt={`${vehicle.marca} ${vehicle.modelo}`}
              className="w-full h-48 object-cover cursor-pointer transition-transform hover:scale-105"
              onClick={handleDetailsClick}
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <div 
              className="w-full h-48 bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
              onClick={handleDetailsClick}
            >
              <div className="text-center text-gray-500">
                <ImageOff className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">Imagem não disponível</p>
              </div>
            </div>
          )}
          <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
            {vehicle.categoria}
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-foreground mb-1">
              {vehicle.marca} {vehicle.modelo}
            </h3>
            <p className="text-2xl font-bold text-primary">
              {vehicle.sob_consulta ? "Sob Consulta" : formatPrice(vehicle.preco)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{vehicle.ano}</span>
            </div>
            <div className="flex items-center gap-2">
              <Fuel className="w-4 h-4 text-primary" />
              <span>{vehicle.combustivel}</span>
            </div>
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-primary" />
              <span>{vehicle.cambio}</span>
            </div>
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-primary" />
              <span>{vehicle.cor}</span>
            </div>
          </div>

          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {vehicle.descricao}
          </p>

          <div className="flex gap-2 mobile-action-buttons sm:flex-row">
            <Button 
              onClick={handleDetailsClick}
              variant="outline" 
              className="flex-1"
            >
              Ver Detalhes
            </Button>
            <Button 
              onClick={handleWhatsAppClick}
              className="whatsapp-btn text-white flex items-center gap-2 flex-1 sm:flex-initial"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
              <span className="sm:hidden">WhatsApp</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default VehicleCard;

