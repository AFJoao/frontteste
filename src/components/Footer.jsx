import React from 'react';
import { Car, Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
const Footer = () => {
  return <footer className="bg-gray-900 text-gray-300 dark:bg-black">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e descrição */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary p-2 rounded-lg">
                <Car className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">ALECAR</span>
                <p className="text-sm text-gray-400">Multimarcas</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">Há mais de 3 anos oferecendo os melhores veículos com qualidade, confiança e excelente atendimento.</p>
          </div>

          {/* Links rápidos */}
          <div>
            <span className="text-lg font-semibold mb-4 block text-white">Links Rápidos</span>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#veiculos" className="hover:text-primary transition-colors">Nossos Veículos</a></li>
              <li><a href="#sobre" className="hover:text-primary transition-colors">Sobre Nós</a></li>
              <li><a href="#financiamento" className="hover:text-primary transition-colors">Financiamento</a></li>
              <li><a href="#garantia" className="hover:text-primary transition-colors">Garantia</a></li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <span className="text-lg font-semibold mb-4 block text-white">Contato</span>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>(55) 99698-0476 </span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>contato@alecar.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>R. Duque de Caxias, 471 - Horizontina, RS</span>
              </li>
            </ul>
          </div>

          {/* Redes sociais */}
          <div>
            <span className="text-lg font-semibold mb-4 block text-white">Redes Sociais</span>
            <div className="flex gap-3">
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-blue-600 transition-colors">
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-pink-600 transition-colors">
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-red-600 transition-colors">
                <Youtube className="w-5 h-5 text-white" />
              </a>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              Siga-nos para ficar por dentro das novidades!
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} AutoPrime Concessionária. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;