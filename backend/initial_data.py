from flask import current_app as app
from backend.models import db
from flask_security import SQLAlchemyUserDatastore, hash_password

with app.app_context():
    db.create_all()

    userdatastore : SQLAlchemyUserDatastore = app.security.datastore

    userdatastore.find_or_create_role(name = 'admin', description = 'superuser')
    userdatastore.find_or_create_role(name = 'customer', description = 'general customer')
    userdatastore.find_or_create_role(name = 'professional', description = 'service professional')

    if not ( userdatastore.find_user(email = 'admin@email')):
        userdatastore.create_user(email = 'admin@email', password = hash_password('pass'), roles = ['admin'] )

    if not ( userdatastore.find_user(email = 'customer1@email')):
        userdatastore.create_user(email = 'customer1@email', password = hash_password('pass'), roles = ['customer'] ) 

    if not ( userdatastore.find_user(email = 'professional1@email')):
        userdatastore.create_user(email = 'professional1@email', password = hash_password('pass'), roles = ['professional'] )

    db.session.commit()