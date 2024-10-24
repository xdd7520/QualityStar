export const $Body_login_login_access_token = {
	properties: {
		grant_type: {
	type: 'any-of',
	contains: [{
	type: 'string',
	pattern: 'password',
}, {
	type: 'null',
}],
},
		username: {
	type: 'string',
	isRequired: true,
},
		password: {
	type: 'string',
	isRequired: true,
},
		scope: {
	type: 'string',
	default: '',
},
		client_id: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		client_secret: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $DataURIItems = {
	properties: {
		name: {
	type: 'string',
	isRequired: true,
},
		url_list: {
	type: 'array',
	contains: {
		type: 'URIItem',
	},
	isRequired: true,
},
		base_url: {
	type: 'string',
	isRequired: true,
},
	},
} as const;

export const $HTTPValidationError = {
	properties: {
		detail: {
	type: 'array',
	contains: {
		type: 'ValidationError',
	},
},
	},
} as const;

export const $IgnoreCreate = {
	properties: {
		uri: {
	type: 'string',
	isRequired: true,
},
		description: {
	type: 'string',
	isRequired: true,
},
	},
} as const;

export const $IgnoreInterface = {
	properties: {
		uri: {
	type: 'string',
	isRequired: true,
},
		description: {
	type: 'string',
	isRequired: true,
},
		id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		created_at: {
	type: 'string',
	format: 'date-time',
},
		updated_at: {
	type: 'string',
	format: 'date-time',
},
	},
} as const;

export const $IgnoreOut = {
	properties: {
		uri: {
	type: 'string',
	isRequired: true,
},
		description: {
	type: 'string',
	isRequired: true,
},
		id: {
	type: 'number',
	isRequired: true,
},
		created_at: {
	type: 'string',
	isRequired: true,
	format: 'date-time',
},
		updated_at: {
	type: 'string',
	isRequired: true,
	format: 'date-time',
},
	},
} as const;

export const $IgnoreUpdate = {
	properties: {
		uri: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		description: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $ItemCreate = {
	properties: {
		title: {
	type: 'string',
	isRequired: true,
	maxLength: 255,
	minLength: 1,
},
		description: {
	type: 'any-of',
	contains: [{
	type: 'string',
	maxLength: 255,
}, {
	type: 'null',
}],
},
	},
} as const;

export const $ItemPublic = {
	properties: {
		title: {
	type: 'string',
	isRequired: true,
	maxLength: 255,
	minLength: 1,
},
		description: {
	type: 'any-of',
	contains: [{
	type: 'string',
	maxLength: 255,
}, {
	type: 'null',
}],
},
		id: {
	type: 'string',
	isRequired: true,
	format: 'uuid',
},
		owner_id: {
	type: 'string',
	isRequired: true,
	format: 'uuid',
},
	},
} as const;

export const $ItemUpdate = {
	properties: {
		title: {
	type: 'any-of',
	contains: [{
	type: 'string',
	maxLength: 255,
	minLength: 1,
}, {
	type: 'null',
}],
},
		description: {
	type: 'any-of',
	contains: [{
	type: 'string',
	maxLength: 255,
}, {
	type: 'null',
}],
},
	},
} as const;

export const $Message = {
	properties: {
		message: {
	type: 'string',
	isRequired: true,
},
	},
} as const;

export const $NewPassword = {
	properties: {
		token: {
	type: 'string',
	isRequired: true,
},
		new_password: {
	type: 'string',
	isRequired: true,
	maxLength: 40,
	minLength: 8,
},
	},
} as const;

export const $Page_IgnoreOut_ = {
	properties: {
		items: {
	type: 'array',
	contains: {
		type: 'IgnoreOut',
	},
	isRequired: true,
},
		total: {
	type: 'any-of',
	contains: [{
	type: 'number',
	minimum: 0,
}, {
	type: 'null',
}],
	isRequired: true,
},
		page: {
	type: 'any-of',
	contains: [{
	type: 'number',
	minimum: 1,
}, {
	type: 'null',
}],
	isRequired: true,
},
		size: {
	type: 'any-of',
	contains: [{
	type: 'number',
	minimum: 1,
}, {
	type: 'null',
}],
	isRequired: true,
},
		pages: {
	type: 'any-of',
	contains: [{
	type: 'number',
	minimum: 0,
}, {
	type: 'null',
}],
},
	},
} as const;

export const $Page_ProjectNameMappingPublic_ = {
	properties: {
		items: {
	type: 'array',
	contains: {
		type: 'ProjectNameMappingPublic',
	},
	isRequired: true,
},
		total: {
	type: 'any-of',
	contains: [{
	type: 'number',
	minimum: 0,
}, {
	type: 'null',
}],
	isRequired: true,
},
		page: {
	type: 'any-of',
	contains: [{
	type: 'number',
	minimum: 1,
}, {
	type: 'null',
}],
	isRequired: true,
},
		size: {
	type: 'any-of',
	contains: [{
	type: 'number',
	minimum: 1,
}, {
	type: 'null',
}],
	isRequired: true,
},
		pages: {
	type: 'any-of',
	contains: [{
	type: 'number',
	minimum: 0,
}, {
	type: 'null',
}],
},
	},
} as const;

export const $PaginatedResponse_ItemPublic_ = {
	properties: {
		data: {
	type: 'array',
	contains: {
	properties: {
	},
},
	isRequired: true,
},
		total: {
	type: 'number',
	isRequired: true,
},
		page: {
	type: 'number',
	isRequired: true,
},
		size: {
	type: 'number',
	isRequired: true,
},
		pages: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $PaginatedResponse_RolePublic_ = {
	properties: {
		data: {
	type: 'array',
	contains: {
	properties: {
	},
},
	isRequired: true,
},
		total: {
	type: 'number',
	isRequired: true,
},
		page: {
	type: 'number',
	isRequired: true,
},
		size: {
	type: 'number',
	isRequired: true,
},
		pages: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $PaginatedResponse_UserPublic_ = {
	properties: {
		data: {
	type: 'array',
	contains: {
	properties: {
	},
},
	isRequired: true,
},
		total: {
	type: 'number',
	isRequired: true,
},
		page: {
	type: 'number',
	isRequired: true,
},
		size: {
	type: 'number',
	isRequired: true,
},
		pages: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $PasswordValidationRequest = {
	properties: {
		password: {
	type: 'string',
	isRequired: true,
},
		username: {
	type: 'string',
	isRequired: true,
},
	},
} as const;

export const $PasswordValidationResponse = {
	properties: {
		is_valid: {
	type: 'boolean',
	isRequired: true,
},
		errors: {
	type: 'array',
	contains: {
	type: 'string',
},
	isRequired: true,
},
		strength: {
	type: 'string',
	isRequired: true,
},
	},
} as const;

export const $ProjectNameMappingCreate = {
	properties: {
		upload_name: {
	type: 'string',
	isRequired: true,
},
		eureka_name: {
	type: 'string',
	isRequired: true,
},
		name: {
	type: 'string',
	isRequired: true,
},
		description: {
	type: 'string',
	isRequired: true,
},
	},
} as const;

export const $ProjectNameMappingPublic = {
	properties: {
		id: {
	type: 'string',
	isRequired: true,
	format: 'uuid',
},
		upload_name: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
	isRequired: true,
},
		eureka_name: {
	type: 'string',
	isRequired: true,
},
		name: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
	isRequired: true,
},
		description: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
	isRequired: true,
},
		created_at: {
	type: 'string',
	isRequired: true,
	format: 'date-time',
},
		updated_at: {
	type: 'string',
	isRequired: true,
	format: 'date-time',
},
	},
} as const;

export const $ProjectNameMappingUpdate = {
	properties: {
		upload_name: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		eureka_name: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		name: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		description: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $ReportRUI = {
	properties: {
		data: {
	type: 'array',
	contains: {
		type: 'DataURIItems',
	},
	isRequired: true,
},
	},
} as const;

export const $RoleCreate = {
	properties: {
		name: {
	type: 'string',
	isRequired: true,
},
		description: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $RolePublic = {
	properties: {
		name: {
	type: 'string',
	isRequired: true,
},
		description: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		id: {
	type: 'string',
	isRequired: true,
	format: 'uuid',
},
	},
} as const;

export const $RoleUpdate = {
	properties: {
		name: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		description: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $Token = {
	properties: {
		access_token: {
	type: 'string',
	isRequired: true,
},
		token_type: {
	type: 'string',
	default: 'bearer',
},
	},
} as const;

export const $URIItem = {
	properties: {
		url: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		method: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		description: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		is_active: {
	type: 'boolean',
	default: false,
},
	},
} as const;

export const $UpdatePassword = {
	properties: {
		current_password: {
	type: 'string',
	isRequired: true,
	maxLength: 40,
	minLength: 8,
},
		new_password: {
	type: 'string',
	isRequired: true,
	maxLength: 40,
	minLength: 8,
},
	},
} as const;

export const $UserCreate = {
	properties: {
		email: {
	type: 'string',
	isRequired: true,
	format: 'email',
	maxLength: 255,
},
		is_active: {
	type: 'boolean',
	default: true,
},
		is_superuser: {
	type: 'boolean',
	default: false,
},
		full_name: {
	type: 'any-of',
	contains: [{
	type: 'string',
	maxLength: 255,
}, {
	type: 'null',
}],
},
		role_id: {
	type: 'any-of',
	contains: [{
	type: 'string',
	format: 'uuid',
}, {
	type: 'null',
}],
},
		password: {
	type: 'string',
	isRequired: true,
	maxLength: 40,
	minLength: 8,
},
	},
} as const;

export const $UserPublic = {
	properties: {
		email: {
	type: 'string',
	isRequired: true,
	format: 'email',
	maxLength: 255,
},
		is_active: {
	type: 'boolean',
	default: true,
},
		is_superuser: {
	type: 'boolean',
	default: false,
},
		full_name: {
	type: 'any-of',
	contains: [{
	type: 'string',
	maxLength: 255,
}, {
	type: 'null',
}],
},
		role_id: {
	type: 'any-of',
	contains: [{
	type: 'string',
	format: 'uuid',
}, {
	type: 'null',
}],
},
		id: {
	type: 'string',
	isRequired: true,
	format: 'uuid',
},
	},
} as const;

export const $UserRegister = {
	properties: {
		email: {
	type: 'string',
	isRequired: true,
	format: 'email',
	maxLength: 255,
},
		password: {
	type: 'string',
	isRequired: true,
	maxLength: 40,
	minLength: 8,
},
		full_name: {
	type: 'any-of',
	contains: [{
	type: 'string',
	maxLength: 255,
}, {
	type: 'null',
}],
},
	},
} as const;

export const $UserUpdate = {
	properties: {
		email: {
	type: 'any-of',
	contains: [{
	type: 'string',
	format: 'email',
	maxLength: 255,
}, {
	type: 'null',
}],
},
		is_active: {
	type: 'boolean',
	default: true,
},
		is_superuser: {
	type: 'boolean',
	default: false,
},
		full_name: {
	type: 'any-of',
	contains: [{
	type: 'string',
	maxLength: 255,
}, {
	type: 'null',
}],
},
		role_id: {
	type: 'any-of',
	contains: [{
	type: 'string',
	format: 'uuid',
}, {
	type: 'null',
}],
},
		password: {
	type: 'any-of',
	contains: [{
	type: 'string',
	maxLength: 40,
	minLength: 8,
}, {
	type: 'null',
}],
},
	},
} as const;

export const $UserUpdateMe = {
	properties: {
		full_name: {
	type: 'any-of',
	contains: [{
	type: 'string',
	maxLength: 255,
}, {
	type: 'null',
}],
},
		email: {
	type: 'any-of',
	contains: [{
	type: 'string',
	format: 'email',
	maxLength: 255,
}, {
	type: 'null',
}],
},
	},
} as const;

export const $ValidationError = {
	properties: {
		loc: {
	type: 'array',
	contains: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'number',
}],
},
	isRequired: true,
},
		msg: {
	type: 'string',
	isRequired: true,
},
		type: {
	type: 'string',
	isRequired: true,
},
	},
} as const;