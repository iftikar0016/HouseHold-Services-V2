from datetime import datetime
from flask import current_app as app, jsonify, render_template,  request
from flask_security import auth_required, verify_password, hash_password
from backend.models import Customer, Professional, Service, ServiceRequest, db

datastore = app.security.datastore
cache = app.cache


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
    fullname = data.get('fullname') 
    address = data.get('address') 
    pincode = data.get('pincode')

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
            service=data.get('service')
            phone_no=data.get('phone')
            professional = Professional(user_id=user.id,  address=address, pincode=pincode, fullname= fullname, service_id=service, phone_no=phone_no)
            db.session.add(professional)
            db.session.commit()
            return jsonify({"message" : "prof created"}), 200
        
        customer = Customer(user_id=user.id,  address=address, pincode=pincode, fullname= fullname)
        db.session.add(customer)
        db.session.commit()
        return jsonify({"message" : "customer created"}), 200
    except:
        db.session.rollback()
        return jsonify({"message" : "error creating user"}), 400
    

@app.route('/add_service', methods=['GET','POST'])
def addService():
    if request.method=="POST":
        ServiceName= request.form.get('service_name')
        BasePrice = request.form.get('base_price')
        description = request.form.get('description')
        new_service = Service( name= ServiceName , price= BasePrice, description=description )
        db.session.add(new_service)
        db.session.commit()
        return jsonify({"message" : "service added"}), 200
    
@app.route('/service_request/<int:user_id>/<int:professional_id>', methods=['GET'])
def service_request(user_id, professional_id):
    # ServiceRequest=ServiceRequest.query.filter_by(id=id).first()
    professional=Professional.query.filter_by(user_id=professional_id).first()
    service=Service.query.get(professional.service_id)
    user=Customer.query.filter_by(user_id=user_id).first()
    new_service_request = ServiceRequest(service_name=service.name, customer_name=user.fullname, professional_name=professional.fullname ,service_id=professional.service_id, customer_id=user.user_id, professional_id=professional.user_id,date_of_request=datetime.now() )
    db.session.add(new_service_request)
    db.session.commit()
    return jsonify({"message" : "New Service Request added"}), 200


@app.route('/accept_req/<int:id>')
def accept_req(id):
    req= ServiceRequest.query.get(id)
    req.status = "accepted"
    db.session.commit()
    return jsonify({"message" : "New Service Request Accepted"}), 200

@app.route('/reject_req/<int:id>')
def reject_req(id):
    req= ServiceRequest.query.get(id)
    req.status = "rejected"
    db.session.commit()
    return jsonify({"message" : "New Service Request Rejected"}), 200

@app.route('/editservice/<int:id>', methods=['POST'])
def editService(id):
    data = request.get_json()
    service=Service.query.filter_by(id=id).first()
    
    ServiceName= data.get('service_name')
    BasePrice = data.get('base_price')
    description = data.get('description')
    if description !='':
        service.description= description
    if ServiceName != '':
        service.name = ServiceName
    if BasePrice != '':
        service.price= BasePrice
    db.session.commit()
    return jsonify({"message" : "Service Edited"}), 200