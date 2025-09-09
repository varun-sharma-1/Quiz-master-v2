from flask import Flask 
from backend.database import db
from backend.models import db, User, Role
from backend.resources import api
from backend.config import LocalDevelopmentConfig
from flask_security import Security, SQLAlchemyUserDatastore, hash_password
from werkzeug.security import check_password_hash, generate_password_hash
from flask_session import Session 
from backend.celery_init import celery_init_app
from flask_mail import Mail, Message
from celery.schedules import crontab

def create_app():
    app = Flask(__name__)
    app.config.from_object(LocalDevelopmentConfig)
    db.init_app(app)
    api.init_app(app)
    datastore = SQLAlchemyUserDatastore(db, User, Role)
    app.security = Security(app, datastore)
    app.app_context().push()
    app.config['SESSION_TYPE'] = 'filesystem'
    app.config["MAIL_SERVER"] = "localhost"
    app.config["MAIL_PORT"] = 1025
    app.config["MAIL_USE_TLS"] = False
    app.config["MAIL_USE_SSL"] = False
    app.config["MAIL_USERNAME"] = None  
    app.config["MAIL_PASSWORD"] = None  
    app.config["MAIL_DEFAULT_SENDER"] = "admin@gmail.com"
    Session(app)
    return app

app = create_app()
celery = celery_init_app(app)
mail = Mail(app)

with app.app_context():
    db.create_all()

    app.security.datastore.find_or_create_role(name = "admin", description = "admin of app")
    app.security.datastore.find_or_create_role(name = "user", description = "user of app")
    db.session.commit()

    if not app.security.datastore.find_user(email = "admin@gmail.com"):
        app.security.datastore.create_user(
            email = "admin@gmail.com",
            password = generate_password_hash("9958929932"),
            fullname = "admin",
            qualification = "superadmin",
            dob = 2001,
            roles = ['admin']
        )

    db.session.commit()




from backend.routes import *




if __name__ == "__main__":
    app.run()