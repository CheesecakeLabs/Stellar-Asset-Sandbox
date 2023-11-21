package email

import (
	"fmt"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ses"
)

type AwsSesService struct {
	client *ses.SES
}

func NewAwsSesService() *AwsSesService {
	sess := session.Must(session.NewSession(&aws.Config{
		Region:      aws.String("YOUR_AWS_REGION"),                                                                // TODO: Change this
		Credentials: credentials.NewStaticCredentials("YOUR_AWS_ACCESS_KEY_ID", "YOUR_AWS_SECRET_ACCESS_KEY", ""), // TODO: Change this
	}))

	return &AwsSesService{
		client: ses.New(sess),
	}
}

func (s *AwsSesService) SendEmail(to, subject, body string) error {
	input := &ses.SendEmailInput{
		Destination: &ses.Destination{
			ToAddresses: []*string{
				aws.String(to),
			},
		},
		Message: &ses.Message{
			Body: &ses.Body{
				Html: &ses.Content{
					Charset: aws.String("UTF-8"),
					Data:    aws.String(body),
				},
			},
			Subject: &ses.Content{
				Charset: aws.String("UTF-8"),
				Data:    aws.String(subject),
			},
		},
		Source: aws.String("your-email@example.com"), // TODO: Change this
	}

	_, err := s.client.SendEmail(input)
	if err != nil {
		return fmt.Errorf("failed to send email: %v", err)
	}

	return nil
}
