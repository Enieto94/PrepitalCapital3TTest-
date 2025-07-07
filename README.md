# Microservicios Products & Inventory + Frontend Svelte

## 📝 Descripción
Microservicios con autenticación básica y JSON API. Frontend en Svelte para gestión de productos e inventarios.

## 🔧 Tecnologías
- TypeScript, Express, Prisma
- PostgreSQL
- Docker, Docker Compose
- SvelteKit
- Axios + axios-retry
- Swagger

## 🚀 Ejecución
```bash
docker-compose up --build
```

Accede a:
- Products: http://localhost:3001/docs
- Inventory: http://localhost:3002/docs
- Frontend: http://localhost:5173

## Funcionalidades
- CRUD productos
- Consultar y actualizar inventario
- Frontend responsivo
## Diagrama 
[Svelte Frontend]
      |
[NGINX opcional]
      |
-------------------------------
| [products-service] <--> [Postgres]
|        |
|   REST (API Key)
|        |
| [inventory-service] <--> [Postgres]
-------------------------------
## 🧪 Pruebas
- Backend: Jest
- Frontend: Vitest
## Ejemplos request 
Crear producto
POST http://localhost:3001/products
Headers:
  x-api-key: 4eb07053-1eb8-4cd0-969a-c163456ff4c1
Content-Type: application/json

Body:
{
  "name": "Laptop Dell",
  "description": "Intel i7, 16GB RAM",
  "price": 2500
}

## obtener producto 
GET http://localhost:3001/products/1
Headers:
  x-api-key: 4eb07053-1eb8-4cd0-969a-c163456ff4c1

  ## actualizar producto

  PATCH http://localhost:3001/products/1
Headers:
  x-api-key: 4eb07053-1eb8-4cd0-969a-c163456ff4c1
Content-Type: application/json

Body:
{
  "name": "Laptop Dell XPS",
  "price": 2600
}

## Eliminar producto
DELETE http://localhost:3001/products/1
Headers:
  x-api-key: 4eb07053-1eb8-4cd0-969a-c163456ff4c1

## consultar inventario
GET http://localhost:3002/inventory/1
Headers:
  x-api-key: 4eb07053-1eb8-4cd0-969a-c163456ff4c1

## Actualizar inventario con compra

PATCH http://localhost:3002/inventory/1
Headers:
  x-api-key: 4eb07053-1eb8-4cd0-969a-c163456ff4c1
Content-Type: application/json

Body:
{
  "quantity": 9
}

## Proceso de compra

Usuario Frontend realiza GET /products/:id al Products Service

Products Service responde con datos del producto

Usuario Frontend realiza GET /inventory/:productId al Inventory Service

Inventory Service realiza GET /products/:id al Products Service para validar existencia

Products Service responde con producto válido

Inventory Service consulta base de datos y responde cantidad disponible

Usuario Frontend realiza PATCH /inventory/:productId con cantidad actualizada

Inventory Service valida producto con Products Service

Products Service confirma existencia

Inventory Service actualiza inventario en DB y emite log
## 👤 Autor
Edwin Nieto