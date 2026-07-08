import axios from 'axios';

// TIPOS Y DEFINICIONES DE LA BASE DE DATOS

export interface PersonalMilitar {
  CEDULA: string;
  ID_JERARQUIA: number;
  NOMBRE: string;
  APELLIDO: string;
  CONTINGENTE: string;
  ID_COMPANIA: number;
  TELEFONO?: string;
  JERARQUIA_NOMBRE?: string;
  COMPANIA_NOMBRE?: string;
}

export interface Arma {
  SERIAL_ARMA: string;
  TAG_NFC: string;
  MODELO: string;
  TIPO: string;
  CALIBRE: string;
  CAPACIDAD_CARGA: number;
  ESTADO_DISPONIBILIDAD: 'DISPONIBLE' | 'ASIGNADO' | 'MANTENIMIENTO';
  URL_IMAGEN_ACCION?: string;
}

export interface Movimiento {
  ID_MOVIMIENTO: number;
  TIPO_MOVIMIENTO: 'ENTRADA' | 'SALIDA';
  ID_CEDULA_PERSONAL: string;
  SERIAL_ARMA: string;
  CANTIDAD_CARGADORES: number;
  CANTIDAD_MUNICION: number;
  GRUPO_FECHA_HORA: string;
  MOTIVO: string;
  UID_LECTOR_NFC: string;
  NOMBRE_COMPLETO?: string;
  MODELO_ARMA?: string;
}

export interface FolioRevista {
  ID_FOLIO: number;
  GRUPO_FECHA_HORA: string;
  ID_CEDULA_PERSONAL: string;
  PUESTO_SERVICIO: string;
  REVISTA_GRUPO: string;
  CEDULA_INSPECTOR: string;
  OBSERVACION?: string;
  NOMBRE_PERSONAL?: string;
  NOMBRE_INSPECTOR?: string;
}

export interface Jerarquia {
  ID_JERARQUIA: number;
  NOMBRE_JERARQUIA: string;
}

export interface Compania {
  ID_COMPANIA: number;
  NOMBRE_COMPANIA: string;
  NUM_REGIMIENTO: string;
}

// CONFIGURACIÓN DE LA API

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// SERVICIOS DE PERSONAL
// ============================================

export const personalService = {
  // Obtener todo el personal
  getAll: async (): Promise<PersonalMilitar[]> => {
    try {
      const response = await api.get('/personal');
      return response.data;
    } catch (error) {
      console.error('Error al obtener personal:', error);
      throw error;
    }
  },

  // Buscar personal por cédula
  getByCedula: async (cedula: string): Promise<PersonalMilitar | null> => {
    try {
      const response = await api.get(`/personal/${cedula}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error al buscar personal:', error);
      throw error;
    }
  },

  // Buscar personal por nombre
  searchByNombre: async (nombre: string): Promise<PersonalMilitar[]> => {
    try {
      const response = await api.get(`/personal/search?nombre=${nombre}`);
      return response.data;
    } catch (error) {
      console.error('Error al buscar personal por nombre:', error);
      throw error;
    }
  },

  // Crear nuevo personal
  create: async (personal: Omit<PersonalMilitar, 'JERARQUIA_NOMBRE' | 'COMPANIA_NOMBRE'>): Promise<PersonalMilitar> => {
    try {
      const response = await api.post('/personal', personal);
      return response.data;
    } catch (error) {
      console.error('Error al crear personal:', error);
      throw error;
    }
  },

  // Actualizar personal
  update: async (cedula: string, personal: Partial<PersonalMilitar>): Promise<PersonalMilitar> => {
    try {
      const response = await api.put(`/personal/${cedula}`, personal);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar personal:', error);
      throw error;
    }
  },
};

// ============================================
// SERVICIOS DE ARMAS
// ============================================

export const armasService = {
  // Obtener todas las armas
  getAll: async (): Promise<Arma[]> => {
    try {
      const response = await api.get('/armas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener armas:', error);
      throw error;
    }
  },

  // Buscar arma por serial
  getBySerial: async (serial: string): Promise<Arma | null> => {
    try {
      const response = await api.get(`/armas/${serial}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error al buscar arma:', error);
      throw error;
    }
  },

  // Buscar arma por TAG NFC
  getByNFC: async (tagNFC: string): Promise<Arma | null> => {
    try {
      const response = await api.get(`/armas/nfc/${tagNFC}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error al buscar arma por NFC:', error);
      throw error;
    }
  },

  // Obtener armas por estado
  getByEstado: async (estado: string): Promise<Arma[]> => {
    try {
      const response = await api.get(`/armas/estado/${estado}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener armas por estado:', error);
      throw error;
    }
  },

  // Actualizar estado del arma
  updateEstado: async (serial: string, estado: string): Promise<Arma> => {
    try {
      const response = await api.patch(`/armas/${serial}/estado`, { estado });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar estado del arma:', error);
      throw error;
    }
  },
};

// ============================================
// SERVICIOS DE MOVIMIENTOS
// ============================================

export const movimientosService = {
  // Registrar movimiento (entrada/salida)
  registrar: async (movimiento: Omit<Movimiento, 'ID_MOVIMIENTO' | 'GRUPO_FECHA_HORA'>): Promise<Movimiento> => {
    try {
      const response = await api.post('/movimientos', movimiento);
      return response.data;
    } catch (error) {
      console.error('Error al registrar movimiento:', error);
      throw error;
    }
  },

  // Obtener movimientos por fecha
  getByFecha: async (fechaInicio: string, fechaFin: string): Promise<Movimiento[]> => {
    try {
      const response = await api.get(`/movimientos/fecha?inicio=${fechaInicio}&fin=${fechaFin}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener movimientos por fecha:', error);
      throw error;
    }
  },

  // Obtener movimientos por personal
  getByPersonal: async (cedula: string): Promise<Movimiento[]> => {
    try {
      const response = await api.get(`/movimientos/personal/${cedula}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener movimientos por personal:', error);
      throw error;
    }
  },

  // Obtener movimientos por arma
  getByArma: async (serial: string): Promise<Movimiento[]> => {
    try {
      const response = await api.get(`/movimientos/arma/${serial}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener movimientos por arma:', error);
      throw error;
    }
  },

  // Obtener últimos movimientos
  getUltimos: async (limite: number = 50): Promise<Movimiento[]> => {
    try {
      const response = await api.get(`/movimientos/ultimos?limite=${limite}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener últimos movimientos:', error);
      throw error;
    }
  },
};

// ============================================
// SERVICIOS DE FOLIO REVISTAS
// ============================================

export const folioRevistasService = {
  // Crear nuevo folio de revista
  crear: async (folio: Omit<FolioRevista, 'ID_FOLIO'>): Promise<FolioRevista> => {
    try {
      const response = await api.post('/folio-revistas', folio);
      return response.data;
    } catch (error) {
      console.error('Error al crear folio de revista:', error);
      throw error;
    }
  },

  // Obtener folios por fecha
  getByFecha: async (fechaInicio: string, fechaFin: string): Promise<FolioRevista[]> => {
    try {
      const response = await api.get(`/folio-revistas/fecha?inicio=${fechaInicio}&fin=${fechaFin}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener folios por fecha:', error);
      throw error;
    }
  },

  // Obtener folios por personal
  getByPersonal: async (cedula: string): Promise<FolioRevista[]> => {
    try {
      const response = await api.get(`/folio-revistas/personal/${cedula}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener folios por personal:', error);
      throw error;
    }
  },
};

// ============================================
// SERVICIOS DE CATÁLOGOS
// ============================================

export const catalogosService = {
  // Obtener jerarquías
  getJerarquias: async (): Promise<Jerarquia[]> => {
    try {
      const response = await api.get('/catalogos/jerarquias');
      return response.data;
    } catch (error) {
      console.error('Error al obtener jerarquías:', error);
      throw error;
    }
  },

  // Obtener compañías
  getCompanias: async (): Promise<Compania[]> => {
    try {
      const response = await api.get('/catalogos/companias');
      return response.data;
    } catch (error) {
      console.error('Error al obtener compañías:', error);
      throw error;
    }
  },
};

// ============================================
// SERVICIO DE LECTORES NFC
// ============================================

export const lectoresService = {
  // Registrar lectura NFC y procesar movimiento
  procesarLectura: async (tagNFC: string, tipoMovimiento: 'ENTRADA' | 'SALIDA', uidLector: string) => {
    try {
      const response = await api.post('/lectores/procesar', {
        tagNFC,
        tipoMovimiento,
        uidLector,
      });
      return response.data;
    } catch (error) {
      console.error('Error al procesar lectura NFC:', error);
      throw error;
    }
  },
};

export default {
  personal: personalService,
  armas: armasService,
  movimientos: movimientosService,
  folioRevistas: folioRevistasService,
  catalogos: catalogosService,
  lectores: lectoresService,
};