package entity

type Asset struct {
	Id          int    `json:"id" example:"1"`
	Name        string `json:"name" example:"USD Coin"`
	Code        string `json:"code" example:"USDC"`
	Distributor Wallet `json:"distributor"`
	Issuer      Wallet `json:"issuer"`
	Amount      int    `json:"amount" example:"1000000"`
	AssetType   string `json:"asset_type"`
	Image       []byte `json:"image,omitempty"`
}

const (
	SecurityToken = "security_token"
	StableCoin    = "stable_coin"
	UtilityToken  = "utility_token"
	PaymentToken  = "payment_token"
	DefiToken     = "defi_token"
)

type TomlData struct {
	Version           string        `toml:"VERSION,omitempty"`
	NetworkPassphrase string        `toml:"NETWORK_PASSPHRASE,omitempty"`
	FederationServer  string        `toml:"FEDERATION_SERVER,omitempty"`
	TransferServer    string        `toml:"TRANSFER_SERVER,omitempty"`
	SigningKey        string        `toml:"SIGNING_KEY,omitempty"`
	HorizonURL        string        `toml:"HORIZON_URL,omitempty"`
	Accounts          []string      `toml:"ACCOUNTS,omitempty"`
	Documentation     Documentation `toml:"DOCUMENTATION,omitempty"`
	Principals        []Principal   `toml:"PRINCIPALS,omitempty"`
	Currencies        []Currency    `toml:"CURRENCIES,omitempty"`
	Validators        []Validator   `toml:"VALIDATORS,omitempty"`
}

type Documentation struct {
	OrgName                       string `toml:"ORG_NAME,omitempty"`
	OrgDBA                        string `toml:"ORG_DBA,omitempty"`
	OrgURL                        string `toml:"ORG_URL,omitempty"`
	OrgLogo                       string `toml:"ORG_LOGO,omitempty"`
	OrgDescription                string `toml:"ORG_DESCRIPTION,omitempty"`
	OrgPhysicalAddress            string `toml:"ORG_PHYSICAL_ADDRESS,omitempty"`
	OrgPhysicalAddressAttestation string `toml:"ORG_PHYSICAL_ADDRESS_ATTESTATION,omitempty"`
	OrgPhoneNumber                string `toml:"ORG_PHONE_NUMBER,omitempty"`
	OrgPhoneNumberAttestation     string `toml:"ORG_PHONE_NUMBER_ATTESTATION,omitempty"`
	OrgKeybase                    string `toml:"ORG_KEYBASE,omitempty"`
	OrgTwitter                    string `toml:"ORG_TWITTER,omitempty"`
	OrgGithub                     string `toml:"ORG_GITHUB,omitempty"`
	OrgOfficialEmail              string `toml:"ORG_OFFICIAL_EMAIL,omitempty"`
}

type Principal struct {
	Name                  string `toml:"name,omitempty"`
	Email                 string `toml:"email,omitempty"`
	Keybase               string `toml:"keybase,omitempty"`
	Twitter               string `toml:"twitter,omitempty"`
	Github                string `toml:"github,omitempty"`
	IDPhotoHash           string `toml:"id_photo_hash,omitempty"`
	VerificationPhotoHash string `toml:"verification_photo_hash,omitempty"`
}

type Currency struct {
	Code                        string   `toml:"code,omitempty"`
	Issuer                      string   `toml:"issuer,omitempty"`
	DisplayDecimals             int      `toml:"display_decimals,omitempty"`
	Name                        string   `toml:"name,omitempty"`
	Description                 string   `toml:"desc,omitempty"`
	Conditions                  string   `toml:"conditions,omitempty"`
	Image                       string   `toml:"image,omitempty"`
	FixedNumber                 int      `toml:"fixed_number,omitempty"`
	MaxNumber                   int      `toml:"max_number,omitempty"`
	IsUnlimited                 bool     `toml:"is_unlimited,omitempty"`
	IsAssetAnchored             bool     `toml:"is_asset_anchored,omitempty"`
	AnchorAssetType             string   `toml:"anchor_asset_type,omitempty"`
	AnchorAsset                 string   `toml:"anchor_asset,omitempty"`
	AttestationOfReserve        string   `toml:"attestation_of_reserve,omitempty"`
	RedemptionInstructions      string   `toml:"redemption_instructions,omitempty"`
	CollateralAddresses         []string `toml:"collateral_addresses,omitempty"`
	CollateralAddressMessages   []string `toml:"collateral_address_messages,omitempty"`
	CollateralAddressSignatures []string `toml:"collateral_address_signatures,omitempty"`
	Regulated                   bool     `toml:"regulated,omitempty"`
	ApprovalServer              string   `toml:"approval_server,omitempty"`
	ApprovalCriteria            string   `toml:"approval_criteria,omitempty"`
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
