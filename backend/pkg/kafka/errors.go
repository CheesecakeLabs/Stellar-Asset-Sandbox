package kafka

import (
	"errors"
)

var (
	// ErrInvalidURL is returned when the URL is invalid.
	ErrInvalidURL = errors.New("invalid URL")

	// ErrInvalidTopic is returned when the topic is invalid.
	ErrInvalidTopic = errors.New("invalid topic")

	// ErrInvalidGroupID is returned when the group ID is invalid.
	ErrInvalidGroupID = errors.New("invalid group ID")

	// ErrInvalidMessage is returned when the message is invalid.
	ErrInvalidMessage = errors.New("invalid message")
)

const Sucess = "success"
