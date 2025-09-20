Chortega E-Market — Frontend (Next.js)

Marketplace comunitario para conectar emprendedores, clientes y repartidores de Nicoya. Este repo contiene la app web (SSR/SPA) construida con Next.js (App Router) + TypeScript + Tailwind + shadcn/ui y Zustand para estado. La app consume una API NestJS y usa Socket.IO para tiempo real (chat y estados de pedido).

🔍 Objetivo

Ofrecer una interfaz rápida, accesible y responsiva para: explorar catálogo, realizar pedidos, chatear en tiempo real y seguir el estado de las entregas. Basado en las especificaciones académicas del proyecto final (UNA) y el alcance del MVP.

🚀 Stack técnico

Framework: Next.js (App Router) + React 18 + TypeScript

UI: Tailwind CSS + shadcn/ui + Lucide Icons

Estado: Zustand (slices por dominio: auth, cart, orders, chat)

Tiempo real: Socket.IO client (WS)

Peticiones: fetch/React Query (opcional)

Imágenes: next/image + dominios permitidos (CDN/S3)

Calidad: ESLint + Prettier + Husky + lint-staged

Pruebas: Playwright E2E (y Testing Library opcional)

Accesibilidad: aria-*, contraste, navegación por teclado

Deploy: Vercel (preview + prod), CI/CD con GitHub Actions


🗺️ Módulos del Frontend (MVP)

Auth & Perfil: registro/login, rol (Cliente/Emprendedor/Repartidor/Admin), edición de perfil.

Catálogo: listado, detalle, búsqueda, categorías, carrito, checkout.

Pedidos: creación, tracking de estados (confirmado → en preparación → en camino → entregado).

Repartidores: ver pedidos disponibles y aceptar entregas (flujo básico).

Chat: conversaciones Cliente↔Emprendedor y Cliente↔Repartidor (Socket.IO).

Admin (mínimo): CRUD básico de usuarios/contenido visible.

Notificaciones in-app: timeline de cambios de estado.


📁 Estructura de carpetas (sugerida)
/src
  /app
    /(public)          # rutas públicas (home, login, registro, catálogo)
    /(private)         # rutas protegidas por rol
    /api               # acciones server-only (Next.js server actions opcional)
    /orders
    /products
    /chat
    /dashboard
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
  /types               # DTOs/Types compartidos con backend si aplica
  /styles              # estilos adicionales
  /tests-e2e           # Playwright

🔧 Requisitos

Node 18+

pnpm npm i -g pnpm

Cuenta de Vercel (deploy)

API NestJS accesible (local/Render) y servidor Socket.IO


⚙️ Variables de entorno

Crea un .env.local:

# API & Realtime
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
NEXT_PUBLIC_SOCKET_URL=wss://api.example.com

# Imágenes
NEXT_PUBLIC_IMAGE_BASE=https://cdn.example.com

# Auth (si se usa OAuth en frontend)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=


Ajusta dominios permitidos para next/image en next.config.js y CORS en el backend.

▶️ Scripts
pnpm i                # instalar dependencias
pnpm dev              # entorno local (http://localhost:3000)
pnpm build            # compilar para producción
pnpm start            # servir build (Node)
pnpm lint             # lint
pnpm format           # prettier
pnpm test:e2e         # playwright

🔐 Rutas por rol (guardas)

Públicas: /, /login, /register, /products, /products/[id]

Cliente: /orders, /orders/[id], /chat

Emprendedor: /dashboard/entrepreneur, /dashboard/products

Repartidor: /dashboard/courier, /deliveries

Admin: /admin (gestión mínima)
Los layouts de App Router aplican guards de rol a nivel de segmento.

🔌 Integración con la API

Convenciones:

REST base: ${NEXT_PUBLIC_API_BASE_URL}

Auth: /auth/login, /auth/register, refresh token en cookies/httpOnly

Catálogo: /products, /categories

Pedidos: /orders, /orders/:id/status

Chat: WS en ${NEXT_PUBLIC_SOCKET_URL} y REST /conversations, /messages

Eventos WS: order:status, order:assigned, chat:message


Ejemplo de cliente simple:

// src/lib/fetcher.ts
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`, {
    credentials: 'include',
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

💬 Socket.IO (cliente)
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


Suscripción en componentes de chat/órdenes para actualizar timeline de estado.

🧰 UI & diseño

shadcn/ui para componentes accesibles y consistentes (Button, Card, Sheet, Dialog).

Tailwind con tokens de color y tipografía; soporte dark mode si aplica.

Responsivo: mobile-first, breakpoints para cards de catálogo y timeline de pedidos.

Accesibilidad: roles/labels, foco visible, semántica adecuada.


🧪 Pruebas y calidad

E2E (Playwright): flujos clave: login, añadir al carrito, checkout, ver estado del pedido, chat básico.

Lint/Format: se ejecutan en pre-commit con Husky + lint-staged.

Métricas: Lighthouse (performance, a11y, best practices).


🔄 CI/CD

Vercel: conecta el repo; cada PR crea un preview deployment.

GitHub Actions: job de pnpm install, pnpm build y (opcional) pnpm test:e2e en modo CI.

Variables de entorno gestionadas en Vercel Project Settings.

🗺️ Roadmap (frente al MVP)

MVP: auth + catálogo + pedidos + chat + estados + admin mínimo.

Pagos (SINPE/TC), reseñas, notificaciones email, mapa por zonas.

Autoasignación por cercanía, optimización de rutas, campañas internas, analítica.


🤝 Convenciones & Contribución

Commits: Conventional Commits (feat:, fix:, chore:…).

Branches: feat/<módulo>, fix/<área>, PRs con preview de Vercel.

Code style: hooks de pre-commit activos; evita push con lint roto.

📜 Licencia

Uso académico/educativo según lineamientos del curso. Ajustar si se publica de forma abierta.

📝 Notas

Asegúrate de alinear CORS, dominios de imágenes y URLs de Socket entre frontend y backend.

Revisa el cronograma y los módulos priorizados para cumplir hitos semanales.
