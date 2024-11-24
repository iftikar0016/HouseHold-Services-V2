from celery.schedules import crontab
from flask import current_app as app
from backend.celery.tasks import req_reminder

celery_app = app.extensions['celery']



@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # every 10 seconds
    # sender.add_periodic_task(10.0, req_reminder.s() )

    # # daily message at 6:55 pm, everyday
    sender.add_periodic_task(crontab(hour=16, minute=26), req_reminder.s(), name='daily reminder' )

    # # weekly messages
    # sender.add_periodic_task(crontab(hour=18, minute=55, day_of_week='monday'), email_reminder.s('students@gmail', 'reminder to login', '<h1> hello everyone </h1>'), name = 'weekly reminder' )