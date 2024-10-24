export type Body_login_login_access_token = {
	grant_type?: string | null;
	username: string;
	password: string;
	scope?: string;
	client_id?: string | null;
	client_secret?: string | null;
};



export type DataURIItems = {
	name: string;
	url_list: Array<URIItem>;
	base_url: string;
};



export type HTTPValidationError = {
	detail?: Array<ValidationError>;
};



export type IgnoreCreate = {
	uri: string;
	description: string;
};



export type IgnoreInterface = {
	uri: string;
	description: string;
	id?: number | null;
	created_at?: string;
	updated_at?: string;
};



export type IgnoreOut = {
	uri: string;
	description: string;
	id: number;
	created_at: string;
	updated_at: string;
};



export type IgnoreUpdate = {
	uri?: string | null;
	description?: string | null;
};



export type ItemCreate = {
	title: string;
	description?: string | null;
};



export type ItemPublic = {
	title: string;
	description?: string | null;
	id: string;
	owner_id: string;
};



export type ItemUpdate = {
	title?: string | null;
	description?: string | null;
};



export type Message = {
	message: string;
};



export type NewPassword = {
	token: string;
	new_password: string;
};



export type Page_IgnoreOut_ = {
	items: Array<IgnoreOut>;
	total: number | null;
	page: number | null;
	size: number | null;
	pages?: number | null;
};



export type Page_ProjectNameMappingPublic_ = {
	items: Array<ProjectNameMappingPublic>;
	total: number | null;
	page: number | null;
	size: number | null;
	pages?: number | null;
};



export type PaginatedResponse_ItemPublic_ = {
	data: Array<ItemPublic>;
	total: number;
	page: number;
	size: number;
	pages: number;
};



export type PaginatedResponse_RolePublic_ = {
	data: Array<RolePublic>;
	total: number;
	page: number;
	size: number;
	pages: number;
};



export type PaginatedResponse_UserPublic_ = {
	data: Array<UserPublic>;
	total: number;
	page: number;
	size: number;
	pages: number;
};



export type PasswordValidationRequest = {
	password: string;
	username: string;
};



export type PasswordValidationResponse = {
	is_valid: boolean;
	errors: Array<string>;
	strength: string;
};



export type ProjectNameMappingCreate = {
	upload_name: string;
	eureka_name: string;
	name: string;
	description: string;
};



export type ProjectNameMappingPublic = {
	id: string;
	upload_name: string | null;
	eureka_name: string;
	name: string | null;
	description: string | null;
	created_at: string;
	updated_at: string;
};



export type ProjectNameMappingUpdate = {
	upload_name?: string | null;
	eureka_name?: string | null;
	name?: string | null;
	description?: string | null;
};



export type ReportRUI = {
	data: Array<DataURIItems>;
};



export type RoleCreate = {
	name: string;
	description?: string | null;
};



export type RolePublic = {
	name: string;
	description?: string | null;
	id: string;
};



export type RoleUpdate = {
	name?: string | null;
	description?: string | null;
};



export type Token = {
	access_token: string;
	token_type?: string;
};



export type URIItem = {
	url?: string | null;
	method?: string | null;
	description?: string | null;
	is_active?: boolean;
};



export type UpdatePassword = {
	current_password: string;
	new_password: string;
};



export type UserCreate = {
	email: string;
	is_active?: boolean;
	is_superuser?: boolean;
	full_name?: string | null;
	role_id?: string | null;
	password: string;
};



export type UserPublic = {
	email: string;
	is_active?: boolean;
	is_superuser?: boolean;
	full_name?: string | null;
	role_id?: string | null;
	id: string;
};



export type UserRegister = {
	email: string;
	password: string;
	full_name?: string | null;
};



export type UserUpdate = {
	email?: string | null;
	is_active?: boolean;
	is_superuser?: boolean;
	full_name?: string | null;
	role_id?: string | null;
	password?: string | null;
};



export type UserUpdateMe = {
	full_name?: string | null;
	email?: string | null;
};



export type ValidationError = {
	loc: Array<string | number>;
	msg: string;
	type: string;
};

