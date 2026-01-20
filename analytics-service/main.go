package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type AnalyticsData struct {
	Service   string    `json:"service"`
	Status    string    `json:"status"`
	Timestamp time.Time `json:"timestamp"`
}

func main() {
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		fmt.Fprint(w, "Analytics service is healthy")
	})

	http.HandleFunc("/api/analytics", func(w http.ResponseWriter, r *http.Request) {
		data := AnalyticsData{
			Service:   "Analytics",
			Status:    "Active",
			Timestamp: time.Now(),
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(data)
	})

	fmt.Println("Analytics service starting on port 8081...")
	if err := http.ListenAndServe(":8081", nil); err != nil {
		fmt.Printf("Error starting server: %s\n", err)
	}
}



