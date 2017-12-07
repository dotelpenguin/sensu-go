package e2e

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/sensu/sensu-go/cli/client"
	"github.com/sensu/sensu-go/cli/client/config/basic"
)

// newSensuClient is deprecated, newSensuCtl should be used instead
func newSensuClient(backendHTTPURL string) *client.RestClient {
	config := &basic.Config{
		Cluster: basic.Cluster{
			APIUrl: backendHTTPURL,
		},
	}
	client := client.New(config)
	tokens, _ := client.CreateAccessToken(backendHTTPURL, "admin", "P@ssw0rd!")
	config.Cluster.Tokens = tokens

	return client
}

func waitForBackend(url string) bool {
	for i := 0; i < 10; i++ {
		resp, getErr := http.Get(fmt.Sprintf("%s/health", url))
		if getErr != nil {
			log.Println("backend not ready, sleeping...")
			time.Sleep(1 * time.Second)
			continue
		}
		resp.Body.Close()

		if resp.StatusCode != 200 && resp.StatusCode != 401 {
			log.Printf("backend returned non-200/401 status code: %d\n", resp.StatusCode)
			time.Sleep(1 * time.Second)
			continue
		}

		log.Println("backend ready")
		return true
	}
	return false
}
