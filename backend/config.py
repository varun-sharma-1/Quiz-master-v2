class Config():
    DEBUG = False
    SQLALCHEMY_TRACK_MODIFICATIONS = True

class LocalDevelopmentConfig():
    SQLALCHEMY_DATABASE_URI = "sqlite:///qm2.sqlite3"
    DEBUG = True

    
    SECRET_KEY = "my-secretkey"
    SECURITY_PASSWORD_HASH = "bcrypt"
    SECURITY_PASSWORD_SALT = "this-is-a-password-salt"
    WTF_CSRF_ENABLED = False
    SECURITY_TOKEN_AUTHENTICATION_HEADER = "Token"
    
