from flask import Flask
from backend.config import LocalDevelopmentConfig
from backend.models import db, User, Role
from flask_security import Security, SQLAlchemyUserDatastore, auth_required

def createApp():
    app = Flask(__name__)

    app.config.from_object(LocalDevelopmentConfig)

    db.init_app(app)

    datastore = SQLAlchemyUserDatastore(db, User, Role)

    app.security = Security(app, datastore=datastore)
    app.app_context().push()

    return app

app = createApp()

import backend.initial_data

@app.get('/')
def home():
    return '<h1> home page </h1>'



        
if (__name__ == '__main__'):
    app.run(debug=True)