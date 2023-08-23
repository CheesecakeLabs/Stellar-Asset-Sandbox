// Code generated by MockGen. DO NOT EDIT.
// Source: internal/usecase/interfaces.go

// Package mocks is a generated GoMock package.
package mocks

import (
	reflect "reflect"

	entity "github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	usecase "github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase"
	gomock "github.com/golang/mock/gomock"
)

// MockUserRepo is a mock of UserRepo interface.
type MockUserRepo struct {
	ctrl     *gomock.Controller
	recorder *MockUserRepoMockRecorder
}

// MockUserRepoMockRecorder is the mock recorder for MockUserRepo.
type MockUserRepoMockRecorder struct {
	mock *MockUserRepo
}

// NewMockUserRepo creates a new mock instance.
func NewMockUserRepo(ctrl *gomock.Controller) *MockUserRepo {
	mock := &MockUserRepo{ctrl: ctrl}
	mock.recorder = &MockUserRepoMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockUserRepo) EXPECT() *MockUserRepoMockRecorder {
	return m.recorder
}

// CreateUser mocks base method.
func (m *MockUserRepo) CreateUser(user entity.User) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "CreateUser", user)
	ret0, _ := ret[0].(error)
	return ret0
}

// CreateUser indicates an expected call of CreateUser.
func (mr *MockUserRepoMockRecorder) CreateUser(user interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CreateUser", reflect.TypeOf((*MockUserRepo)(nil).CreateUser), user)
}

// EditUsersRole mocks base method.
func (m *MockUserRepo) EditUsersRole(id_user, id_role string) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "EditUsersRole", id_user, id_role)
	ret0, _ := ret[0].(error)
	return ret0
}

// EditUsersRole indicates an expected call of EditUsersRole.
func (mr *MockUserRepoMockRecorder) EditUsersRole(id_user, id_role interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "EditUsersRole", reflect.TypeOf((*MockUserRepo)(nil).EditUsersRole), id_user, id_role)
}

// GetAllUsers mocks base method.
func (m *MockUserRepo) GetAllUsers() ([]entity.UserResponse, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetAllUsers")
	ret0, _ := ret[0].([]entity.UserResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetAllUsers indicates an expected call of GetAllUsers.
func (mr *MockUserRepoMockRecorder) GetAllUsers() *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetAllUsers", reflect.TypeOf((*MockUserRepo)(nil).GetAllUsers))
}

// GetProfile mocks base method.
func (m *MockUserRepo) GetProfile(token string) (entity.UserResponse, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetProfile", token)
	ret0, _ := ret[0].(entity.UserResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetProfile indicates an expected call of GetProfile.
func (mr *MockUserRepoMockRecorder) GetProfile(token interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetProfile", reflect.TypeOf((*MockUserRepo)(nil).GetProfile), token)
}

// GetUser mocks base method.
func (m *MockUserRepo) GetUser(email string) (entity.User, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetUser", email)
	ret0, _ := ret[0].(entity.User)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetUser indicates an expected call of GetUser.
func (mr *MockUserRepoMockRecorder) GetUser(email interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetUser", reflect.TypeOf((*MockUserRepo)(nil).GetUser), email)
}

// GetUserByToken mocks base method.
func (m *MockUserRepo) GetUserByToken(token string) (entity.User, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetUserByToken", token)
	ret0, _ := ret[0].(entity.User)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetUserByToken indicates an expected call of GetUserByToken.
func (mr *MockUserRepoMockRecorder) GetUserByToken(token interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetUserByToken", reflect.TypeOf((*MockUserRepo)(nil).GetUserByToken), token)
}

// UpdateToken mocks base method.
func (m *MockUserRepo) UpdateToken(id, token string) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "UpdateToken", id, token)
	ret0, _ := ret[0].(error)
	return ret0
}

// UpdateToken indicates an expected call of UpdateToken.
func (mr *MockUserRepoMockRecorder) UpdateToken(id, token interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "UpdateToken", reflect.TypeOf((*MockUserRepo)(nil).UpdateToken), id, token)
}

// ValidateToken mocks base method.
func (m *MockUserRepo) ValidateToken(token string) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "ValidateToken", token)
	ret0, _ := ret[0].(error)
	return ret0
}

// ValidateToken indicates an expected call of ValidateToken.
func (mr *MockUserRepoMockRecorder) ValidateToken(token interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "ValidateToken", reflect.TypeOf((*MockUserRepo)(nil).ValidateToken), token)
}

// MockUser is a mock of User interface.
type MockUser struct {
	ctrl     *gomock.Controller
	recorder *MockUserMockRecorder
}

// MockUserMockRecorder is the mock recorder for MockUser.
type MockUserMockRecorder struct {
	mock *MockUser
}

// NewMockUser creates a new mock instance.
func NewMockUser(ctrl *gomock.Controller) *MockUser {
	mock := &MockUser{ctrl: ctrl}
	mock.recorder = &MockUserMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockUser) EXPECT() *MockUserMockRecorder {
	return m.recorder
}

// Autentication mocks base method.
func (m *MockUser) Autentication(name, password string) (usecase.User, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Autentication", name, password)
	ret0, _ := ret[0].(usecase.User)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// Autentication indicates an expected call of Autentication.
func (mr *MockUserMockRecorder) Autentication(name, password interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Autentication", reflect.TypeOf((*MockUser)(nil).Autentication), name, password)
}

// CreateUser mocks base method.
func (m *MockUser) CreateUser(user entity.User) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "CreateUser", user)
	ret0, _ := ret[0].(error)
	return ret0
}

// CreateUser indicates an expected call of CreateUser.
func (mr *MockUserMockRecorder) CreateUser(user interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CreateUser", reflect.TypeOf((*MockUser)(nil).CreateUser), user)
}

// Detail mocks base method.
func (m *MockUser) Detail(email string) (entity.User, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Detail", email)
	ret0, _ := ret[0].(entity.User)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// Detail indicates an expected call of Detail.
func (mr *MockUserMockRecorder) Detail(email interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Detail", reflect.TypeOf((*MockUser)(nil).Detail), email)
}

// MockWalletRepoInterface is a mock of WalletRepoInterface interface.
type MockWalletRepoInterface struct {
	ctrl     *gomock.Controller
	recorder *MockWalletRepoInterfaceMockRecorder
}

// MockWalletRepoInterfaceMockRecorder is the mock recorder for MockWalletRepoInterface.
type MockWalletRepoInterfaceMockRecorder struct {
	mock *MockWalletRepoInterface
}

// NewMockWalletRepoInterface creates a new mock instance.
func NewMockWalletRepoInterface(ctrl *gomock.Controller) *MockWalletRepoInterface {
	mock := &MockWalletRepoInterface{ctrl: ctrl}
	mock.recorder = &MockWalletRepoInterfaceMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockWalletRepoInterface) EXPECT() *MockWalletRepoInterfaceMockRecorder {
	return m.recorder
}

// CreateKey mocks base method.
func (m *MockWalletRepoInterface) CreateKey(arg0 entity.Key) (entity.Key, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "CreateKey", arg0)
	ret0, _ := ret[0].(entity.Key)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// CreateKey indicates an expected call of CreateKey.
func (mr *MockWalletRepoInterfaceMockRecorder) CreateKey(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CreateKey", reflect.TypeOf((*MockWalletRepoInterface)(nil).CreateKey), arg0)
}

// CreateWallet mocks base method.
func (m *MockWalletRepoInterface) CreateWallet(arg0 entity.Wallet) (entity.Wallet, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "CreateWallet", arg0)
	ret0, _ := ret[0].(entity.Wallet)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// CreateWallet indicates an expected call of CreateWallet.
func (mr *MockWalletRepoInterfaceMockRecorder) CreateWallet(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CreateWallet", reflect.TypeOf((*MockWalletRepoInterface)(nil).CreateWallet), arg0)
}

// CreateWalletWithKey mocks base method.
func (m *MockWalletRepoInterface) CreateWalletWithKey(arg0 entity.Wallet) (entity.Wallet, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "CreateWalletWithKey", arg0)
	ret0, _ := ret[0].(entity.Wallet)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// CreateWalletWithKey indicates an expected call of CreateWalletWithKey.
func (mr *MockWalletRepoInterfaceMockRecorder) CreateWalletWithKey(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CreateWalletWithKey", reflect.TypeOf((*MockWalletRepoInterface)(nil).CreateWalletWithKey), arg0)
}

// GetKeyByWallet mocks base method.
func (m *MockWalletRepoInterface) GetKeyByWallet(arg0 int) (entity.Key, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetKeyByWallet", arg0)
	ret0, _ := ret[0].(entity.Key)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetKeyByWallet indicates an expected call of GetKeyByWallet.
func (mr *MockWalletRepoInterfaceMockRecorder) GetKeyByWallet(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetKeyByWallet", reflect.TypeOf((*MockWalletRepoInterface)(nil).GetKeyByWallet), arg0)
}

// GetWallet mocks base method.
func (m *MockWalletRepoInterface) GetWallet(arg0 int) (entity.Wallet, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetWallet", arg0)
	ret0, _ := ret[0].(entity.Wallet)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetWallet indicates an expected call of GetWallet.
func (mr *MockWalletRepoInterfaceMockRecorder) GetWallet(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetWallet", reflect.TypeOf((*MockWalletRepoInterface)(nil).GetWallet), arg0)
}

// GetWallets mocks base method.
func (m *MockWalletRepoInterface) GetWallets(arg0 string) ([]entity.Wallet, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetWallets", arg0)
	ret0, _ := ret[0].([]entity.Wallet)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetWallets indicates an expected call of GetWallets.
func (mr *MockWalletRepoInterfaceMockRecorder) GetWallets(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetWallets", reflect.TypeOf((*MockWalletRepoInterface)(nil).GetWallets), arg0)
}

// UpdateWallet mocks base method.
func (m *MockWalletRepoInterface) UpdateWallet(arg0 entity.Wallet) (entity.Wallet, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "UpdateWallet", arg0)
	ret0, _ := ret[0].(entity.Wallet)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// UpdateWallet indicates an expected call of UpdateWallet.
func (mr *MockWalletRepoInterfaceMockRecorder) UpdateWallet(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "UpdateWallet", reflect.TypeOf((*MockWalletRepoInterface)(nil).UpdateWallet), arg0)
}

// MockAssetRepoInterface is a mock of AssetRepoInterface interface.
type MockAssetRepoInterface struct {
	ctrl     *gomock.Controller
	recorder *MockAssetRepoInterfaceMockRecorder
}

// MockAssetRepoInterfaceMockRecorder is the mock recorder for MockAssetRepoInterface.
type MockAssetRepoInterfaceMockRecorder struct {
	mock *MockAssetRepoInterface
}

// NewMockAssetRepoInterface creates a new mock instance.
func NewMockAssetRepoInterface(ctrl *gomock.Controller) *MockAssetRepoInterface {
	mock := &MockAssetRepoInterface{ctrl: ctrl}
	mock.recorder = &MockAssetRepoInterfaceMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockAssetRepoInterface) EXPECT() *MockAssetRepoInterfaceMockRecorder {
	return m.recorder
}

// CreateAsset mocks base method.
func (m *MockAssetRepoInterface) CreateAsset(arg0 entity.Asset) (entity.Asset, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "CreateAsset", arg0)
	ret0, _ := ret[0].(entity.Asset)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// CreateAsset indicates an expected call of CreateAsset.
func (mr *MockAssetRepoInterfaceMockRecorder) CreateAsset(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CreateAsset", reflect.TypeOf((*MockAssetRepoInterface)(nil).CreateAsset), arg0)
}

// GetAsset mocks base method.
func (m *MockAssetRepoInterface) GetAsset(arg0 int) (entity.Asset, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetAsset", arg0)
	ret0, _ := ret[0].(entity.Asset)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetAsset indicates an expected call of GetAsset.
func (mr *MockAssetRepoInterfaceMockRecorder) GetAsset(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetAsset", reflect.TypeOf((*MockAssetRepoInterface)(nil).GetAsset), arg0)
}

// GetAssetByCode mocks base method.
func (m *MockAssetRepoInterface) GetAssetByCode(arg0 string) (entity.Asset, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetAssetByCode", arg0)
	ret0, _ := ret[0].(entity.Asset)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetAssetByCode indicates an expected call of GetAssetByCode.
func (mr *MockAssetRepoInterfaceMockRecorder) GetAssetByCode(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetAssetByCode", reflect.TypeOf((*MockAssetRepoInterface)(nil).GetAssetByCode), arg0)
}

// GetAssetById mocks base method.
func (m *MockAssetRepoInterface) GetAssetById(arg0 string) (entity.Asset, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetAssetById", arg0)
	ret0, _ := ret[0].(entity.Asset)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetAssetById indicates an expected call of GetAssetById.
func (mr *MockAssetRepoInterfaceMockRecorder) GetAssetById(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetAssetById", reflect.TypeOf((*MockAssetRepoInterface)(nil).GetAssetById), arg0)
}

// GetAssets mocks base method.
func (m *MockAssetRepoInterface) GetAssets() ([]entity.Asset, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetAssets")
	ret0, _ := ret[0].([]entity.Asset)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetAssets indicates an expected call of GetAssets.
func (mr *MockAssetRepoInterfaceMockRecorder) GetAssets() *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetAssets", reflect.TypeOf((*MockAssetRepoInterface)(nil).GetAssets))
}

// MockRoleRepoInterface is a mock of RoleRepoInterface interface.
type MockRoleRepoInterface struct {
	ctrl     *gomock.Controller
	recorder *MockRoleRepoInterfaceMockRecorder
}

// MockRoleRepoInterfaceMockRecorder is the mock recorder for MockRoleRepoInterface.
type MockRoleRepoInterfaceMockRecorder struct {
	mock *MockRoleRepoInterface
}

// NewMockRoleRepoInterface creates a new mock instance.
func NewMockRoleRepoInterface(ctrl *gomock.Controller) *MockRoleRepoInterface {
	mock := &MockRoleRepoInterface{ctrl: ctrl}
	mock.recorder = &MockRoleRepoInterfaceMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockRoleRepoInterface) EXPECT() *MockRoleRepoInterfaceMockRecorder {
	return m.recorder
}

// GetRoles mocks base method.
func (m *MockRoleRepoInterface) GetRoles() ([]entity.Role, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetRoles")
	ret0, _ := ret[0].([]entity.Role)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetRoles indicates an expected call of GetRoles.
func (mr *MockRoleRepoInterfaceMockRecorder) GetRoles() *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetRoles", reflect.TypeOf((*MockRoleRepoInterface)(nil).GetRoles))
}

// MockRolePermissionRepoInterface is a mock of RolePermissionRepoInterface interface.
type MockRolePermissionRepoInterface struct {
	ctrl     *gomock.Controller
	recorder *MockRolePermissionRepoInterfaceMockRecorder
}

// MockRolePermissionRepoInterfaceMockRecorder is the mock recorder for MockRolePermissionRepoInterface.
type MockRolePermissionRepoInterfaceMockRecorder struct {
	mock *MockRolePermissionRepoInterface
}

// NewMockRolePermissionRepoInterface creates a new mock instance.
func NewMockRolePermissionRepoInterface(ctrl *gomock.Controller) *MockRolePermissionRepoInterface {
	mock := &MockRolePermissionRepoInterface{ctrl: ctrl}
	mock.recorder = &MockRolePermissionRepoInterfaceMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockRolePermissionRepoInterface) EXPECT() *MockRolePermissionRepoInterfaceMockRecorder {
	return m.recorder
}

// GetRolePermissions mocks base method.
func (m *MockRolePermissionRepoInterface) GetRolePermissions(token string) ([]entity.RolePermissionResponse, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetRolePermissions", token)
	ret0, _ := ret[0].([]entity.RolePermissionResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetRolePermissions indicates an expected call of GetRolePermissions.
func (mr *MockRolePermissionRepoInterfaceMockRecorder) GetRolePermissions(token interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetRolePermissions", reflect.TypeOf((*MockRolePermissionRepoInterface)(nil).GetRolePermissions), token)
}

// Validate mocks base method.
func (m *MockRolePermissionRepoInterface) Validate(action string, roleId int) (bool, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Validate", action, roleId)
	ret0, _ := ret[0].(bool)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// Validate indicates an expected call of Validate.
func (mr *MockRolePermissionRepoInterfaceMockRecorder) Validate(action, roleId interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Validate", reflect.TypeOf((*MockRolePermissionRepoInterface)(nil).Validate), action, roleId)
}

// MockVaultCategoryRepoInterface is a mock of VaultCategoryRepoInterface interface.
type MockVaultCategoryRepoInterface struct {
	ctrl     *gomock.Controller
	recorder *MockVaultCategoryRepoInterfaceMockRecorder
}

// MockVaultCategoryRepoInterfaceMockRecorder is the mock recorder for MockVaultCategoryRepoInterface.
type MockVaultCategoryRepoInterfaceMockRecorder struct {
	mock *MockVaultCategoryRepoInterface
}

// NewMockVaultCategoryRepoInterface creates a new mock instance.
func NewMockVaultCategoryRepoInterface(ctrl *gomock.Controller) *MockVaultCategoryRepoInterface {
	mock := &MockVaultCategoryRepoInterface{ctrl: ctrl}
	mock.recorder = &MockVaultCategoryRepoInterfaceMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockVaultCategoryRepoInterface) EXPECT() *MockVaultCategoryRepoInterfaceMockRecorder {
	return m.recorder
}

// CreateVaultCategory mocks base method.
func (m *MockVaultCategoryRepoInterface) CreateVaultCategory(arg0 entity.VaultCategory) (entity.VaultCategory, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "CreateVaultCategory", arg0)
	ret0, _ := ret[0].(entity.VaultCategory)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// CreateVaultCategory indicates an expected call of CreateVaultCategory.
func (mr *MockVaultCategoryRepoInterfaceMockRecorder) CreateVaultCategory(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CreateVaultCategory", reflect.TypeOf((*MockVaultCategoryRepoInterface)(nil).CreateVaultCategory), arg0)
}

// GetVaultCategories mocks base method.
func (m *MockVaultCategoryRepoInterface) GetVaultCategories() ([]entity.VaultCategory, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetVaultCategories")
	ret0, _ := ret[0].([]entity.VaultCategory)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetVaultCategories indicates an expected call of GetVaultCategories.
func (mr *MockVaultCategoryRepoInterfaceMockRecorder) GetVaultCategories() *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetVaultCategories", reflect.TypeOf((*MockVaultCategoryRepoInterface)(nil).GetVaultCategories))
}

// GetVaultCategoryById mocks base method.
func (m *MockVaultCategoryRepoInterface) GetVaultCategoryById(id int) (entity.VaultCategory, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetVaultCategoryById", id)
	ret0, _ := ret[0].(entity.VaultCategory)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetVaultCategoryById indicates an expected call of GetVaultCategoryById.
func (mr *MockVaultCategoryRepoInterfaceMockRecorder) GetVaultCategoryById(id interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetVaultCategoryById", reflect.TypeOf((*MockVaultCategoryRepoInterface)(nil).GetVaultCategoryById), id)
}

// MockVaultRepoInterface is a mock of VaultRepoInterface interface.
type MockVaultRepoInterface struct {
	ctrl     *gomock.Controller
	recorder *MockVaultRepoInterfaceMockRecorder
}

// MockVaultRepoInterfaceMockRecorder is the mock recorder for MockVaultRepoInterface.
type MockVaultRepoInterfaceMockRecorder struct {
	mock *MockVaultRepoInterface
}

// NewMockVaultRepoInterface creates a new mock instance.
func NewMockVaultRepoInterface(ctrl *gomock.Controller) *MockVaultRepoInterface {
	mock := &MockVaultRepoInterface{ctrl: ctrl}
	mock.recorder = &MockVaultRepoInterfaceMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockVaultRepoInterface) EXPECT() *MockVaultRepoInterfaceMockRecorder {
	return m.recorder
}

// CreateVault mocks base method.
func (m *MockVaultRepoInterface) CreateVault(arg0 entity.Vault) (entity.Vault, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "CreateVault", arg0)
	ret0, _ := ret[0].(entity.Vault)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// CreateVault indicates an expected call of CreateVault.
func (mr *MockVaultRepoInterfaceMockRecorder) CreateVault(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CreateVault", reflect.TypeOf((*MockVaultRepoInterface)(nil).CreateVault), arg0)
}

// DeleteVault mocks base method.
func (m *MockVaultRepoInterface) DeleteVault(arg0 entity.Vault) (entity.Vault, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "DeleteVault", arg0)
	ret0, _ := ret[0].(entity.Vault)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// DeleteVault indicates an expected call of DeleteVault.
func (mr *MockVaultRepoInterfaceMockRecorder) DeleteVault(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "DeleteVault", reflect.TypeOf((*MockVaultRepoInterface)(nil).DeleteVault), arg0)
}

// GetVaultById mocks base method.
func (m *MockVaultRepoInterface) GetVaultById(id int) (entity.Vault, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetVaultById", id)
	ret0, _ := ret[0].(entity.Vault)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetVaultById indicates an expected call of GetVaultById.
func (mr *MockVaultRepoInterfaceMockRecorder) GetVaultById(id interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetVaultById", reflect.TypeOf((*MockVaultRepoInterface)(nil).GetVaultById), id)
}

// GetVaults mocks base method.
func (m *MockVaultRepoInterface) GetVaults() ([]entity.Vault, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetVaults")
	ret0, _ := ret[0].([]entity.Vault)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetVaults indicates an expected call of GetVaults.
func (mr *MockVaultRepoInterfaceMockRecorder) GetVaults() *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetVaults", reflect.TypeOf((*MockVaultRepoInterface)(nil).GetVaults))
}

// UpdateVault mocks base method.
func (m *MockVaultRepoInterface) UpdateVault(arg0 entity.Vault) (entity.Vault, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "UpdateVault", arg0)
	ret0, _ := ret[0].(entity.Vault)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// UpdateVault indicates an expected call of UpdateVault.
func (mr *MockVaultRepoInterfaceMockRecorder) UpdateVault(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "UpdateVault", reflect.TypeOf((*MockVaultRepoInterface)(nil).UpdateVault), arg0)
}

// MockContractRepoInterface is a mock of ContractRepoInterface interface.
type MockContractRepoInterface struct {
	ctrl     *gomock.Controller
	recorder *MockContractRepoInterfaceMockRecorder
}

// MockContractRepoInterfaceMockRecorder is the mock recorder for MockContractRepoInterface.
type MockContractRepoInterfaceMockRecorder struct {
	mock *MockContractRepoInterface
}

// NewMockContractRepoInterface creates a new mock instance.
func NewMockContractRepoInterface(ctrl *gomock.Controller) *MockContractRepoInterface {
	mock := &MockContractRepoInterface{ctrl: ctrl}
	mock.recorder = &MockContractRepoInterfaceMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockContractRepoInterface) EXPECT() *MockContractRepoInterfaceMockRecorder {
	return m.recorder
}

// CreateContract mocks base method.
func (m *MockContractRepoInterface) CreateContract(arg0 entity.Contract) (entity.Contract, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "CreateContract", arg0)
	ret0, _ := ret[0].(entity.Contract)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// CreateContract indicates an expected call of CreateContract.
func (mr *MockContractRepoInterfaceMockRecorder) CreateContract(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CreateContract", reflect.TypeOf((*MockContractRepoInterface)(nil).CreateContract), arg0)
}

// GetContractById mocks base method.
func (m *MockContractRepoInterface) GetContractById(id string) (entity.Contract, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetContractById", id)
	ret0, _ := ret[0].(entity.Contract)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetContractById indicates an expected call of GetContractById.
func (mr *MockContractRepoInterfaceMockRecorder) GetContractById(id interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetContractById", reflect.TypeOf((*MockContractRepoInterface)(nil).GetContractById), id)
}

// GetContracts mocks base method.
func (m *MockContractRepoInterface) GetContracts() ([]entity.Contract, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetContracts")
	ret0, _ := ret[0].([]entity.Contract)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetContracts indicates an expected call of GetContracts.
func (mr *MockContractRepoInterfaceMockRecorder) GetContracts() *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetContracts", reflect.TypeOf((*MockContractRepoInterface)(nil).GetContracts))
}
