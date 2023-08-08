package repo

import (
	"database/sql"
	"fmt"

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

func (r AssetRepo) GetAssets() ([]entity.Asset, error) {
	query := `
		SELECT
			a.id AS asset_id, a.name AS asset_name, a.asset_type, a.code AS code,
			d.id AS distributor_id, d.type AS distributor_type, d.funded AS distributor_funded,
			dk.id AS distributor_key_id, dk.public_key AS distributor_key_public_key, dk.weight AS distributor_key_weight,
			i.id AS issuer_id, i.type AS issuer_type, i.funded AS issuer_funded,
			ik.id AS issuer_key_id, ik.public_key AS issuer_key_public_key, ik.weight AS issuer_key_weight
		FROM asset a
		JOIN wallet d ON a.distributor_id = d.id
		JOIN key dk ON d.id = dk.wallet_id
		JOIN wallet i ON a.issuer_id = i.id
		JOIN key ik ON i.id = ik.wallet_id;
	`

	rows, err := r.Db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("AssetRepo - GetAllAssets - Query: %w", err)
	}
	defer rows.Close()

	var assets []entity.Asset

	for rows.Next() {
		var asset entity.Asset
		var distributor entity.Wallet
		var issuer entity.Wallet

		err := rows.Scan(
			&asset.Id, &asset.Name, &asset.AssetType, &asset.Code,
			&distributor.Id, &distributor.Type, &distributor.Funded,
			&distributor.Key.Id, &distributor.Key.PublicKey, &distributor.Key.Weight,
			&issuer.Id, &issuer.Type, &issuer.Funded,
			&issuer.Key.Id, &issuer.Key.PublicKey, &issuer.Key.Weight,
		)
		if err != nil {
			return nil, fmt.Errorf("AssetRepo - GetAllAssets - row.Scan: %w", err)
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
			a.id AS asset_id, a.name AS asset_name, a.asset_type,a.code as asset_code,
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

	err := row.Scan(
		&asset.Id, &asset.Name, &asset.AssetType, &asset.Code,
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

	asset.Distributor = distributor
	asset.Issuer = issuer

	return asset, nil
}

func (r AssetRepo) CreateAsset(data entity.Asset) (entity.Asset, error) {
	res := data
	stmt := `INSERT INTO Asset (code, issuer_id, distributor_id, name, asset_type) VALUES ($1, $2, $3,$4, $5) RETURNING id;`
	err := r.Db.QueryRow(stmt, data.Code, data.Issuer.Id, data.Distributor.Id, data.Name, data.AssetType).Scan(&res.Id)
	if err != nil {
		return entity.Asset{}, fmt.Errorf("AssetRepo - CreateAsset - db.QueryRow: %w", err)
	}

	return res, nil
}

func (r AssetRepo) GetAssetById(id string) (entity.Asset, error) {
	query := `
		SELECT
			a.id AS asset_id, a.name AS asset_name, a.asset_type, a.code as asset_code,
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

	err := row.Scan(
		&asset.Id, &asset.Name, &asset.AssetType, &asset.Code,
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

	asset.Distributor = distributor
	asset.Issuer = issuer

	return asset, nil
}
