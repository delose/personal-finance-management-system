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
        
        # Use the container's hostname for the address
        address = os.getenv('HOSTNAME', 'localhost')
        
        # Construct the health check URL. 
        # Note: Consul needs to be able to reach this address. 
        # If Consul is in the same network, using the container IP or hostname works.
        # We use the address variable here to ensure consistency.
        check_url = f"http://{address}:{SERVICE_PORT}/health"
        
        consul_client.agent.service.register(
            name=SERVICE_NAME,
            service_id=SERVICE_ID,
            address=address,
            port=SERVICE_PORT,
            check={
                "http": check_url,
                "interval": "10s",
                "timeout": "5s"
            }
        )
        logger.info(f"{SERVICE_NAME} registered successfully with check at {check_url}")
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
