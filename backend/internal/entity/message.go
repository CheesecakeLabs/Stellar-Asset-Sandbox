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
)
