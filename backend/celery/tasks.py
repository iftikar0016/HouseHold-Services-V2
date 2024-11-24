from celery import shared_task
import flask_excel
from backend.celery.mail_service import send_email
from backend.models import Professional, ServiceRequest, User, db


@shared_task(bind = True, ignore_result = False)
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
    results = db.session.query(User).join(ServiceRequest, User.id == ServiceRequest.professional_id).filter(ServiceRequest.status=='requested').all()
    print(results)
    for each in results:
        send_email(str(each.email), 'reminder to login', '<h1> hello everyone </h1>')
        