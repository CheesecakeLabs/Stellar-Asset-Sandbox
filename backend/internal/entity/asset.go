package entity

type Asset struct {
	Id          int    `json:"id" example:"1"`
	Name        string `json:"name" example:"USD Coin"`
	Code        string `json:"code" example:"USDC"`
	Distributor Wallet `json:"distributor"`
	Issuer      Wallet `json:"issuer"`
	Amount      int    `json:"amount" example:"1000000"`
	AssetType   string `json:"asset_type"`
}

const (
	SecurityToken = "security_token"
	StableCoin    = "stable_coin"
	UtilityToken  = "utility_token"
	PaymentToken  = "payment_token"
	DefiToken     = "defi_token"
)

type TomlData struct {
	Version           string        `toml:"VERSION"`
	NetworkPassphrase string        `toml:"NETWORK_PASSPHRASE"`
	FederationServer  string        `toml:"FEDERATION_SERVER"`
	TransferServer    string        `toml:"TRANSFER_SERVER"`
	SigningKey        string        `toml:"SIGNING_KEY"`
	HorizonURL        string        `toml:"HORIZON_URL"`
	Accounts          []string      `toml:"ACCOUNTS"`
	Documentation     Documentation `toml:"DOCUMENTATION"`
	Principals        []Principal   `toml:"PRINCIPALS"`
	Currencies        []Currency    `toml:"CURRENCIES"`
	Validators        []Validator   `toml:"VALIDATORS"`
}

type Documentation struct {
	OrgName                       string `toml:"ORG_NAME"`
	OrgDBA                        string `toml:"ORG_DBA"`
	OrgURL                        string `toml:"ORG_URL"`
	OrgLogo                       string `toml:"ORG_LOGO"`
	OrgDescription                string `toml:"ORG_DESCRIPTION"`
	OrgPhysicalAddress            string `toml:"ORG_PHYSICAL_ADDRESS"`
	OrgPhysicalAddressAttestation string `toml:"ORG_PHYSICAL_ADDRESS_ATTESTATION"`
	OrgPhoneNumber                string `toml:"ORG_PHONE_NUMBER"`
	OrgPhoneNumberAttestation     string `toml:"ORG_PHONE_NUMBER_ATTESTATION"`
	OrgKeybase                    string `toml:"ORG_KEYBASE"`
	OrgTwitter                    string `toml:"ORG_TWITTER"`
	OrgGithub                     string `toml:"ORG_GITHUB"`
	OrgOfficialEmail              string `toml:"ORG_OFFICIAL_EMAIL"`
}

type Principal struct {
	Name                  string `toml:"name"`
	Email                 string `toml:"email"`
	Keybase               string `toml:"keybase"`
	Twitter               string `toml:"twitter"`
	Github                string `toml:"github"`
	IDPhotoHash           string `toml:"id_photo_hash"`
	VerificationPhotoHash string `toml:"verification_photo_hash"`
}

type Currency struct {
	Code                        string   `toml:"code"`
	Issuer                      string   `toml:"issuer"`
	DisplayDecimals             int      `toml:"display_decimals"`
	Name                        string   `toml:"name"`
	Description                 string   `toml:"desc"`
	Conditions                  string   `toml:"conditions"`
	Image                       string   `toml:"image"`
	FixedNumber                 int      `toml:"fixed_number"`
	MaxNumber                   int      `toml:"max_number"`
	IsUnlimited                 bool     `toml:"is_unlimited"`
	IsAssetAnchored             bool     `toml:"is_asset_anchored"`
	AnchorAssetType             string   `toml:"anchor_asset_type"`
	AnchorAsset                 string   `toml:"anchor_asset"`
	AttestationOfReserve        string   `toml:"attestation_of_reserve"`
	RedemptionInstructions      string   `toml:"redemption_instructions"`
	CollateralAddresses         []string `toml:"collateral_addresses"`
	CollateralAddressMessages   []string `toml:"collateral_address_messages"`
	CollateralAddressSignatures []string `toml:"collateral_address_signatures"`
	Regulated                   bool     `toml:"regulated"`
	ApprovalServer              string   `toml:"approval_server"`
	ApprovalCriteria            string   `toml:"approval_criteria"`
}

type Validator struct {
	Alias       string `toml:"ALIAS"`
	DisplayName string `toml:"DISPLAY_NAME"`
	Host        string `toml:"HOST"`
	PublicKey   string `toml:"PUBLIC_KEY"`
	History     string `toml:"HISTORY"`
}

type Toml struct {
	ID        int
	Content   string
	CreatedAt string `pg:"default:now()"`
	UpdatedAt string `pg:"default:now()"`
}
