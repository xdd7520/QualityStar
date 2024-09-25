import type { CancelablePromise } from './core/CancelablePromise';
import { OpenAPI } from './core/OpenAPI';
import { request as __request } from './core/request';

import type { Body_login_login_access_token,Message,NewPassword,Token,UserPublic,PaginatedResponse_UserPublic_,UpdatePassword,UserCreate,UserRegister,UserUpdate,UserUpdateMe,ItemCreate,ItemPublic,ItemUpdate,PaginatedResponse_ItemPublic_,PaginatedResponse_RolePublic_,RoleCreate,RolePublic,RoleUpdate } from './models';

export type TDataLoginAccessToken = {
                formData: Body_login_login_access_token

            }
export type TDataRecoverPassword = {
                email: string

            }
export type TDataResetPassword = {
                requestBody: NewPassword

            }
export type TDataRecoverPasswordHtmlContent = {
                email: string

            }

export class LoginService {

	/**
	 * Login Access Token
	 * OAuth2 compatible token login, get an access token for future requests
	 * @returns Token Successful Response
	 * @throws ApiError
	 */
	public static loginAccessToken(data: TDataLoginAccessToken): CancelablePromise<Token> {
		const {
formData,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/login/access-token',
			formData: formData,
			mediaType: 'application/x-www-form-urlencoded',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Test Token
	 * Test access token
	 * @returns UserPublic Successful Response
	 * @throws ApiError
	 */
	public static testToken(): CancelablePromise<UserPublic> {
				return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/login/test-token',
		});
	}

	/**
	 * Recover Password
	 * Password Recovery
	 * @returns Message Successful Response
	 * @throws ApiError
	 */
	public static recoverPassword(data: TDataRecoverPassword): CancelablePromise<Message> {
		const {
email,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/password-recovery/{email}',
			path: {
				email
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Reset Password
	 * Reset password
	 * @returns Message Successful Response
	 * @throws ApiError
	 */
	public static resetPassword(data: TDataResetPassword): CancelablePromise<Message> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/reset-password/',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Recover Password Html Content
	 * HTML Content for Password Recovery
	 * @returns string Successful Response
	 * @throws ApiError
	 */
	public static recoverPasswordHtmlContent(data: TDataRecoverPasswordHtmlContent): CancelablePromise<string> {
		const {
email,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/password-recovery-html-content/{email}',
			path: {
				email
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

}

export type TDataReadUsers = {
                /**
 * Page number
 */
page?: number
/**
 * Page size
 */
size?: number

            }
export type TDataCreateUser = {
                requestBody: UserCreate

            }
export type TDataUpdateUserMe = {
                requestBody: UserUpdateMe

            }
export type TDataUpdatePasswordMe = {
                requestBody: UpdatePassword

            }
export type TDataRegisterUser = {
                requestBody: UserRegister

            }
export type TDataReadUserById = {
                userId: string

            }
export type TDataUpdateUser = {
                requestBody: UserUpdate
userId: string

            }
export type TDataDeleteUser = {
                userId: string

            }

export class UsersService {

	/**
	 * Read Users
	 * Retrieve users with pagination.
	 * @returns PaginatedResponse_UserPublic_ Successful Response
	 * @throws ApiError
	 */
	public static readUsers(data: TDataReadUsers = {}): CancelablePromise<PaginatedResponse_UserPublic_> {
		const {
page = 1,
size = 20,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/users/',
			query: {
				page, size
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Create User
	 * Create new user.
	 * @returns UserPublic Successful Response
	 * @throws ApiError
	 */
	public static createUser(data: TDataCreateUser): CancelablePromise<UserPublic> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/users/',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Read User Me
	 * Get current user.
	 * @returns UserPublic Successful Response
	 * @throws ApiError
	 */
	public static readUserMe(): CancelablePromise<UserPublic> {
				return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/users/me',
		});
	}

	/**
	 * Delete User Me
	 * Delete own user.
	 * @returns Message Successful Response
	 * @throws ApiError
	 */
	public static deleteUserMe(): CancelablePromise<Message> {
				return __request(OpenAPI, {
			method: 'DELETE',
			url: '/api/v1/users/me',
		});
	}

	/**
	 * Update User Me
	 * Update own user.
	 * @returns UserPublic Successful Response
	 * @throws ApiError
	 */
	public static updateUserMe(data: TDataUpdateUserMe): CancelablePromise<UserPublic> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'PATCH',
			url: '/api/v1/users/me',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Update Password Me
	 * Update own password.
	 * @returns Message Successful Response
	 * @throws ApiError
	 */
	public static updatePasswordMe(data: TDataUpdatePasswordMe): CancelablePromise<Message> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'PATCH',
			url: '/api/v1/users/me/password',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Register User
	 * Create new user without the need to be logged in.
	 * @returns UserPublic Successful Response
	 * @throws ApiError
	 */
	public static registerUser(data: TDataRegisterUser): CancelablePromise<UserPublic> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/users/signup',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Read User By Id
	 * Get a specific user by id.
	 * @returns UserPublic Successful Response
	 * @throws ApiError
	 */
	public static readUserById(data: TDataReadUserById): CancelablePromise<UserPublic> {
		const {
userId,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/users/{user_id}',
			path: {
				user_id: userId
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Update User
	 * Update a user.
	 * @returns UserPublic Successful Response
	 * @throws ApiError
	 */
	public static updateUser(data: TDataUpdateUser): CancelablePromise<UserPublic> {
		const {
requestBody,
userId,
} = data;
		return __request(OpenAPI, {
			method: 'PATCH',
			url: '/api/v1/users/{user_id}',
			path: {
				user_id: userId
			},
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Delete User
	 * Delete a user.
	 * @returns Message Successful Response
	 * @throws ApiError
	 */
	public static deleteUser(data: TDataDeleteUser): CancelablePromise<Message> {
		const {
			userId,
			} = data;
		return __request(OpenAPI, {
			method: 'DELETE',
			url: '/api/v1/users/{user_id}',
			path: {
				user_id: userId
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

}

export type TDataTestEmail = {
                emailTo: string

            }

export class UtilsService {

	/**
	 * Test Email
	 * Test emails.
	 * @returns Message Successful Response
	 * @throws ApiError
	 */
	public static testEmail(data: TDataTestEmail): CancelablePromise<Message> {
		const {
emailTo,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/utils/test-email/',
			query: {
				email_to: emailTo
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Health Check
	 * @returns boolean Successful Response
	 * @throws ApiError
	 */
	public static healthCheck(): CancelablePromise<boolean> {
				return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/utils/health-check/',
		});
	}

}

export type TDataReadItems = {
                /**
 * Page number
 */
page?: number
/**
 * Page size
 */
size?: number

            }
export type TDataCreateItem = {
                requestBody: ItemCreate

            }
export type TDataUpdateItem = {
                id: string
requestBody: ItemUpdate

            }
export type TDataReadItem = {
                id: string

            }
export type TDataDeleteItem = {
                id: string

            }

export class ItemsService {

	/**
	 * Read Items
	 * Retrieve items with pagination.
	 * @returns PaginatedResponse_ItemPublic_ Successful Response
	 * @throws ApiError
	 */
	public static readItems(data: TDataReadItems = {}): CancelablePromise<PaginatedResponse_ItemPublic_> {
		const {
page = 1,
size = 20,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/items/',
			query: {
				page, size
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Create Item
	 * Create new item.
	 * @returns ItemPublic Successful Response
	 * @throws ApiError
	 */
	public static createItem(data: TDataCreateItem): CancelablePromise<ItemPublic> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/items/',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Update Item
	 * Update an item.
	 * @returns ItemPublic Successful Response
	 * @throws ApiError
	 */
	public static updateItem(data: TDataUpdateItem): CancelablePromise<ItemPublic> {
		const {
id,
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/api/v1/items/{id}',
			path: {
				id
			},
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Read Item
	 * Get item by ID.
	 * @returns ItemPublic Successful Response
	 * @throws ApiError
	 */
	public static readItem(data: TDataReadItem): CancelablePromise<ItemPublic> {
		const {
id,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/items/{id}',
			path: {
				id
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Delete Item
	 * Delete an item.
	 * @returns ItemPublic Successful Response
	 * @throws ApiError
	 */
	public static deleteItem(data: TDataDeleteItem): CancelablePromise<ItemPublic> {
		const {
id,
} = data;
		return __request(OpenAPI, {
			method: 'DELETE',
			url: '/api/v1/items/{id}',
			path: {
				id
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

}

export type TDataCreateRole = {
                requestBody: RoleCreate

            }
export type TDataReadRoles = {
                /**
 * Page number
 */
page?: number
/**
 * Page size
 */
size?: number

            }
export type TDataReadRole = {
                roleId: string

            }
export type TDataUpdateRole = {
                requestBody: RoleUpdate
roleId: string

            }
export type TDataDeleteRole = {
                roleId: string

            }

export class RolesService {

	/**
	 * Create Role
	 * @returns RolePublic Successful Response
	 * @throws ApiError
	 */
	public static createRole(data: TDataCreateRole): CancelablePromise<RolePublic> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/roles/',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Read Roles
	 * @returns PaginatedResponse_RolePublic_ Successful Response
	 * @throws ApiError
	 */
	public static readRoles(data: TDataReadRoles = {}): CancelablePromise<PaginatedResponse_RolePublic_> {
		const {
page = 1,
size = 20,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/roles/',
			query: {
				page, size
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Read Role
	 * @returns RolePublic Successful Response
	 * @throws ApiError
	 */
	public static readRole(data: TDataReadRole): CancelablePromise<RolePublic> {
		const {
roleId,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/roles/{role_id}',
			path: {
				role_id: roleId
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Update Role
	 * @returns RolePublic Successful Response
	 * @throws ApiError
	 */
	public static updateRole(data: TDataUpdateRole): CancelablePromise<RolePublic> {
		const {
requestBody,
roleId,
} = data;
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/api/v1/roles/{role_id}',
			path: {
				role_id: roleId
			},
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Delete Role
	 * @returns unknown Successful Response
	 * @throws ApiError
	 */
	public static deleteRole(data: TDataDeleteRole): CancelablePromise<unknown> {
		const {
roleId,
} = data;
		return __request(OpenAPI, {
			method: 'DELETE',
			url: '/api/v1/roles/{role_id}',
			path: {
				role_id: roleId
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

}
