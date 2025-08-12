import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
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
  Phone,
  ImageOff,
  ZoomIn
} from 'lucide-react';

const VehicleDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getVehicleById, loading } = useVehicles();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState({});
  const [showImageModal, setShowImageModal] = useState(false);
  
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
    const message = `Olá! Tenho interesse no ${vehicle.marca} ${vehicle.modelo} ${vehicle.ano} ${vehicle.sob_consulta ? 'que está sob consulta' : `por ${formatPrice(vehicle.preco)}`}. Gostaria de agendar uma visita para conhecer o veículo.`;
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCallClick = () => {
    window.open('tel:+5511999999999', '_self');
  };

  // Função para obter URL de imagem com suporte a CDN
  const getImageUrl = (image, size = 'large') => {
    if (!image) return null;

    // Se for uma string simples (URL), usar diretamente
    if (typeof image === 'string') {
      // Se for do ImageKit, adicionar transformação
      if (image.includes('ik.imagekit.io')) {
        const transformations = {
          thumbnail: 'tr=w-300,h-200,c-maintain_ratio,f-webp',
          medium: 'tr=w-800,h-600,c-maintain_ratio,f-webp',
          large: 'tr=w-1200,h-800,c-maintain_ratio,f-webp',
          original: ''
        };
        const transform = transformations[size] || transformations.large;
        return transform ? `${image}?${transform}` : image;
      }
      return image;
    }

    // Se for um objeto com URLs (do CDN), usar a versão apropriada
    if (typeof image === 'object' && image.urls) {
      const sizeMap = {
        thumbnail: image.urls.webp_thumbnail || image.urls.thumbnail,
        medium: image.urls.webp_medium || image.urls.medium,
        large: image.urls.original,
        original: image.urls.original
      };
      return sizeMap[size] || image.urls.original;
    }

    return image;
  };

  const handleImageError = (index) => {
    setImageError(prev => ({ ...prev, [index]: true }));
  };

  const currentImage = vehicle.imagens?.[currentImageIndex];
  const currentImageUrl = getImageUrl(currentImage, 'large');
  const currentThumbnailUrl = getImageUrl(currentImage, 'medium');

  return (
    <>
      <Helmet>
        <title>{`${vehicle.marca} ${vehicle.modelo} ${vehicle.ano} - AutoPrime`}</title>
        <meta name="description" content={`${vehicle.marca} ${vehicle.modelo} ${vehicle.ano} ${vehicle.sob_consulta ? 'sob consulta' : `por ${formatPrice(vehicle.preco)}`}. ${vehicle.descricao}`} />
        <meta property="og:title" content={`${vehicle.marca} ${vehicle.modelo} ${vehicle.ano}`} />
        <meta property="og:description" content={vehicle.descricao} />
        {currentImageUrl && <meta property="og:image" content={currentImageUrl} />}
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
            {/* Galeria de Imagens */}
            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-4 relative"
              >
                {currentImageUrl && !imageError[currentImageIndex] ? (
                  <div className="relative group">
                    <img
                      src={currentThumbnailUrl || currentImageUrl}
                      alt={`${vehicle.marca} ${vehicle.modelo} - Imagem ${currentImageIndex + 1}`}
                      className="w-full h-96 object-cover rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-[1.02]"
                      onError={() => handleImageError(currentImageIndex)}
                      onClick={() => setShowImageModal(true)}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center">
                      <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg">
                    <div className="text-center text-gray-500">
                      <ImageOff className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-lg">Imagem não disponível</p>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Miniaturas */}
              {vehicle.imagens && vehicle.imagens.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {vehicle.imagens.map((image, index) => {
                    const thumbnailUrl = getImageUrl(image, 'thumbnail');
                    
                    return (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          currentImageIndex === index 
                            ? 'border-primary ring-2 ring-primary/30' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {thumbnailUrl && !imageError[index] ? (
                          <img
                            src={thumbnailUrl}
                            alt={`Miniatura ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={() => handleImageError(index)}
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <ImageOff className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Informações do Veículo */}
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
                    {vehicle.sob_consulta ? "Sob Consulta" : formatPrice(vehicle.preco)}
                  </p>
                </div>

                <Card className="mb-6">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Especificações</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Ano</p>
                          <p className="font-semibold">{vehicle.ano}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Fuel className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Combustível</p>
                          <p className="font-semibold">{vehicle.combustivel}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Settings className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Câmbio</p>
                          <p className="font-semibold">{vehicle.cambio}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Palette className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Cor</p>
                          <p className="font-semibold">{vehicle.cor}</p>
                        </div>
                      </div>
                      {vehicle.quilometragem > 0 && (
                        <div className="flex items-center gap-3 col-span-2">
                          <Gauge className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Quilometragem</p>
                            <p className="font-semibold">{vehicle.quilometragem.toLocaleString('pt-BR')} km</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {vehicle.descricao && (
                  <Card className="mb-6">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Descrição</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {vehicle.descricao}
                      </p>
                    </CardContent>
                  </Card>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={handleWhatsAppClick}
                    className="whatsapp-btn text-white flex items-center justify-center gap-2 flex-1"
                    size="lg"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Conversar no WhatsApp
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

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Garantia e Segurança</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Todos os nossos veículos passam por rigorosa inspeção técnica. 
                    Oferecemos garantia e suporte completo pós-venda.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <Footer />
      </div>

      {/* Modal de Imagem Ampliada */}
      {showImageModal && currentImageUrl && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={currentImageUrl}
              alt={`${vehicle.marca} ${vehicle.modelo} - Imagem ampliada`}
              className="max-w-full max-h-full object-contain"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              ✕
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default VehicleDetailsPage;

