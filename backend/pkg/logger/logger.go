package logger

import (
	"fmt"
	"os"
	"strings"

	"github.com/sirupsen/logrus"
)

// Interface defines the logger interface.
type Interface interface {
	Debug(message interface{}, args ...interface{})
	Info(message string, args ...interface{})
	Warn(message string, args ...interface{})
	Error(message interface{}, args ...interface{})
	Fatal(message interface{}, args ...interface{})
}

// Logger holds the logrus logger instance.
type Logger struct {
	logger *logrus.Logger
}

var _ Interface = (*Logger)(nil)

// New initializes and returns a Logger.
func New(level string) *Logger {
	logger := logrus.New()
	logger.SetOutput(os.Stdout)
	logger.SetReportCaller(true)
	switch strings.ToLower(level) {
	case "error":
		logger.SetLevel(logrus.ErrorLevel)
	case "warn":
		logger.SetLevel(logrus.WarnLevel)
	case "info":
		logger.SetLevel(logrus.InfoLevel)
	case "debug":
		logger.SetLevel(logrus.DebugLevel)
	default:
		logger.SetLevel(logrus.InfoLevel)
	}

	return &Logger{
		logger: logger,
	}
}

// Debug logs a debug message.
func (l *Logger) Debug(message interface{}, args ...interface{}) {
	l.logger.Debugf(fmt.Sprintf("%v", message), args...)
}

// Info logs an info message.
func (l *Logger) Info(message string, args ...interface{}) {
	l.logger.Infof(message, args...)
}

// Warn logs a warning message.
func (l *Logger) Warn(message string, args ...interface{}) {
	l.logger.Warnf(message, args...)
}

// Error logs an error message.
func (l *Logger) Error(message interface{}, args ...interface{}) {
	l.logger.Errorf(fmt.Sprintf("%v", message), args...)
}

// Fatal logs a fatal message and exits.
func (l *Logger) Fatal(message interface{}, args ...interface{}) {
	l.logger.Fatalf(fmt.Sprintf("%v", message), args...)
}
