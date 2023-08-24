package integration_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"testing"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/stretchr/testify/assert"
)

var _user = entity.User{
	Name:     "User Test",
	Password: "123456",
	RoleId:   1,
	Email:    "testuser@test.com",
}

type UserLoginResponse struct {
	User entity.User `json:"user"`
}

func TestCreateUserSuccess(t *testing.T) {
	createUserPath := basePath + "/users/create"

	requestBodyBytes, err := json.Marshal(_user)
	assert.NoError(t, err)

	// Create the HTTP request
	req, err := http.NewRequest(http.MethodPost, createUserPath, bytes.NewBuffer(requestBodyBytes))
	assert.NoError(t, err)
	req.Header.Set("Content-Type", "application/json")

	// Execute the request
	client := &http.Client{}
	resp, err := client.Do(req)

	assert.NoError(t, err)
	defer resp.Body.Close()

	// Verify the status code
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	// Parsing the response into an expected structure
	var response UserLoginResponse
	err = json.NewDecoder(resp.Body).Decode(&response)
	assert.NoError(t, err)
}

func TestUserLoginSuccess(t *testing.T) {
	// URL for logging in a user
	loginUserPath := basePath + "/users/login"

	// Test user credentials
	email := _user.Email
	password := _user.Password

	// Request body
	requestBody := map[string]string{
		"email":    email,
		"password": password,
	}
	requestBodyBytes, err := json.Marshal(requestBody)
	assert.NoError(t, err)

	// Create the HTTP request
	req, err := http.NewRequest(http.MethodPost, loginUserPath, bytes.NewBuffer(requestBodyBytes))
	assert.NoError(t, err)
	req.Header.Set("Content-Type", "application/json")

	// Execute the request
	client := &http.Client{}
	resp, err := client.Do(req)
	assert.NoError(t, err)
	defer resp.Body.Close()

	// Verify the status code
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	var loginResponse UserLoginResponse
	err = json.NewDecoder(resp.Body).Decode(&loginResponse)
	assert.NoError(t, err)

	assert.NoError(t, err)
	assert.Equal(t, _user.Name, loginResponse.User.Name)
	assert.Equal(t, _user.Email, loginResponse.User.Email)
	assert.Equal(t, _user.RoleId, loginResponse.User.RoleId)
	assert.NotEmpty(t, loginResponse.User.Token)
	_user.Token = loginResponse.User.Token
	t.Log("token", _user.Token)
}

func TestCreateUserFailedUserAlreadyInDatabase(t *testing.T) {
	createUserPath := basePath + "/users/create"

	requestBodyBytes, err := json.Marshal(_user)
	assert.NoError(t, err)

	// Create the HTTP request
	req, err := http.NewRequest(http.MethodPost, createUserPath, bytes.NewBuffer(requestBodyBytes))
	assert.NoError(t, err)
	req.Header.Set("Content-Type", "application/json")

	// Execute the request
	client := &http.Client{}
	resp, err := client.Do(req)

	assert.NoError(t, err)
	defer resp.Body.Close()

	// Verify the status code
	assert.Equal(t, http.StatusInternalServerError, resp.StatusCode)

	// Parsing the response into an expected structure
	var response errrorResponse
	err = json.NewDecoder(resp.Body).Decode(&response)
	assert.NoError(t, err)

	// Verifying the response content
	assert.Equal(t, "database problems", response.Message)
	assert.Contains(t, response.Error, "duplicate key value violates unique constraint \"useraccount_email_key\"")
}

func TestCreateUserFailedPasswordIsEmpty(t *testing.T) {
	createUserPath := basePath + "/users/create"

	// Create a request body with an empty password
	requestBody := entity.User{
		Name:     "User Test",
		Password: "",
		RoleId:   1,
		Email:    "",
	}

	requestBodyBytes, err := json.Marshal(requestBody)
	assert.NoError(t, err)

	// Create the HTTP request
	req, err := http.NewRequest(http.MethodPost, createUserPath, bytes.NewBuffer(requestBodyBytes))
	assert.NoError(t, err)
	req.Header.Set("Content-Type", "application/json")

	// Execute the request
	client := &http.Client{}
	resp, err := client.Do(req)
	assert.NoError(t, err)
	defer resp.Body.Close()

	// Verify the status code
	assert.Equal(t, http.StatusBadRequest, resp.StatusCode) // Adjust the status code as per your application's behavior

	// Parsing the response into an expected structure
	var response errrorResponse
	err = json.NewDecoder(resp.Body).Decode(&response)
	assert.NoError(t, err)

	// Verifying the response content
	assert.Equal(t, "password is required", response.Message)
}

func TestUserLoginFailed(t *testing.T) {
	// URL for logging in a user
	loginUserPath := basePath + "/users/login"

	// Request body
	requestBody := entity.User{
		Email:    "test@example.com",
		Password: "testpassword",
	}
	requestBodyBytes, err := json.Marshal(requestBody)
	assert.NoError(t, err)

	// Create the HTTP request
	req, err := http.NewRequest(http.MethodPost, loginUserPath, bytes.NewBuffer(requestBodyBytes))
	assert.NoError(t, err)
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
	assert.Equal(t, "database problems", response.Message)
	assert.Equal(t, "email or password incorrect", response.Error)
}
