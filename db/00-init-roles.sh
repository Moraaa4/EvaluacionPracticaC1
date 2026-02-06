if [ -z "$APP_DB_PASSWORD" ]; then
    echo "ERROR: La variable APP_DB_PASSWORD no está definida"
    exit 1
fi

export PGPASSWORD="$POSTGRES_PASSWORD"

psql -v APP_DB_PASSWORD="'$APP_DB_PASSWORD'" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /docker-entrypoint-initdb.d/00-roles.sql

echo "✓ Roles creados con credenciales seguras desde variables de entorno"
