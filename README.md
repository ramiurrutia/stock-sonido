# MVP — Control de stock para sonido (asambleas)

## Objetivo del MVP

Poder saber qué artículos se sacaron, cuáles volvieron y cuáles faltan usando el celular.

## 1. Alcance exacto del MVP

### Incluye

- Escaneo de códigos (QR)
- Registro de artículos
- Marcar artículos como:
  - En uso
  - Guardado
- Listado de artículos
- Detección de faltantes

## 2. Tecnología del MVP

### Frontend

- Next.js
- PWA
- `html5-qrcode` (escaneo con cámara)
- TailwindCSS

### Backend

- Node.js + Express
- API REST simple
- SQLite (archivo único, fácil backup)

## 3. Modelo de datos (mínimo)

### Tabla: `items`

```sql
id INTEGER PRIMARY KEY
code TEXT UNIQUE        -- contenido del QR
name TEXT               -- EJ: "Cable XLR 3m"
category TEXT           -- Cable, Consola, Micrófono
status TEXT             -- available | in_use
notes TEXT              -- notas adicionales
```

### Tabla: `transactions`

```sql
id INTEGER PRIMARY KEY
item_id INTEGER         -- FK a items.id
action TEXT             -- checkout | checkin
timestamp DATETIME      -- cuándo se hizo la acción
user TEXT               -- quién hizo la acción (opcional)
```
### Endpoints:
```
GET /item/:code

POST /item

POST /checkout

POST /return
```
## 4. Flujo de usuario

1. Usuario abre la PWA en su celular.
2. Escanea el código QR del artículo.
3. Si el artículo no está registrado, se le pide que ingrese el nombre y categoría.
4. Usuario marca el artículo como "En uso" o "Guardado".
5. El sistema registra la transacción y actualiza el estado del artículo.
6. Usuario puede ver un listado de artículos y su estado actual.
7. Al finalizar, usuario puede revisar qué artículos faltan.

## 5. Pantallas del MVP

### Pantalla principal

1.  Botones grandes (uso con una mano):

    - Escanear artículo
    - Ver listado

2.  Escaneo

    - Se abre la cámara
    - Se lee el QR

    Si existe:

    - Muestra nombre y estado
    - Botones:
      - Marcar como EN USO
      - Marcar como GUARDADO

    Si no existe:

    - Formulario rápido para crear el artículo

3.  Listado

- Todos los artículos

- Filtros:
  - En uso
  - Disponibles
  - Indicador visual de faltantes

6. Flujo real en la asamblea
### Armado
  - Se escanea cada artículo → queda en uso

### Desarmado

  - Se escanea al devolver → queda disponible

### Resultado
  - Lo que no se devolvió queda marcado automáticamente como faltante

## 7. Estructura del proyecto

```
/frontend
  /app
    /scan
    /items
    page.tsx

/backend
  server.js
  database.sqlite
  /routes
    items.js
    transactions.js
```

## 8. Generación de QR

El QR solo contiene un identificador simple:

```
XLR-007
MIC-003
POT-001
```
Se imprimen y se pegan físicamente en los artículos.