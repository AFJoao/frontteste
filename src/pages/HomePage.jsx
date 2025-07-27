import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VehicleCard from '@/components/VehicleCard';
import VehicleFilters from '@/components/VehicleFilters';
import { Button } from '@/components/ui/button';
import { useVehicles } from '@/hooks/useVehicles';
import { Car, Shield, Award, Users, ArrowRight } from 'lucide-react';

const HomePage = () => {
  const { vehicles } = useVehicles();
  const [filteredVehicles, setFilteredVehicles] = useState([]);

  useEffect(() => {
    setFilteredVehicles(vehicles);
  }, [vehicles]);

  const handleFilterChange = (filtered) => {
    setFilteredVehicles(filtered);
  };

  return (
    <>
      <Helmet>
        <title>AutoPrime - Concessionária de Veículos | Carros Novos e Seminovos</title>
        <meta name="description" content="Encontre o carro dos seus sonhos na AutoPrime. Oferecemos veículos novos e seminovos das melhores marcas com financiamento facilitado e garantia." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero Section */}
        <section className="hero-section relative py-20 text-white">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-6xl font-bold mb-6"
              >
                Encontre o Carro dos
                <span className="block text-yellow-400">Seus Sonhos</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl md:text-2xl mb-8 text-gray-100"
              >
                Veículos novos e seminovos das melhores marcas com financiamento facilitado
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg font-semibold"
                  onClick={() => document.getElementById('veiculos').scrollIntoView({ behavior: 'smooth' })}
                >
                  Ver Veículos
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg font-semibold"
                  onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
                >
                  Falar no WhatsApp
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Diferenciais */}
        <section id="sobre" className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Por que escolher a AutoPrime?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Mais de 20 anos de experiência oferecendo qualidade e confiança
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Car,
                  title: 'Veículos Selecionados',
                  description: 'Todos os nossos carros passam por rigorosa inspeção de qualidade'
                },
                {
                  icon: Shield,
                  title: 'Garantia Estendida',
                  description: 'Oferecemos garantia estendida em todos os veículos seminovos'
                },
                {
                  icon: Award,
                  title: 'Financiamento Fácil',
                  description: 'Parcerias com os melhores bancos para facilitar sua compra'
                },
                {
                  icon: Users,
                  title: 'Atendimento Premium',
                  description: 'Equipe especializada para te ajudar em todo o processo'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow bg-background"
                >
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Catálogo de Veículos */}
        <section id="veiculos" className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Nossos Veículos
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Explore nossa seleção de veículos novos e seminovos
              </p>
            </div>

            <VehicleFilters 
              vehicles={vehicles} 
              onFilterChange={handleFilterChange}
            />

            {filteredVehicles.length === 0 ? (
              <div className="text-center py-12">
                <Car className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Nenhum veículo encontrado
                </h3>
                <p className="text-muted-foreground">
                  Tente ajustar os filtros para encontrar o veículo ideal
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default HomePage;