package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		fmt.Println("Error loading .env file:", err)
		return
	}

	email := os.Getenv("SCRIPTS_LOAD_DATA_EMAIL")
	password := os.Getenv("SCRIPTS_LOAD_DATA_PASSWORD")
	baseUrl := os.Getenv("SCRIPTS_LOAD_DATA_BASE_URL")

	createAssetEndpoint := baseUrl + "/v1/assets"
	createVaultEndpoint := baseUrl + "/v1/vault"
	loginEndpoint := baseUrl + "/v1/users/login"

	// Read data
	if len(os.Args) != 2 {
		fmt.Println("Usage: go run load_data.go <json_file>")
		return
	}
	jsonFilename := os.Args[1]
	jsonData, err := os.ReadFile(jsonFilename)
	if err != nil {
		fmt.Println("Error reading JSON file:", err)
		return
	}
	var data map[string][]map[string]interface{}
	if err := json.Unmarshal(jsonData, &data); err != nil {
		fmt.Println("Error decoding JSON data:", err)
		return
	}
	
	// Get JWT token
	loginResponse, err := performLogin(loginEndpoint, email, password)
	if err != nil {
		fmt.Println("Error performing login request:", err)
		return
	}
	jwtToken, err := extractJWTToken(loginResponse)
	if err != nil {
		fmt.Println("Error extracting JWT token:", err)
		return
	}

	var createdAssetIDs = make(map[string]string)
	// Create assets
	for _, asset := range data["assets"] {
		imagePath, hasImagePath := asset["image"].(string)
		if hasImagePath {
			imageData, err := encodeImageToBase64(imagePath)
			if err != nil {
				fmt.Println("Error encoding image to base64:", err)
				return
			}
			asset["image"] = imageData
		}
		assetBytes, err := json.Marshal(asset)
		if err != nil {
			fmt.Println("Error marshalling JSON payload for asset:", err)
			return
		}
		response, err := makePOSTRequest(createAssetEndpoint, jwtToken, assetBytes)
		if err != nil {
			fmt.Println("Error making POST request for asset:", err)
			return
		}
		
		 // Extract and store the created asset ID
		 var createdAsset map[string]interface{}
		 if err := json.Unmarshal(response, &createdAsset); err != nil {
			 fmt.Println("Error unmarshalling asset response:", err)
			 return
		 }
	 
		 createdAssetID, ok := createdAsset["id"].(string)
		 if !ok {
			 fmt.Println("Error extracting asset ID from response")
			 return
		 }
	 
		createdAssetIDs[asset["code"].(string)] = createdAssetID

		fmt.Printf("Response for asset %s: %s\n", asset["code"], string(response))
	}

	// Create vaults
	for _, vault := range data["vaults"] {
		var assetIDs []string
		for _, assetCode := range vault["asset_codes"].([]interface{}) {
			assetID, found := createdAssetIDs[assetCode.(string)]
			if found {
				assetIDs = append(assetIDs, assetID)
			} else {
				fmt.Printf("Warning: Asset name %s not found in the created assets\n", assetCode)
			}
		}

		vault["assets"] = assetIDs
		delete(vault, "asset_codes")

		vaultBytes, err := json.Marshal(vault)
		if err != nil {
			fmt.Println("Error marshalling JSON payload for vault:", err)
			return
		}
		response, err := makePOSTRequest(createVaultEndpoint, jwtToken, vaultBytes)
		if err != nil {
			fmt.Println("Error making POST request for asset:", err)
			return
		}
		fmt.Printf("Response for vault %s: %s\n", vault["name"], string(response))
	}
}

func makePOSTRequest(apiEndpoint, jwtToken string, payload []byte) ([]byte, error) {
	client := &http.Client{}

	req, err := http.NewRequest("POST", apiEndpoint, bytes.NewBuffer(payload))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", jwtToken)

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	return responseBody, nil
}

func performLogin(loginEndpoint, email, password string) ([]byte, error) {
	client := &http.Client{}

	loginPayload := map[string]string{
		"email":    email,
		"password": password,
	}
	loginPayloadBytes, err := json.Marshal(loginPayload)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest("POST", loginEndpoint, bytes.NewBuffer(loginPayloadBytes))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	return responseBody, nil
}

func extractJWTToken(loginResponse []byte) (string, error) {
	var loginData map[string]interface{}
	if err := json.Unmarshal(loginResponse, &loginData); err != nil {
		return "", err
	}

	token, ok := loginData["user"].(map[string]interface{})["token"].(string)
	if !ok {
		return "", fmt.Errorf("JWT token not found in login response")
	}

	return token, nil
}

func encodeImageToBase64(imagePath string) (string, error) {
	// Read the image file
	imageData, err := os.ReadFile(imagePath)
	if err != nil {
		return "", err
	}

	// Encode the image data to base64
	base64Data := base64.StdEncoding.EncodeToString(imageData)

	return base64Data, nil
}