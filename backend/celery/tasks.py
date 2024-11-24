from celery import shared_task
import flask_excel
from backend.models import ServiceRequest


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