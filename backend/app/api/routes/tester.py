# Created by xdd at 2024/6/3

from fastapi import APIRouter
import re
from typing import List
from pydantic import BaseModel

router = APIRouter()


# 从之前的实现中导入这些函数


class PasswordValidationRequest(BaseModel):
    password: str
    username: str


class PasswordValidationResponse(BaseModel):
    is_valid: bool
    errors: List[str]
    strength: str


@router.post("/validate_password", response_model=PasswordValidationResponse)
def validate_password_endpoint(request: PasswordValidationRequest):
    # 验证密码
    is_valid, errors = validate_password(request.password, request.username)

    # 评估密码强度
    strength = assess_password_strength(request.password)

    return PasswordValidationResponse(
        is_valid=is_valid,
        errors=errors,
        strength=strength
    )


# 为了使这个示例可以独立运行，我们在这里包含了密码验证的逻辑
# 在实际应用中，你应该从单独的模块导入这些函数

COMMON_PASSWORDS = {"password", "123456", "qwerty", "admin", "letmein", "welcome"}


def validate_password(password: str, username: str) -> tuple[bool, List[str]]:
    print(password)
    errors = []

    if len(password) < 8:
        errors.append("密码长度必须至少为8个字符")
    elif len(password) > 20:
        errors.append("密码长度不能超过20个字符")

    if not re.search(r'[A-Z]', password):
        errors.append("密码必须包含至少一个大写字母")
    if not re.search(r'[a-z]', password):
        errors.append("密码必须包含至少一个小写字母")
    if not re.search(r'\d', password):
        errors.append("密码必须包含至少一个数字")
    if not re.search(r'[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]', password):
        errors.append("密码必须包含至少一个特殊字符")

    if username.lower() in password.lower():
        errors.append("密码不能包含用户名")

    if password.lower() in COMMON_PASSWORDS:
        errors.append("不能使用常见密码")

    if contains_sequential_chars(password):
        errors.append("密码不能包含连续的字符")

    return len(errors) == 0, errors


def contains_sequential_chars(password: str, sequence_length: int = 3) -> bool:
    for i in range(len(password) - sequence_length + 1):
        substr = password[i:i + sequence_length]
        if (substr.isdigit() and str(int(substr) + 1) == substr) or \
                (substr.isalpha() and substr.lower() in 'abcdefghijklmnopqrstuvwxyz'):
            return True
    return False


def assess_password_strength(password: str) -> str:
    if len(password) < 8:
        return "弱"

    has_upper = bool(re.search(r'[A-Z]', password))
    has_lower = bool(re.search(r'[a-z]', password))
    has_digit = bool(re.search(r'\d', password))
    has_special = bool(re.search(r'[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]', password))

    if has_upper and has_lower and has_digit and has_special:
        if len(password) > 12:
            return "强"
        else:
            return "中"
    else:
        return "弱"
