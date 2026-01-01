// how to use
// go to http://localhost:8500/ui/dc1/services/transaction-service/instances
// find which service to remove
// npm run deregister:service transaction-service-*

const Consul = require('consul');
const consul = new Consul();

const serviceId = process.argv[2]; // Get ID from command line argument

if (serviceId) {
  consul.agent.service.deregister(serviceId, (err) => {
    if (err) throw err;
    console.log(`Deregistered service: ${serviceId}`);
  });
} else {
  console.error('Please provide a Service ID as an argument.');
}

