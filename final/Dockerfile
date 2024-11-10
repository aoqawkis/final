

FROM python:3.12


WORKDIR /app


COPY . .


RUN apt-get update && apt-get install -y \


    odbc-postgresql \


    unixodbc \


    unixodbc-dev \


    --no-install-recommends \


    && rm -rf /var/lib/apt/lists/*


RUN pip install -r requirements.txt


CMD ["python", "app.py"]