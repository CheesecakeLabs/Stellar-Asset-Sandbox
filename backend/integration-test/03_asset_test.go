package integration_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"testing"

	v1 "github.com/CheesecakeLabs/token-factory-v2/backend/internal/controller/http/v1"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/stretchr/testify/assert"
)

var (
	_asset_1 entity.Asset
	_asset_2 entity.Asset
	_asset_3 entity.Asset
)

func TestCreateAsset1Success(t *testing.T) {
	// URL for creating a asset
	createAssetPath := basePath + "/assets"

	// Use a predefined asset for testing or create one
	requestBody := map[string]string{
		"name":             "USD COIN",
		"code":             "USDC",
		"amount":           "10000",
		"asset_type":       "STABLECOIN",
		"controlMechanism": "[\"AUTH_REQUIRED\",\"AUTH_REVOCABLE\",\"AUTH_CLAWBACK_ENABLED\"]",
	}

	requestBodyBytes, err := json.Marshal(requestBody)
	assert.NoError(t, err)

	// Create the HTTP request
	req, err := http.NewRequest(http.MethodPost, createAssetPath, bytes.NewBuffer(requestBodyBytes))
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
	var response entity.Asset
	err = json.NewDecoder(resp.Body).Decode(&response)
	assert.NoError(t, err)

	// Verify the response contents
	assert.Equal(t, "USD COIN", response.Name)
	assert.Equal(t, "USDC", response.Code)
	assert.Equal(t, "STABLECOIN", response.AssetType)

	_asset_1 = response
}

func TestCreateAssetFail(t *testing.T) {
	// URL for creating a asset
	createAssetPath := basePath + "/assets"

	// Use a predefined asset for testing or create one
	requestBody := map[string]string{}

	requestBodyBytes, err := json.Marshal(requestBody)
	assert.NoError(t, err)

	// Create the HTTP request
	req, err := http.NewRequest(http.MethodPost, createAssetPath, bytes.NewBuffer(requestBodyBytes))
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

	// Verify the response contents
	assert.Equal(t, "invalid request body: Key: 'CreateAssetRequest.Name' Error:Field validation for 'Name' failed on the 'required' tag\nKey: 'CreateAssetRequest.AssetType' Error:Field validation for 'AssetType' failed on the 'required' tag\nKey: 'CreateAssetRequest.Code' Error:Field validation for 'Code' failed on the 'required' tag", response.Message)
	assert.Equal(t, "Key: 'CreateAssetRequest.Name' Error:Field validation for 'Name' failed on the 'required' tag\nKey: 'CreateAssetRequest.AssetType' Error:Field validation for 'AssetType' failed on the 'required' tag\nKey: 'CreateAssetRequest.Code' Error:Field validation for 'Code' failed on the 'required' tag", response.Error)
}

func TestGetAllAssetsSuccess(t *testing.T) {
	// URL for getting all assets
	getAllAssetsPath := basePath + "/assets"

	// Create the HTTP request
	req, err := http.NewRequest(http.MethodGet, getAllAssetsPath, nil)
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
	var response []entity.Asset
	err = json.NewDecoder(resp.Body).Decode(&response)
	assert.NoError(t, err)

	// Verify the response contents
	assert.NotEmpty(t, response)

	// Verify the response contents
	assert.Equal(t, "USD COIN", response[0].Name)
	assert.Equal(t, "USDC", response[0].Code)
	assert.Equal(t, "STABLECOIN", response[0].AssetType)
}

func TestGetAssetByIdSuccess(t *testing.T) {
	// URL for getting a asset
	getAssetPath := basePath + "/assets/" + "1"

	// Create the HTTP request
	req, err := http.NewRequest(http.MethodGet, getAssetPath, nil)
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
	var response entity.Asset
	err = json.NewDecoder(resp.Body).Decode(&response)
	assert.NoError(t, err)

	// Verify the response contents
	assert.Equal(t, "USD COIN", response.Name)
	assert.Equal(t, "USDC", response.Code)
	assert.Equal(t, "STABLECOIN", response.AssetType)
}

func TestGetAssetByIdFailed(t *testing.T) {
	// URL for getting a asset
	getAssetPath := basePath + "/assets/" + "1000"

	// Create the HTTP request
	req, err := http.NewRequest(http.MethodGet, getAssetPath, nil)
	assert.NoError(t, err)

	// Add necessary headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", _user.Token)

	// Execute the request
	client := &http.Client{}
	resp, err := client.Do(req)
	assert.NoError(t, err)
	defer resp.Body.Close()

	// Parse and verify the response body
	var response errrorResponse
	err = json.NewDecoder(resp.Body).Decode(&response)
	assert.NoError(t, err)

	// Verify the response contents
	assert.Equal(t, "error getting asset", response.Message)
	assert.Equal(t, "AssetUseCase - Get - uc.repo.GetAssetByCode: AssetRepo - GetAssetById - asset not found", response.Error)
}

func TestMintAssetSuccess(t *testing.T) {
	// URL for mint a asset
	mintAssetPath := basePath + "/assets/mint"

	// Use a predefined asset for testing or create one
	requestBody := v1.MintAssetRequest{
		Id:        "1",
		SponsorId: 1,
		Code:      "USDC", // Adding the missing Code field
		Amount:    "10000",
	}

	requestBodyBytes, err := json.Marshal(requestBody)
	assert.NoError(t, err)

	// Create the HTTP request
	req, err := http.NewRequest(http.MethodPost, mintAssetPath, bytes.NewBuffer(requestBodyBytes))
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
	var response errrorResponse
	err = json.NewDecoder(resp.Body).Decode(&response)
	assert.NoError(t, err)

	// Verify the response contents
	assert.Equal(t, "asset minted", response.Message)
}

func TestMintAssetUnauthorized(t *testing.T) {
	// URL for minting a asset
	mintAssetPath := basePath + "/assets/mint"

	// Use a predefined asset for testing or create one
	requestBody := map[string]string{
		"id":         "1",
		"amount":     "1000000",
		"sponsor_id": "1",
	}

	requestBodyBytes, err := json.Marshal(requestBody)
	assert.NoError(t, err)

	// Create the HTTP request
	req, err := http.NewRequest(http.MethodPost, mintAssetPath, bytes.NewBuffer(requestBodyBytes))
	assert.NoError(t, err)

	// Add necessary headers
	req.Header.Set("Content-Type", "application/json")

	// Execute the request
	client := &http.Client{}
	resp, err := client.Do(req)
	assert.NoError(t, err)
	defer resp.Body.Close()

	// Verify the status code
	assert.Equal(t, http.StatusUnauthorized, resp.StatusCode)

	// Parse and verify the response body
	var response errrorResponse
	err = json.NewDecoder(resp.Body).Decode(&response)
	assert.NoError(t, err)

	// Verify the response contents
	assert.Equal(t, "request does not contain an access token", response.Error)
}

func TestBurnAssetSuccess(t *testing.T) {
	// URL for burning a asset
	burnAssetPath := basePath + "/assets/burn"

	// Use a predefined asset for testing or create one
	requestBody := v1.BurnAssetRequest{
		Id:        "1",
		SponsorId: 1,
		Amount:    "500",
	}

	requestBodyBytes, err := json.Marshal(requestBody)
	assert.NoError(t, err)

	// Create the HTTP request
	req, err := http.NewRequest(http.MethodPost, burnAssetPath, bytes.NewBuffer(requestBodyBytes))
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
	var response errrorResponse
	err = json.NewDecoder(resp.Body).Decode(&response)
	assert.NoError(t, err)

	// Verify the response contents
	assert.Equal(t, "Asset burned successfully", response.Message)
}

func TestBurnAssetFailed(t *testing.T) {
	// URL for burning a asset
	burnAssetPath := basePath + "/assets/burn"

	// Use a predefined asset for testing or create one
	requestBody := v1.BurnAssetRequest{
		Id:        "1",
		SponsorId: 1,
		Amount:    "10000000000", // Burn more than the amount available
	}

	requestBodyBytes, err := json.Marshal(requestBody)
	assert.NoError(t, err)

	// Create the HTTP request
	req, err := http.NewRequest(http.MethodPost, burnAssetPath, bytes.NewBuffer(requestBodyBytes))
	assert.NoError(t, err)

	// Add necessary headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", _user.Token)

	// Execute the request
	client := &http.Client{}
	resp, err := client.Do(req)
	assert.NoError(t, err)
	defer resp.Body.Close()

	// Parse and verify the response body
	var response errrorResponse
	err = json.NewDecoder(resp.Body).Decode(&response)
	assert.NoError(t, err)

	// Verify the response contents
	assert.Equal(t, "starlabs messaging problems", response.Message)
}

func TestCreateAsset2Success(t *testing.T) {
	// URL for creating a asset
	createAssetPath := basePath + "/assets"

	// Use a predefined asset for testing or create one
	requestBody := map[string]string{
		"name":             "Argentine Peso",
		"code":             "ARS",
		"amount":           "10000",
		"asset_type":       "PAYMENT_TOKEN",
		"controlMechanism": "[\"AUTH_REQUIRED\",\"AUTH_REVOCABLE\",\"AUTH_CLAWBACK_ENABLED\"]",
	}

	requestBodyBytes, err := json.Marshal(requestBody)
	assert.NoError(t, err)

	// Create the HTTP request
	req, err := http.NewRequest(http.MethodPost, createAssetPath, bytes.NewBuffer(requestBodyBytes))
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
	var response entity.Asset
	err = json.NewDecoder(resp.Body).Decode(&response)
	assert.NoError(t, err)

	// Verify the response contents
	assert.Equal(t, "Argentine Peso", response.Name)
	assert.Equal(t, "ARS", response.Code)
	assert.Equal(t, "PAYMENT_TOKEN", response.AssetType)
	_asset_2 = response
}

func TestCreateAsset3Success(t *testing.T) {
	// URL for creating a asset
	createAssetPath := basePath + "/assets"

	// Use a predefined asset for testing or create one
	requestBody := map[string]string{
		"name":             "British Pound Sterling",
		"code":             "GBPC",
		"amount":           "40000",
		"asset_type":       "PAYMENT_TOKEN",
		"controlMechanism": "[\"AUTH_REQUIRED\",\"AUTH_REVOCABLE\",\"AUTH_CLAWBACK_ENABLED\"]",
	}

	requestBodyBytes, err := json.Marshal(requestBody)
	assert.NoError(t, err)

	// Create the HTTP request
	req, err := http.NewRequest(http.MethodPost, createAssetPath, bytes.NewBuffer(requestBodyBytes))
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
	var response entity.Asset
	err = json.NewDecoder(resp.Body).Decode(&response)
	assert.NoError(t, err)

	// Verify the response contents
	assert.Equal(t, "British Pound Sterling", response.Name)
	assert.Equal(t, "GBPC", response.Code)
	assert.Equal(t, "PAYMENT_TOKEN", response.AssetType)
	_asset_3 = response
}
