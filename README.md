# Chortega E-Market — Frontend (Next.js)

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)

Marketplace comunitario para conectar emprendedores, clientes y repartidores de Nicoya. Este repositorio contiene la aplicación web (SSR/SPA) construida con Next.js (App Router) + TypeScript + Tailwind + shadcn/ui y Zustand para estado. La app consume una API NestJS y usa Socket.IO para comunicación en tiempo real.

## 🔍 Objetivo

Ofrecer una interfaz rápida, accesible y responsiva para:
- 🛍️ Explorar catálogo de productos
- 📦 Realizar pedidos
- 💬 Chat en tiempo real
- 📍 Seguimiento de entregas

Basado en las especificaciones académicas del proyecto final (UNA) y el alcance del MVP.

## 🚀 Stack Técnico

| Categoría | Tecnología |
|-----------|------------|
| **Framework** | Next.js (App Router) + React 18 + TypeScript |
| **UI/Styling** | Tailwind CSS + shadcn/ui + Lucide Icons |
| **Estado** | Zustand (slices por dominio: auth, cart, orders, chat) |
| **Tiempo Real** | Socket.IO client (WebSocket) |
| **Peticiones** | fetch/React Query (opcional) |
| **Imágenes** | next/image + dominios permitidos (CDN/S3) |
| **Calidad** | ESLint + Prettier + Husky + lint-staged |
| **Testing** | Playwright E2E + Testing Library (opcional) |
| **Accesibilidad** | aria-*, contraste, navegación por teclado |
| **Deploy** | Vercel (preview + prod), CI/CD con GitHub Actions |

## 🗺️ Módulos del Frontend (MVP)

### 🔐 Auth & Perfil
- Registro/login con roles (Cliente/Emprendedor/Repartidor/Admin)
- Edición de perfil de usuario

### 📋 Catálogo
- Listado y detalle de productos
- Búsqueda y filtros por categorías
- Carrito de compras y checkout

### 📦 Pedidos
- Creación de pedidos
- Tracking de estados: `confirmado` → `en preparación` → `en camino` → `entregado`

### 🚚 Repartidores
- Vista de pedidos disponibles
- Flujo de aceptación de entregas

### 💬 Chat
- Conversaciones Cliente ↔ Emprendedor
- Conversaciones Cliente ↔ Repartidor
- Comunicación en tiempo real con Socket.IO

### ⚙️ Admin (Básico)
- CRUD de usuarios y contenido
- Panel de administración mínimo

### 🔔 Notificaciones
- Timeline in-app de cambios de estado
- Notificaciones en tiempo real

## 📁 Estructura de Carpetas

```
/src
  /app
    /(public)          # rutas públicas (home, login, registro, catálogo)
    /(private)         # rutas protegidas por rol
    /api               # acciones server-only (Next.js server actions)
    /orders            # páginas de pedidos
    /products          # páginas de productos
    /chat              # páginas de chat
    /dashboard         # dashboards por rol
    layout.tsx
    globals.css
  /components
    /ui                # wrappers de shadcn/ui
    /shared            # Header, Footer, Sidebar, EmptyState, etc.
    /catalog           # ProductCard, Filters, Sort, etc.
    /cart              # CartSheet/Drawer
    /orders            # OrderTimeline, OrderStatusBadge
    /chat              # ChatThread, MessageBubble, Composer
  /hooks               # useAuth, useSocket, useRole, etc.
  /lib                 # fetcher, socket, constants, utils (money, dates)
  /stores              # Zustand slices (authSlice, cartSlice, chatSlice...)
  /types               # DTOs/Types compartidos con backend
  /styles              # estilos adicionales
  /tests-e2e           # Playwright tests
```

## 🔧 Requisitos

- **Node.js** 18+
- **pnpm** (`npm i -g pnpm`)
- Cuenta de **Vercel** para deploy
- **API NestJS** accesible (local/Render)
- Servidor **Socket.IO** configurado

## ⚙️ Variables de Entorno

Crea un archivo `.env.local`:

```bash
# API & Realtime
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
NEXT_PUBLIC_SOCKET_URL=wss://api.example.com

# Imágenes
NEXT_PUBLIC_IMAGE_BASE=https://cdn.example.com

# Auth (si se usa OAuth en frontend)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

> **Nota**: Ajusta dominios permitidos para `next/image` en `next.config.js` y CORS en el backend.

## ▶️ Scripts

```bash
pnpm i                # Instalar dependencias
pnpm dev              # Entorno local (http://localhost:3000)
pnpm build            # Compilar para producción
pnpm start            # Servir build (Node)
pnpm lint             # Linting
pnpm format           # Formatear código con Prettier
pnpm test:e2e         # Pruebas E2E con Playwright
```

## 🔐 Rutas por Rol

### 🌍 Públicas
- `/` - Página de inicio
- `/login` - Iniciar sesión
- `/register` - Registro
- `/products` - Catálogo
- `/products/[id]` - Detalle de producto

### 👤 Cliente
- `/orders` - Mis pedidos
- `/orders/[id]` - Detalle de pedido
- `/chat` - Conversaciones

### 🏪 Emprendedor
- `/dashboard/entrepreneur` - Panel de emprendedor
- `/dashboard/products` - Gestión de productos

### 🚚 Repartidor
- `/dashboard/courier` - Panel de repartidor
- `/deliveries` - Entregas disponibles

### 👑 Admin
- `/admin` - Panel de administración

> Los layouts de App Router aplican guards de rol a nivel de segmento.

## 🔌 Integración con la API

### Convenciones REST

| Endpoint | Descripción |
|----------|-------------|
| **Base** | `${NEXT_PUBLIC_API_BASE_URL}` |
| **Auth** | `/auth/login`, `/auth/register` |
| **Catálogo** | `/products`, `/categories` |
| **Pedidos** | `/orders`, `/orders/:id/status` |
| **Chat** | `/conversations`, `/messages` |

### Ejemplo de Cliente API

```typescript
// src/lib/fetcher.ts
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`, {
    credentials: 'include',
    ...init,
    headers: { 
      'Content-Type': 'application/json', 
      ...(init?.headers || {}) 
    },
  });
  
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}
```

### Eventos WebSocket

- `order:status` - Cambio de estado de pedido
- `order:assigned` - Asignación de pedido
- `chat:message` - Nuevo mensaje de chat

## 💬 Socket.IO (Cliente)

```typescript
// src/lib/socket.ts
import { io } from 'socket.io-client';

export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
  autoConnect: false,
  withCredentials: true,
});

export function connectSocket(token?: string) {
  if (token) socket.auth = { token };
  if (!socket.connected) socket.connect();
}
```

## 🧰 UI & Diseño

- **shadcn/ui** para componentes accesibles y consistentes (Button, Card, Sheet, Dialog)
- **Tailwind CSS** con tokens de color y tipografía
- **Soporte dark mode** (opcional)
- **Diseño responsivo**: mobile-first con breakpoints adaptativos
- **Accesibilidad**: roles ARIA, labels, foco visible, semántica adecuada

## 🧪 Pruebas y Calidad

### Testing E2E (Playwright)
Flujos críticos cubiertos:
- ✅ Login y autenticación
- ✅ Añadir productos al carrito
- ✅ Proceso de checkout
- ✅ Seguimiento de pedidos
- ✅ Chat básico

### Code Quality
- **Linting/Format**: Ejecutado en pre-commit con Husky + lint-staged
- **Métricas**: Lighthouse (performance, accessibility, best practices)

## 🔄 CI/CD

### Vercel
- Conecta el repositorio
- Cada PR crea un preview deployment automático
- Variables de entorno gestionadas en Project Settings

### GitHub Actions
```yaml
# Ejemplo de workflow
- pnpm install
- pnpm build
- pnpm test:e2e (modo CI)
```

## 🗺️ Roadmap

### ✅ MVP
- Auth + catálogo + pedidos + chat + estados + admin básico

### 🚧 Futuras Mejoras
- 💳 Integración de pagos (SINPE/TC)
- ⭐ Sistema de reseñas
- 📧 Notificaciones por email
- 🗺️ Mapas por zonas de entrega
- 🤖 Autoasignación por proximidad
- 📊 Panel de analítica
- 🎯 Sistema de campañas

## 🤝 Contribución

### Convenciones
- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`)
- **Branches**: `feat/<módulo>`, `fix/<área>`
- **PRs**: Incluyen preview automático de Vercel
- **Code Style**: Hooks de pre-commit activos

### Proceso
1. Fork el repositorio
2. Crea una rama feature: `git checkout -b feat/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'feat: agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feat/nueva-funcionalidad`
5. Abre un Pull Request

## 📜 Licencia

Uso académico/educativo según lineamientos del curso UNA.

---

## 📝 Notas Importantes

> ⚠️ **Configuración Crítica**
> 
> - Asegúrate de alinear CORS entre frontend y backend
> - Configura dominios permitidos para imágenes en `next.config.js`
> - Sincroniza URLs de Socket.IO entre cliente y servidor
> - Revisa el cronograma y módulos priorizados para cumplir hitos semanales

## 🆘 Soporte

Para dudas sobre el proyecto académico, consulta con el equipo docente o revisa la documentación del curso.

---

**Desarrollado con ❤️ para la comunidad de Nicoya**
