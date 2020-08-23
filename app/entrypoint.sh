#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

python manage.py flush --no-input
python manage.py migrate
echo "from django.contrib.auth import get_user_model; CustomUser = get_user_model();  CustomUser.objects.create_superuser('admin', 'admin@gmail.com', 'teamlab')" | python manage.py shell

exec "$@"