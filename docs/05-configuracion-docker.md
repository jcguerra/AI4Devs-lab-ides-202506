# Configuración de Servicios Docker - Sistema ATS

## Resumen de Servicios

El sistema ATS utiliza Docker Compose para orquestar los siguientes servicios:

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Docker Environment                           │
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐│
│  │ PostgreSQL  │  │    MinIO    │  │   Mailpit   │  │ MinIO Init  ││
│  │             │  │             │  │             │  │  (Helper)   ││
│  │ Port: 5432  │  │Port:9000/01 │  │Port:1025/25 │  │   (Temp)    ││
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

## PostgreSQL Database

### Configuración
```yaml
db:
  container_name: ats-db
  image: postgres:15
  ports:
    - "5432:5432"
  environment:
    POSTGRES_USER: LTIdbUser
    POSTGRES_PASSWORD: D1ymf8wyQEGthFR1E9xhCq
    POSTGRES_DB: LTIdb
```

### Conexión
- **Host**: localhost
- **Puerto**: 5432
- **Usuario**: LTIdbUser
- **Contraseña**: D1ymf8wyQEGthFR1E9xhCq
- **Base de datos**: LTIdb

### Comandos útiles
```bash
# Conectar a la base de datos
docker exec -it ats-db psql -U LTIdbUser -d LTIdb

# Backup de la base de datos
docker exec ats-db pg_dump -U LTIdbUser LTIdb > backup.sql

# Restaurar backup
docker exec -i ats-db psql -U LTIdbUser -d LTIdb < backup.sql
```

## MinIO Object Storage

### Configuración
```yaml
minio:
  container_name: ats-minio
  image: minio/minio:latest
  ports:
    - "9000:9000"  # API MinIO
    - "9001:9001"  # Console Web
  environment:
    MINIO_ROOT_USER: minioadmin
    MINIO_ROOT_PASSWORD: minioadmin
```

### Acceso
- **API MinIO**: http://localhost:9000
- **Console Web**: http://localhost:9001
- **Usuario**: minioadmin
- **Contraseña**: minioadmin

### Configuración inicial
El servicio `minio-init` se encarga automáticamente de:
1. Crear el bucket `ats-bucket`
2. Configurar políticas de acceso público
3. Preparar el entorno para desarrollo

### Comandos útiles con MC (MinIO Client)
```bash
# Configurar alias para MinIO local
mc config host add local http://localhost:9000 minioadmin minioadmin

# Listar buckets
mc ls local

# Listar archivos en bucket
mc ls local/ats-bucket

# Subir archivo
mc cp archivo.pdf local/ats-bucket/candidates/1/cv/

# Descargar archivo
mc cp local/ats-bucket/candidates/1/cv/archivo.pdf ./downloads/

# Eliminar archivo
mc rm local/ats-bucket/candidates/1/cv/archivo.pdf

# Generar URL pre-firmada (válida por 1 hora)
mc share download local/ats-bucket/candidates/1/cv/archivo.pdf --expire=1h
```

### Estructura de Buckets
```
ats-bucket/
├── candidates/
│   ├── {candidateId}/
│   │   ├── cv/
│   │   │   ├── {timestamp}_cv_original.pdf
│   │   │   └── {timestamp}_cv_updated.pdf
│   │   ├── documents/
│   │   │   ├── {timestamp}_cover_letter.pdf
│   │   │   └── {timestamp}_certificates.pdf
│   │   └── photos/
│   │       └── {timestamp}_profile.jpg
├── temp/
│   └── uploads/
└── templates/
    ├── cv_templates/
    └── email_templates/
```

## Mailpit Email Testing

### Configuración
```yaml
mailpit:
  container_name: ats-mailpit
  image: axllent/mailpit:latest
  ports:
    - "1025:1025"  # SMTP Server
    - "8025:8025"  # Web Interface
```

### Acceso
- **Web Interface**: http://localhost:8025
- **SMTP Server**: localhost:1025

### Configuración en aplicación
```env
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
SMTP_FROM=noreply@ats-system.com
```

### Características
- **Captura todos los emails**: No se envían emails reales
- **Interface Web**: Visualiza emails enviados en tiempo real
- **API REST**: Acceso programático a emails capturados
- **Búsqueda**: Filtros por destinatario, asunto, fecha
- **Exportación**: Descarga emails en formato EML

### API de Mailpit
```bash
# Listar emails
curl http://localhost:8025/api/v1/messages

# Obtener email específico
curl http://localhost:8025/api/v1/message/{id}

# Eliminar todos los emails
curl -X DELETE http://localhost:8025/api/v1/messages

# Estadísticas
curl http://localhost:8025/api/v1/info
```

## Comandos Docker Compose

### Iniciar servicios
```bash
# Iniciar todos los servicios
docker-compose up -d

# Iniciar servicio específico
docker-compose up -d db
docker-compose up -d minio
docker-compose up -d mailpit

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de servicio específico
docker-compose logs -f minio
```

### Gestión de servicios
```bash
# Detener servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v

# Reiniciar servicio específico
docker-compose restart minio

# Reconstruir servicios
docker-compose build --no-cache

# Ver estado de servicios
docker-compose ps

# Ver uso de recursos
docker stats
```

### Limpieza y mantenimiento
```bash
# Eliminar contenedores parados
docker container prune

# Eliminar imágenes no utilizadas
docker image prune

# Eliminar volúmenes no utilizados
docker volume prune

# Limpieza completa del sistema
docker system prune -a --volumes
```

## Variables de Entorno

### Para Desarrollo (.env)
```env
# Database
DATABASE_URL="postgresql://LTIdbUser:D1ymf8wyQEGthFR1E9xhCq@localhost:5432/LTIdb"

# MinIO
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=ats-bucket
MINIO_USE_SSL=false

# Email (Mailpit)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
SMTP_FROM=noreply@ats-system.com
MAILPIT_UI_URL=http://localhost:8025
```

## Troubleshooting

### Problemas comunes

#### MinIO no inicia
```bash
# Verificar logs
docker-compose logs minio

# Limpiar datos y reiniciar
docker-compose down -v
docker-compose up -d minio
```

#### Mailpit no recibe emails
```bash
# Verificar configuración SMTP
docker-compose logs mailpit

# Probar conexión SMTP
telnet localhost 1025
```

#### PostgreSQL problemas de conexión
```bash
# Verificar estado del contenedor
docker-compose ps db

# Verificar logs
docker-compose logs db

# Reiniciar base de datos
docker-compose restart db
```

### Health Checks

#### Verificar servicios
```bash
# PostgreSQL
docker exec ats-db pg_isready -U LTIdbUser

# MinIO
curl http://localhost:9000/minio/health/live

# Mailpit
curl http://localhost:8025/api/v1/info
```

## Configuración para Producción

### Consideraciones de seguridad
1. **Cambiar credenciales por defecto**
2. **Usar variables de entorno seguras**
3. **Configurar SSL/TLS**
4. **Implementar backups automáticos**
5. **Monitoreo y alertas**

### Migración a servicios cloud
- **MinIO → AWS S3**: Cambiar configuración de SDK
- **Mailpit → SendGrid/AWS SES**: Actualizar transporter de email
- **PostgreSQL → AWS RDS**: Actualizar DATABASE_URL

## Monitoreo y Observabilidad

### Métricas importantes
- **PostgreSQL**: Conexiones activas, queries lentas, tamaño DB
- **MinIO**: Espacio utilizado, operaciones I/O, latencia
- **Mailpit**: Emails enviados, errores de envío

### Logs centralizados
```bash
# Ver todos los logs con timestamps
docker-compose logs -t

# Filtrar logs por nivel
docker-compose logs | grep ERROR
docker-compose logs | grep WARN
``` 