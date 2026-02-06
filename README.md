# Sistema de Gestión Académica - Evaluación Práctica

Sistema de reportes académicos desarrollado con **Next.js** y **PostgreSQL** que proporciona análisis de desempeño estudiantil, asistencia y carga docente.

## Características

- **Detección de Alumnos en Riesgo** - Sistema de alerta temprana
- **Rendimiento por Curso** - Análisis de aprobación/reprobación
- **Asistencia por Grupo** - Monitoreo de participación estudiantil
- **Ranking de Alumnos** - Top 10 de mejores estudiantes
- **Carga Académica Docente** - Distribución de grupos y alumnos

## Stack Tecnológico

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS 4
- **Validación**: Zod

### Backend
- **Base de Datos**: PostgreSQL 15
- **ORM/Cliente**: node-postgres (pg)
- **Containerización**: Docker & Docker Compose

## Estructura del Proyecto

```
evaluacion-practica/
├── db/                          # Scripts SQL
│   ├── 00-roles.sql            # Configuración de roles y permisos
│   ├── 01-schema.sql           # Esquema de tablas
│   ├── 02-migrate.sql          # Migraciones
│   ├── 03-seed.sql             # Datos de prueba
│   ├── 04-reports_vw.sql       # 5 vistas de reportes
│   └── 05-indexes.sql          # Índices de optimización
├── frontend/                    # Aplicación Next.js
│   ├── src/
│   │   ├── app/
│   │   │   ├── reports/        # Páginas de reportes
│   │   │   │   ├── at-risk/
│   │   │   │   ├── attendance/
│   │   │   │   ├── performance/
│   │   │   │   ├── ranking/
│   │   │   │   └── teacher-load/
│   │   │   └── page.tsx        # Página principal
│   │   └── lib/
│   │       ├── db.ts           # Conexión PostgreSQL
│   │       └── definitions.ts  # Tipos TypeScript
│   └── package.json
├── docker-compose.yml           # Orquestación de servicios
├── .env.example                 # Plantilla de variables de entorno
└── README.md
```

## Instalación y Configuración

### Prerrequisitos

- **Docker** y **Docker Compose** instalados
- **Node.js** 20+ (si se ejecuta fuera de Docker)
- **PostgreSQL 15+** (opcional, si no se usa Docker)

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd evaluacion-practica
```

### 2. Configurar Variables de Entorno

Copia el archivo de ejemplo y configura las variables:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:

```env
# PostgreSQL (superusuario)
POSTGRES_DB=school_db
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin123

# Usuario de aplicación
APP_DB_USER=app_user
APP_DB_PASSWORD=app_pass

# URL de conexión
DATABASE_URL=postgresql://app_user:app_pass@db:5432/school_db
```

> **Nota**: Para desarrollo local (sin Docker), cambia `@db:5432` por `@localhost:5432`

### 3. Iniciar con Docker Compose

Levanta todos los servicios (PostgreSQL + Frontend):

```bash
docker-compose up -d
```

Esto creará:
- **Base de datos PostgreSQL** en `localhost:5432`
- **Aplicación Next.js** en `http://localhost:3000`
- Automáticamente ejecuta los scripts SQL en `/db` para inicializar el esquema

### 4. Verificar Instalación

Accede a la aplicación:

```
http://localhost:3000
```

Deberías ver el dashboard con enlaces a los 5 reportes.

## Desarrollo Local (Sin Docker)

### 1. Instalar Dependencias

```bash
cd frontend
npm install
```

### 2. Configurar Base de Datos

Ejecuta los scripts SQL manualmente en PostgreSQL:

```bash
psql -U postgres -f db/00-roles.sql
psql -U postgres -d school_db -f db/01-schema.sql
psql -U postgres -d school_db -f db/02-migrate.sql
psql -U postgres -d school_db -f db/03-seed.sql
psql -U postgres -d school_db -f db/04-reports_vw.sql
psql -U postgres -d school_db -f db/05-indexes.sql
```

### 3. Actualizar DATABASE_URL

En `.env`, cambia la URL para apuntar a localhost:

```env
DATABASE_URL=postgresql://app_user:app_pass@localhost:5432/school_db
```

### 4. Ejecutar Servidor de Desarrollo

```bash
cd frontend
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Vistas de Reportes

### 1. Alumnos en Riesgo (`/reports/at-risk`)

**Funcionalidad**: Identifica estudiantes con promedio < 7 o asistencia < 80%

**Parámetros**:
- `query` - Búsqueda por nombre o email
- `page` - Número de página
- `limit` - Registros por página

**Ejemplo**:
```
http://localhost:3000/reports/at-risk?query=Juan&page=1
```

### 2. Asistencia por Grupo (`/reports/attendance`)

**Funcionalidad**: Muestra porcentaje promedio de asistencia por curso

**Parámetros**:
- `term` - Periodo académico (ej: `2025-1`)

**Ejemplo**:
```
http://localhost:3000/reports/attendance?term=2025-1
```

### 3. Rendimiento por Curso (`/reports/performance`)

**Funcionalidad**: Analiza promedio general, aprobados y reprobados por curso

**Parámetros**:
- `term` - Periodo académico

**Ejemplo**:
```
http://localhost:3000/reports/performance?term=2025-1
```

### 4. Ranking de Alumnos (`/reports/ranking`)

**Funcionalidad**: Top 10 estudiantes con mejores promedios

**Parámetros**: Ninguno (lista estática)

**Ejemplo**:
```
http://localhost:3000/reports/ranking
```

### 5. Carga Académica por Docente (`/reports/teacher-load`)

**Funcionalidad**: Muestra grupos y total de estudiantes por profesor

**Parámetros**:
- `term` - Periodo académico

**Ejemplo**:
```
http://localhost:3000/reports/teacher-load?term=2025-1
```

## Esquema de Base de Datos

### Tablas Principales

| Tabla | Descripción | Relaciones |
|-------|-------------|------------|
| **students** | Información de estudiantes | → enrollments |
| **teachers** | Datos de profesores | → groups |
| **courses** | Catálogo de cursos | → groups |
| **groups** | Grupos de clase | courses, teachers → enrollments |
| **enrollments** | Inscripciones | students, groups → grades, attendance |
| **grades** | Calificaciones (partial1, partial2, final_exam) | enrollments |
| **attendance** | Registro de asistencia | enrollments |

### Vistas SQL Creadas

| Vista | Descripción |
|-------|-------------|
| `vw_students_at_risk` | Alumnos con bajo rendimiento o ausentismo |
| `vw_group_attendance` | Promedio de asistencia por grupo |
| `vw_course_performance` | Estadísticas de aprobación/reprobación |
| `vw_student_ranking` | Ranking de estudiantes por promedio |
| `vw_teacher_load` | Carga académica de profesores |

## Scripts Disponibles

En el directorio `frontend/`:

```bash
npm run dev      # Servidor de desarrollo (localhost:3000)
npm run build    # Compilar para producción
npm run start    # Ejecutar build de producción
npm run lint     # Verificar código con ESLint
```

## Comandos Docker

```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Reiniciar servicios
docker-compose restart

# Reconstruir contenedores
docker-compose up -d --build

# Acceder a PostgreSQL
docker exec -it bda-postgres-db psql -U admin -d school_db
```

## Seguridad

- **Prepared Statements**: Uso de parámetros `$1, $2` para prevenir SQL injection
- **Roles de usuario**: Separación entre admin (`admin`) y aplicación (`app_user`)
- **Permisos limitados**: `app_user` solo tiene SELECT en vistas, no acceso directo a tablas
- **Producción**: Cambiar contraseñas por defecto en `.env`

## Datos de Prueba

El script `03-seed.sql` incluye:
- 7 estudiantes de ejemplo
- 2 profesores
- 2 cursos (Desarrollo Web, Bases de Datos)
- 7 inscripciones
- Calificaciones y asistencias de muestra

## Solución de Problemas

### Error: "Cannot connect to database"

**Solución**:
1. Verifica que PostgreSQL esté corriendo: `docker ps`
2. Confirma que el puerto 5432 esté disponible
3. Revisa credenciales en `.env`

### Error: "relation vw_students_at_risk does not exist"

**Solución**:
```bash
docker exec -it bda-postgres-db psql -U admin -d school_db -f /docker-entrypoint-initdb.d/04-reports_vw.sql
```

### Error: "Port 3000 already in use"

**Solución**:
```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "3001:3000"  # Usa 3001 en lugar de 3000
```

## Documentación Adicional

- [Análisis Técnico de Vistas](./analisis_vistas_proyecto.md) - Documento detallado con justificación de cada implementación
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Views](https://www.postgresql.org/docs/current/sql-createview.html)

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-vista`)
3. Commit tus cambios (`git commit -m 'Agregar nueva vista de ...'`)
4. Push a la rama (`git push origin feature/nueva-vista`)
5. Abre un Pull Request

## Licencia

Este proyecto es de uso educativo para la evaluación práctica de Bases de Datos Avanzadas.

---

**Desarrollado usando Next.js y PostgreSQL**
