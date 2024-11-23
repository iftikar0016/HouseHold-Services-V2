from flask import jsonify, request, current_app as app
from flask_restful import Api, Resource, fields, marshal_with
from flask_security import auth_required, current_user, roles_required
from backend.models import Customer, Professional, Service, ServiceRequest, db

cache = app.cache

api = Api(prefix='/api')

customer_fields = {
    'id': fields.Integer,
    'user_id': fields.Integer,
    'fullname': fields.String,
    'address': fields.String,
    'pincode': fields.Integer,
}

professional_fields = {
    'id': fields.Integer,
    'user_id': fields.Integer,
    'fullname': fields.String,
    'address': fields.String,
    'pincode': fields.Integer,
    'phone_no': fields.Integer,
    'service_id': fields.Integer,
}


service_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'price': fields.Float,
    'description': fields.String,
    'time_required': fields.String,
}


service_request_fields = {
    'id': fields.Integer,
    'customer_name': fields.String,
    'professional_name': fields.String,
    'service_name': fields.String,
    'service_id': fields.Integer,
    'customer_id': fields.Integer,
    'professional_id': fields.Integer,
    'date_of_request': fields.DateTime,
    'date_of_completion': fields.DateTime,
    'status': fields.String,
    'remarks': fields.String,
}


        

class ServiceListAPI(Resource):
    # @cache.cached(timeout = 5, key_prefix = "service_list")
    @marshal_with(service_fields)
    # @auth_required('token')
    def get(self):
        services = Service.query.all()
        return services
    
    @roles_required('admin')
    @auth_required('token')
    def post(self):
        data = request.get_json()
        name = data.get('service_name')
        price = data.get('base_price')
        description = data.get('description')
        new_service = Service(name=name, price=price, description=description)
        db.session.add(new_service)
        db.session.commit()
        return jsonify({'message' : 'New service added'})
    

# ProfessionalListAPI
class ProfessionalListAPI(Resource):
    @marshal_with(professional_fields)
    @auth_required('token')
    def get(self):
        professionals = Professional.query.all()
        return professionals

# professionals for specific service
class ServiceProfessionalsAPI(Resource):
    @marshal_with(professional_fields)
    @auth_required('token')
    def get(self,service_id):
        professionals = Professional.query.filter_by(service_id=service_id).all()
        return professionals

# CustomerListAPI
class CustomerListAPI(Resource):
    @marshal_with(customer_fields)
    @auth_required('token')
    def get(self):
        customers = Customer.query.all()
        return customers


class ServiceRequestAPI(Resource):
    @marshal_with(service_request_fields)
    @auth_required('token')
    def get(self):
        service_requests = ServiceRequest.query.all()
        return service_requests

    @auth_required('token')
    def post(self):
        data = request.get_json()
        customer_name = data.get('customer_name')
        professional_name = data.get('professional_name')
        service_name = data.get('service_name')
        service_id = data.get('service_id')
        customer_id = data.get('customer_id')
        professional_id = data.get('professional_id')
        date_of_request = data.get('date_of_request')
        date_of_completion = data.get('date_of_completion')
        status = data.get('status', 'requested')
        remarks = data.get('remarks')
        new_service_request = ServiceRequest(
            customer_name=customer_name,
            professional_name=professional_name,
            service_name=service_name,
            service_id=service_id,
            customer_id=customer_id,
            professional_id=professional_id,
            date_of_request=date_of_request,
            date_of_completion=date_of_completion,
            status=status,
            remarks=remarks
        )
        db.session.add(new_service_request)
        db.session.commit()
        return jsonify({'message': 'New service request added'})

api.add_resource(ServiceRequestAPI, '/service_requests')
api.add_resource(CustomerListAPI, '/customers')
api.add_resource(ProfessionalListAPI, '/professionals')
api.add_resource(ServiceListAPI, '/services')

api.add_resource(ServiceProfessionalsAPI, '/service/<int:service_id>/professionals')

class UserServiceRequestAPI(Resource):
    # @auth_required('token')
    @cache.memoize(timeout = 5)
    @marshal_with(service_request_fields)
    def get(self, user_id):
        service_requests = ServiceRequest.query.filter_by(customer_id=user_id).all()
        prof_requests = ServiceRequest.query.filter_by(professional_id=user_id).all()
        return service_requests + prof_requests
api.add_resource(UserServiceRequestAPI, '/services_requests/<int:user_id>')