package aws

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/ses"
)

func PasswordResetEmailTemplate(token string) string {
	return `
		<html>
		<head>
			<title>Password Reset</title>
		</head>
		<body>
			<p>Hello,</p>
			<p>You requested a password reset. Click the link below to reset your password:</p>
			<a href="https://yourwebsite.com/reset-password?token=` + token + `">Reset Password</a>
			<p>If you didn't request this, please ignore this email.</p>
			<p>Thank you!</p>
		</body>
		</html>
	`
}

func SendPasswordResetEmail(client *ses.SES, email string, token string) error {
	input := &ses.SendEmailInput{
		Destination: &ses.Destination{
			ToAddresses: []*string{
				aws.String(email),
			},
		},
		Message: &ses.Message{
			Body: &ses.Body{
				Html: &ses.Content{
					Data: aws.String(PasswordResetEmailTemplate(token)),
				},
			},
			Subject: &ses.Content{
				Data: aws.String("Password Reset Request"),
			},
		},
		Source: aws.String("noreply@yourwebsite.com"), // TODO
	}

	_, err := client.SendEmail(input)
	return err
}
