import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
import consul

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Consul Configuration
CONSUL_HOST = os.getenv("CONSUL_HOST", "localhost")
CONSUL_PORT = 8500
SERVICE_NAME = "reporting-service"
SERVICE_ID = f"{SERVICE_NAME}-{os.getenv('HOSTNAME', 'local')}"
SERVICE_PORT = 8000

# Initialize Consul client
consul_client = consul.Consul(host=CONSUL_HOST, port=CONSUL_PORT)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Register with Consul
    try:
        logger.info(f"Registering {SERVICE_NAME} with Consul at {CONSUL_HOST}:{CONSUL_PORT}")
        consul_client.agent.service.register(
            name=SERVICE_NAME,
            service_id=SERVICE_ID,
            address=os.getenv("HOSTNAME", "localhost"), # Use container hostname or IP
            port=SERVICE_PORT,
            check={
                "http": f"http://{os.getenv('HOSTNAME', 'localhost')}:{SERVICE_PORT}/health",
                "interval": "10s",
                "timeout": "5s"
            }
        )
        logger.info(f"{SERVICE_NAME} registered successfully")
    except Exception as e:
        logger.error(f"Failed to register with Consul: {e}")

    yield

    # Shutdown: Deregister from Consul
    try:
        logger.info(f"Deregistering {SERVICE_NAME} from Consul")
        consul_client.agent.service.deregister(SERVICE_ID)
        logger.info(f"{SERVICE_NAME} deregistered successfully")
    except Exception as e:
        logger.error(f"Failed to deregister from Consul: {e}")

app = FastAPI(title="Reporting Service", lifespan=lifespan)

@app.get("/health")
def health_check():
    return {"status": "Reporting Service is active"}
