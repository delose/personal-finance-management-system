package com.delose.pfms.user_service.service;

import com.netflix.appinfo.InstanceInfo;
import com.netflix.discovery.EurekaClient;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class HealthService {

    private final MeterRegistry meterRegistry;

    @Autowired
    @Lazy
    private EurekaClient eurekaClient;

    public ResponseEntity<Map<String, Object>> getContainerInfo() {
        Map<String, Object> healthData = new LinkedHashMap<>();

        InstanceInfo instanceInfo = eurekaClient.getApplicationInfoManager().getInfo();
        Map<String, Object> eurekaInfo = new LinkedHashMap<>();
        eurekaInfo.put("status", instanceInfo.getStatus().toString());
        eurekaInfo.put("instanceId", instanceInfo.getStatus().toString());
        eurekaInfo.put("appName", instanceInfo.getAppName());
        eurekaInfo.put("ipAddress", instanceInfo.getIPAddr());
        eurekaInfo.put("port", instanceInfo.getPort());
        healthData.put("eurekaDiscovery", eurekaInfo);

        Map<String, Object> metrics = new LinkedHashMap<>();
        metrics.put("jvm_memory_used_mb", getMetricValue("jvm.memory.used") / (1024 * 1024));
        metrics.put("cpu_usage", String.format("%.2f%%", getMetricValue("system.cpu.usage") * 100));
        metrics.put("uptime_seconds", getMetricValue("process.uptime"));
        healthData.put("systemMetrics", metrics);

        return ResponseEntity.ok(healthData);
    }

    private double getMetricValue(String name) {
        try {
            return meterRegistry.get(name).gauge().value();
        } catch (Exception e) {
            return 0.0;
        }
    }
}
