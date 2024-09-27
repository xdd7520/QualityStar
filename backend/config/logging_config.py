# config/logging_config.py
import os

from loguru import logger

os.chdir(os.path.dirname(os.path.abspath(__file__)))


def setup_logger():
    # 清除所有现有的处理程序
    logger.remove()

    log_path = "../logs"
    if not os.path.exists(log_path):
        os.makedirs(log_path)

    # 添加新的处理程序
    logger.add(f"{log_path}/app.log", rotation="1 week", level="INFO", encoding='utf-8')

    return logger


# 创建一个全局的 logger 实例
global_logger = setup_logger()
