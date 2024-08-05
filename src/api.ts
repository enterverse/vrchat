import { atLeastOneOf, reduceQueryObject } from "./utils";

import type { CurrentUser } from "vrchat";

// TODO: endpoints I was too lazy to implement.
// - GET    /avatars
// - POST   /avatars
// - GET    /avatars/favorites
// - GET    /Steam/transactions
// - GET    /Steam/transactions/:transactionId
// - GET    /auth/user/subscription
// - GET    /subscriptions
// - GET    /licenseGroups/:licenseGroupId
// - GET    /favorites
// - POST   /favorites
// - GET    /favorites/:favoriteId
// - DELETE /favorites/:favoriteId
// - GET    /favorites/groups
// - GET    /favorite/group/:favoriteGroupType/:favoriteGroupName/:userId
// - PUT    /favorite/group/:favoriteGroupType/:favoriteGroupName/:userId
// - DELETE /favorite/group/:favoriteGroupType/:favoriteGroupName/:userId
// - GET    /files
// - POST   /files
// - PUT    /file/:fileId/:versionId/:fileType/finish
// - PUT    /file/:fileId/:versionId/:fileType/start
// - GET    /file/:fileId/:versionId/:fileType/status
// - GET    /groups
// - POST   /groups
// - GET    /groups/:groupId
// - PUT    /groups/:groupId
// - DELETE /groups/:groupId
// - GET    /groups/:groupId/announcement
// - POST   /groups/:groupId/announcement
// - DELETE /groups/:groupId/announcement
// - GET    /groups/:groupId/auditLogs
// - GET    /groups/:groupId/bans
// - POST   /groups/:groupId/bans
// - DELETE /groups/:groupId/bans/:userId
// - POST   /groups/:groupId/galleries
// - GET    /groups/:groupId/galleries/:groupGalleryId
// - PUT    /groups/:groupId/galleries/:groupGalleryId
// - DELETE /groups/:groupId/galleries/:groupGalleryId
// - POST   /groups/:groupId/galleries/:groupGalleryId/images
// - DELETE /groups/:groupId/galleries/:groupGalleryId/images/:groupGalleryImageId
// - GET    /groups/:groupId/instances
// - GET    /groups/:groupId/invites
// - POST   /groups/:groupId/invites
// - DELETE /groups/:groupId/invites/:userId
// - POST   /groups/:groupId/join
// - POST   /groups/:groupId/leave
// - GET    /groups/:groupId/members
// - GET    /groups/:groupId/members/:userId
// - PUT    /groups/:groupId/members/:userId
// - DELETE /groups/:groupId/members/:userId
// - PUT    /groups/:groupId/members/:userId/roles/:groupRoleId
// - DELETE /groups/:groupId/members/:userId/roles/:groupRoleId
// - GET    /groups/:groupId/permissions
// - GET    /groups/:groupId/posts
// - POST   /groups/:groupId/posts
// - PUT    /groups/:groupId/posts/:notificationId
// - DELETE /groups/:groupId/posts/:notificationId
// - GET    /groups/:groupId/requests
// - DELETE /groups/:groupId/requests
// - PUT    /groups/:groupId/requests/:userId
// - GET    /groups/:groupId/roles
// - POST   /groups/:groupId/roles
// - PUT    /groups/:groupId/roles/:groupRoleId
// - DELETE /groups/:groupId/roles/:groupRoleId
// - GET    /message/:userId/:messageType
// - GET    /message/:userId/:messageType/:slot
// - GET    /message/:userId/:messageType/:slot
// - PUT    /message/:userId/:messageType/:slot
// - DELETE /message/:userId/:messageType/:slot
// - GET    /auth/permissions
// - GET    /permissions/:permissionId
// - GET    /auth/user/playermoderations
// - POST   /auth/user/playermoderations
// - DELETE /auth/user/playermoderations
// - GET    /auth/user/playermoderations/:playerModerationId
// - DELETE /auth/user/playermoderations/:playerModerationId
// - PUT    /auth/user/unplayermoderate
// - GET    /infoPush
// - GET    /worlds
// - POST   /worlds
// - GET    /worlds/active
// - GET    /worlds/favorites
// - GET    /worlds/recent

export const Routes = {
	/**
	 * Route for:
	 * - PUT `/auth/user/notifications/:notificationId/accept`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	acceptFriendRequest: (notificationId: string) =>
		`/auth/user/notifications/${notificationId}/accept` as const,

	/**
	 * Route for:
	 * - GET `/avatars/:avatarId`
	 * - PUT `/avatars/:avatarId`
	 * - DELETE `/avatars/:avatarId`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	avatar: (avatarId: string) => `/avatars/${avatarId}` as const,

	/**
	 * Route for:
	 * - GET `/auth/exists`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	checkUserExists: (query: CheckUserExistsQuery) =>
		`/auth/exists${reduceQueryObject(atLeastOneOf(query, ["username", "displayName", "email"]))}` as const,

	/**
	 * Route for:
	 * - PUT `/auth/user/notifications/clear`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	clearAllNotifications: () => "/auth/user/notifications/clear" as const,

	/**
	 * Route for:
	 * - GET ` /config`
	 *
	 * *Returns a `clientApiKey` which is needed for other api calls when unauthenticated.*
	 */
	config: () => "/config" as const,

	/**
	 * Route for:
	 * - GET `/auth/user`
	 *
	 * If a valid session cookie is present, the current user will be returned. Otherwise it will act like the `login` route.
	 */
	currentUser: () => "/auth/user" as const,

	/**
	 * Route for:
	 * - PUT `/auth/user/notifications/:notificationId/hide`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	deleteNotification: (notificationId: string) =>
		`/auth/user/notifications/${notificationId}/hide` as const,

	/**
	 * Route for:
	 * - PUT `/users/:userId/delete`
	 *
	 * Normal users only have permission to delete their own account.
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	deleteUser: (userId: string) => `/users/${userId}/delete` as const,

	/**
	 * Route for:
	 * - GET `/file/:fileId/:versionId`
	 * - DELETE `/file/:fileId/:versionId`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	downloadFile: (fileId: string, versionId: number) =>
		`/files/${fileId}/${versionId}` as const,

	/**
	 * Route for:
	 * - GET `/file/:fileId`
	 * - POST `/file/:fileId`
	 * - DELETE `/file/:fileId`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	file: (fileId: string) => `/files/${fileId}` as const,

	/**
	 * Route for:
	 * - POST `/user/:userId/friendRequest`
	 * - DELETE `/user/:userId/friendRequest`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	friendRequest: (userId: string) => `/user/${userId}/friendRequest` as const,

	/**
	 * Route for:
	 * - GET `/user/:userId/friendStatus`
	 *
	 * *Requires the session cookie to be present in the request*
	 */
	friendStatus: (userId: string) => `/user/${userId}/friendStatus` as const,

	/**
	 * Route for:
	 * - GET `/auth/user/friends`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	friends: (query?: FriendsQuery) =>
		`/auth/user/friends${reduceQueryObject(query)}` as const,

	/**
	 * Route for:
	 * - GET `/instances/{worldId}:{instanceId}`
	 * - DELETE `/instances/{worldId}:{instanceId}`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	instance: (worldId: string, instanceId: string) =>
		`/instances/${worldId}:${instanceId}` as const,

	/**
	 * Route for:
	 * - GET `/instances/s/:shortName`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	instanceByShortName: (shortName: string) =>
		`/instances/s/${shortName}` as const,

	/**
	 * Route for:
	 * - POST `/instances/{worldId}:{instanceId}/invite`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	instanceSendSelfInvite: (worldId: string, instanceId: string) =>
		`/instances/${worldId}:${instanceId}/invite` as const,

	/**
	 * Route for:
	 * - GET `/instances/{worldId}:{instanceId}/shortName`
	 *
	 */
	instanceShortName: (worldId: string, instanceId: string) =>
		`/instances/${worldId}:${instanceId}/shortName` as const,

	/**
	 * Route for:
	 * - POST `/instances`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	instances: () => "/instances" as const,

	/**
	 * Route for:
	 * - POST `/invite/:userId`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	invite: (userId: string) => `/invite/${userId}` as const,

	/**
	 * Route for:
	 * - POST `/invite/myself/to/{userId}:{worldId}`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	inviteMyself: (worldId: string, instanceId: string) =>
		`/invite/myself/to/${worldId}:${instanceId}` as const,

	/**
	 * Route for:
	 * - GET `/auth/user`
	 *
	 * With no valid session cookie is present you must pass the username and password in the Authorization header.
	 * `Authorization: Basic base64(urlencode(username):urlencode(password))`
	 */
	login: () => "/auth/user" as const,

	/**
	 * Route for:
	 * - PUT `/logout`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	logout: () => "/logout" as const,

	/**
	 * Route for:
	 * - PUT `/auth/user/notifications/:notificationId/see`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	markNotificationAsRead: (notificationId: string) =>
		`/auth/user/notifications/${notificationId}/see` as const,

	/**
	 * Route for:
	 * - GET `/auth/user/notifications`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	notifications: () => "/auth/user/notifications" as const,

	/**
	 * Route for:
	 * - GET `/visits`
	 */
	onlineUserCount: () => "/visits" as const,

	/**
	 * Route for:
	 * - GET `/users/:userId/avatar`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	ownAvatar: (userId: string) => `/users/${userId}/avatar` as const,

	/**
	 * Route for:
	 * - POST `/requestInvite/:userId`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	requestInvite: (userId: string) => `/requestInvite/${userId}` as const,

	/**
	 * Route for:
	 * - POST `/invite/:notificationId/response`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	respondToInvite: (notificationId: string) =>
		`/invite/${notificationId}/response` as const,

	/**
	 * Route for:
	 * - GET `/users`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	searchUsers: (query?: SearchUsersQuery) =>
		`/users${reduceQueryObject(query)}` as const,

	/**
	 * Route for:
	 * - PUT `/avatars/:avatarId/select`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	selectAvatar: (avatarId: string) => `/avatars/${avatarId}/select` as const,

	/**
	 * Route for:
	 * - PUT `/avatars/:avatarId/selectFallback`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	selectFallbackAvatar: (avatarId: string) =>
		`/avatars/${avatarId}/selectFallback` as const,

	/**
	 * Route for:
	 * - GET `/time`
	 */
	systemTime: () => "/time" as const,

	/**
	 * Route for:
	 * - DELETE ` /auth/user/friends/:userId`
	 *
	 * *Requires the session cookie to be present in the request*
	 */
	unfriend: (userId: string) => `/auth/user/friends/${userId}` as const,

	/**
	 * Route for:
	 * - GET `/users/:userId`
	 * - PUT `/users/:userId`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	user: (userId: string) => `/users/${userId}` as const,

	/**
	 * Route for:
	 * - GET `/users/:userId/groups/represented`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	userGroupRepresented: (userId: string) =>
		`/users/${userId}/groups/represented` as const,

	/**
	 * Route for:
	 * - GET `/users/:userId/groups/requested`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	userGroupRequests: (userId: string) =>
		`/users/${userId}/groups/requested` as const,

	/**
	 * Route for:
	 * - GET `/users/:userId/groups`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	userGroups: (userId: string) => `/users/${userId}/groups` as const,

	/**
	 * Route for:
	 * - POST `/auth/twofactorauth/totp/verify`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	verify2FACode: () => "/auth/twofactorauth/totp/verify" as const,

	/**
	 * Route for:
	 * - POST `/auth/twofactorauth/emailotp/verify`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	verify2FACodeEmail: () => "/auth/twofactorauth/emailotp/verify" as const,

	/**
	 * Route for:
	 * - POST `/auth/twofactorauth/otp/verify`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	verify2FACodeRecovery: () => " /auth/twofactorauth/otp/verify" as const,

	/**
	 * Route for:
	 * - GET `/auth`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	verifyAuthToken: () => "/auth" as const,

	/**
	 * Route for:
	 * - GET `/worlds/:worldId`
	 * - PUT `/worlds/:worldId`
	 * - DELETE `/worlds/:worldId`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	world: (worldId: string) => `/worlds/${worldId}` as const,

	/**
	 * Route for:
	 * - GET `/worlds/:worldId/:instanceId`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	worldInstance: (worldId: string, instanceId: string) =>
		`/worlds/${worldId}/${instanceId}` as const,

	/**
	 * Route for:
	 * - GET `/worlds/:worldId/publish`
	 * - PUT `/worlds/:worldId/publish`
	 * - DELETE `/worlds/:worldId/publish`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	worldPublishStatus: (worldId: string) => `/worlds/${worldId}/publish` as const
} as const;

export interface CheckUserExistsQuery {
	email?: string;
	displayName?: string;
	username?: string;
	exludeUserId?: string;
}

export interface FriendsQuery {
	offset?: number;
	n?: number;
	offline?: boolean;
}

export interface SearchUsersQuery {
	search?: string;
	developerType?: string;
	n?: number;
	offset?: number;
}
export interface Verify2FACodeRequest {
	code: string;
}

export interface CurrentUserTotp extends CurrentUser {
	// This package only supports totp for now.
	requiresTwoFactorAuth?: Array<"totp" | "otp" | "emailOtp">;
}

// Exports all existing response interfaces from the vrchat package.
export type {
	APIConfig,
	APIConfigAnnouncement,
	APIConfigDownloadURLList,
	APIConfigEvents,
	APIHealth,
	AccountDeletionLog,
	AddFavoriteRequest,
	AddGroupGalleryImageRequest,
	Avatar,
	AvatarUnityPackageUrlObject,
	Badge,
	BanGroupMemberRequest,
	CreateAvatarRequest,
	CreateFileRequest,
	CreateFileVersionRequest,
	CreateGroupAnnouncementRequest,
	CreateGroupGalleryRequest,
	CreateGroupInviteRequest,
	CreateGroupPostRequest,
	CreateGroupRequest,
	CreateGroupRoleRequest,
	CreateInstanceRequest,
	CreateWorldRequest,
	CurrentUser,
	CurrentUserPresence,
	DeploymentGroup,
	DeveloperType,
	DynamicContentRow,
	Favorite,
	FavoriteGroup,
	FavoriteGroupVisibility,
	FavoriteType,
	FileData,
	FileDataCategoryEnum,
	FileStatus,
	FileUploadURL,
	FileVersion,
	FileVersionUploadStatus,
	FinishFileDataUploadRequest,
	FriendStatus,
	Group,
	GroupAccessType,
	GroupAnnouncement,
	GroupAuditLogEntry,
	GroupGallery,
	GroupGalleryImage,
	InfoPush,
	GroupInstance,
	GroupLimitedMember,
	GroupJoinRequestAction,
	GroupJoinState,
	GroupMember,
	GroupMemberLimitedUser,
	GroupMemberStatus,
	GroupMyMember,
	GroupPermission,
	GroupPost,
	GroupPostVisibility,
	GroupPrivacy,
	GroupRole,
	GroupRoleTemplate,
	GroupSearchSort,
	GroupUserVisibility,
	InfoPushData,
	InfoPushDataArticle,
	InfoPushDataArticleContent,
	InfoPushDataClickable,
	InfoPushDataClickableCommandEnum,
	Instance,
	InstancePlatforms,
	InstanceRegion,
	InstanceShortNameResponse,
	InstanceType,
	InviteMessage,
	InviteMessageType,
	InviteRequest,
	InviteResponse,
	License,
	LicenseAction,
	LicenseGroup,
	LicenseType,
	LimitedGroup,
	LimitedUnityPackage,
	LimitedUser,
	LimitedUserGroups,
	LimitedWorld,
	MIMEType,
	ModelError,
	ModelFile,
	ModerateUserRequest,
	Notification,
	NotificationDetailInvite,
	NotificationDetailInviteResponse,
	NotificationDetailRequestInvite,
	NotificationDetailRequestInviteResponse,
	NotificationDetailVoteToKick,
	NotificationType,
	OrderOption,
	PaginatedGroupAuditLogEntryList,
	PastDisplayName,
	Permission,
	PlayerModeration,
	PlayerModerationType,
	Region,
	ReleaseStatus,
	RepresentedGroup,
	RespondGroupJoinRequest,
	RequestInviteRequest,
	Response,
	SentNotification,
	SortOption,
	Subscription,
	SubscriptionPeriod,
	Success,
	Transaction,
	TransactionAgreement,
	TransactionStatus,
	TransactionSteamInfo,
	TransactionSteamWalletInfo,
	TwoFactorAuthCode,
	TwoFactorEmailCode,
	UnityPackage,
	UpdateAvatarRequest,
	UpdateFavoriteGroupRequest,
	UpdateGroupGalleryRequest,
	UpdateGroupMemberRequest,
	UpdateGroupRequest,
	UpdateGroupRoleRequest,
	UpdateInviteMessageRequest,
	UpdateUserRequest,
	UpdateWorldRequest,
	User,
	UserExists,
	UserState,
	UserStatus,
	UserSubscription,
	Verify2FAEmailCodeResult,
	Verify2FAResult,
	VerifyAuthTokenResult,
	World,
	WorldMetadata,
	WorldPublishStatus
} from "vrchat";
