# SIATA Backend

Backend REST construido con NestJS, TypeORM y MySQL.

## Correr localmente con Docker Compose

1. Crea el archivo `.env` desde la plantilla:

```bash
cp .env.example .env
```

2. Para Docker Compose, asegúrate de usar credenciales válidas para MySQL. Un ejemplo simple:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=siata
DB_USER=siata_user
DB_PASSWORD=siata_password
JWT_SECRET=change-me
PORT=3000
```

3. Construye y levanta los servicios:

```bash
docker compose up --build
```

4. La API queda disponible en:

```text
http://localhost:3000
```

5. La documentación Swagger queda disponible en:

```text
http://localhost:3000/api/docs
```

## Servicios de Docker Compose

`api` construye la aplicación desde el `Dockerfile`, compila TypeScript y ejecuta `node dist/main`.

`db` levanta MySQL 8, crea la base usando `DB_NAME` y configura usuario/password usando `DB_USER` y `DB_PASSWORD`.

Dentro de Docker, la API usa `DB_HOST=db` porque `db` es el nombre del servicio MySQL dentro de la red de Docker Compose.

## Desplegar en Render con Dockerfile

1. Sube este repositorio a GitHub, GitLab o Bitbucket.
2. En Render, crea un nuevo servicio web.
3. Conecta el repositorio.
4. Selecciona Docker como runtime si Render no lo detecta automáticamente.
5. Render usará el `Dockerfile` de la raíz para construir la imagen.
6. Configura las variables de entorno en Render:

```text
DB_HOST
DB_PORT
DB_NAME
DB_USER
DB_PASSWORD
JWT_SECRET
PORT
```

7. Conecta `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` y `DB_PASSWORD` a una base MySQL externa o administrada.
8. Despliega el servicio.

Render detecta el `Dockerfile`, ejecuta sus stages y arranca el contenedor usando el `CMD` definido:

```bash
node dist/main
```
