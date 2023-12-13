package service

import (
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/aws"
)

type AssetService struct {
	*aws.AwsConnection
}

func NewAssetService(aws *aws.AwsConnection) *AssetService {
	return &AssetService{aws}
}

func (s *AssetService) UploadAssetImage(filename string, file []byte) (string, error) {
	url, err := s.UploadToS3(filename, file)
	if err != nil {
		return "", err
	}
	return url, nil
}
