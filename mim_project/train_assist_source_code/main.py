import uvicorn
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from train_assist_routes import router as train_assist_router

app = FastAPI(docs = "/documentation", redoc_url = None)

app.include_router(train_assist_router, prefix = '/train_assist', tags = ['KB Articles - Quiz'])

# Handling Pydantic Validation exceptions
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code = 422,
        content={
            "code": 422,
            "error": {
                "messsage": "Payload validation failed",
                "details": exc.errors(),
                "endpoint": request.url.path
            },
        },
    )