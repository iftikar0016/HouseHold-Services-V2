from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin

db = SQLAlchemy()

class ServiceRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(150))
    professional_name = db.Column(db.String(150))
    service_name = db.Column(db.String(150))
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    professional_id = db.Column(db.Integer, db.ForeignKey('professional.id'))
    date_of_request = db.Column(db.DateTime)
    date_of_completion = db.Column(db.DateTime)
    status = db.Column(db.String(25), default="requested")
    remarks = db.Column(db.String(250))
    address= db.Column(db.String(200))

class User(db.Model, UserMixin):
    id=db.Column(db.Integer, primary_key=True)
    email= db.Column(db.String(), nullable=False )
    password= db.Column(db.String(), nullable=False)
    is_blocked= db.Column(db.Boolean, default=False)
    professional = db.relationship('Professional',uselist=False, back_populates='user')
    customer = db.relationship('Customer',uselist=False, back_populates='user')
        # flask-security specific
    fs_uniquifier = db.Column(db.String, unique = True, nullable = False)
    active = db.Column(db.Boolean, default = True)
    roles = db.Relationship('Role', backref = 'bearers', secondary='user_roles')

class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String, unique = True, nullable  = False)
    description = db.Column(db.String, nullable = False)

class UserRoles(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))

class Customer(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable = False)
    user = db.relationship('User', back_populates='customer')
    fullname= db.Column(db.String(80))
    address= db.Column(db.String(200))
    pincode=db.Column(db.Integer)

    active = db.Column(db.Boolean, default = True)
    is_blocked= db.Column(db.Boolean, default=False)

class Professional(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable = False)
    user = db.relationship('User', back_populates='professional')
    fullname= db.Column(db.String(80))
    address= db.Column(db.String(200))
    pincode=db.Column(db.Integer)
    phone_no=db.Column(db.Integer)
    experience=db.Column(db.Integer)
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'))

    active = db.Column(db.Boolean, default = True)
    is_blocked= db.Column(db.Boolean, default=False)
    
class Service(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(250))
    time_required = db.Column(db.String(), default='2 Days')