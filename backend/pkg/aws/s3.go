package aws

import (
	"bytes"
	"path/filepath"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
)

func (s *AwsConnection) uploadToS3(filename string, file []byte) (string, error) {
	uploader := s3manager.NewUploader(s.session)

	if filepath.Ext(filename) != ".png" {
		filename += ".png"
	}

	result, err := uploader.Upload(&s3manager.UploadInput{
		Bucket: aws.String(s.bucketName),
		Key:    aws.String(filename),
		Body:   bytes.NewReader(file),
	})
	if err != nil {
		return "", err
	}

	return result.Location, nil
}
