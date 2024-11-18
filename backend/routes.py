from flask import current_app as app, jsonify, render_template,  request
from flask_security import auth_required, verify_password, hash_password
from backend.models import Customer, Professional, db

datastore = app.security.datastore

@app.route('/')
def home():
    return render_template('index.html')

@app.get('/protected')
@auth_required('token')
def protected():
    return '<h1> only accessible by auth user</h1>'

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message" : "invalid inputs"}), 404
    
    user = datastore.find_user(email = email)

    if not user:
        return jsonify({"message" : "invalid email"}), 404
    
    if verify_password(password, user.password):
        return jsonify({'token' : user.get_auth_token(), 'email' : user.email, 'role' : user.roles[0].name, 'id' : user.id})
    
    return jsonify({'message' : 'password wrong'}), 400


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    if not email or not password or role not in ['customer', 'professional']:
        return jsonify({"message" : "invalid inputs"}), 404
    
    user = datastore.find_user(email = email)

    if user:
        return jsonify({"message" : "user already exists"}), 404

    try :
        user = datastore.create_user(email = email, password = hash_password(password), active = True)
        datastore.add_role_to_user(user, role)  
        db.session.commit()
        if user.roles[0].name == 'professional':
            professional = Professional(user_id=user.id)
            db.session.add(professional)
            db.session.commit()
            return jsonify({"message" : "prof created"}), 200
        
        customer = Customer(user_id=user.id)
        db.session.add(customer)
        db.session.commit()
        return jsonify({"message" : "customer created"}), 200
    except:
        db.session.rollback()
        return jsonify({"message" : "error creating user"}), 400