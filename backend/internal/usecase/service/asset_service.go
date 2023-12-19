package service

import (
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/storage"
)

type AssetService struct {
	storageService storage.StorageService
}

func NewAssetService(storage storage.StorageService) *AssetService {
	return &AssetService{storageService: storage}
}

func (s *AssetService) UploadFile(filename string, file []byte) (string, error) {
	url, err := s.storageService.UploadFile(filename, file)
	if err != nil {
		return "", err
	}
	return url, nil
}
