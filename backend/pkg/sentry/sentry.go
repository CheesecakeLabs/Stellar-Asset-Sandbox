package sentryPkg

import (
	"github.com/CheesecakeLabs/token-factory-v2/backend/config"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/logger"
	"github.com/getsentry/sentry-go"
)

func New(cfg *config.Config, l *logger.Logger) {
	if err := sentry.Init(sentry.ClientOptions{
		Dsn:              cfg.Sentry.DSN,
		EnableTracing:    true,
		TracesSampleRate: 0.75,
		SampleRate:       0.75,
		Environment:      cfg.Deploy.DeployStage,
	}); err != nil {
		l.Error(err, "app - Run - sentry.Init")
	}
}
