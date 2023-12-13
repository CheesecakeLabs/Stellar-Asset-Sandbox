package aws

import (
	"github.com/CheesecakeLabs/token-factory-v2/backend/config"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ses"
)

type AwsConnection struct {
	session     *session.Session
	emailClient *ses.SES
	bucketName  string
}

// Initialize a session with AWS
func NewAwsService(cfg config.AWS) (*AwsConnection, error) {
	sess, err := session.NewSession()
	if err != nil {
		return &AwsConnection{}, err
	}

	return &AwsConnection{
		session:     sess,
		emailClient: ses.New(sess),
		bucketName:  cfg.BucketName,
	}, nil
}
