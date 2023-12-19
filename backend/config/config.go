package config

import (
	"github.com/ilyakaznacheev/cleanenv"
	"github.com/joho/godotenv"
)

type (
	Config struct {
		Kafka   KafkaConfig
		PG      PGConfig
		HTTP    HTTP
		JWT     JWT
		Horizon Horizon
		Log     Log
		AWS     AWS
		Deploy  Deploy
	}

	Log struct {
		Level string `env-required:"true" env:"LOG_LEVEL" env-default:"info"`
	}

	KafkaConfig struct {
		ClientGroupId  string `env:"KAFKA_CLIENT_GROUP_ID"`
		ClientBrokers  string `env:"KAFKA_CLIENT_BROKERS"`
		SchemaRegistry string `env:"KAFKA_SCHEMA_REGISTRY_URL"`
		CreateKpCfg    struct {
			ConsumerTopics []string `env:"KAFKA_CREATE_KP_CONSUMER_TOPICS"`
			ProducerTopic  string   `env:"KAFKA_CREATE_KP_PRODUCER_TOPIC"`
		}
		EnvelopeCfg struct {
			ConsumerTopics []string `env:"KAFKA_ENVELOPE_CONSUMER_TOPICS"`
			ProducerTopic  string   `env:"KAFKA_ENVELOPE_PRODUCER_TOPIC"`
		}
		HorizonCfg struct {
			ConsumerTopics []string `env:"KAFKA_HORIZON_CONSUMER_TOPICS"`
			ProducerTopic  string   `env:"KAFKA_HORIZON_PRODUCER_TOPIC"`
		}
		SubmitTransactionCfg struct {
			ConsumerTopics []string `env:"KAFKA_ENVELOPE_CONSUMER_TOPICS"`
			ProducerTopic  string   `env:"KAFKA_SUBMIT_TRANSACTION_PRODUCER_TOPIC"`
		}
		SignTransactionCfg struct {
			ConsumerTopics []string `env:"KAFKA_SIGN_SOROBAN_TRANSACTION_CONSUMER_TOPICS"`
			ProducerTopic  string   `env:"KAFKA_SIGN_SOROBAN_TRANSACTION_PRODUCER_TOPIC"`
		}
	}

	PGConfig struct {
		Host     string `env-required:"true" env:"PG_HOST"`
		Port     int    `env-required:"true" env:"PG_PORT"`
		User     string `env-required:"true" env:"PG_USER"`
		Password string `env-required:"true" env:"PG_PASSWORD"`
		DBName   string `env-required:"true" env:"PG_DB_NAME"`
	}

	HTTP struct {
		Port           string `env-required:"true" yaml:"port" env:"HTTP_PORT"`
		FrontEndAdress string `env-required:"true" yaml:"front_adress" env:"HTTP_FRONT_ADRESS"`
	}

	JWT struct {
		SecretKey string `env-required:"true" env:"JWT_SECRET_KEY"`
	}

	AWS struct {
		BucketName string `env-required:"true" env:"AWS_BUCKET_NAME"`
		AwsRegion  string `env:"AWS_REGION"`
	}

	Horizon struct {
		PublicAPIServer    string `env:"HORIZON_PUBLIC_API_SERVER"`
		TestAPIServer      string `env:"HORIZON_TEST_API_SERVER"`
		PublicNetworkPass  string `env:"PUBLIC_NETWORK_PASSPHRASE"`
		TestNetworkPass    string `env:"TEST_NETWORK_PASSPHRASE"`
		StellarTomlVersion string `env:"STELLAR_TOML_VERSION"`
		HorizonURL         string `env:"HORIZON_URL"`
		FederationServer   string `env:"FEDERATION_SERVER"`
		TransferServer     string `env:"TRANSFER_SERVER"`
		Documentation      Documentation
		Principals         Principals
	}

	Documentation struct {
		OrgName                       string `env:"ORG_NAME"`
		OrgDBA                        string `env:"ORG_DBA"`
		OrgURL                        string `env:"ORG_URL"`
		OrgLogo                       string `env:"ORG_LOGO"`
		OrgDescription                string `env:"ORG_DESCRIPTION"`
		OrgPhysicalAddress            string `env:"ORG_PHYSICAL_ADDRESS"`
		OrgPhysicalAddressAttestation string `env:"ORG_PHYSICAL_ADDRESS_ATTESTATION"`
		OrgPhoneNumber                string `env:"ORG_PHONE_NUMBER"`
		OrgPhoneNumberAttestation     string `env:"ORG_PHONE_NUMBER_ATTESTATION"`
		OrgKeybase                    string `env:"ORG_KEYBASE"`
		OrgTwitter                    string `env:"ORG_TWITTER"`
		OrgGithub                     string `env:"ORG_GITHUB"`
		OrgOfficialEmail              string `env:"ORG_OFFICIAL_EMAIL"`
	}

	Principals struct {
		Name                  string `env:"PRINCIPALS_NAME"`
		Email                 string `env:"PRINCIPALS_EMAIL"`
		Keybase               string `env:"PRINCIPALS_KEYBASE"`
		Github                string `env:"PRINCIPALS_GITHUB"`
		Twitter               string `env:"PRINCIPALS_TWITTER"`
		IDPhotoHash           string `env:"PRINCIPALS_ID_PHOTO_HASH"`
		VerificationPhotoHash string `env:"PRINCIPALS_VERIFICATION_PHOTO_HASH"`
	}

	Deploy struct {
		DeployStage string `env:"DEPLOY_STAGE"`
	}
)

// NewConfig returns app config.
func NewConfig() (*Config, error) {
	_ = godotenv.Load()

	cfg := &Config{}
	err := cleanenv.ReadEnv(cfg)
	if err != nil {
		return nil, err
	}

	return cfg, nil
}
