# Actividad 3 – Aplicación al Proyecto Productivo: Autenticación y Autorización en una SPA

## 1. Requerimientos de la Actividad
Implemente en su proyecto formativo:
- Pantalla de login
- Gestión de JWT (JSON Web Token)
- Protección de rutas (Guards / ProtectedRoute)
- Control de permisos
- Para cada una de las rutas, basado en su base de datos (`autometrica_db.sql`).

---

## 2. Alineación con la Base de Datos (`autometrica_db.sql`)

En la tabla `usuarios` de `autometrica_db.sql`:
```sql
CREATE TABLE usuarios (
    id              SERIAL PRIMARY KEY,
    taller_id       INT REFERENCES talleres(id) ON DELETE SET NULL,
    nombre_completo VARCHAR(150) NOT NULL,
    correo          VARCHAR(100) NOT NULL UNIQUE,
    contrasena_hash VARCHAR(255) NOT NULL,  
    rol             VARCHAR(20)  NOT NULL
                    CHECK (rol IN ('admin', 'mecanico', 'cliente')),
    telefono        VARCHAR(20),
    activo          BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_registro  TIMESTAMP NOT NULL DEFAULT NOW(),
    ultimo_acceso   TIMESTAMP   
);
```

### Cuentas Semilla Preconfiguradas para Pruebas (Acceso Rápido):

| Rol BD | Nombre Completo | Correo | Contraseña | Alcance de Permisos |
| :--- | :--- | :--- | :--- | :--- |
| **`admin`** | Administrador AutoTecnik | `admin@autotecnik.com` | `admin123` | **Acceso total**: `/usuarios`, `/productos`, `/ventas`, `/perfil`. |
| **`mecanico`** | Carlos Mendoza | `carlos.m@autotecnik.com` | `mecanico123` | **Gestión técnica**: `/productos` y `/usuarios`. *Bloqueo 403 en `/ventas`*. |
| **`cliente`** | Luis Ramírez | `luis.r@correo.com` | `cliente123` | **Portal de cliente**: `/perfil`. *Bloqueo 403 en `/usuarios`, `/productos` y `/ventas`*. |

---

## 3. Matriz de Control de Rutas y Permisos

| Ruta | Rol(es) Autorizado(s) | Sin Token | Rol No Autorizado |
| :--- | :--- | :--- | :--- |
| `/login` | Público | Visible | Redirige al Dashboard |
| `/registro` | Público | Visible | Redirige al Dashboard |
| `/usuarios` | `admin`, `mecanico` | Redirige a `/login` | Error 403 (Acceso Denegado) |
| `/productos` | `admin`, `mecanico` | Redirige a `/login` | Error 403 (Acceso Denegado) |
| `/ventas` | `admin` | Redirige a `/login` | Error 403 (Acceso Denegado) |
| `/perfil` | `admin`, `mecanico`, `cliente` | Redirige a `/login` | N/A |

---

## 4. Arquitectura de Seguridad Implementada

1. **`tokenService.ts`**:
   - Genera tokens JWT bajo el estándar **RFC 7519** (`Header.Payload.Signature`) con expiración calculada (`exp`).
   - Almacenamiento seguro en `localStorage` (`autometrica_jwt_token` y `autometrica_auth_user`).
   - Funciones de consulta, validación de vigencia, obtención del perfil y logout (`removeToken`).
2. **`authSlice.ts`**:
   - Sincroniza el estado de autenticación con el store global de Redux Toolkit.
3. **`ProtectedRoute.tsx`**:
   - Intercepta el enrutamiento. Si no existe sesión, redirige a `/login` conservando la ruta solicitada (`state.from`). Si el rol no cuenta con privilegios, despliega la pantalla 403.
4. **`AccesoDenegado.tsx`**:
   - Interfaz amigable que detalla el rol del usuario, los roles requeridos y provee accesos directos de retorno seguro o cambio de cuenta.
5. **`Login.tsx`**:
   - Formulario interactivo con botones de acceso 1-clic para probar al instante los tres roles de `autometrica_db.sql`.
6. **`Header.tsx` & `Sidebar.tsx`**:
   - Barra superior con avatar, nombre, badge de rol y botón **Cerrar Sesión**.
   - Barra lateral que indica mediante candados 🔒 los módulos restringidos según el rol activo.

---

## 5. Enlaces Oficiales de GitHub

- **Repositorio GitHub:** [daniel-mv-code/Proyecto_Formativo_React_Refactorizado_2](https://github.com/daniel-mv-code/Proyecto_Formativo_React_Refactorizado_2)
- **Rama:** `feature/autenticacion-autorizacion-actividad-3`
- **Documento Word Original Actualizado:** `docs/Autenticacion_y_Autorizacion_SPA_Brayan_Munoz.docx`
