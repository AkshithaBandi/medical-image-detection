from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

from auth.database import conn, cursor
from auth.utils import (
    hash_password,
    verify_password,
    create_access_token
)

router = APIRouter()


class RegisterUser(BaseModel):
    username: str
    email: EmailStr
    password: str


class LoginUser(BaseModel):
    email: EmailStr
    password: str


@router.post("/register")
def register(user: RegisterUser):

    cursor.execute(
        "SELECT * FROM users WHERE email=?",
        (user.email,)
    )

    existing_user = cursor.fetchone()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User already exists"
        )

    hashed_password = hash_password(user.password)

    cursor.execute("""
    INSERT INTO users (
        username,
        email,
        password
    )
    VALUES (?, ?, ?)
    """, (
        user.username,
        user.email,
        hashed_password
    ))

    conn.commit()

    return {
        "message": "User registered successfully"
    }


@router.post("/login")
def login(user: LoginUser):

    cursor.execute(
        "SELECT * FROM users WHERE email=?",
        (user.email,)
    )

    db_user = cursor.fetchone()

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    stored_password = db_user[3]

    if not verify_password(
        user.password,
        stored_password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token({
        "sub": user.email
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "username": db_user[1],
        "email": db_user[2]
    }