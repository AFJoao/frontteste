import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Car, Phone, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';
const Header = () => {
  const navigate = useNavigate();
  return <header className="bg-card shadow-md sticky top-0 z-50 transition-colors duration-300">
      {/* Top bar */}
      <div className="bg-primary/90 text-primary-foreground py-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span>(55) 99698-0000 </span>
              </div>
              <div className="hidden sm:flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>Horizontina, RS
              </span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Seg-Sex: 8h-18h | Sáb: 8h-14h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <motion.div initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-primary p-2 rounded-lg">
              <Car className="w-8 h-8 text-primary-foreground" />
            </div>
            {/* 
            // CÓDIGO PARA USAR LOGO PNG - DESCOMENTE PARA ATIVAR
            // Substitua o caminho '/logo.png' pelo caminho correto da sua logo
            <div>
              <img 
                src="/logo.png" 
                alt="AutoPrime Concessionária" 
                className="h-12 w-auto"
              />
            </div>
            */}
            <div>
              <h1 className="text-2xl font-bold text-foreground">AutoPrime</h1>
              <p className="text-sm text-muted-foreground">Concessionária</p>
            </div>
          </motion.div>

          <div className="flex items-center gap-2">
            <nav className="hidden md:flex items-center gap-6">
              <a href="#veiculos" className="text-foreground/80 hover:text-primary transition-colors">
                Veículos
              </a>
              <a href="#sobre" className="text-foreground/80 hover:text-primary transition-colors">
                Sobre
              </a>
              <a href="#contato" className="text-foreground/80 hover:text-primary transition-colors">
                Contato
              </a>
              <Button onClick={() => navigate('/admin/login')} variant="outline" size="sm">
                Admin
              </Button>
            </nav>
            <ThemeToggle />
            <Button className="whatsapp-btn text-white md:hidden" onClick={() => window.open('https://wa.me/5511999999999', '_blank')}>
              WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </header>;
};
export default Header;