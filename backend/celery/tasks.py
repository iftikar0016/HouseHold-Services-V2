from datetime import datetime, timedelta
from celery import shared_task
from flask import render_template
import flask_excel
from backend.celery.mail_service import send_email
from backend.models import Customer, Professional, ServiceRequest, User, db


@shared_task(bind = True, ignore_result = True)
def create_csv(self, id):
    s_request = ServiceRequest.query.filter_by(id=id).all()

    task_id = self.request.id
    filename = f'service_request_data_{task_id}.csv'
    column_names = [column.name for column in ServiceRequest.__table__.columns]
    print(column_names)
    csv_out = flask_excel.make_response_from_query_sets(s_request, column_names = column_names, file_type='csv' )

    with open(f'./backend/celery/user-downloads/{filename}', 'wb') as file:
        file.write(csv_out.data)
    
    return filename

@shared_task(ignore_result = True)
def req_reminder():
    results = db.session.query(User, ServiceRequest).join(ServiceRequest, User.id == ServiceRequest.professional_id).filter(ServiceRequest.status=='requested').all()
    # results= ServiceRequest.query.filter_by(status="requested").all()
    for user, req in results:
        send_email(str(user.email), 'Reminder to Accept/Reject Request', render_template('req_remainder.html', req=req))

@shared_task(ignore_result = True)
def monthly_activity_report():
    customers= db.session.query(Customer).all()
    a_month_ago = datetime.now() - timedelta(days=30)
    for customer in customers:
        # service_requests=ServiceRequest.query.filter((ServiceRequest.customer_id==customer.user_id) & (ServiceRequest.date_of_request >= a_month_ago)).all()
        data = (
        db.session.query(ServiceRequest.status, db.func.count(ServiceRequest.id))
        .filter((ServiceRequest.customer_id == customer.user_id) & (ServiceRequest.date_of_request >= a_month_ago))  # Filter for either customer or professional
        .group_by(ServiceRequest.status)
        .all()
        )
        labels = [row[0] for row in data]  
        values = [row[1] for row in data]

        html_code=render_template('monthly_reports.html',labels=labels,values=values)
        
        send_email(str(customer.user.email), 'Monthly Activity Report',html_code)
        