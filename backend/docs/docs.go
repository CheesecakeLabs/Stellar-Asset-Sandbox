// Code generated by swaggo/swag. DO NOT EDIT.

package docs

import "github.com/swaggo/swag"

const docTemplate = `{
    "schemes": {{ marshal .Schemes }},
    "swagger": "2.0",
    "info": {
        "description": "{{escape .Description}}",
        "title": "{{.Title}}",
        "contact": {},
        "version": "{{.Version}}"
    },
    "host": "{{.Host}}",
    "basePath": "{{.BasePath}}",
    "paths": {
        "/assets": {
            "get": {
                "description": "Get all assets",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Assets"
                ],
                "summary": "Get all assets",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/entity.Asset"
                            }
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/v1.response"
                        }
                    }
                }
            },
            "post": {
                "description": "Create and issue a new asset on Stellar",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Assets"
                ],
                "summary": "Create a new asset",
                "parameters": [
                    {
                        "description": "Asset info",
                        "name": "request",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/v1.CreateAssetRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/entity.Asset"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/v1.response"
                        }
                    },
                    "404": {
                        "description": "Not Found",
                        "schema": {
                            "$ref": "#/definitions/v1.response"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/v1.response"
                        }
                    }
                }
            }
        },
        "/assets/auth-flags": {
            "post": {
                "description": "Update the authorization flags of a trust line on Stellar",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Assets"
                ],
                "summary": "Update authorization flags of a trust line",
                "parameters": [
                    {
                        "description": "Authorization flags",
                        "name": "request",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/v1.UpdateAuthFlagsRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/entity.Asset"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/v1.response"
                        }
                    },
                    "404": {
                        "description": "Not Found",
                        "schema": {
                            "$ref": "#/definitions/v1.response"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/v1.response"
                        }
                    }
                }
            }
        },
        "/assets/burn": {
            "post": {
                "description": "Burn an asset on Stellar",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Assets"
                ],
                "summary": "Burn an asset",
                "parameters": [
                    {
                        "description": "Asset info",
                        "name": "request",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/v1.BurnAssetRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/entity.Asset"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/v1.response"
                        }
                    },
                    "404": {
                        "description": "Not Found",
                        "schema": {
                            "$ref": "#/definitions/v1.response"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/v1.response"
                        }
                    }
                }
            }
        },
        "/assets/clawback": {
            "post": {
                "description": "Clawback an asset on Stellar",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Assets"
                ],
                "summary": "Clawback an asset",
                "parameters": [
                    {
                        "description": "Asset info",
                        "name": "request",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/v1.ClawbackAssetRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/v1.response"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/v1.response"
                        }
                    },
                    "404": {
                        "description": "Not Found",
                        "schema": {
                            "$ref": "#/definitions/v1.response"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/v1.response"
                        }
                    }
                }
            }
        },
        "/assets/mint": {
            "post": {
                "description": "Mint an asset on Stellar",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Assets"
                ],
                "summary": "Mint an asset",
                "parameters": [
                    {
                        "description": "Asset info",
                        "name": "request",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/v1.MintAssetRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/entity.Asset"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/v1.response"
                        }
                    },
                    "404": {
                        "description": "Not Found",
                        "schema": {
                            "$ref": "#/definitions/v1.response"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/v1.response"
                        }
                    }
                }
            }
        },
        "/assets/transfer": {
            "post": {
                "description": "Transfer an asset between wallets on Stellar",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Assets"
                ],
                "summary": "Transfer an asset",
                "parameters": [
                    {
                        "description": "Transfer info",
                        "name": "request",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/v1.TransferAssetRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/v1.response"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/v1.response"
                        }
                    },
                    "404": {
                        "description": "Not Found",
                        "schema": {
                            "$ref": "#/definitions/v1.response"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/v1.response"
                        }
                    }
                }
            }
        },
        "/role": {
            "get": {
                "description": "List role",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Role"
                ],
                "summary": "List",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Type",
                        "name": "type",
                        "in": "query",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/entity.Role"
                            }
                        }
                    }
                }
            }
        },
        "/role-permission/permissions": {
            "get": {
                "description": "Role permissions",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "RolePermissions"
                ],
                "summary": "Role permissions",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/entity.RolePermissionResponse"
                            }
                        }
                    }
                }
            }
        },
        "/user/create": {
            "post": {
                "description": "Edit users role",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "user"
                ],
                "summary": "Edit users role",
                "operationId": "editUsersRole",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/entity.UserRole"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/v1.response"
                        }
                    }
                }
            }
        },
        "/user/login": {
            "post": {
                "description": "Autentication User",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "user"
                ],
                "summary": "Autentication User",
                "operationId": "autentication",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/v1.userResponse"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/v1.response"
                        }
                    }
                }
            }
        },
        "/user/logout": {
            "post": {
                "description": "Logout User",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "user"
                ],
                "summary": "Logout User",
                "operationId": "logout",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/v1.userResponse"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/v1.response"
                        }
                    }
                }
            }
        },
        "/users": {
            "get": {
                "description": "Get PRofile",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "user"
                ],
                "summary": "GET Profile",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/entity.UserResponse"
                        }
                    }
                }
            }
        },
        "/wallets": {
            "get": {
                "description": "List wallets by type",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Wallets"
                ],
                "summary": "List",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Type",
                        "name": "type",
                        "in": "query",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/entity.Wallet"
                            }
                        }
                    }
                }
            },
            "post": {
                "description": "Create a new wallet",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Wallets"
                ],
                "summary": "Create",
                "parameters": [
                    {
                        "description": "Set up wallet",
                        "name": "request",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/v1.CreateWalletRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/entity.Wallet"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/v1.response"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/v1.response"
                        }
                    }
                }
            }
        },
        "/wallets/fund/": {
            "post": {
                "description": "Fund a wallet with Friendbot",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Wallets"
                ],
                "summary": "Fund Wallet",
                "parameters": [
                    {
                        "description": "Wallet id",
                        "name": "request",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/v1.FundWalletRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/entity.Wallet"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/v1.response"
                        }
                    },
                    "404": {
                        "description": "Not Found",
                        "schema": {
                            "$ref": "#/definitions/v1.response"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/v1.response"
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "entity.Asset": {
            "type": "object",
            "properties": {
                "amount": {
                    "type": "integer",
                    "example": 1000000
                },
                "code": {
                    "type": "string",
                    "example": "USDC"
                },
                "distributor": {
                    "$ref": "#/definitions/entity.Wallet"
                },
                "id": {
                    "type": "integer",
                    "example": 1
                },
                "issuer": {
                    "$ref": "#/definitions/entity.Wallet"
                }
            }
        },
        "entity.Key": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "integer",
                    "example": 1
                },
                "publicKey": {
                    "type": "string",
                    "example": "GCK..."
                },
                "walletId": {
                    "type": "integer",
                    "example": 1
                },
                "weight": {
                    "type": "integer",
                    "example": 3
                }
            }
        },
        "entity.Role": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "integer",
                    "example": 1
                },
                "name": {
                    "type": "string",
                    "example": "Admin"
                }
            }
        },
        "entity.RolePermissionResponse": {
            "type": "object",
            "properties": {
                "description": {
                    "type": "string",
                    "example": "Edit action"
                },
                "name": {
                    "type": "string",
                    "example": "Edit"
                }
            }
        },
        "entity.User": {
            "type": "object",
            "properties": {
                "created_at": {
                    "type": "string"
                },
                "email": {
                    "type": "string"
                },
                "id": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                },
                "password": {
                    "type": "string"
                },
                "role_id": {
                    "type": "integer"
                },
                "token": {
                    "type": "string"
                },
                "updated_at": {
                    "type": "string"
                }
            }
        },
        "entity.UserResponse": {
            "type": "object",
            "properties": {
                "email": {
                    "type": "string"
                },
                "id": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                },
                "role": {
                    "type": "string"
                },
                "role_id": {
                    "type": "integer"
                },
                "updated_at": {
                    "type": "string"
                }
            }
        },
        "entity.UserRole": {
            "type": "object",
            "properties": {
                "id_role": {
                    "type": "string"
                },
                "id_user": {
                    "type": "string"
                }
            }
        },
        "entity.Wallet": {
            "type": "object",
            "properties": {
                "funded": {
                    "type": "boolean"
                },
                "id": {
                    "type": "integer",
                    "example": 1
                },
                "key": {
                    "$ref": "#/definitions/entity.Key"
                },
                "type": {
                    "type": "string",
                    "example": "sponsor"
                }
            }
        },
        "v1.BurnAssetRequest": {
            "type": "object",
            "required": [
                "amount",
                "id",
                "sponsor_id"
            ],
            "properties": {
                "amount": {
                    "type": "string",
                    "example": "1000"
                },
                "id": {
                    "type": "string",
                    "example": "001"
                },
                "sponsor_id": {
                    "type": "integer",
                    "example": 2
                }
            }
        },
        "v1.ClawbackAssetRequest": {
            "type": "object",
            "required": [
                "amount",
                "code",
                "from",
                "sponsor_id"
            ],
            "properties": {
                "amount": {
                    "type": "string",
                    "example": "1000"
                },
                "code": {
                    "type": "string",
                    "example": "USDC"
                },
                "from": {
                    "type": "string",
                    "example": "GDKIJJIKXLOM2NRMPNQZUUYK24ZPVFC6426GZAICZ6E5PQG2MIPIMB2L"
                },
                "sponsor_id": {
                    "type": "integer",
                    "example": 2
                }
            }
        },
        "v1.CreateAssetRequest": {
            "type": "object",
            "required": [
                "code",
                "sponsor_id"
            ],
            "properties": {
                "code": {
                    "type": "string",
                    "example": "USDC"
                },
                "limit": {
                    "type": "integer",
                    "example": 1000
                },
                "sponsor_id": {
                    "type": "integer",
                    "example": 2
                }
            }
        },
        "v1.CreateWalletRequest": {
            "type": "object",
            "required": [
                "type"
            ],
            "properties": {
                "type": {
                    "type": "string",
                    "example": "sponsor"
                }
            }
        },
        "v1.FundWalletRequest": {
            "type": "object",
            "required": [
                "id"
            ],
            "properties": {
                "id": {
                    "type": "integer",
                    "example": 1
                }
            }
        },
        "v1.MintAssetRequest": {
            "type": "object",
            "required": [
                "amount",
                "code",
                "id",
                "sponsor_id"
            ],
            "properties": {
                "amount": {
                    "type": "string",
                    "example": "1000"
                },
                "code": {
                    "type": "string",
                    "example": "USDC"
                },
                "id": {
                    "type": "string",
                    "example": "12"
                },
                "sponsor_id": {
                    "type": "integer",
                    "example": 2
                }
            }
        },
        "v1.TransferAssetRequest": {
            "type": "object",
            "required": [
                "amount",
                "asset_id",
                "destination_wallet_pk",
                "source_wallet_id",
                "sponsor_id"
            ],
            "properties": {
                "amount": {
                    "type": "string",
                    "example": "12"
                },
                "asset_id": {
                    "type": "string",
                    "example": "12"
                },
                "destination_wallet_pk": {
                    "type": "string",
                    "example": "GABCD...."
                },
                "source_wallet_id": {
                    "type": "integer",
                    "example": 1
                },
                "sponsor_id": {
                    "type": "integer",
                    "example": 2
                }
            }
        },
        "v1.UpdateAuthFlagsRequest": {
            "type": "object",
            "required": [
                "code",
                "issuer",
                "trustor_id"
            ],
            "properties": {
                "clear_flags": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    },
                    "example": [
                        "[\"AUTH_IMMUTABLE\"]"
                    ]
                },
                "code": {
                    "type": "string",
                    "example": "USDC"
                },
                "issuer": {
                    "type": "integer",
                    "example": 2
                },
                "set_flags": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    },
                    "example": [
                        "[\"AUTH_REQUIRED\"",
                        " \"AUTH_REVOCABLE\"",
                        "\"AUTH_CLAWBACK_ENABLED\"]"
                    ]
                },
                "trustor_id": {
                    "type": "integer",
                    "example": 2
                }
            }
        },
        "v1.response": {
            "type": "object",
            "properties": {
                "error": {
                    "type": "string",
                    "example": "message"
                }
            }
        },
        "v1.userResponse": {
            "type": "object",
            "properties": {
                "user": {
                    "$ref": "#/definitions/entity.User"
                }
            }
        }
    }
}`

// SwaggerInfo holds exported Swagger Info so clients can modify it
var SwaggerInfo = &swag.Spec{
	Version:          "",
	Host:             "",
	BasePath:         "",
	Schemes:          []string{},
	Title:            "",
	Description:      "",
	InfoInstanceName: "swagger",
	SwaggerTemplate:  docTemplate,
	LeftDelim:        "{{",
	RightDelim:       "}}",
}

func init() {
	swag.Register(SwaggerInfo.InstanceName(), SwaggerInfo)
}
