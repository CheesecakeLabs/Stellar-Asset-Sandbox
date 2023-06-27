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
