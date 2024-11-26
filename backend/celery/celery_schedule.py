from celery.schedules import crontab
from flask import current_app as app
from backend.celery.tasks import monthly_activity_report, req_reminder

celery_app = app.extensions['celery']



@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # every 10 seconds
    sender.add_periodic_task(10.0, monthly_activity_report.s() , name="checking for monthly report" )
    # sender.add_periodic_task(4.0, req_reminder.s(), name='checking for daily reminder' )

    # # daily message at 12:30 pm, everyday
    sender.add_periodic_task(crontab(hour=12, minute=30), req_reminder.s(), name='daily reminder' )

    # # monthly messages
    sender.add_periodic_task(crontab(hour=20, minute=30, day_of_month=1), monthly_activity_report.s(), name='monthly report' )