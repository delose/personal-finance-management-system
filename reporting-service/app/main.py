from fastapi import FastAPI

app = FastAPI(title="Reporting Service")

@app.get("/health")
def health_check():
    return {"status": "Reporting Service is active"}
