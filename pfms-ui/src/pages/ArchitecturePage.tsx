import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import BaseLayout from '../components/BaseLayout';
import ServiceModal from '../components/ServiceModal';
import ArchitectureGraph from '../components/ArchitectureGraph';

interface Service {
  id: string;
  name: string;
  type: string;
  language: string;
  port: number;
  database?: string;
  health: 'UP' | 'DOWN' | 'DEGRADED' | 'UNKNOWN';
  responseTime?: number;
  lastUpdated?: string;
  endpoints?: {
    health?: string;
    logs?: string;
    dashboard?: string;
  };
}

interface MessageFlow {
  from: string;
  to: string;
  type: 'kafka' | 'rabbitmq' | 'http';
  message: string;
}

const ArchitecturePage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [viewMode, setViewMode] = useState<'logical' | 'deployment'>('logical');
  const [allHealthy, setAllHealthy] = useState<boolean>(false);
  const [setupTime, setSetupTime] = useState<string>('');
  const [messageFlows, setMessageFlows] = useState<MessageFlow[]>([]);

  useEffect(() => {
    // Initialize services with default data
    const initialServices: Service[] = [
      {
        id: 'api-gateway',
        name: 'API Gateway',
        type: 'gateway',
        language: 'Java (Spring Boot)',
        port: 8080,
        health: 'UNKNOWN',
        endpoints: {
          health: 'http://localhost:8080/actuator/health',
          dashboard: 'http://localhost:8080'
        }
      },
      {
        id: 'budget-service',
        name: 'Budget Service',
        type: 'service',
        language: 'Java (Spring Boot)',
        port: 8081,
        database: 'PostgreSQL',
        health: 'UNKNOWN',
        endpoints: {
          health: 'http://localhost:8761/eureka/apps/BUDGET-SERVICE',
          dashboard: 'http://localhost:8761'
        }
      },
      {
        id: 'transaction-service',
        name: 'Transaction Service',
        type: 'service',
        language: 'Node.js (NestJS)',
        port: 3002,
        database: 'PostgreSQL',
        health: 'UNKNOWN',
        endpoints: {
          health: 'http://localhost:3002/health',
          dashboard: 'http://localhost:8500'
        }
      },
      {
        id: 'account-service',
        name: 'Account Service',
        type: 'service',
        language: 'Node.js (NestJS)',
        port: 3003,
        database: 'PostgreSQL',
        health: 'UNKNOWN',
        endpoints: {
          health: 'http://localhost:3003/health',
          dashboard: 'http://localhost:8500'
        }
      },
      {
        id: 'goal-service',
        name: 'Goal Service',
        type: 'service',
        language: 'Java (Spring Boot)',
        port: 8082,
        database: 'PostgreSQL',
        health: 'UNKNOWN',
        endpoints: {
          health: 'http://localhost:8082/actuator/health',
          dashboard: 'http://localhost:8761'
        }
      },
      {
        id: 'notification-service',
        name: 'Notification Service',
        type: 'service',
        language: 'Java (Spring Boot)',
        port: 8083,
        database: 'PostgreSQL',
        health: 'UNKNOWN',
        endpoints: {
          health: 'http://localhost:8083/actuator/health',
          dashboard: 'http://localhost:8761'
        }
      },
      {
        id: 'kafka',
        name: 'Kafka',
        type: 'messaging',
        language: 'N/A',
        port: 9092,
        health: 'UNKNOWN'
      },
      {
        id: 'rabbitmq',
        name: 'RabbitMQ',
        type: 'messaging',
        language: 'N/A',
        port: 5672,
        health: 'UNKNOWN'
      },
      {
        id: 'postgresql',
        name: 'PostgreSQL',
        type: 'database',
        language: 'N/A',
        port: 5432,
        health: 'UNKNOWN'
      },
      {
        id: 'eureka',
        name: 'Eureka Server',
        type: 'discovery',
        language: 'Java (Spring Boot)',
        port: 8761,
        health: 'UNKNOWN',
        endpoints: {
          dashboard: 'http://localhost:8761'
        }
      },
      {
        id: 'consul',
        name: 'Consul',
        type: 'discovery',
        language: 'N/A',
        port: 8500,
        health: 'UNKNOWN',
        endpoints: {
          dashboard: 'http://localhost:8500'
        }
      }
    ];

    setServices(initialServices);
    calculateSetupTime();

    // Start polling health status
    const interval = setInterval(() => {
      checkHealthStatuses();
    }, 5000);

    // Initial check
    checkHealthStatuses();

    return () => clearInterval(interval);
  }, []);

  const calculateSetupTime = () => {
    // This would be more accurate with actual startup timing data
    // For demo purposes, we'll use a fixed time
    const startTime = new Date(Date.now() - 3 * 60 * 1000); // 3 minutes ago
    const endTime = new Date();
    const diffInSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    setSetupTime(`${diffInSeconds} seconds`);
  };

  const checkHealthStatuses = async () => {
    const updatedServices = await Promise.all(
      services.map(async (service) => {
        if (!service.endpoints?.health) {
          return { ...service, health: 'UP' as const };
        }

        try {
          const startTime = Date.now();
          const response = await axios.get(service.endpoints.health, {
            timeout: 2000,
            headers: {
              'Accept': 'application/json'
            }
          });

          const responseTime = Date.now() - startTime;
          let healthStatus: 'UP' | 'DOWN' | 'DEGRADED' | 'UNKNOWN' = 'UP';

          // Handle different health endpoint formats
          if (response.data?.status) {
            healthStatus = response.data.status;
          } else if (response.data?.applications?.application) {
            // Eureka response format
            const app = response.data.applications.application.find(
              (app: any) => app.name === 'BUDGET-SERVICE'
            );
            healthStatus = app ? 'UP' : 'DOWN';
          }

          // Ensure healthStatus is one of the allowed values
          if (!['UP', 'DOWN', 'DEGRADED', 'UNKNOWN'].includes(healthStatus)) {
            healthStatus = 'UNKNOWN';
          }

          return {
            ...service,
            health: healthStatus,
            responseTime,
            lastUpdated: new Date().toISOString()
          };
        } catch (error) {
          console.error(`Health check failed for ${service.name}:`, error);
          return {
            ...service,
            health: 'DOWN' as const,
            responseTime: 0,
            lastUpdated: new Date().toISOString()
          };
        }
      })
    );

    setServices(updatedServices);
    setAllHealthy(updatedServices.every(s => s.health === 'UP'));

    // Simulate some message flows
    if (updatedServices.some(s => s.id === 'transaction-service' && s.health === 'UP')) {
      setMessageFlows(prev => [
        ...prev,
        {
          from: 'transaction-service',
          to: 'rabbitmq',
          type: 'rabbitmq',
          message: 'New transaction created'
        },
        {
          from: 'rabbitmq',
          to: 'account-service',
          type: 'rabbitmq',
          message: 'Update account balance'
        }
      ]);
    }

    if (updatedServices.some(s => s.id === 'budget-service' && s.health === 'UP')) {
      setMessageFlows(prev => [
        ...prev,
        {
          from: 'budget-service',
          to: 'kafka',
          type: 'kafka',
          message: 'Budget limit warning'
        },
        {
          from: 'kafka',
          to: 'notification-service',
          type: 'kafka',
          message: 'Send notification'
        }
      ]);
    }
  };

  const getServiceColor = (health: string) => {
    switch (health) {
      case 'UP': return 'bg-green-500';
      case 'DEGRADED': return 'bg-yellow-500';
      case 'DOWN': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
  };

  const handleCloseModal = () => {
    setSelectedService(null);
  };

  return (
    <BaseLayout>
      <div className="architecture-page">
        {/* Congratulations Banner */}
        {allHealthy && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-green-500 text-white p-6 rounded-lg mb-8 text-center"
          >
            <h1 className="text-3xl font-bold mb-2">🎉 Congratulations! PFMS is running successfully!</h1>
            <p className="text-lg">All services are healthy and ready to use.</p>
            <p className="text-md mt-2">Setup completed in {setupTime}</p>
            <div className="mt-4 p-4 bg-green-600 rounded-lg inline-block">
              <h3 className="font-semibold">Next Steps:</h3>
              <ul className="list-disc list-inside text-left mt-2">
                <li>Create your first budget</li>
                <li>Add some transactions</li>
                <li>Set financial goals</li>
                <li>Explore the reports</li>
              </ul>
            </div>
          </motion.div>
        )}

        {/* View Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-800 rounded-lg p-1 flex">
            <button
              className={`px-4 py-2 rounded-md ${viewMode === 'logical' ? 'bg-blue-600' : 'bg-gray-700'}`}
              onClick={() => setViewMode('logical')}
            >
              Logical View
            </button>
            <button
              className={`px-4 py-2 rounded-md ${viewMode === 'deployment' ? 'bg-blue-600' : 'bg-gray-700'}`}
              onClick={() => setViewMode('deployment')}
            >
              Deployment View
            </button>
          </div>
        </div>

        {/* Architecture Visualization */}
        <div className="bg-gray-800 rounded-lg p-6 min-h-[600px]">
          <ArchitectureGraph
            services={services}
            messageFlows={messageFlows}
            viewMode={viewMode}
            onServiceClick={handleServiceClick}
          />
        </div>

        {/* Service Modal */}
        {selectedService && (
          <ServiceModal
            service={selectedService}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </BaseLayout>
  );
};

export default ArchitecturePage;
