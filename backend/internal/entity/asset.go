package entity

type Asset struct {
	Id                int     `json:"id" example:"1"`
	Name              string  `json:"name" example:"USD Coin"`
	Code              string  `json:"code" example:"USDC"`
	Distributor       Wallet  `json:"distributor"`
	Issuer            Wallet  `json:"issuer"`
	Amount            int     `json:"amount" example:"1000000"`
	AssetType         string  `json:"asset_type"`
	Image             string  `json:"image,omitempty"`
	ContractId        *string `json:"contract_id,omitempty"`
	AuthorizeRequired bool    `json:"authorize_required" example:"true"`
	ClawbackEnabled   bool    `json:"clawback_enabled" example:"false"`
	FreezeEnabled     bool    `json:"freeze_enabled" example:"false"`
}

const (
	SecurityToken = "security_token"
	StableCoin    = "stable_coin"
	UtilityToken  = "utility_token"
	PaymentToken  = "payment_token"
	DefiToken     = "defi_token"
)

type TomlData struct {
	Version           string        `json:"VERSION,omitempty"`
	NetworkPassphrase string        `json:"NETWORK_PASSPHRASE,omitempty"`
	FederationServer  string        `json:"FEDERATION_SERVER,omitempty"`
	TransferServer    string        `json:"TRANSFER_SERVER,omitempty"`
	SigningKey        string        `json:"SIGNING_KEY,omitempty"`
	HorizonURL        string        `json:"HORIZON_URL,omitempty"`
	Accounts          []string      `json:"ACCOUNTS,omitempty"`
	Documentation     Documentation `json:"DOCUMENTATION,omitempty"`
	Principals        []Principal   `json:"PRINCIPALS,omitempty"`
	Currencies        []Currency    `json:"CURRENCIES,omitempty"`
	Validators        []Validator   `json:"VALIDATORS,omitempty"`
}

type Documentation struct {
	OrgName                       string `json:"ORG_NAME,omitempty"`
	OrgDBA                        string `json:"ORG_DBA,omitempty"`
	OrgURL                        string `json:"ORG_URL,omitempty"`
	OrgLogo                       string `json:"ORG_LOGO,omitempty"`
	OrgDescription                string `json:"ORG_DESCRIPTION,omitempty"`
	OrgPhysicalAddress            string `json:"ORG_PHYSICAL_ADDRESS,omitempty"`
	OrgPhysicalAddressAttestation string `json:"ORG_PHYSICAL_ADDRESS_ATTESTATION,omitempty"`
	OrgPhoneNumber                string `json:"ORG_PHONE_NUMBER,omitempty"`
	OrgPhoneNumberAttestation     string `json:"ORG_PHONE_NUMBER_ATTESTATION,omitempty"`
	OrgKeybase                    string `json:"ORG_KEYBASE,omitempty"`
	OrgTwitter                    string `json:"ORG_TWITTER,omitempty"`
	OrgGithub                     string `json:"ORG_GITHUB,omitempty"`
	OrgOfficialEmail              string `json:"ORG_OFFICIAL_EMAIL,omitempty"`
}

type Principal struct {
	Name                  string `json:"name,omitempty"`
	Email                 string `json:"email,omitempty"`
	Keybase               string `json:"keybase,omitempty"`
	Twitter               string `json:"twitter,omitempty"`
	Github                string `json:"github,omitempty"`
	IDPhotoHash           string `json:"id_photo_hash,omitempty"`
	VerificationPhotoHash string `json:"verification_photo_hash,omitempty"`
}

type Currency struct {
	Code                        string   `json:"code,omitempty"`
	Issuer                      string   `json:"issuer,omitempty"`
	DisplayDecimals             int      `json:"display_decimals,omitempty"`
	Name                        string   `json:"name,omitempty"`
	Description                 string   `json:"desc,omitempty"`
	Conditions                  string   `json:"conditions,omitempty"`
	Image                       string   `json:"image,omitempty"`
	FixedNumber                 int      `json:"fixed_number,omitempty"`
	MaxNumber                   int      `json:"max_number,omitempty"`
	IsUnlimited                 bool     `json:"is_unlimited,omitempty"`
	IsAssetAnchored             bool     `json:"is_asset_anchored,omitempty"`
	AnchorAssetType             string   `json:"anchor_asset_type,omitempty"`
	AnchorAsset                 string   `json:"anchor_asset,omitempty"`
	AttestationOfReserve        string   `json:"attestation_of_reserve,omitempty"`
	RedemptionInstructions      string   `json:"redemption_instructions,omitempty"`
	CollateralAddresses         []string `json:"collateral_addresses,omitempty"`
	CollateralAddressMessages   []string `json:"collateral_address_messages,omitempty"`
	CollateralAddressSignatures []string `json:"collateral_address_signatures,omitempty"`
	Regulated                   bool     `json:"regulated,omitempty"`
	ApprovalServer              string   `json:"approval_server,omitempty"`
	ApprovalCriteria            string   `json:"approval_criteria,omitempty"`
}

type Validator struct {
	Alias       string `json:"ALIAS"`
	DisplayName string `json:"DISPLAY_NAME"`
	Host        string `json:"HOST"`
	PublicKey   string `json:"PUBLIC_KEY"`
	History     string `json:"HISTORY"`
}

type Toml struct {
	ID        int
	Content   string
	CreatedAt string `pg:"default:now()"`
	UpdatedAt string `pg:"default:now()"`
}

type AssetFilter struct {
	AssetName         string
	AssetType         string
	AuthorizeRequired *bool
	ClawbackEnabled   *bool
	FreezeEnabled     *bool
}
