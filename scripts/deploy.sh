cd /home/django_user/priority_queue
mkdir -p site

cp ./scripts/uwsgi.service /etc/systemd/system/uwsgi.service
cp ./scripts/priority_queue.conf /etc/nginx/conf.d/priority_queue.conf

python -m venv ./venv
source ./venv/bin/activate
pip install -r requirements.txt

cp ./scripts/uwsgi.ini backend

systemctl daemon-reload


systemctl restart uwsgi
systemctl restart nginx