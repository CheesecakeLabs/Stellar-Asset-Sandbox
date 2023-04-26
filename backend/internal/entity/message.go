package entity

type (
	NotifyData struct {
		Key      string
		Message  interface{}
		Producer ProducerInterface
	}

	Request struct {
		CreateKeypair CreateKeypairRequest
	}

	CreateKeypairRequest struct {
		Amount int `json:"amount"`
	}

	CreateKeypairResponse struct {
		PublicKeys []string `json:"publicKeys"`
	}

	HorizonRequest struct {
		Id      int    `json:"id"`
		Type    string `json:"type"`
		Account string `json:"account"`
	}

	HorizonResponse struct {
		Id         int `json:"id"`
		StatusCode int `json:"statusCode"`
	}
)
