package postgres

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	"github.com/CheesecakeLabs/token-factory-v2/backend/config"
	_ "github.com/lib/pq"
)

const (
	_defaultMaxPoolSize  = 1
	_defaultConnAttempts = 10
	_defaultConnTimeout  = time.Second
)

type Postgres struct {
	maxPoolSize  int
	connAttempts int
	connTimeout  time.Duration
	Db           *sql.DB
}

func New(c config.PGConfig, opts ...Option) (*Postgres, error) {
	pg := &Postgres{
		maxPoolSize:  _defaultMaxPoolSize,
		connAttempts: _defaultConnAttempts,
		connTimeout:  _defaultConnTimeout,
	}

	psqlInfo := fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		c.Host, c.Port, c.User, c.Password, c.DBName,
	)
	var err error
	for pg.connAttempts > 0 {
		pg.Db, err = sql.Open("postgres", psqlInfo)
		if err == nil {
			break
		}

		log.Printf("Postgres is trying to connect, attempts left: %d", pg.connAttempts)

		time.Sleep(pg.connTimeout)

		pg.connAttempts--
	}

	if err != nil {
		return nil, fmt.Errorf("postgres - NewPostgres - connAttempts == 0: %w", err)
	}

	return pg, nil
}

func (p *Postgres) Close() {
	if p.Db != nil {
		p.Db.Close()
	}
}
