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

func assertResponse(t *testing.T, StatusCode int, Error string, Message string, respStatusCode int, response *errorResponse) {
	assert.Equal(t, StatusCode, respStatusCode)
	if response != nil {
		assert.Equal(t, Error, response.Error)
		assert.Equal(t, Message, response.Message)
	}

	assert.Equal(t, StatusCode, respStatusCode)
	assert.Equal(t, Error, response.Error)
	assert.Equal(t, Message, response.Message)
}

func createAsset(t *testing.T, Name string, Code string, Amount string, AssetType string, SetFlags []string, StatusCode int, Message string, Error string, errorB bool) (bool, entity.Asset) {
	requestBody := v1.CreateAssetRequest{
		SponsorId: 1,
		Name:      Name,
		Code:      Code,
		Amount:    Amount,
		AssetType: AssetType,
		SetFlags:  SetFlags,
	}

	var responseObj interface{}

	if errorB {
		responseObj = &errorResponse{}
	} else {
		responseObj = &entity.Asset{}
	}

	statusCode, err := executePostRequest(t, basePath+"/assets", _user.Token, requestBody, responseObj)
	assert.NoError(t, err)

	if errorB {
		assertResponse(t, StatusCode, Error, Message, statusCode, responseObj.(*errorResponse))
		return true, entity.Asset{}
	} else {
		response := responseObj.(*entity.Asset)
		assert.Equal(t, Name, response.Name)
		assert.Equal(t, Code, response.Code)
		assert.Equal(t, AssetType, response.AssetType)
		return true, *response
	}
}

func transferAsset(t *testing.T, SourceWalletID int, DestinationWalletPK string, AssetID string, Amount string, StatusCode int, Error string, Message string) bool {
	requestBody := v1.TransferAssetRequest{
		SourceWalletID:      SourceWalletID,
		DestinationWalletPK: DestinationWalletPK,
		AssetID:             AssetID,
		Amount:              Amount,
		SponsorId:           1,
	}

	var response errorResponse
	statusCode, err := executePostRequest(t, basePath+"/assets/transfer", _user.Token, requestBody, &response)
	assert.NoError(t, err)

	assertResponse(t, StatusCode, Error, Message, statusCode, &response)
	return true
}

func executeGetRequest(t *testing.T, url string, token string, responseObj interface{}) (int, error) {
	req, err := http.NewRequest(http.MethodGet, url, nil)
	assert.NoError(t, err)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", token)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()

	err = json.NewDecoder(resp.Body).Decode(responseObj)
	return resp.StatusCode, err
}

func executePostRequest(t *testing.T, url string, token string, requestBody interface{}, responseObj interface{}) (int, error) {
	requestBodyBytes, err := json.Marshal(requestBody)
	assert.NoError(t, err)

	req, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(requestBodyBytes))
	assert.NoError(t, err)
	req.Header.Set("Content-Type", "application/json")
	if token != "" {
		req.Header.Set("Authorization", token)
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()

	err = json.NewDecoder(resp.Body).Decode(responseObj)
	return resp.StatusCode, err
}
