package storage

type StorageService interface {
	UploadFile(filename string, file []byte) (string, error)
}
