package local

import (
	"os"
	"path/filepath"
)

type LocalStorage struct {
	BasePath string
}

func (l *LocalStorage) UploadFile(filename string, file []byte) (string, error) {
	if filepath.Ext(filename) != ".png" {
		filename += ".png"
	}
	fullPath := filepath.Join(l.BasePath, filename)
	err := os.WriteFile(fullPath, file, 0o666)
	if err != nil {
		return "", err
	}
	return fullPath, nil
}
