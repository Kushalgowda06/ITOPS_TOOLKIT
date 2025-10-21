#The goal of this file is to check whether the reques tis authorized or not [ verification of the proteced route]
from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from .auth_handler import decodeJWT
from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.status import HTTP_403_FORBIDDEN
from .auth_handler import *

import redis


############# Global Variables ########################
# redis_client = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)
token_time_limit=300



##############################

class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)


    async def __call__(self, request: Request):

        if hasattr(request.state, "token_payload"):

            # print("This part successfully implemented.......")


            return {
                  "token": request.headers.get("Authorization").split(" ")[1],
                  "payload": request.state.token_payload


                  }

        credentials: HTTPAuthorizationCredentials = await super().__call__(request)
        if credentials:
            if credentials.scheme != "Bearer":
                raise HTTPException(status_code=403, detail="Invalid authentication scheme.")

            else:
                payload = decodeJWT(credentials.credentials)
                print("Payload Details are", payload)

                if any([payload==None]):
                    print("Invalid token or empty token")
                    raise HTTPException(status_code=403, detail="Invalid or expired token.")


                #After each API call, refresh the token,
                new_token=refreshJWT(payload['user_id'])
                request.state.new_token = new_token.get("access_token")

            # print("Refreshed Token details are ", new_token)



            if not payload:
                payload = decode_jwt_allow_expired(credentials.credentials)
                print("Expired TOken Details", payload)

                payload_expires=payload['expires']

                if (time.time()-payload_expires)>5*token_time_limit:

                    raise HTTPException(status_code=403, detail="Invalid or expired token.")



                # if redis_client.exists(f"refresh:{payload['user_id']}"):
                #     refresh_token=redis_client.get(f"refresh:{payload['user_id']}")
                #     # print(f"Refresh Token exists{ refresh_token}")

                #     new_token=refreshJWT(payload['user_id'])
                #     request.state.new_token = new_token.get("access_token")
                #     request.state.token_payload = decodeJWT(new_token)
                #     # print("New Token is======",new_token)
                #     return {
                #         "token": new_token,
                #         "payload": request.state.token_payload
                #     }


                raise HTTPException(status_code=403, detail="Invalid or expired token.")


            return {"token": credentials.credentials, "payload": payload}
        else:
            raise HTTPException(status_code=403, detail="Invalid authorization code.")


 
