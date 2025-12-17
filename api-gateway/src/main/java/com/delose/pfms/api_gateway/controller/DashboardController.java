package com.delose.pfms.api_gateway.controller;

import org.springframework.boot.actuate.metrics.MetricsEndpoint;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DashboardController {
    private final MetricsEndpoint metricsEndpoint;

    public DashboardController(MetricsEndpoint metricsEndpoint) {
        this.metricsEndpoint = metricsEndpoint;
    }

    @GetMapping("/dashboard")
    public String getDashboard(Model model) {
        var memoryUsed = metricsEndpoint.metric("jvm.memory.used", null).getMeasurements().get(0).getValue();
        var cpuUsage = metricsEndpoint.metric("system.cpu.usage", null).getMeasurements().get(0).getValue();

        model.addAttribute("memoryUsed", String.format("%2f MB", memoryUsed));
        model.addAttribute("cpuUsage", String.format("%2f%%", cpuUsage * 100));
        model.addAttribute("appName", "API Gateway Monitor");

        return "dashboard";
    }
}
