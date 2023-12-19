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

	EnvelopeRequest struct {
		Id         int
		MainSource string
		PublicKeys []string
		Operations []Operation
		FeeBump    string
	}

	EnvelopeResponse struct {
		Id         int         `json:"id"`
		Hash       string      `json:"hash"`
		StatusCode int         `json:"statusCode"`
		Error      interface{} `json:"error"`
	}

	Operation struct {
		Type                 string
		Origin               string
		Target               string
		Sponsor              string
		Amount               string
		Asset                OpAsset
		Order                int
		InflationDestination *string
		SetFlags             []string
		ClearFlags           []string
		MasterWeight         *uint8
		LowThreshold         *uint8
		MediumThreshold      *uint8
		HighThreshold        *uint8
		HomeDomain           *string
		Signer               *Signer
		TrustLimit           *int
		Trustor              string
	}

	OpAsset struct {
		Code   string `json:"code"`
		Issuer string `json:"issuer"`
	}

	Signer struct {
		Account string
		Weight  uint8
	}

	SignTransactionRequest struct {
		Id         int      `json:"id"`
		Envelope   string   `json:"envelope"`
		PublicKeys []string `json:"publicKeys"`
		Hash       string   `json:"hash"`
	}

	SorobanTransactionResponse struct {
		Id       int    `json:"id"`
		Envelope string `json:"envelope"`
	}

	SubmitRequest struct {
		Id       int    `json:"id"`
		Envelope string `json:"envelope"`
	}
)
