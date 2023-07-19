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
	return AssetRepo{pg}
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
	stmt := `SELECT id, name, code, distributor_id as distributor, issuer_id as issuer FROM Asset`
	rows, err := r.Db.Query(stmt)
	if err != nil {
		return nil, fmt.Errorf("AssetRepo - GetAssets - db.Query: %w", err)
	}

	defer rows.Close()

	entities := make([]entity.Asset, 0, _defaultEntityCap)

	for rows.Next() {
		var asset entity.Asset

		err = rows.Scan(&asset.Id, &asset.Name, &asset.Code, &asset.Distributor.Id, &asset.Issuer.Id)
		if err != nil {
			return nil, fmt.Errorf("AssetRepo - GetAssets - rows.Scan: %w", err)
		}

		entities = append(entities, asset)
	}

	return entities, nil
}

func (r AssetRepo) GetAssetByCode(code string) (entity.Asset, error) {
	smtp := `SELECT * FROM Asset WHERE code=$1`
	row := r.Db.QueryRow(smtp, code)

	var asset entity.Asset
	err := row.Scan(&asset.Id, &asset.Code, &asset.Distributor.Id, &asset.Issuer.Id)
	if err != nil {
		if err == sql.ErrNoRows {
			return entity.Asset{}, fmt.Errorf("AssetRepo - GetAssetByCode - asset not found")
		}
		return entity.Asset{}, fmt.Errorf("AssetRepo - GetAssetByCode - row.Scan: %w", err)
	}

	return asset, nil
}

func (r AssetRepo) CreateAsset(data entity.Asset) (entity.Asset, error) {
	res := data
	stmt := `INSERT INTO Asset (code, issuer_id, distributor_id) VALUES ($1, $2, $3) RETURNING id;`
	err := r.Db.QueryRow(stmt, data.Code, data.Issuer.Id, data.Distributor.Id).Scan(&res.Id)
	if err != nil {
		return entity.Asset{}, fmt.Errorf("AssetRepo - CreateAsset - db.QueryRow: %w", err)
	}

	return res, nil
}
