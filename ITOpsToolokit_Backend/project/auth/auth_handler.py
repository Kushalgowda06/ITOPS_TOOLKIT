import time
from typing import Dict
import secrets
import redis

from typing import Dict
from datetime import datetime, timedelta

import jwt
from decouple import config

from jwt import ExpiredSignatureError, InvalidTokenError


################################################
#JWT secrets
JWT_SECRET = config("secret")
JWT_ALGORITHM = config("algorithm")

#Redis Client
# redis_client = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)
token_time_limit=300


#Token response
def token_response(token: str):
    return {
        "access_token": token
    }



def signJWT(user_id: str) -> Dict[str, str]:
    payload = {
        "user_id": user_id,
        "expires": time.time() + token_time_limit
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

    # redis_client.setex(f"access:{user_id}", timedelta(seconds=2000), token)
    refresh_token = secrets.token_urlsafe(32)
    # redis_client.setex(f"refresh:{user_id}", timedelta(days=7), refresh_token)


    return token_response(token)


def refreshJWT(user_id: str) -> Dict[str, str]:
    payload = {
        "user_id": user_id,
        "expires": time.time() + token_time_limit
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

    # redis_client.setex(f"access:{user_id}", timedelta(seconds=2000), token)

    return token_response(token)



def decodeJWT(token: str) -> dict:
    try:
        decoded_token = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return decoded_token if decoded_token["expires"] >= time.time() else None
    except:
        return {}


def decode_jwt_allow_expired(token: str):
    try:
        # Decode without verifying expiration
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM],
            options={"verify_exp": False}  # Skip expiration check
        )
        return payload
    except InvalidTokenError:
        return Noneroot
