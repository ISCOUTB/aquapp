# Aquapp Platform

AquApp is a web-based platform created to carry out the monitoring geolocated information for IoT.

### Setup for production.

You need docker and docker-compose installed on your system.

Check if you already been created the following folders (backups, grafana, influxd, imports and aquappdatabase):

    mkdir -p data/{grafana,influxd}

Please the SSL certificates in:

    frontend/config/utb.edu.co.crt
    frontend/config/utb.edu.co.key

Just open the command prompt and cd to the root of the project, then:

    docker-compose up --build

### Configuration files ###

**config/001_users:**

    db.createUser({user: "usuario", pwd: "password", roles: [{role: "readWrite", db: "databasename"}]})


**config/mongo.env:**

    MONGO_INITDB_ROOT_USERNAME=usuario
    MONGO_INITDB_ROOT_PASSWORD=password
    MONGO_INITDB_DATABASE=databasename


**api/.env**

    SECRET_KEY=""
    ADMIN_USER=""
    ADMIN_EMAIL="@.com"
    ADMIN_PASS=""
    DB_HOST=""
    DB_PORT=""
    DB_USER=""
    DB_PASSWORD=""
    DB_DATABASE=""
