package integration_test

import (
	"log"
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

// *---------- Create Asset Tests ----------*

func TestCreateAsset1Sucess(t *testing.T) {
	success, asset := createAsset(t, "USD COIN", "USDC", "100000", "STABLECOIN", []string{"AUTH_REQUIRED_FLAG", "AUTH_CLAWBACK_ENABLED", "AUTH_REVOCABLE_FLAG"}, http.StatusOK, "Asset created successfully", "", false)

	if success {
		_asset_1 = asset
	} else {
		t.Errorf("Expected asset creation to be successful")
	}
}

func TestCreateAsset2Success(t *testing.T) {
	sucess, asset := createAsset(t, "Argentine Peso", "ARS", "10000", "PAYMENT_TOKEN", []string{"AUTH_REQUIRED_FLAG", "AUTH_REVOCABLE_FLAG"}, http.StatusOK, "Asset created successfully", "", false)
	if sucess {
		_asset_2 = asset
	} else {
		t.Errorf("Expected asset creation to be successful")
	}
}

func TestCreateAsset3Success(t *testing.T) {
	sucess, asset := createAsset(t, "British Pound Sterling", "GBPC", "40000", "PAYMENT_TOKEN", []string{"AUTH_REQUIRED_FLAG", "AUTH_REVOCABLE_FLAG"}, http.StatusOK, "Asset created successfully", "", false)
	if sucess {
		_asset_3 = asset
	} else {
		t.Errorf("Expected asset creation to be successful")
	}
}

func TestCreateAssetFailedWithoutCode(t *testing.T) {
	sucess, _ := createAsset(t, "USD COIN", "", "100000", "STABLECOIN", []string{"AUTH_REQUIRED_FLAG", "AUTH_CLAWBACK_ENABLED", "AUTH_REVOCABLE_FLAG"}, http.StatusBadRequest, "invalid request body: Key: 'CreateAssetRequest.Code' Error:Field validation for 'Code' failed on the 'required' tag", "Key: 'CreateAssetRequest.Code' Error:Field validation for 'Code' failed on the 'required' tag", true)

	if !sucess {
		t.Errorf("Expected asset creation to fail")
	}
}

func TestCreateAssetFailedWithoutName(t *testing.T) {
	sucess, _ := createAsset(t, "", "USDC", "100000", "STABLECOIN", []string{"AUTH_REQUIRED_FLAG", "AUTH_CLAWBACK_ENABLED", "AUTH_REVOCABLE_FLAG"}, http.StatusBadRequest, "invalid request body: Key: 'CreateAssetRequest.Name' Error:Field validation for 'Name' failed on the 'required' tag", "Key: 'CreateAssetRequest.Name' Error:Field validation for 'Name' failed on the 'required' tag", true)

	if !sucess {
		t.Errorf("Expected asset creation to fail")
	}
}

// *---------- Get Asset Tests ----------*
func TestGetAllAssetsSuccess(t *testing.T) {
	var response []entity.Asset
	statusCode, err := executeGetRequest(t, basePath+"/assets", _user.Token, &response)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, statusCode)
	assert.NotEmpty(t, response)
	assert.Equal(t, 3, len(response))
}

func TestGetAssetByIdSuccess(t *testing.T) {
	var response entity.Asset
	statusCode, err := executeGetRequest(t, basePath+"/assets/1", _user.Token, &response)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, statusCode)
	assert.Equal(t, "USD COIN", response.Name)
	assert.Equal(t, "USDC", response.Code)
	assert.Equal(t, "STABLECOIN", response.AssetType)
}

func TestGetAssetByIdFailed(t *testing.T) {
	var response errorResponse
	statusCode, err := executeGetRequest(t, basePath+"/assets/1000", _user.Token, &response)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusInternalServerError, statusCode)
	assert.Equal(t, "error getting asset", response.Message)
	assert.Equal(t, "AssetUseCase - Get - uc.repo.GetAssetByCode: AssetRepo - GetAssetById - asset not found", response.Error)
}

// *---------- Mint Asset Tests ----------*
func TestMintAssetSuccess(t *testing.T) {
	var response errorResponse
	requestBody := v1.MintAssetRequest{
		Id:        "1",
		SponsorId: 1,
		Code:      "USDC",
		Amount:    "10000",
	}
	statusCode, err := executePostRequest(t, basePath+"/assets/mint", _user.Token, requestBody, &response)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, statusCode)
	assert.Equal(t, "asset minted", response.Message)
}

func TestMintAssetUnauthorized(t *testing.T) {
	var response errorResponse
	requestBody := map[string]string{
		"id":         "1",
		"amount":     "1000000",
		"sponsor_id": "1",
	}
	statusCode, err := executePostRequest(t, basePath+"/assets/mint", "", requestBody, &response)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusUnauthorized, statusCode)
	assert.Equal(t, "request does not contain an access token", response.Error)
}

func TestMintAssetFailedWithInvalidSponsorId(t *testing.T) {
	var response errorResponse
	requestBody := v1.MintAssetRequest{
		Id:        "1",
		SponsorId: 1000,
		Amount:    "1000000",
		Code:      _asset_1.Code,
	}
	statusCode, err := executePostRequest(t, basePath+"/assets/mint", _user.Token, requestBody, &response)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusNotFound, statusCode)
	assert.Equal(t, "sponsor wallet not found", response.Message)
	assert.Equal(t, "WalletUseCase - Get - uc.repo.GetWallet: WalletRepo - GetWallet - wallet not found", response.Error)
}

func TestMintAssetFailedWithInvalidAssetId(t *testing.T) {
	var response errorResponse
	requestBody := v1.MintAssetRequest{
		Id:        "1000",
		SponsorId: 1,
		Amount:    "1000000",
		Code:      _asset_1.Code,
	}
	statusCode, err := executePostRequest(t, basePath+"/assets/mint", _user.Token, requestBody, &response)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusNotFound, statusCode)
	assert.Equal(t, "asset not found", response.Message)
	assert.Equal(t, "AssetUseCase - Get - uc.repo.GetAssetByCode: AssetRepo - GetAssetById - asset not found", response.Error)
}

// *---------- Burn Asset Tests ----------*
func TestBurnAssetSuccess(t *testing.T) {
	var response errorResponse
	requestBody := v1.BurnAssetRequest{
		Id:        "1",
		SponsorId: 1,
		Amount:    "500",
	}
	statusCode, err := executePostRequest(t, basePath+"/assets/burn", _user.Token, requestBody, &response)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, statusCode)
	assert.Equal(t, "Asset burned successfully", response.Message)
}

func TestBurnAssetFailed(t *testing.T) {
	var response errorResponse
	requestBody := v1.BurnAssetRequest{
		Id:        "1",
		SponsorId: 1,
		Amount:    "10000000000", // Burn more than the amount available
	}
	statusCode, err := executePostRequest(t, basePath+"/assets/burn", _user.Token, requestBody, &response)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusInternalServerError, statusCode)
	assert.Equal(t, "starlabs messaging problems", response.Message)
}

// *---------- Authorization Flags Tests ----------*
func TestSetAuthRequiredFlagSuccess(t *testing.T) {
	var response errorResponse
	log.Println("Oi  Asset , ", _asset_1.Issuer)
	log.Println("Oi Wallet , ", _walletUser.Id)
	requestBody := v1.UpdateAuthFlagsRequest{
		TrustorPK: _walletUser.Key.PublicKey,
		Code:      _asset_1.Code,
		Issuer:    _asset_1.Issuer.Id,
		SetFlags:  []string{"TRUST_LINE_AUTHORIZED"},
	}

	statusCode, err := executePostRequest(t, basePath+"/assets/update-auth-flags", _user.Token, requestBody, &response)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, statusCode)
	assert.Equal(t, "authorization flags updated successfully", response.Message)
}

// *---------- Transfer Asset Tests ----------*
// func TestTransferAssetSuccess(t *testing.T) {
// 	if !transferAsset(t, 4, _walletUser.Key.PublicKey, strconv.Itoa(_asset_1.Id), "10000", http.StatusOK, "", "Asset transferred successfully") {
// 		t.Errorf("Expected asset to be transferred successfully")
// 	}
// }

// func TestTransferAssetMissingParameters(t *testing.T) {
// 	if transferAsset(0, "", "", "") {
// 		t.Errorf("Expected asset transfer to fail due to missing parameters")
// 	}
// }

// func TestTransferAssetInvalidSourceWalletID(t *testing.T) {
// 	if transferAsset(-1, "valid_wallet_pk", "valid_asset_id", "100") {
// 		t.Errorf("Expected asset transfer to fail due to invalid SourceWalletID")
// 	}
// }

// func TestTransferAssetInvalidDestinationWalletPK(t *testing.T) {
// 	if transferAsset(1, "invalid_wallet_pk", "valid_asset_id", "100") {
// 		t.Errorf("Expected asset transfer to fail due to invalid DestinationWalletPK")
// 	}
// }

//  *---------- Clawback Asset Tests ----------*

// func TestClawbackAsset2Failed(t *testing.T) {
// 	// URL for clawback a asset
// 	clawbackAssetPath := basePath + "/assets/clawback"

// 	// Use a predefined asset for testing or create one
// 	requestBody := v1.ClawbackAssetRequest{
// 		SponsorId: 1,
// 		Code:      _asset_2.Code,
// 		From:      _asset_2.Distributor.Key.PublicKey,
// 		Amount:    "10000",
// 	}

// 	requestBodyBytes, err := json.Marshal(requestBody)
// 	assert.NoError(t, err)

// 	// Create the HTTP request
// 	req, err := http.NewRequest(http.MethodPost, clawbackAssetPath, bytes.NewBuffer(requestBodyBytes))
// 	assert.NoError(t, err)

// 	// Add necessary headers
// 	req.Header.Set("Content-Type", "application/json")
// 	req.Header.Set("Authorization", _user.Token)

// 	// Execute the request
// 	client := &http.Client{}
// 	resp, err := client.Do(req)
// 	assert.NoError(t, err)

// 	// Verify the status code
// 	assert.Equal(t, http.StatusInternalServerError, resp.StatusCode)

// 	// Parse and verify the response body
// 	var response errorResponse

// 	err = json.NewDecoder(resp.Body).Decode(&response)
// 	assert.NoError(t, err)
// 	// Verify the response contents
// 	assert.Equal(t, "starlabs messaging problems", response.Message)
// }
