from datetime import datetime
from flask import current_app as app, jsonify, redirect, render_template,  request, send_file
from flask_security import auth_required, verify_password, hash_password
from sqlalchemy import Integer
from backend.models import Customer, Professional, Service, ServiceRequest, User, db
from backend.celery.tasks import create_sr_csv
from celery.result import AsyncResult

datastore = app.security.datastore
cache = app.cache


@app.route('/')
def home():
    return render_template('index.html')

@app.get('/get-sr-csv/<id>')
def getCSV(id):
    result = AsyncResult(id)
    if result.ready():
        return send_file(f'./backend/celery/user-downloads/{result.result}'), 200
    else:
        return {'message' : 'task not ready yet'}, 405
    
@app.get('/create-sr-csv/<id>')
# @auth_required('token')
def createCSV(id):
    task = create_sr_csv.delay(id)
    return {'task_id' : task.id}, 200


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
        if not user.active or user.is_blocked: 
            return jsonify({"message" : "user is inactive or blocked"}), 404
        return jsonify({'token' : user.get_auth_token(), 'email' : user.email, 'role' : user.roles[0].name, 'id' : user.id}),200
    
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
        if role == 'professional':
            user = datastore.create_user(email = email, password = hash_password(password), active = False)
            datastore.add_role_to_user(user, role) 
            service=data.get('service')
            experience=data.get('experience')
            phone_no=data.get('phone')
            professional = Professional(user_id=user.id, active = False,  address=address, pincode=pincode, fullname= fullname, service_id=service, phone_no=phone_no,experience=experience)
            db.session.add(professional)
            db.session.commit()
            cache.clear()
            return jsonify({"message" : "prof created"}), 200
        
        user = datastore.create_user(email = email, password = hash_password(password), active = True)
        datastore.add_role_to_user(user, role) 
        customer = Customer(user_id=user.id,  address=address, pincode=pincode, fullname= fullname)
        db.session.add(customer)
        db.session.commit()
        cache.clear()
        return jsonify({"message" : "customer created"}), 200
    except:
        db.session.rollback()
        return jsonify({"message" : "error creating user"}), 400
    

@app.route('/add_service', methods=['POST'])
@auth_required('token')
def addService():
    if request.method=="POST":
        ServiceName= request.form.get('service_name')
        BasePrice = request.form.get('base_price')
        description = request.form.get('description')
        new_service = Service( name= ServiceName , price= BasePrice, description=description )
        db.session.add(new_service)
        db.session.commit()
        cache.clear()
        return jsonify({"message" : "service added"}), 200
    
@app.route('/service_request/<int:user_id>/<int:professional_id>', methods=['GET'])
@auth_required('token')
def service_request(user_id, professional_id):
    # ServiceRequest=ServiceRequest.query.filter_by(id=id).first()
    professional=Professional.query.filter_by(user_id=professional_id).first()
    service=Service.query.get(professional.service_id)
    user=Customer.query.filter_by(user_id=user_id).first()
    new_service_request = ServiceRequest(service_name=service.name, customer_name=user.fullname, professional_name=professional.fullname ,service_id=professional.service_id, customer_id=user.user_id, professional_id=professional.user_id,date_of_request=datetime.now(), address=user.address )
    db.session.add(new_service_request)
    db.session.commit()
    cache.clear()
    return jsonify({"message" : "New Service Request added"}), 200


@app.route('/accept_req/<int:id>')
@auth_required('token')
def accept_req(id):
    req= ServiceRequest.query.get(id)
    req.status = "accepted"
    db.session.commit()
    cache.clear()
    return jsonify({"message" : "New Service Request Accepted"}), 200

@app.route('/reject_req/<int:id>')
@auth_required('token')
def reject_req(id):
    req= ServiceRequest.query.get(id)
    req.status = "rejected"
    db.session.commit()
    cache.clear()
    return jsonify({"message" : "New Service Request Rejected"}), 200

@app.route('/editservice/<int:id>', methods=['POST'])
@auth_required('token')
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
    cache.clear()
    return jsonify({"message" : "Service Edited"}), 200

@app.route('/delete_service/<int:id>')
@auth_required('token')
def delete_service(id):
    service=Service.query.filter_by(id=id).first()
    db.session.delete(service)
    db.session.commit()
    cache.clear()
    return jsonify({"message" : "Service Deleted"}), 200

@app.route('/cancel_service/<int:id>')
@auth_required('token')
def cancel_service(id):
    service=ServiceRequest.query.filter_by(id=id).first()
    db.session.delete(service)
    db.session.commit()
    cache.clear()
    return jsonify({"message" : "Service Request Canceled"}), 200


@app.route('/user_action/<int:id>', methods=['POST'])
@auth_required('token')
def user_action(id):
    user=User.query.get(id)
    if not user: return jsonify({'error': 'User not found'}), 404
    data = request.get_json()
    param = data.get('param')
    role = data.get('role')
    if param == 'Approve':
        if role == 'professional':
            user.active = True
            user.professional.active = True
            db.session.commit()
        else:
            user.active = True
            user.customer.active = True
            db.session.commit()

    if param == 'Reject':
        if role == 'professional':
            prof=Professional.query.filter_by(user_id=id).first()
            db.session.delete(prof)
            db.session.delete(user)
            db.session.commit()
        else:
            customer=Customer.query.filter_by(user_id=id).first()
            db.session.delete(customer)
            db.session.delete(user)
            db.session.commit()

    if param == 'Block':
        if role == 'professional':
            user.is_blocked = True
            user.professional.is_blocked = True
            db.session.commit()
        else:
            user.is_blocked = True
            user.customer.is_blocked = True
            db.session.commit()

    if param == 'Unblock':
        if role == 'professional':
            user.is_blocked = False
            user.professional.is_blocked = False
            db.session.commit()
        else:
            user.is_blocked = False
            user.customer.is_blocked = False
            db.session.commit()
    cache.clear()
    return jsonify({"message" : "User Updated"}), 200


@app.route('/service_remarks/<int:request_id>', methods=['POST'])
@auth_required('token')
def service_remarks(request_id):
    req= ServiceRequest.query.get(request_id)
    data= request.get_json()
    remarks= data.get('remarks')
    req.status = "closed"
    req.remarks= remarks
    req.date_of_completion = datetime.now()
    db.session.commit()
    cache.clear()
    return jsonify({"message" : "req Updated"}), 200


@app.route('/profile/<int:id>', methods=['GET','POST'])
@auth_required('token')
def profile(id):
    user=User.query.get(id)
    if request.method=="POST":
        data= request.get_json()
        email= data.get('email')
        password = data.get('password')
        fullname = data.get('fullname')
        address = data.get('address')
        pincode = data.get('pincode')

        if email !='':
            user.email= email
        if password != '':
            user.password= password

        if user.roles[0].name == "professional":
            if pincode != '':
                user.professional.pincode= int(pincode)
            if fullname != '':
                user.professional.fullname = fullname
            if address != '':
                user.professional.address = address
            db.session.commit()

        if user.roles[0].name == "customer":
            if pincode != '':
                user.customer.pincode= int(pincode)
            if fullname != '':
                user.customer.fullname = fullname
            if address != '':
                user.customer.address = address
            db.session.commit()
        cache.clear()
        return jsonify({"message" : "User Profile Updated"}), 200
    
    else:
        if user.roles[0].name == "professional":
            return jsonify({"email" : str(user.email), "password":str(user.password), "pincode":str(user.professional.pincode),"address":str(user.professional.address), "fullname":str(user.professional.fullname) }), 200
        if user.roles[0].name == "customer":
            return jsonify({"email" : str(user.email), "password":str(user.password), "pincode":str(user.customer.pincode),"address":str(user.customer.address), "fullname":str(user.customer.fullname) }), 200
        

@app.route("/summary/<int:user_id>")
@auth_required('token')
def userSummary(user_id):
    data = (
        db.session.query(ServiceRequest.status, db.func.count(ServiceRequest.id))
        .filter((ServiceRequest.customer_id == user_id) | (ServiceRequest.professional_id == user_id))  # Filter for either customer or professional
        .group_by(ServiceRequest.status)
        .all()
    )
    labels = [row[0] for row in data]  # Statuses 
    values = [row[1] for row in data]
    data = { 'labels': labels, 'values': values }
    return jsonify(data),200


@app.route("/summary")
@auth_required('token')
def adminSummary():
    data = (
        db.session.query(ServiceRequest.status, db.func.count(ServiceRequest.id))  
        .group_by(ServiceRequest.status)
        .all()
    )
    labels = [row[0] for row in data]  # Statuses 
    values = [row[1] for row in data]
    data = { 'labels': labels, 'values': values }
    return jsonify(data),200