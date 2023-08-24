package integration_test

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"testing"
	"time"
)

type errrorResponse struct {
	Message string `json:"message"`
	Error   string `json:"error,omitempty"`
}

const (
	host       = "localhost:8080"
	healthPath = "http://" + host + "/healthz"
	attempts   = 20

	// HTTP REST
	basePath = "http://" + host + "/v1"
)

func TestMain(m *testing.M) {
	err := healthCheck(attempts)
	if err != nil {
		log.Fatalf("Integration tests: host %s is not available: %s", host, err)
	}
	log.Printf("Integration tests: host %s is available", host)

	code := m.Run()
	os.Exit(code)
}

func healthCheck(attempts int) error {
	client := &http.Client{}

	for attempts > 0 {
		req, err := http.NewRequest(http.MethodGet, healthPath, nil)
		if err != nil {
			return err
		}

		resp, err := client.Do(req)
		if err == nil && resp.StatusCode == http.StatusOK {
			return nil
		}

		if err != nil {
			log.Printf("Integration tests: error connecting to %s: %s", healthPath, err)
		} else {
			log.Printf("Integration tests: url %s returned status %d, attempts left: %d", healthPath, resp.StatusCode, attempts)
		}

		time.Sleep(time.Second)

		attempts--
	}

	return fmt.Errorf("Integration tests: failed to connect to %s after %d attempts", healthPath, attempts)
}
