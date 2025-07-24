from core.password import pwd_context  # 👈 importa de password.py

users_db = {
    "petrobras@example.com": {
        "email": "petrobras@example.com",
        "hashed_password": pwd_context.hash("senha"),
        "company_id": 1
    },
        "refinaria@example.com": {
        "email": "refinaria@example.com",
        "hashed_password": pwd_context.hash("senha"),
        "company_id": 1
    },
    "cimpor@example.com": {
        "email": "cimpor@example.com",
        "hashed_password": pwd_context.hash("senha"),
        "company_id": 2
    },
    "petroquimica@example.com": {
        "email": "petroquimica@example.com",
        "hashed_password": pwd_context.hash("senha"),
        "company_id": 3
    },
    "bunge@example.com": {
        "email": "bunge@example.com",
        "hashed_password": pwd_context.hash("senha"),
        "company_id": 4
    }
}
