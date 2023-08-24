package integration_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"testing"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/stretchr/testify/assert"
)

var _wallet = entity.Wallet{}

func TestCreateWalletSuccess(t *testing.T) {
	// URL for creating a wallet
	createWalletPath := basePath + "/wallets"

	// Use a predefined wallet for testing or create one
	requestBody := map[string]string{
		"type": "sponsor",
	}
	requestBodyBytes, err := json.Marshal(requestBody)
	assert.NoError(t, err)

	// Create the HTTP request
	req, err := http.NewRequest(http.MethodPost, createWalletPath, bytes.NewBuffer(requestBodyBytes))
	assert.NoError(t, err)

	// Add necessary headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", _user.Token)
	// Execute the request
	client := &http.Client{}
	resp, err := client.Do(req)
	assert.NoError(t, err)
	defer resp.Body.Close()

	// Verify the status code
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	// Parse and verify the response body
	var response entity.Wallet
	err = json.NewDecoder(resp.Body).Decode(&response)
	assert.NoError(t, err)

	// Verify the response contents (you can expand this to verify other fields)
	assert.Equal(t, "sponsor", response.Type)
	assert.False(t, response.Funded)

	_wallet = response
}

func TestCreateWalletFail(t *testing.T) {
	// URL for creating a wallet
	createWalletPath := basePath + "/wallets"

	// Use a predefined wallet for testing or create one
	requestBody := map[string]string{}

	requestBodyBytes, err := json.Marshal(requestBody)
	assert.NoError(t, err)

	// Create the HTTP request
	req, err := http.NewRequest(http.MethodPost, createWalletPath, bytes.NewBuffer(requestBodyBytes))
	assert.NoError(t, err)

	// Add necessary headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", _user.Token)

	// Execute the request
	client := &http.Client{}
	resp, err := client.Do(req)
	assert.NoError(t, err)
	defer resp.Body.Close()

	// Verify the status code
	assert.Equal(t, http.StatusBadRequest, resp.StatusCode)

	// Parse and verify the response body
	var response errrorResponse
	err = json.NewDecoder(resp.Body).Decode(&response)
	assert.NoError(t, err)

	// Verify the response contents (you can expand this to verify other fields)
	assert.Equal(t, "invalid request body", response.Message)
	assert.Equal(t, "Key: 'CreateWalletRequest.Type' Error:Field validation for 'Type' failed on the 'required' tag", response.Error)
}

func TestFundWalletSucess(t *testing.T) {
	// URL for creating a wallet
	fundWalletPath := basePath + "/wallets/fund"

	// Use a predefined wallet for testing or create one
	requestBody := map[string]int{
		"id": 1,
	}
	requestBodyBytes, err := json.Marshal(requestBody)
	assert.NoError(t, err)

	// Create the HTTP request
	req, err := http.NewRequest(http.MethodPost, fundWalletPath, bytes.NewBuffer(requestBodyBytes))
	assert.NoError(t, err)

	// Add necessary headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", _user.Token)
	// Execute the request
	client := &http.Client{}
	resp, err := client.Do(req)
	assert.NoError(t, err)
	defer resp.Body.Close()

	// Verify the status code
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	// Parse and verify the response body
	var response entity.Wallet
	err = json.NewDecoder(resp.Body).Decode(&response)

	assert.NoError(t, err)

	// Verify the response contents (you can expand this to verify other fields)
	assert.Equal(t, "sponsor", response.Type)
	assert.True(t, response.Funded)
}

func TestFundWalletFail(t *testing.T) {
	// URL for creating a wallet
	fundWalletPath := basePath + "/wallets/fund"

	// Use a predefined wallet for testing or create one
	requestBody := map[string]int{
		"id": 1,
	}
	requestBodyBytes, err := json.Marshal(requestBody)
	assert.NoError(t, err)

	// Create the HTTP request
	req, err := http.NewRequest(http.MethodPost, fundWalletPath, bytes.NewBuffer(requestBodyBytes))
	assert.NoError(t, err)

	// Add necessary headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", _user.Token)
	// Execute the request
	client := &http.Client{}
	resp, err := client.Do(req)
	assert.NoError(t, err)
	defer resp.Body.Close()

	// Verify the status code
	assert.Equal(t, http.StatusBadRequest, resp.StatusCode)

	// Parse and verify the response body
	var response errrorResponse
	err = json.NewDecoder(resp.Body).Decode(&response)

	assert.NoError(t, err)

	// Verify the response contents (you can expand this to verify other fields)
	assert.Equal(t, "wallet is already funded", response.Message)
}

// List all wallets
func TestListWalletsSuccess(t *testing.T) {
	// URL for listing all wallets
	listWalletsPath := basePath + "/wallets"

	// Create the HTTP request
	req, err := http.NewRequest(http.MethodGet, listWalletsPath, nil)
	assert.NoError(t, err)

	// Add necessary headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", _user.Token)

	// set que query params to sponsor
	q := req.URL.Query()
	q.Add("type", "sponsor")
	req.URL.RawQuery = q.Encode()

	// Execute the request
	client := &http.Client{}
	resp, err := client.Do(req)
	assert.NoError(t, err)
	defer resp.Body.Close()

	// Verify the status code
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	// Parse and verify the response body
	var response []entity.Wallet
	err = json.NewDecoder(resp.Body).Decode(&response)

	assert.NoError(t, err)

	// Verify the response contents (you can expand this to verify other fields)
	assert.Equal(t, 1, len(response))
	assert.Equal(t, "sponsor", response[0].Type)
	assert.True(t, response[0].Funded)
}
