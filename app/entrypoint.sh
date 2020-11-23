#!/bin/sh

# if [ "$DATABASE" = "mysql" ]
# then
#     echo "Waiting for mysql..."

#     while ! nc -z $SQL_HOST $SQL_PORT; do
#       sleep 1
#     done

#     echo "MYSQL started"
# fi

python manage.py flush --no-input
# python manage.py inspectdb > patent_search/models.py
python manage.py makemigrations
python manage.py migrate
# python manage.py search_index --rebuild -f
python manage.py collectstatic --no-input --clear
echo "from django.contrib.auth import get_user_model; CustomUser = get_user_model();  CustomUser.objects.create_superuser('teamlab', 'admin@gmail.com', 'test1234')" | python manage.py shell

exec "$@"