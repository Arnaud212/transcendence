FROM python:3.9-slim

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir virtualenv

RUN rm -rf venv && virtualenv venv

COPY requirements.txt .
RUN /bin/bash -c "source venv/bin/activate && pip install -r requirements.txt"

EXPOSE 8000

CMD ["/bin/bash", "-c", "source venv/bin/activate && python manage.py makemigrations && python manage.py migrate && python manage.py collectstatic --noinput && python manage.py runserver 0.0.0.0:8000"]
