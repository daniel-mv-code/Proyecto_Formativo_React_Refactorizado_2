/**
 * Servicio de Manejo de Tokens JWT y Control de Autenticación
 * Basado en la estructura de la base de datos autometrica_db.sql
 */

export type RolUsuario = 'admin' | 'mecanico' | 'cliente';

export interface UsuarioAuth {
  id: number;
  taller_id?: number | null;
  nombre_completo: string;
  correo: string;
  rol: RolUsuario;
  telefono?: string;
  activo: boolean;
  exp?: number;
}

export interface JwtPayload {
  id: number;
  nombre_completo: string;
  correo: string;
  rol: RolUsuario;
  taller_id?: number | null;
  iat: number;
  exp: number;
}

const TOKEN_KEY = 'autometrica_jwt_token';
const USER_KEY = 'autometrica_auth_user';

// Cuentas semilla extraídas directamente de autometrica_db.sql
export const USUARIOS_BD_DEMO: (UsuarioAuth & { contrasena: string })[] = [
  {
    id: 1,
    taller_id: 1,
    nombre_completo: 'Administrador AutoTecnik',
    correo: 'admin@autotecnik.com',
    contrasena: 'admin123',
    rol: 'admin',
    telefono: '+57 300 000 0001',
    activo: true,
  },
  {
    id: 2,
    taller_id: 1,
    nombre_completo: 'Carlos Mendoza',
    correo: 'carlos.m@autotecnik.com',
    contrasena: 'mecanico123',
    rol: 'mecanico',
    telefono: '+57 311 111 1111',
    activo: true,
  },
  {
    id: 3,
    taller_id: 1,
    nombre_completo: 'José Martínez',
    correo: 'jose.m@autotecnik.com',
    contrasena: 'mecanico123',
    rol: 'mecanico',
    telefono: '+57 322 222 2222',
    activo: true,
  },
  {
    id: 5,
    taller_id: null,
    nombre_completo: 'Luis Ramírez',
    correo: 'luis.r@correo.com',
    contrasena: 'cliente123',
    rol: 'cliente',
    telefono: '+57 300 100 1001',
    activo: true,
  },
  {
    id: 6,
    taller_id: null,
    nombre_completo: 'Ana García',
    correo: 'ana.g@correo.com',
    contrasena: 'cliente123',
    rol: 'cliente',
    telefono: '+57 300 200 2002',
    activo: true,
  },
];

/**
 * Genera un token JWT simulado estándar de 3 partes: Header.Payload.Signature
 */
export const generateJwt = (user: UsuarioAuth): string => {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const payload: JwtPayload = {
    id: user.id,
    nombre_completo: user.nombre_completo,
    correo: user.correo,
    rol: user.rol,
    taller_id: user.taller_id,
    iat: now,
    exp: now + 3600 * 8, // Válido por 8 horas
  };

  const toBase64 = (obj: object) =>
    btoa(unescape(encodeURIComponent(JSON.stringify(obj))))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

  const encodedHeader = toBase64(header);
  const encodedPayload = toBase64(payload);
  const dummySignature = btoa(`sig_${user.id}_${now}_autometrica_secret`).substring(0, 32);

  return `${encodedHeader}.${encodedPayload}.${dummySignature}`;
};

/**
 * Decodifica la carga útil (Payload) de un token JWT
 */
export const decodeJwt = (token: string): JwtPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonString = decodeURIComponent(escape(atob(base64)));
    return JSON.parse(jsonString) as JwtPayload;
  } catch (error) {
    console.error('[tokenService] Error decodificando JWT:', error);
    return null;
  }
};

/**
 * Almacena el token y la información del usuario en localStorage
 */
export const saveToken = (token: string, user: UsuarioAuth): void => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Obtiene el token actual almacenado
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Obtiene la información del usuario autenticado actual
 */
export const getUser = (): UsuarioAuth | null => {
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson) as UsuarioAuth;
  } catch {
    return null;
  }
};

/**
 * Elimina las credenciales almacenadas (Cierre de sesión seguro)
 */
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Comprueba si existe una sesión activa y con token no expirado
 */
export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;
  const payload = decodeJwt(token);
  if (!payload) return false;
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) {
    removeToken();
    return false;
  }
  return true;
};

/**
 * Valida si el usuario logueado posee alguno de los roles permitidos
 */
export const hasRole = (allowedRoles: RolUsuario[]): boolean => {
  if (!isAuthenticated()) return false;
  const user = getUser();
  if (!user) return false;
  return allowedRoles.includes(user.rol);
};

/**
 * Autentica contra la base de datos de usuarios (con fallback para nuevos registros)
 */
export const authenticateUser = (
  correo: string,
  contrasena: string
): { success: boolean; token?: string; user?: UsuarioAuth; error?: string } => {
  const normalizedEmail = correo.trim().toLowerCase();
  
  // Buscar en usuarios demo de la BD
  const foundUser = USUARIOS_BD_DEMO.find(
    (u) => u.correo.toLowerCase() === normalizedEmail
  );

  if (foundUser) {
    if (foundUser.contrasena === contrasena) {
      const userAuth: UsuarioAuth = {
        id: foundUser.id,
        taller_id: foundUser.taller_id,
        nombre_completo: foundUser.nombre_completo,
        correo: foundUser.correo,
        rol: foundUser.rol,
        telefono: foundUser.telefono,
        activo: foundUser.activo,
      };
      const token = generateJwt(userAuth);
      saveToken(token, userAuth);
      return { success: true, token, user: userAuth };
    }
    return { success: false, error: 'Contraseña incorrecta. Intente de nuevo.' };
  }

  // Si no está en demo, permitir acceso como usuario estándar si ingresó datos
  if (contrasena.length >= 4) {
    const userAuth: UsuarioAuth = {
      id: Date.now(),
      nombre_completo: normalizedEmail.split('@')[0],
      correo: normalizedEmail,
      rol: 'cliente',
      activo: true,
    };
    const token = generateJwt(userAuth);
    saveToken(token, userAuth);
    return { success: true, token, user: userAuth };
  }

  return { success: false, error: 'Usuario no registrado en la base de datos.' };
};
