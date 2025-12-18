This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## MVP — Control de stock para sonido (asambleas)
Objetivo del MVP

Poder saber qué artículos se sacaron, cuáles volvieron y cuáles faltan usando el celular.

1. Alcance exacto del MVP
Incluye

Escaneo de códigos (QR)

Registro de artículos

Marcar artículos como:

En uso

Devuelto

Listado de artículos

Detección de faltantes

No incluye (por ahora)

Usuarios y roles

Reportes

Fotos

Notificaciones

Permisos

2. Tecnología del MVP
Frontend (celular)

Next.js

PWA (se puede “instalar” en el celu)

html5-qrcode (escaneo con cámara)

TailwindCSS

Backend

Node.js + Express

API REST simple

SQLite (archivo único, fácil backup)

3. Modelo de datos (mínimo)
Tabla: items
id INTEGER PRIMARY KEY
code TEXT UNIQUE        -- lo que va en el QR
name TEXT               -- Ej: Cable XLR
category TEXT           -- Cable, Consola, Micrófono
status TEXT             -- available | in_use
notes TEXT

Tabla: movements
id INTEGER PRIMARY KEY
item_id INTEGER
action TEXT             -- checkout | return
date DATETIME

4. Pantallas del MVP
1️⃣ Pantalla principal

Botones grandes (uso con una mano):

Escanear artículo

Ver listado

2️⃣ Escaneo

Se abre la cámara

Se lee el QR

Si existe:

Muestra nombre y estado

Botón:

“Marcar como EN USO”

“Marcar como DEVUELTO”

Si no existe:

Formulario rápido para crear el artículo

3️⃣ Listado

Todos los artículos

Filtros:

En uso

Disponibles

Indicador visual de faltantes

5. Flujo real en la asamblea

Armado

Escanean cada artículo → queda “en uso”

Desarmado

Escanean al devolver → queda “disponible”

Resultado

Lo que no se devolvió queda marcado automáticamente

6. Estructura básica del proyecto
/frontend
  /app
    /scan
    /items
    page.tsx
/backend
  server.js
  database.sqlite

7. Generación de QR

El QR solo contiene algo como:

CAB-001
MIC-003
CONS-001


Se imprimen y se pegan físicamente.

8. Siguiente paso inmediato (recomendado)

Empezar por:

Definir categorías

Crear backend + DB

Endpoint:

GET /item/:code

POST /item

POST /checkout

POST /return