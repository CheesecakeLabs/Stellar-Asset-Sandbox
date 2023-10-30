package aws

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ses"
)

type Email struct {
	From    string
	To      []string
	Subject string
	Body    string
}

func NewSESClient() *ses.SES {
	sess, err := session.NewSession(&aws.Config{
		Region: aws.String("us-west-2"),
	})
	if err != nil {
		panic(err)
	}
	client := ses.New(sess)
	return client
}
