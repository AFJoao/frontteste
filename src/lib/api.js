import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://concessionaria-backend-k997.onrender.com/api',
});

// Interceptador para adicionar o token JWT
API.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==================== FUNÇÕES DE CDN ====================

/**
 * Obtém configuração do CDN
 */
export const getCdnConfig = async () => {
  try {
    const response = await API.get('/cdn-config');
    return response.data;
  } catch (error) {
    console.error('Erro ao obter configuração do CDN:', error);
    throw error;
  }
};

/**
 * Upload de imagem via CDN
 */
export const uploadImageToCdn = async (file, vehicleId) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('vehicle_id', vehicleId);

    const response = await API.post('/cdn-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Erro no upload para CDN:', error);
    throw error;
  }
};

/**
 * Upload múltiplo de imagens via CDN
 */
export const uploadMultipleImagesToCdn = async (files, vehicleId) => {
  try {
    const formData = new FormData();
    
    files.forEach((file) => {
      formData.append('files', file);
    });
    
    formData.append('vehicle_id', vehicleId);

    const response = await API.post('/cdn-uploads/bulk', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Erro no upload múltiplo para CDN:', error);
    throw error;
  }
};

/**
 * Remove imagem do CDN
 */
export const deleteImageFromCdn = async (imageId) => {
  try {
    const response = await API.delete(`/cdn-uploads/${imageId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar imagem do CDN:', error);
    throw error;
  }
};

/**
 * Lista imagens de um veículo do CDN
 */
export const getVehicleImagesFromCdn = async (vehicleId) => {
  try {
    const response = await API.get(`/cdn-uploads/${vehicleId}/images`);
    return response.data;
  } catch (error) {
    console.error('Erro ao listar imagens do CDN:', error);
    throw error;
  }
};

// ==================== FUNÇÕES ORIGINAIS (mantidas para compatibilidade) ====================

/**
 * Upload de imagem local (mantido para compatibilidade)
 */
export const uploadImage = async (file, vehicleId) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('vehicle_id', vehicleId);

    const response = await API.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Erro no upload local:', error);
    throw error;
  }
};

/**
 * Função helper para determinar se deve usar CDN ou upload local
 */
export const uploadImageSmart = async (file, vehicleId) => {
  try {
    // Tentar primeiro com CDN
    const cdnConfig = await getCdnConfig();
    
    if (cdnConfig.imagekit_url_endpoint && cdnConfig.imagekit_public_key) {
      console.log('Usando upload via CDN ImageKit');
      return await uploadImageToCdn(file, vehicleId);
    } else {
      console.log('CDN não configurado, usando upload local');
      return await uploadImage(file, vehicleId);
    }
  } catch (error) {
    console.error('Erro no upload inteligente:', error);
    // Fallback para upload local em caso de erro no CDN
    try {
      console.log('Tentando fallback para upload local');
      return await uploadImage(file, vehicleId);
    } catch (localError) {
      console.error('Erro também no upload local:', localError);
      throw localError;
    }
  }
};

/**
 * Função helper para upload múltiplo inteligente
 */
export const uploadMultipleImagesSmart = async (files, vehicleId) => {
  try {
    // Tentar primeiro com CDN
    const cdnConfig = await getCdnConfig();
    
    if (cdnConfig.imagekit_url_endpoint && cdnConfig.imagekit_public_key) {
      console.log('Usando upload múltiplo via CDN ImageKit');
      return await uploadMultipleImagesToCdn(files, vehicleId);
    } else {
      console.log('CDN não configurado, fazendo uploads locais individuais');
      const results = [];
      const errors = [];
      
      for (const file of files) {
        try {
          const result = await uploadImage(file, vehicleId);
          results.push(result);
        } catch (error) {
          errors.push(`${file.name}: ${error.message}`);
        }
      }
      
      return {
        message: `${results.length} imagens enviadas com sucesso`,
        uploaded_images: results,
        errors: errors
      };
    }
  } catch (error) {
    console.error('Erro no upload múltiplo inteligente:', error);
    throw error;
  }
};

export default API;

