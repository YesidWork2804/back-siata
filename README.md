# 🚚 SIATA Backend API

API REST para gestionar clientes, productos, bodegas terrestres, puertos marítimos y envíos logísticos terrestres y marítimos. Incluye autenticación JWT, documentación Swagger, persistencia con MySQL/TypeORM, validaciones de negocio y despliegue con Docker.

## 🧰 Tecnologías usadas

| Tecnología | Versión | Uso en el proyecto |
|---|---:|---|
| NestJS | `^10.4.15` | Framework principal para módulos, controllers, providers, guards e inyección de dependencias. |
| TypeScript | `^5.7.2` | Tipado estricto y compilación del backend. |
| TypeORM | `^0.3.28` | ORM para entidades, repositorios, relaciones y migraciones. |
| MySQL | `8` | Base de datos relacional usada por `docker-compose.yml`. |
| JWT | `@nestjs/jwt ^11.0.2` | Emisión de tokens de autenticación Bearer. |
| Passport JWT | `passport-jwt ^4.0.1` | Validación del token en requests protegidos. |
| Swagger/OpenAPI | `@nestjs/swagger ^7.4.2` | Documentación interactiva en `/api/docs`. |
| Docker | `node:20-alpine` | Imagen multi-stage para construir y ejecutar la API. |
| Docker Compose | Compose spec | Orquestación local de API y MySQL. |
| class-validator | `^0.15.1` | Validación declarativa de DTOs. |
| bcrypt | `^6.0.0` | Hash seguro de contraseñas. |

## 🏛️ Arquitectura

El proyecto usa una organización inspirada en arquitectura hexagonal. La idea central es separar reglas de negocio, casos de uso y detalles técnicos para que la API pueda crecer sin mezclar responsabilidades.

| Capa | Carpeta | Responsabilidad |
|---|---|---|
| Dominio | `src/domain/` | Entidades principales del negocio: `Client`, `Product`, `Warehouse`, `Port`, `User`, `LandShipment`, `MaritimeShipment`. |
| Aplicación | `src/application/` | Servicios de casos de uso y DTOs. Aquí viven reglas como descuentos, unicidad de guía y validaciones de negocio. |
| Infraestructura | `src/infrastructure/` | Controllers HTTP, módulos Nest, configuración, TypeORM, Swagger, guards, strategies y filtros globales. |

Decisión técnica: NestJS queda en la capa de infraestructura y aplicación, mientras que las entidades representan el modelo central. Esto permite mantener el negocio separado de detalles como HTTP, JWT o MySQL.

## 🧩 Patrones de diseño aplicados

| Patrón | Aplicación |
|---|---|
| Repository | TypeORM expone repositorios para consultar y persistir entidades sin escribir SQL en los servicios. |
| DTO | Cada endpoint recibe objetos específicos como `CreateClientDto` o `CreateLandShipmentDto`, evitando exponer entidades directamente como contrato de entrada. |
| Guard | `JwtAuthGuard` protege globalmente la API y deja públicas solo rutas como `/auth/login`, `/auth/register` y `/api/docs`. |
| Dependency Injection | NestJS inyecta servicios, repositorios, estrategias JWT y configuración, reduciendo acoplamiento entre clases. |

## ✅ Buenas prácticas

- Código organizado por módulos y responsabilidades.
- TypeScript estricto para reducir errores de tipos.
- Nombres descriptivos en entidades, servicios, DTOs y controllers.
- Funciones pequeñas con responsabilidad única.
- Validaciones de entrada con `class-validator`.
- Reglas de negocio en servicios, no en controllers.
- Filtro global de excepciones con respuestas estructuradas.
- Swagger como contrato visible de la API.
- Sin comentarios innecesarios: el código busca ser explícito por nombres y estructura.

## 📋 Requisitos previos

- Node.js 20 o superior.
- Docker.
- Docker Compose.
- MySQL, solo si se corre sin Docker.

## 🔐 Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `DB_HOST` | Host de MySQL. En Docker Compose la API usa `db`. | `localhost` |
| `DB_PORT` | Puerto de MySQL. | `3306` |
| `DB_NAME` | Nombre de la base de datos. | `siata` |
| `DB_USER` | Usuario de MySQL. | `postgres` |
| `DB_PASSWORD` | Password de MySQL. | `postgres` |
| `JWT_SECRET` | Secreto usado para firmar tokens JWT. | `change-me` |
| `PORT` | Puerto HTTP de la API. | `3000` |

## 🐳 Correr localmente con Docker

1. Crea el archivo `.env`:

```bash
cp .env.example .env
```

2. Para Docker Compose, puedes usar estos valores:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=siata
DB_USER=siata_user
DB_PASSWORD=siata_password
JWT_SECRET=change-me
PORT=3000
```

3. Levanta API y base de datos:

```bash
docker compose up --build
```

4. Abre la API:

```text
http://localhost:3000
```

5. Abre Swagger:

```text
http://localhost:3000/api/docs
```

Docker Compose crea una red interna. Por eso el servicio `api` se conecta a MySQL usando `DB_HOST=db`, que es el nombre del servicio de base de datos.

## 💻 Correr localmente sin Docker

1. Instala dependencias:

```bash
npm install
```

2. Crea el archivo `.env`:

```bash
cp .env.example .env
```

3. Asegúrate de tener MySQL corriendo y crea la base de datos:

```sql
CREATE DATABASE siata;
```

4. Ejecuta migraciones:

```bash
npm run migration:run
```

5. Inicia en modo desarrollo:

```bash
npm run start:dev
```

6. Compila para producción:

```bash
npm run build
```

7. Ejecuta producción:

```bash
npm run start:prod
```

## 🧭 Endpoints disponibles

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| `POST` | `/auth/register` | Registra usuario y retorna JWT. | No |
| `POST` | `/auth/login` | Autentica usuario y retorna JWT. | No |
| `GET` | `/clients` | Lista clientes. | Sí |
| `GET` | `/clients/:id` | Consulta cliente por id. | Sí |
| `POST` | `/clients` | Crea cliente. | Sí |
| `PATCH` | `/clients/:id` | Actualiza cliente. | Sí |
| `DELETE` | `/clients/:id` | Elimina cliente. | Sí |
| `GET` | `/products` | Lista productos. | Sí |
| `GET` | `/products/:id` | Consulta producto por id. | Sí |
| `POST` | `/products` | Crea producto. | Sí |
| `PATCH` | `/products/:id` | Actualiza producto. | Sí |
| `DELETE` | `/products/:id` | Elimina producto. | Sí |
| `GET` | `/warehouses` | Lista bodegas terrestres. | Sí |
| `GET` | `/warehouses/:id` | Consulta bodega por id. | Sí |
| `POST` | `/warehouses` | Crea bodega. | Sí |
| `PATCH` | `/warehouses/:id` | Actualiza bodega. | Sí |
| `DELETE` | `/warehouses/:id` | Elimina bodega. | Sí |
| `GET` | `/ports` | Lista puertos marítimos. | Sí |
| `GET` | `/ports/:id` | Consulta puerto por id. | Sí |
| `POST` | `/ports` | Crea puerto. | Sí |
| `PATCH` | `/ports/:id` | Actualiza puerto. | Sí |
| `DELETE` | `/ports/:id` | Elimina puerto. | Sí |
| `GET` | `/land-shipments` | Lista envíos terrestres. | Sí |
| `GET` | `/land-shipments/:id` | Consulta envío terrestre por id. | Sí |
| `POST` | `/land-shipments` | Crea envío terrestre. | Sí |
| `PATCH` | `/land-shipments/:id` | Actualiza envío terrestre. | Sí |
| `DELETE` | `/land-shipments/:id` | Elimina envío terrestre. | Sí |
| `GET` | `/maritime-shipments` | Lista envíos marítimos. | Sí |
| `GET` | `/maritime-shipments/:id` | Consulta envío marítimo por id. | Sí |
| `POST` | `/maritime-shipments` | Crea envío marítimo. | Sí |
| `PATCH` | `/maritime-shipments/:id` | Actualiza envío marítimo. | Sí |
| `DELETE` | `/maritime-shipments/:id` | Elimina envío marítimo. | Sí |
| `GET` | `/api/docs` | Documentación Swagger. | No |

Para llamar endpoints protegidos se debe enviar:

```http
Authorization: Bearer <token>
```

## 📦 Reglas de negocio implementadas

| Regla | Módulo | Comportamiento |
|---|---|---|
| Descuento terrestre 5% | `LandShipments` | Si `quantity > 10`, `discount_price = price * 0.95`; si no, `discount_price = price`. |
| Descuento marítimo 3% | `MaritimeShipments` | Si `quantity > 10`, `discount_price = price * 0.97`; si no, `discount_price = price`. |
| Cantidad positiva | Ambos envíos | Si `quantity <= 0`, se lanza `422 UnprocessableEntityException`. |
| Placa terrestre | `LandShipments` | `vehicle_plate` debe cumplir `ABC123`, regex `/^[A-Z]{3}[0-9]{3}$/`. |
| Flota marítima | `MaritimeShipments` | `fleet_number` debe cumplir `ABC1234D`, regex `/^[A-Z]{3}[0-9]{4}[A-Z]$/`. |
| Guía única | Ambos envíos | `guide_number` debe tener 10 caracteres alfanuméricos y no existir en base de datos. Si existe, retorna `422`. |

Decisión técnica: las reglas dependientes del negocio se validan en servicios, no solo en DTOs. Los DTOs validan forma básica del request; los servicios validan reglas que requieren contexto o consulta a base de datos.

## 🗺️ Diagrama E-R

El diagrama E-R está documentado en Mermaid:

[Ver diagrama E-R](./docs/er-diagram.md)

## 🧱 Cómo correr las migraciones

Generar una migración a partir de cambios en entidades:

```bash
npm run migration:generate
```

Ejecutar migraciones pendientes:

```bash
npm run migration:run
```

Revertir la última migración aplicada:

```bash
npm run migration:revert
```

Decisión técnica: `synchronize` está desactivado. El esquema de base de datos debe evolucionar mediante migraciones versionadas para evitar cambios automáticos peligrosos en producción.

## 🚀 Deploy en Render

1. Sube el proyecto a GitHub, GitLab o Bitbucket.
2. En Render, crea un nuevo Web Service.
3. Conecta el repositorio.
4. Selecciona Docker como entorno si Render no lo detecta automáticamente.
5. Render detecta el `Dockerfile` ubicado en la raíz del backend.
6. Configura las variables de entorno:

```text
DB_HOST
DB_PORT
DB_NAME
DB_USER
DB_PASSWORD
JWT_SECRET
PORT
```

7. Conecta la API a una base MySQL disponible desde Render.
8. Despliega el servicio.

Render construye la imagen con el `Dockerfile` y ejecuta:

```bash
node dist/main
```

## 🧠 Justificación de tecnologías

NestJS se eligió porque da estructura fuerte para APIs medianas o grandes: módulos, controllers, services, guards, pipes, filters e inyección de dependencias. Sobre Express puro, evita que la aplicación crezca como rutas sueltas difíciles de mantener.

TypeORM se eligió porque se integra bien con NestJS, permite usar entidades TypeScript, relaciones, repositorios y migraciones. Para este dominio logístico, donde hay relaciones claras entre clientes, productos, bodegas, puertos y envíos, un ORM relacional ayuda a expresar el modelo sin perder tipado.

MySQL se eligió porque el dominio es naturalmente relacional: los envíos pertenecen a clientes, productos y puntos logísticos. Las foreign keys, constraints y transacciones encajan bien con la necesidad de integridad de datos.

Docker se eligió para que el entorno sea reproducible. El `Dockerfile` multi-stage construye la app en una etapa y deja una imagen final más liviana con solo `dist/` y dependencias de producción. Docker Compose facilita desarrollo local levantando API y MySQL con un solo comando.

JWT se eligió porque permite autenticación stateless: el servidor no necesita guardar sesión por usuario. Cada request protegido lleva el token Bearer, el guard lo valida y Nest permite o rechaza el acceso.

Swagger/OpenAPI se eligió porque convierte la API en un contrato visible y testeable. Frontend, QA y otros consumidores pueden entender rutas, payloads y respuestas sin leer el código fuente.

## 👤 Autor y repositorio

Autor: Yesid

Repositorio: agrega aquí el link del repositorio cuando esté publicado.
