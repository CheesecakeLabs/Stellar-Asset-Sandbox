package logger

import (
	"os"
	"strings"
	"time"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/pkgerrors"
)

// Interface is the logger interface.
type Interface interface {
	Debug(message string, args ...interface{})
	Info(message string, args ...interface{})
	Warn(message string, args ...interface{})
	Error(err error, message string, args ...interface{})
	Fatal(message string, args ...interface{})
}

// Logger wraps zerolog.Logger.
type Logger struct {
	logger zerolog.Logger
}

var _ Interface = (*Logger)(nil)

// New creates and returns a new Logger.
func New(level string) *Logger {
	var lvl zerolog.Level
	zerolog.SetGlobalLevel(lvl)
	zerolog.ErrorStackMarshaler = pkgerrors.MarshalStack

	// Customize the output format and add coloring
	output := zerolog.ConsoleWriter{
		Out:        os.Stderr,
		TimeFormat: time.RFC3339,
		NoColor:    false, // Setting NoColor to false enables color output
	}

	// Customize the level colors if needed
	output.FormatLevel = func(i interface{}) string {
		var l string
		if ll, ok := i.(string); ok {
			switch strings.ToLower(ll) {
			case "debug":
				l = "\033[34mDEBUG\033[0m" // Blue
			case "info":
				l = "\033[32mINFO\033[0m" // Green
			case "warn":
				l = "\033[33mWARN\033[0m" // Yellow
			case "error":
				l = "\033[31mERROR\033[0m" // Red
			case "fatal":
				l = "\033[35mFATAL\033[0m" // Magenta
			default:
				l = "\033[37m" + strings.ToUpper(ll) + "\033[0m" // White for others
			}
		}
		return l
	}

	// Set up the logger with the console writer
	logger := zerolog.New(output).With().Timestamp().CallerWithSkipFrameCount(3).Logger()

	return &Logger{
		logger: logger,
	}
}

func (l *Logger) Debug(message string, args ...interface{}) {
	l.logger.Debug().Msgf(message, args...)
}

func (l *Logger) Info(message string, args ...interface{}) {
	l.logger.Info().Msgf(message, args...)
}

func (l *Logger) Warn(message string, args ...interface{}) {
	l.logger.Warn().Msgf(message, args...)
}

func (l *Logger) Error(err error, message string, args ...interface{}) {
	event := l.logger.Error()
	if err != nil {
		event = event.Err(err)
	}
	event.Msgf(message, args...)
}

func (l *Logger) Fatal(message string, args ...interface{}) {
	l.logger.Fatal().Msgf(message, args...)
}
