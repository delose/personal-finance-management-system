import React, { useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  Position,
  ReactFlowProvider,
  useEdgesState,
  useNodesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';
import { FaServer, FaDatabase, FaNetworkWired, FaCog, FaExchangeAlt } from 'react-icons/all-files';

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
}

interface MessageFlow {
  from: string;
  to: string;
  type: 'kafka' | 'rabbitmq' | 'http';
  message: string;
}

interface ArchitectureGraphProps {
  services: Service[];
  messageFlows: MessageFlow[];
  viewMode: 'logical' | 'deployment';
  onServiceClick: (service: Service) => void;
}

const serviceIcons: Record<string, JSX.Element> = {
  'gateway': <FaNetworkWired className="text-2xl" />,
  'service': <FaServer className="text-2xl" />,
  'database': <FaDatabase className="text-2xl" />,
  'messaging': <FaExchangeAlt className="text-2xl" />,
  'discovery': <FaCog className="text-2xl" />,
  'default': <FaServer className="text-2xl" />
};

const getServiceColor = (health: string) => {
  switch (health) {
    case 'UP': return '#10B981';
    case 'DEGRADED': return '#F59E0B';
    case 'DOWN': return '#EF4444';
    default: return '#6B7280';
  }
};

const ServiceNode: React.FC<{ data: Service }> = ({ data }) => {
  const icon = serviceIcons[data.type] || serviceIcons['default'];
  const color = getServiceColor(data.health);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="service-node"
      style={{
        backgroundColor: color,
        padding: '12px',
        borderRadius: '8px',
        width: '180px',
        color: 'white',
        cursor: 'pointer'
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-bold">{data.name}</div>
        {icon}
      </div>
      <div className="text-xs">
        <div>{data.language}</div>
        <div>Port: {data.port}</div>
        {data.responseTime && <div>Response: {data.responseTime}ms</div>}
        <div className="capitalize">{data.health}</div>
      </div>
    </motion.div>
  );
};

const ArchitectureGraph: React.FC<ArchitectureGraphProps> = ({
  services,
  messageFlows,
  viewMode,
  onServiceClick
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [activeFlows, setActiveFlows] = useState<MessageFlow[]>([]);

  useEffect(() => {
    // Create nodes from services
    const newNodes: Node[] = services.map(service => ({
      id: service.id,
      type: 'service',
      position: getPosition(service.id, viewMode),
      data: service,
    }));

    // Create edges based on service relationships and message flows
    const newEdges: Edge[] = [];

    // Logical view connections
    if (viewMode === 'logical') {
      // API Gateway connections
      newEdges.push(
        { id: 'api-gateway-budget', source: 'api-gateway', target: 'budget-service', animated: true },
        { id: 'api-gateway-transaction', source: 'api-gateway', target: 'transaction-service', animated: true },
        { id: 'api-gateway-goal', source: 'api-gateway', target: 'goal-service', animated: true },
        { id: 'api-gateway-account', source: 'api-gateway', target: 'account-service', animated: true }
      );

      // Kafka connections
      newEdges.push(
        { id: 'budget-kafka', source: 'budget-service', target: 'kafka', animated: true },
        { id: 'kafka-notification', source: 'kafka', target: 'notification-service', animated: true }
      );

      // RabbitMQ connections
      newEdges.push(
        { id: 'transaction-rabbitmq', source: 'transaction-service', target: 'rabbitmq', animated: true },
        { id: 'rabbitmq-account', source: 'rabbitmq', target: 'account-service', animated: true }
      );

      // Database connections
      services.forEach(service => {
        if (service.database && service.id !== 'postgresql') {
          newEdges.push({
            id: `${service.id}-db`,
            source: service.id,
            target: 'postgresql',
            animated: false,
            style: { stroke: '#6B7280', strokeDasharray: '5,5' }
          });
        }
      });

      // Discovery connections
      newEdges.push(
        { id: 'budget-eureka', source: 'budget-service', target: 'eureka', animated: false, style: { stroke: '#6B7280', strokeDasharray: '5,5' } },
        { id: 'goal-eureka', source: 'goal-service', target: 'eureka', animated: false, style: { stroke: '#6B7280', strokeDasharray: '5,5' } },
        { id: 'transaction-consul', source: 'transaction-service', target: 'consul', animated: false, style: { stroke: '#6B7280', strokeDasharray: '5,5' } },
        { id: 'account-consul', source: 'account-service', target: 'consul', animated: false, style: { stroke: '#6B7280', strokeDasharray: '5,5' } }
      );
    }
    // Deployment view would have different connections
    else {
      // Simple connections for deployment view
      services.forEach(service => {
        if (service.id !== 'postgresql' && service.id !== 'kafka' && service.id !== 'rabbitmq') {
          newEdges.push({
            id: `${service.id}-deployment`,
            source: service.id,
            target: service.id === 'api-gateway' ? 'eureka' : 'postgresql',
            animated: false
          });
        }
      });
    }

    setNodes(newNodes);
    setEdges(newEdges);
  }, [services, viewMode]);

  useEffect(() => {
    // Animate message flows
    if (messageFlows.length > 0) {
      setActiveFlows(prev => [...prev, messageFlows[messageFlows.length - 1]]);

      // Remove the flow after animation completes
      const timer = setTimeout(() => {
        setActiveFlows(prev => prev.slice(1));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [messageFlows]);

  const getPosition = (id: string, viewMode: string): { x: number; y: number } => {
    // Position services based on view mode
    const positions: Record<string, Record<string, { x: number; y: number }>> = {
      logical: {
        'api-gateway': { x: 400, y: 50 },
        'budget-service': { x: 200, y: 150 },
        'transaction-service': { x: 200, y: 300 },
        'goal-service': { x: 200, y: 450 },
        'account-service': { x: 600, y: 300 },
        'notification-service': { x: 600, y: 150 },
        'kafka': { x: 400, y: 150 },
        'rabbitmq': { x: 400, y: 300 },
        'postgresql': { x: 400, y: 550 },
        'eureka': { x: 700, y: 50 },
        'consul': { x: 700, y: 450 }
      },
      deployment: {
        'api-gateway': { x: 200, y: 50 },
        'budget-service': { x: 200, y: 150 },
        'transaction-service': { x: 200, y: 250 },
        'goal-service': { x: 200, y: 350 },
        'account-service': { x: 200, y: 450 },
        'notification-service': { x: 200, y: 550 },
        'postgresql': { x: 500, y: 300 },
        'kafka': { x: 500, y: 150 },
        'rabbitmq': { x: 500, y: 450 },
        'eureka': { x: 700, y: 150 },
        'consul': { x: 700, y: 450 }
      }
    };

    return positions[viewMode][id] || { x: 100, y: 100 };
  };

  const nodeTypes = {
    service: ServiceNode,
  };

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    const service = services.find(s => s.id === node.id);
    if (service) {
      onServiceClick(service);
    }
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
      >
        <Background />
        <Controls />
        {activeFlows.map((flow, index) => (
          <MessageFlowAnimation key={index} flow={flow} />
        ))}
      </ReactFlow>
    </div>
  );
};

// Add this outside the main component
const MessageFlowAnimation: React.FC<{ flow: MessageFlow }> = ({ flow }) => {
  const getFlowColor = (type: string) => {
    switch (type) {
      case 'kafka': return '#6B7280';
      case 'rabbitmq': return '#EF4444';
      default: return '#3B82F6';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'absolute',
        backgroundColor: getFlowColor(flow.type),
        color: 'white',
        padding: '8px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        zIndex: 1000,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}
    >
      {flow.message}
    </motion.div>
  );
};

// Wrap the component with ReactFlowProvider for the parent component
const ArchitectureGraphWrapper: React.FC<ArchitectureGraphProps> = (props) => {
  return (
    <ReactFlowProvider>
      <ArchitectureGraph {...props} />
    </ReactFlowProvider>
  );
};

export default ArchitectureGraphWrapper;
