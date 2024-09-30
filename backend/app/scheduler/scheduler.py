from datetime import datetime, timedelta
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.date import DateTrigger
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.jobstores.base import JobLookupError
from config.logging_config import setup_logger
import pytz

logger = setup_logger()

shanghai_tz = pytz.timezone('Asia/Shanghai')


class TaskScheduler:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(TaskScheduler, cls).__new__(cls)
            cls._instance.scheduler = AsyncIOScheduler(timezone=shanghai_tz)
            cls._instance.scheduler.start()
        return cls._instance

    def add_job(self, func, trigger_type, **trigger_args):
        if 'trigger' in trigger_args:
            # 如果传递了触发器实例，直接使用它
            trigger = trigger_args['trigger']
        else:
            # 否则，根据类型和参数创建新的触发器
            trigger_classes = {
                'date': DateTrigger,
                'interval': IntervalTrigger,
                'cron': CronTrigger
            }
            trigger_class = trigger_classes.get(trigger_type)
            if not trigger_class:
                raise ValueError("Unsupported trigger type provided: {}".format(trigger_type))
            trigger = trigger_class(**trigger_args)

        try:
            return self.scheduler.add_job(func, trigger)
        except OverflowError:
            logger.error(f"由于日期值超出范围而无法添加定时调度任务: {func} {trigger}")

    def list_jobs(self):
        """
        Returns a list of all scheduled jobs with detailed information about each job.
        """
        jobs = self.scheduler.get_jobs()
        jobs_info = []
        for job in jobs:
            job_details = {
                'job_id': job.id,
                'name': job.name,
                'next_run_time': str(job.next_run_time),
                'trigger': str(job.trigger)
            }
            jobs_info.append(job_details)
        return jobs_info

    def remove_job(self, job_id):
        """
        Removes a scheduled job by ID.
        """
        try:
            self.scheduler.remove_job(job_id)
        except JobLookupError:
            print(f"No job by the ID {job_id} was found.")


#
# # Example usage:
def my_task():
    print("Task executed!")
    print(datetime.now(shanghai_tz).strftime('%Y-%m-%d %H:%M:%S'))


# Initialize the scheduler
scheduler = TaskScheduler()
# Add a cron job example
# job = domain_scheduler.add_job(my_task, 'cron', hour=10, minute=30)


def one_time_task():
    print("One-time task executed at", datetime.now())


# 安排任务在未来特定时间执行
future_time = datetime.now() + timedelta(days=1)  # 当前时间后一天
# domain_scheduler.add_job(one_time_task, 'date', run_date=future_time)


# 定义任务函数
def recurring_task():
    print("Recurring task executed at", datetime.now())


# 安排任务每10分钟执行一次
# domain_scheduler.add_job(recurring_task, 'interval', minutes=10)


# 定义任务函数
def daily_task():
    print("Daily task executed at", datetime.now())


# 安排任务每天的10:30执行
# domain_scheduler.add_job(daily_task, 'cron', hour=10, minute=30)


# 每周一上午9点15分执行
def weekly_task():
    print("Weekly task executed at", datetime.now())


# domain_scheduler.add_job(weekly_task, 'cron', day_of_week='mon', hour=9, minute=15)

# # 假设 TaskScheduler 类已经定义和初始化
#
# def complex_task():
#     print("Complex task executed at", datetime.now())
#
#
# # 每天下午3点30分，但只在工作日执行
# cron_trigger1 = CronTrigger(day_of_week='mon-fri', hour=15, minute=30)
#
# # 每48小时执行一次，从现在开始计算
# now = datetime.now()
# interval_trigger = IntervalTrigger(start_date=now, hours=48)
#
# # 组合两个触发器
# combined_trigger = AndTrigger([cron_trigger1, interval_trigger])
#
# # 安排复杂任务执行
# scheduler.add_job(complex_task, 'cron', trigger=combined_trigger)
#
# # List jobs
# print(domain_scheduler.list_jobs())
# # Remove job
# domain_scheduler.remove_job(job.id)
#
# print(domain_scheduler.list_jobs())
