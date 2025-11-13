import secrets
import uvicorn
from fastapi.responses import JSONResponse
from fastapi import Depends, FastAPI, Request, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.security import HTTPBasic, HTTPBasicCredentials

app = FastAPI(docs="/documentation", redoc_url=None)
security = HTTPBasic()

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "ITOPS Backend is running"}

@app.get("/")
async def root():
    return {"message": "ITOPS Toolkit Backend API", "version": "1.0.0"}

# CORS configuration
origins = ["*"]  # Allow all origins for now

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def authenticate(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = secrets.compare_digest(credentials.username, "rest")
    correct_password = secrets.compare_digest(credentials.password, "!fi$5*4KlHDdRwdbup%ix")
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username

@app.get("/protected")
async def protected_route(username: str = Depends(authenticate)):
    return {"message": f"Hello {username}, this is a protected route"}

# Exception handler
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "code": 422,
            "error": {
                "message": "Payload validation failed",
                "details": exc.errors(),
                "endpoint": request.url.path
            },
        },
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)