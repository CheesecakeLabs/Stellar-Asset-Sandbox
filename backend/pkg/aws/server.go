package aws

import (
	"github.com/CheesecakeLabs/token-factory-v2/backend/config"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ses"
)

type AwsConnection struct {
	session     *session.Session
	emailClient *ses.SES
	bucketName  string
}

// Initialize a session with AWS
func New(cfg config.AWS) (*AwsConnection, error) {
	sess, err := session.NewSession(
		&aws.Config{
			Region: aws.String(cfg.AwsRegion),
		},
	)
	if err != nil {
		return &AwsConnection{}, err
	}

	return &AwsConnection{
		session:     sess,
		emailClient: ses.New(sess),
		bucketName:  cfg.BucketName,
	}, nil
}

func (s *AwsConnection) UploadFile(filename string, file []byte) (string, error) {
	return s.uploadToS3(filename, file)
}
