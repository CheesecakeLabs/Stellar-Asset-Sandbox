package repo

import (
	"database/sql"
	"fmt"
	"strings"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/postgres"
)

type AssetRepo struct {
	*postgres.Postgres
}

func NewAssetRepo(pg *postgres.Postgres) AssetRepo {
	return AssetRepo{
		Postgres: pg,
	}
}

func (r AssetRepo) GetAsset(id int) (entity.Asset, error) {
	stmt := `SELECT * FROM asset WHERE id=$1`
	row := r.Db.QueryRow(stmt, id)

	var asset entity.Asset
	err := row.Scan(&asset.Id, &asset.Code, &asset.Distributor.Id, &asset.Issuer.Id)
	if err != nil {
		if err == sql.ErrNoRows {
			return entity.Asset{}, fmt.Errorf("AssetRepo - GetAsset - asset not found")
		}
		return entity.Asset{}, fmt.Errorf("AssetRepo - GetAsset - row.Scan: %w", err)
	}

	return asset, nil
}

func (r AssetRepo) GetAssets(filter entity.AssetFilter) ([]entity.Asset, error) {
	queryBuilder := `
        SELECT
            a.id, a.name, a.asset_type, a.code, 
            COALESCE(a.image, '') AS image, a.contract_id,
            d.id, d.type, d.funded,
            dk.id, dk.public_key, dk.weight,
            i.id, i.type, i.funded,
            ik.id, ik.public_key, ik.weight
        FROM asset a
        JOIN wallet d ON a.distributor_id = d.id
        JOIN key dk ON d.id = dk.wallet_id
        JOIN wallet i ON a.issuer_id = i.id
        JOIN key ik ON i.id = ik.wallet_id
    `

	// Initialize arguments slice for query parameters
	var args []interface{}

	// Apply filters
	if filter.AssetName != "" || filter.AssetType != "" {
		queryBuilder += "WHERE "
		if filter.AssetName != "" {
			queryBuilder += "a.name = $1 "
			args = append(args, filter.AssetName)
		}
		if filter.AssetType != "" {
			if len(args) > 0 {
				queryBuilder += "AND "
			}
			queryBuilder += "a.asset_type = $2 "
			args = append(args, filter.AssetType)
		}
	}

	// Add ordering
	queryBuilder += "ORDER BY a.name;"

	// Execute the query
	rows, err := r.Db.Query(queryBuilder, args...)
	if err != nil {
		return nil, fmt.Errorf("AssetRepo - GetAll - Query: %w", err)
	}
	defer rows.Close()

	var assets []entity.Asset
	for rows.Next() {
		var asset entity.Asset
		var distributor entity.Wallet
		var issuer entity.Wallet
		var image sql.NullString

		err := rows.Scan(
			&asset.Id, &asset.Name, &asset.AssetType, &asset.Code, &image,
			&asset.ContractId,
			&distributor.Id, &distributor.Type, &distributor.Funded,
			&distributor.Key.Id, &distributor.Key.PublicKey, &distributor.Key.Weight,
			&issuer.Id, &issuer.Type, &issuer.Funded,
			&issuer.Key.Id, &issuer.Key.PublicKey, &issuer.Key.Weight,
		)
		if err != nil {
			return nil, fmt.Errorf("AssetRepo - GetAll - row.Scan: %w", err)
		}

		if image.Valid {
			asset.Image = image.String
		} else {
			asset.Image = ""
		}

		asset.Distributor = distributor
		asset.Issuer = issuer

		assets = append(assets, asset)
	}

	return assets, nil
}

func (r AssetRepo) GetAssetByCode(code string) (entity.Asset, error) {
	query := `
        SELECT
            a.id AS asset_id, a.name AS asset_name, a.asset_type, a.code AS code, 
            COALESCE(a.image, '') AS image, a.contract_id,
            d.id AS distributor_id, d.type AS distributor_type, d.funded AS distributor_funded,
            dk.id AS distributor_key_id, dk.public_key AS distributor_key_public_key, dk.weight AS distributor_key_weight,
            i.id AS issuer_id, i.type AS issuer_type, i.funded AS issuer_funded,
            ik.id AS issuer_key_id, ik.public_key AS issuer_key_public_key, ik.weight AS issuer_key_weight
        FROM asset a
        JOIN wallet d ON a.distributor_id = d.id
        JOIN key dk ON d.id = dk.wallet_id
        JOIN wallet i ON a.issuer_id = i.id
        JOIN key ik ON i.id = ik.wallet_id
        WHERE a.code = $1;
    `

	row := r.Db.QueryRow(query, code)

	var asset entity.Asset
	var distributor entity.Wallet
	var issuer entity.Wallet
	var image sql.NullString

	err := row.Scan(
		&asset.Id, &asset.Name, &asset.AssetType, &asset.Code, &image,
		&asset.ContractId,
		&distributor.Id, &distributor.Type, &distributor.Funded,
		&distributor.Key.Id, &distributor.Key.PublicKey, &distributor.Key.Weight,
		&issuer.Id, &issuer.Type, &issuer.Funded,
		&issuer.Key.Id, &issuer.Key.PublicKey, &issuer.Key.Weight,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return entity.Asset{}, fmt.Errorf("AssetRepo - GetAssetByCode - asset not found")
		}
		return entity.Asset{}, fmt.Errorf("AssetRepo - GetAssetByCode - row.Scan: %w", err)
	}

	if image.Valid {
		asset.Image = image.String
	} else {
		asset.Image = ""
	}

	asset.Distributor = distributor
	asset.Issuer = issuer

	return asset, nil
}

func (r AssetRepo) GetAssetById(id string) (entity.Asset, error) {
	query := `
        SELECT
            a.id AS asset_id, a.name AS asset_name, a.asset_type, a.code AS code, 
            COALESCE(a.image, '') AS image, a.contract_id,
            d.id AS distributor_id, d.type AS distributor_type, d.funded AS distributor_funded,
            dk.id AS distributor_key_id, dk.public_key AS distributor_key_public_key, dk.weight AS distributor_key_weight,
            i.id AS issuer_id, i.type AS issuer_type, i.funded AS issuer_funded,
            ik.id AS issuer_key_id, ik.public_key AS issuer_key_public_key, ik.weight AS issuer_key_weight
        FROM asset a
        JOIN wallet d ON a.distributor_id = d.id
        JOIN key dk ON d.id = dk.wallet_id
        JOIN wallet i ON a.issuer_id = i.id
        JOIN key ik ON i.id = ik.wallet_id
        WHERE a.id = $1;
    `

	row := r.Db.QueryRow(query, id)

	var asset entity.Asset
	var distributor entity.Wallet
	var issuer entity.Wallet
	var image sql.NullString

	err := row.Scan(
		&asset.Id, &asset.Name, &asset.AssetType, &asset.Code, &image,
		&asset.ContractId,
		&distributor.Id, &distributor.Type, &distributor.Funded,
		&distributor.Key.Id, &distributor.Key.PublicKey, &distributor.Key.Weight,
		&issuer.Id, &issuer.Type, &issuer.Funded,
		&issuer.Key.Id, &issuer.Key.PublicKey, &issuer.Key.Weight,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return entity.Asset{}, fmt.Errorf("AssetRepo - GetAssetById - asset not found")
		}
		return entity.Asset{}, fmt.Errorf("AssetRepo - GetAssetById - row.Scan: %w", err)
	}

	if image.Valid {
		asset.Image = image.String
	} else {
		asset.Image = ""
	}

	asset.Distributor = distributor
	asset.Issuer = issuer

	return asset, nil
}

func (r AssetRepo) GetPaginatedAssets(page int, limit int, filter entity.AssetFilter) ([]entity.Asset, int, error) {
	// Calculate the offset
	offset := (page - 1) * limit

	// Start building the SQL query
	queryBuilder := `
        SELECT
            a.id, a.name, a.asset_type, a.code, 
            COALESCE(a.image, '') AS image, a.contract_id,
            d.id, d.type, d.funded,
            dk.id, dk.public_key, dk.weight,
            i.id, i.type, i.funded,
            ik.id, ik.public_key, ik.weight
        FROM asset a
        JOIN wallet d ON a.distributor_id = d.id
        JOIN key dk ON d.id = dk.wallet_id
        JOIN wallet i ON a.issuer_id = i.id
        JOIN key ik ON i.id = ik.wallet_id
    `

	// Initialize arguments slice for query parameters
	var args []interface{}

	// Apply filters
	whereClauses := []string{}
	if filter.AssetName != "" {
		whereClauses = append(whereClauses, "a.name = ?")
		args = append(args, filter.AssetName)
	}
	if filter.AssetType != "" {
		whereClauses = append(whereClauses, "a.asset_type = ?")
		args = append(args, filter.AssetType)
	}
	if len(whereClauses) > 0 {
		queryBuilder += "WHERE " + strings.Join(whereClauses, " AND ")
	}

	// Add ordering and pagination
	queryBuilder += `
        ORDER BY a.name
        LIMIT ? OFFSET ?;
    `
	args = append(args, limit, offset)

	// Execute the query
	rows, err := r.Db.Query(queryBuilder, args...)
	if err != nil {
		return nil, 0, fmt.Errorf("AssetRepo - GetPaginated - Query: %w", err)
	}
	defer rows.Close()

	var assets []entity.Asset
	for rows.Next() {
		var asset entity.Asset
		var distributor entity.Wallet
		var issuer entity.Wallet
		var image sql.NullString

		err := rows.Scan(
			&asset.Id, &asset.Name, &asset.AssetType, &asset.Code, &image,
			&asset.ContractId,
			&distributor.Id, &distributor.Type, &distributor.Funded,
			&distributor.Key.Id, &distributor.Key.PublicKey, &distributor.Key.Weight,
			&issuer.Id, &issuer.Type, &issuer.Funded,
			&issuer.Key.Id, &issuer.Key.PublicKey, &issuer.Key.Weight,
		)
		if err != nil {
			return nil, 0, fmt.Errorf("AssetRepo - GetPaginated - row.Scan: %w", err)
		}

		if image.Valid {
			asset.Image = image.String
		} else {
			asset.Image = ""
		}

		asset.Distributor = distributor
		asset.Issuer = issuer

		assets = append(assets, asset)
	}

	var totalAssets int

	// Check for errors after iterating through the rows
	if err = rows.Err(); err != nil {
		return nil, 0, fmt.Errorf("AssetRepo - GetPaginated - rows.Err: %w", err)
	}

	// Query to count the total number of assets after applying the filters
	countQueryBuilder := "SELECT COUNT(*) FROM asset a "
	if len(whereClauses) > 0 {
		countQueryBuilder += "WHERE " + strings.Join(whereClauses, " AND ")
	}
	err = r.Db.QueryRow(countQueryBuilder, args...).Scan(&totalAssets)
	if err != nil {
		return nil, 0, fmt.Errorf("AssetRepo - GetPaginated - Count Query: %w", err)
	}

	// Calculate total pages
	totalPages := (totalAssets + limit - 1) / limit

	return assets, totalPages, nil
}

func (r AssetRepo) StoreAssetImage(assetId string, image string) error {
	stmt := `
    	UPDATE asset 
    	SET image = $2
    	WHERE id = $1
	`

	_, err := r.Db.Exec(stmt, assetId, image)
	if err != nil {
		return fmt.Errorf("AssetRepo - StoreAssetImage - Db.Exec: %w", err)
	}

	return nil
}

func (r AssetRepo) GetAssetImage(assetId string) ([]byte, error) {
	stmt := `
        SELECT image
        FROM asset
        WHERE id = $1
    `

	row := r.Db.QueryRow(stmt, assetId)

	var image sql.NullString
	err := row.Scan(&image)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("AssetRepo - GetAssetImage - asset not found: %w", err)
		}
		return nil, fmt.Errorf("AssetRepo - GetAssetImage - row.Scan: %w", err)
	}

	if image.Valid {
		return []byte(image.String), nil
	}

	return nil, nil // No image found, return nil without error
}

func (r AssetRepo) UpdateContractId(assetId string, contractId string) error {
	stmt := `
    	UPDATE asset
    	SET contract_id = $2
    	WHERE id = $1
	`

	_, err := r.Db.Exec(stmt, assetId, contractId)
	if err != nil {
		return fmt.Errorf("AssetRepo - UpdateContractId - Db.Exec: %w", err)
	}

	return nil
}

func (r AssetRepo) CreateAsset(data entity.Asset) (entity.Asset, error) {
	res := data
	stmt := `INSERT INTO Asset (code, issuer_id, distributor_id, name, asset_type, image ) VALUES ($1, $2, $3,$4, $5, $6) RETURNING id;`
	err := r.Db.QueryRow(stmt, data.Code, data.Issuer.Id, data.Distributor.Id, data.Name, data.AssetType, data.Image).Scan(&res.Id)
	if err != nil {
		return entity.Asset{}, fmt.Errorf("AssetRepo - CreateAsset - db.QueryRow: %w", err)
	}

	return res, nil
}
