/// <reference types="node" />
import { Stream } from 'stream';
import { Dialog, View, KnownBlock, Block, MessageAttachment, LinkUnfurls } from '@slack/types';
import { WebAPICallOptions, WebAPICallResult } from './WebClient';
/**
 * Generic method definition
 */
export default interface Method<MethodArguments extends WebAPICallOptions> {
    (options?: MethodArguments): Promise<WebAPICallResult>;
}
export interface TokenOverridable {
    token?: string;
}
export interface LocaleAware {
    include_locale?: boolean;
}
export interface Searchable {
    query: string;
    highlight?: boolean;
    sort: 'score' | 'timestamp';
    sort_dir: 'asc' | 'desc';
}
export declare const cursorPaginationEnabledMethods: Set<string>;
export interface CursorPaginationEnabled {
    limit?: number;
    cursor?: string;
}
export interface TimelinePaginationEnabled {
    oldest?: string;
    latest?: string;
    inclusive?: boolean;
}
export interface TraditionalPagingEnabled {
    page?: number;
    count?: number;
}
export interface AdminAppsApproveArguments extends WebAPICallOptions, TokenOverridable {
    app_id?: string;
    request_id?: string;
    team_id?: string;
}
export interface AdminAppsRequestsListArguments extends WebAPICallOptions, TokenOverridable, CursorPaginationEnabled {
    team_id?: string;
}
export interface AdminAppsRestrictArguments extends WebAPICallOptions, TokenOverridable {
    app_id?: string;
    request_id?: string;
    team_id?: string;
}
export interface AdminTeamsAdminsListArguments extends WebAPICallOptions, TokenOverridable, CursorPaginationEnabled {
    team_id: string;
}
export interface AdminTeamsCreateArguments extends WebAPICallOptions, TokenOverridable {
    team_domain: string;
    team_name: string;
    team_description?: string;
    team_discoverability?: string;
}
export interface AdminTeamsOwnersListArguments extends WebAPICallOptions, TokenOverridable, CursorPaginationEnabled {
    team_id: string;
}
export interface AdminUsersAssignArguments extends WebAPICallOptions, TokenOverridable {
    team_id: string;
    user_id: string;
    is_restricted?: boolean;
    is_ultra_restricted?: boolean;
}
export interface AdminUsersInviteArguments extends WebAPICallOptions, TokenOverridable {
    channel_ids: string;
    email: string;
    team_id: string;
    custom_message?: string;
    guest_expiration_ts?: string;
    is_restricted?: boolean;
    is_ultra_restricted?: boolean;
    real_name?: string;
    resend?: boolean;
}
export interface AdminUsersRemoveArguments extends WebAPICallOptions, TokenOverridable {
    team_id: string;
    user_id: string;
}
export interface AdminUsersSetAdminArguments extends WebAPICallOptions, TokenOverridable {
    team_id: string;
    user_id: string;
}
export interface AdminUsersSetOwnerArguments extends WebAPICallOptions, TokenOverridable {
    team_id: string;
    user_id: string;
}
export interface AdminUsersSetRegularArguments extends WebAPICallOptions, TokenOverridable {
    team_id: string;
    user_id: string;
}
export interface AdminUsersSessionResetArguments extends WebAPICallOptions, TokenOverridable {
    user_id: string;
    mobile_only?: boolean;
    web_only?: boolean;
}
export interface APITestArguments extends WebAPICallOptions {
}
export interface AuthRevokeArguments extends WebAPICallOptions, TokenOverridable {
    test: boolean;
}
export interface AuthTestArguments extends WebAPICallOptions, TokenOverridable {
}
export interface BotsInfoArguments extends WebAPICallOptions, TokenOverridable {
    bot?: string;
}
export interface ChannelsArchiveArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
}
export interface ChannelsCreateArguments extends WebAPICallOptions, TokenOverridable {
    name: string;
    validate?: boolean;
}
export interface ChannelsHistoryArguments extends WebAPICallOptions, TokenOverridable, TimelinePaginationEnabled {
    channel: string;
    count?: number;
    unreads?: boolean;
}
export interface ChannelsInfoArguments extends WebAPICallOptions, TokenOverridable, LocaleAware {
    channel: string;
}
export interface ChannelsInviteArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
    user: string;
}
export interface ChannelsJoinArguments extends WebAPICallOptions, TokenOverridable {
    name: string;
    validate?: boolean;
}
export interface ChannelsKickArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
    user: string;
}
export interface ChannelsLeaveArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
}
export interface ChannelsListArguments extends WebAPICallOptions, TokenOverridable, CursorPaginationEnabled {
    exclude_archived?: boolean;
    exclude_members?: boolean;
}
export interface ChannelsMarkArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
    ts: string;
}
export interface ChannelsRenameArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
    name: string;
    validate?: boolean;
}
export interface ChannelsRepliesArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
    thread_ts: string;
}
export interface ChannelsSetPurposeArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
    purpose: string;
}
export interface ChannelsSetTopicArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
    topic: string;
}
export interface ChannelsUnarchiveArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
}
export interface ChatDeleteArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
    ts: string;
    as_user?: boolean;
}
export interface ChatDeleteScheduledMessageArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
    scheduled_message_id: string;
    as_user?: boolean;
}
export interface ChatGetPermalinkArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
    message_ts: string;
}
export interface ChatMeMessageArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
    text: string;
}
export interface ChatPostEphemeralArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
    text: string;
    user: string;
    as_user?: boolean;
    attachments?: MessageAttachment[];
    blocks?: (KnownBlock | Block)[];
    link_names?: boolean;
    parse?: 'full' | 'none';
}
export interface ChatPostMessageArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
    text: string;
    as_user?: boolean;
    attachments?: MessageAttachment[];
    blocks?: (KnownBlock | Block)[];
    icon_emoji?: string;
    icon_url?: string;
    link_names?: boolean;
    mrkdwn?: boolean;
    parse?: 'full' | 'none';
    reply_broadcast?: boolean;
    thread_ts?: string;
    unfurl_links?: boolean;
    unfurl_media?: boolean;
    username?: string;
}
export interface ChatScheduleMessageArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
    text: string;
    post_at: string;
    as_user?: boolean;
    attachments?: MessageAttachment[];
    blocks?: (KnownBlock | Block)[];
    link_names?: boolean;
    parse?: 'full' | 'none';
    reply_broadcast?: boolean;
    thread_ts?: string;
    unfurl_links?: boolean;
    unfurl_media?: boolean;
}
export interface ChatScheduledMessagesListArguments extends WebAPICallOptions, TokenOverridable, CursorPaginationEnabled {
    channel: string;
    latest: number;
    oldest: number;
}
export interface ChatUnfurlArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
    ts: string;
    unfurls: LinkUnfurls;
    user_auth_message?: string;
    user_auth_required?: boolean;
    user_auth_url?: string;
}
export interface ChatUpdateArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
    text: string;
    ts: string;
    as_user?: boolean;
    attachments?: MessageAttachment[];
    blocks?: (KnownBlock | Block)[];
    link_names?: boolean;
    parse?: 'full' | 'none';
}
export interface ConversationsArchiveArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
}
export interface ConversationsCloseArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
}
export interface ConversationsCreateArguments extends WebAPICallOptions, TokenOverridable {
    name: string;
    is_private?: boolean;
}
export interface ConversationsHistoryArguments extends WebAPICallOptions, TokenOverridable, CursorPaginationEnabled, TimelinePaginationEnabled {
    channel: string;
}
export interface ConversationsInfoArguments extends WebAPICallOptions, TokenOverridable, LocaleAware {
    channel: string;
}
export interface ConversationsInviteArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
    users: string;
}
export interface ConversationsJoinArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
}
export interface ConversationsKickArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
    user: string;
}
export interface ConversationsLeaveArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
}
export interface ConversationsListArguments extends WebAPICallOptions, TokenOverridable, CursorPaginationEnabled {
    exclude_archived?: boolean;
    types?: string;
}
export interface ConversationsMembersArguments extends WebAPICallOptions, TokenOverridable, CursorPaginationEnabled {
    channel: string;
}
export interface ConversationsOpenArguments extends WebAPICallOptions, TokenOverridable {
    channel?: string;
    users?: string;
    return_im?: boolean;
}
export interface ConversationsRenameArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
    name: string;
}
export interface ConversationsRepliesArguments extends WebAPICallOptions, TokenOverridable, CursorPaginationEnabled, TimelinePaginationEnabled {
    channel: string;
    ts: string;
}
export interface ConversationsSetPurposeArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
    purpose: string;
}
export interface ConversationsSetTopicArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
    topic: string;
}
export interface ConversationsUnarchiveArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
}
export interface DialogOpenArguments extends WebAPICallOptions, TokenOverridable {
    trigger_id: string;
    dialog: Dialog;
}
export interface DndEndDndArguments extends WebAPICallOptions, TokenOverridable {
}
export interface DndEndSnoozeArguments extends WebAPICallOptions, TokenOverridable {
}
export interface DndInfoArguments extends WebAPICallOptions, TokenOverridable {
    user: string;
}
export interface DndSetSnoozeArguments extends WebAPICallOptions, TokenOverridable {
    num_minutes: number;
}
export interface DndTeamInfoArguments extends WebAPICallOptions, TokenOverridable {
    users?: string;
}
export interface EmojiListArguments extends WebAPICallOptions, TokenOverridable {
}
export interface FilesDeleteArguments extends WebAPICallOptions, TokenOverridable {
    file: string;
}
export interface FilesInfoArguments extends WebAPICallOptions, TokenOverridable, CursorPaginationEnabled {
    file: string;
    count?: number;
    page?: number;
}
export interface FilesListArguments extends WebAPICallOptions, TokenOverridable, TraditionalPagingEnabled {
    channel?: string;
    user?: string;
    ts_from?: string;
    ts_to?: string;
    types?: string;
}
export interface FilesRevokePublicURLArguments extends WebAPICallOptions, TokenOverridable {
    file: string;
}
export interface FilesSharedPublicURLArguments extends WebAPICallOptions, TokenOverridable {
    file: string;
}
export interface FilesUploadArguments extends WebAPICallOptions, TokenOverridable {
    channels?: string;
    content?: string;
    file?: Buffer | Stream;
    filename?: string;
    filetype?: string;
    initial_comment?: string;
    title?: string;
    thread_ts?: string;
}
export interface FilesCommentsDeleteArguments extends WebAPICallOptions, TokenOverridable {
    file: string;
    id: string;
}
export interface FilesRemoteInfoArguments extends WebAPICallOptions, TokenOverridable {
    file?: string;
    external_id?: string;
}
export interface FilesRemoteListArguments extends WebAPICallOptions, TokenOverridable, CursorPaginationEnabled {
    ts_from?: string;
    ts_to?: string;
    channel?: string;
}
export interface FilesRemoteAddArguments extends WebAPICallOptions, TokenOverridable {
    title: string;
    external_url: string;
    external_id: string;
    filetype: string;
    preview_image?: Buffer | Stream;
    indexable_file_contents?: Buffer | Stream;
}
export interface FilesRemoteUpdateArguments extends WebAPICallOptions, TokenOverridable {
    title?: string;
    external_url?: string;
    filetype?: string;
    preview_image?: Buffer | Stream;
    indexable_file_contents?: Buffer | Stream;
    file?: string;
    external_id?: string;
}
export interface FilesRemoteRemoveArguments extends WebAPICallOptions, TokenOverridable {
    file?: string;
    external_id?: string;
}
export interface FilesRemoteShareArguments extends WebAPICallOptions, TokenOverridable {
    channels: string;
    file?: string;
    external_id?: string;
}
export interface GroupsArchiveArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
}
export interface GroupsCreateArguments extends WebAPICallOptions, TokenOverridable {
    name: string;
    validate?: boolean;
}
export interface GroupsCreateChildArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
}
export interface GroupsHistoryArguments extends WebAPICallOptions, TokenOverridable, TimelinePaginationEnabled {
    channel: string;
    unreads?: boolean;
    count?: number;
}
export interface GroupsInfoArguments extends WebAPICallOptions, TokenOverridable, LocaleAware {
    channel: string;
}
export interface GroupsInviteArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
    user: string;
}
export interface GroupsKickArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
    user: string;
}
export interface GroupsLeaveArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
}
export interface GroupsListArguments extends WebAPICallOptions, TokenOverridable, CursorPaginationEnabled {
    exclude_archived?: boolean;
    exclude_members?: boolean;
}
export interface GroupsMarkArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
    ts: string;
}
export interface GroupsOpenArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
}
export interface GroupsRenameArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
    name: string;
    validate?: boolean;
}
export interface GroupsRepliesArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
    thread_ts: boolean;
}
export interface GroupsSetPurposeArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
    purpose: string;
}
export interface GroupsSetTopicArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
    topic: string;
}
export interface GroupsUnarchiveArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
}
export interface IMCloseArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
}
export interface IMHistoryArguments extends WebAPICallOptions, TokenOverridable, TimelinePaginationEnabled {
    channel: string;
    count?: number;
    unreads?: boolean;
}
export interface IMListArguments extends WebAPICallOptions, TokenOverridable, CursorPaginationEnabled {
}
export interface IMMarkArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
    ts: string;
}
export interface IMOpenArguments extends WebAPICallOptions, TokenOverridable, LocaleAware {
    user: string;
    return_im?: boolean;
}
export interface IMRepliesArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
    thread_ts?: string;
}
export interface MigrationExchangeArguments extends WebAPICallOptions, TokenOverridable {
    users: string;
    to_old?: boolean;
}
export interface MPIMCloseArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
}
export interface MPIMHistoryArguments extends WebAPICallOptions, TokenOverridable, TimelinePaginationEnabled {
    channel: string;
    count?: number;
    unreads?: boolean;
}
export interface MPIMListArguments extends WebAPICallOptions, TokenOverridable, CursorPaginationEnabled {
}
export interface MPIMMarkArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
    ts: string;
}
export interface MPIMOpenArguments extends WebAPICallOptions, TokenOverridable {
    users: string;
}
export interface MPIMRepliesArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
    thread_ts: string;
}
export interface OAuthAccessArguments extends WebAPICallOptions {
    client_id: string;
    client_secret: string;
    code: string;
    redirect_uri?: string;
}
export interface PinsAddArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
    file?: string;
    file_comment?: string;
    timestamp?: string;
}
export interface PinsListArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
}
export interface PinsRemoveArguments extends WebAPICallOptions, TokenOverridable {
    channel: string;
    file?: string;
    file_comment?: string;
    timestamp?: string;
}
export interface ReactionsAddArguments extends WebAPICallOptions, TokenOverridable {
    name: string;
    channel?: string;
    timestamp?: string;
    file?: string;
    file_comment?: string;
}
export interface ReactionsGetArguments extends WebAPICallOptions, TokenOverridable {
    full?: boolean;
    channel?: string;
    timestamp?: string;
    file?: string;
    file_comment?: string;
}
export interface ReactionsListArguments extends WebAPICallOptions, TokenOverridable, TraditionalPagingEnabled, CursorPaginationEnabled {
    user?: string;
    full?: boolean;
}
export interface ReactionsRemoveArguments extends WebAPICallOptions, TokenOverridable {
    name: string;
    channel?: string;
    timestamp?: string;
    file?: string;
    file_comment?: string;
}
export interface RemindersAddArguments extends WebAPICallOptions, TokenOverridable {
    text: string;
    time: string | number;
    user?: string;
}
export interface RemindersCompleteArguments extends WebAPICallOptions, TokenOverridable {
    reminder: string;
}
export interface RemindersDeleteArguments extends WebAPICallOptions, TokenOverridable {
    reminder: string;
}
export interface RemindersInfoArguments extends WebAPICallOptions, TokenOverridable {
    reminder: string;
}
export interface RemindersListArguments extends WebAPICallOptions, TokenOverridable {
}
export interface RTMConnectArguments extends WebAPICallOptions, TokenOverridable {
    batch_presence_aware?: boolean;
    presence_sub?: boolean;
}
export interface RTMStartArguments extends WebAPICallOptions, TokenOverridable, LocaleAware {
    batch_presence_aware?: boolean;
    mpim_aware?: boolean;
    no_latest?: '0' | '1';
    no_unreads?: string;
    presence_sub?: boolean;
    simple_latest?: boolean;
}
export interface SearchAllArguments extends WebAPICallOptions, TokenOverridable, TraditionalPagingEnabled, Searchable {
}
export interface SearchFilesArguments extends WebAPICallOptions, TokenOverridable, TraditionalPagingEnabled, Searchable {
}
export interface SearchMessagesArguments extends WebAPICallOptions, TokenOverridable, TraditionalPagingEnabled, Searchable {
}
export interface StarsAddArguments extends WebAPICallOptions, TokenOverridable {
    channel?: string;
    timestamp?: string;
    file?: string;
    file_comment?: string;
}
export interface StarsListArguments extends WebAPICallOptions, TokenOverridable, TraditionalPagingEnabled, CursorPaginationEnabled {
}
export interface StarsRemoveArguments extends WebAPICallOptions, TokenOverridable {
    channel?: string;
    timestamp?: string;
    file?: string;
    file_comment?: string;
}
export interface TeamAccessLogsArguments extends WebAPICallOptions, TokenOverridable {
    before?: number;
    count?: number;
    page?: number;
}
export interface TeamBillableInfoArguments extends WebAPICallOptions, TokenOverridable {
    user?: string;
}
export interface TeamInfoArguments extends WebAPICallOptions, TokenOverridable {
}
export interface TeamIntegrationLogsArguments extends WebAPICallOptions, TokenOverridable {
    app_id?: string;
    change_type?: string;
    count?: number;
    page?: number;
    service_id?: string;
    user?: string;
}
export interface TeamProfileGetArguments extends WebAPICallOptions, TokenOverridable {
    visibility?: 'all' | 'visible' | 'hidden';
}
export interface UsergroupsCreateArguments extends WebAPICallOptions, TokenOverridable {
    name: string;
    channels?: string;
    description?: string;
    handle?: string;
    include_count?: boolean;
}
export interface UsergroupsDisableArguments extends WebAPICallOptions, TokenOverridable {
    usergroup: string;
    include_count?: boolean;
}
export interface UsergroupsEnableArguments extends WebAPICallOptions, TokenOverridable {
    usergroup: string;
    include_count?: boolean;
}
export interface UsergroupsListArguments extends WebAPICallOptions, TokenOverridable {
    include_count?: boolean;
    include_disabled?: boolean;
    include_users?: boolean;
}
export interface UsergroupsUpdateArguments extends WebAPICallOptions, TokenOverridable {
    usergroup: string;
    channels?: string;
    description?: string;
    handle?: string;
    include_count?: boolean;
    name?: string;
}
export interface UsergroupsUsersListArguments extends WebAPICallOptions, TokenOverridable {
    usergroup: string;
    include_disabled?: boolean;
}
export interface UsergroupsUsersUpdateArguments extends WebAPICallOptions, TokenOverridable {
    usergroup: string;
    users: string;
    include_count?: boolean;
}
export interface UsersConversationsArguments extends WebAPICallOptions, TokenOverridable, CursorPaginationEnabled {
    exclude_archived?: boolean;
    types?: string;
    user?: string;
}
export interface UsersDeletePhotoArguments extends WebAPICallOptions, TokenOverridable {
}
export interface UsersGetPresenceArguments extends WebAPICallOptions, TokenOverridable {
    user: string;
}
export interface UsersIdentityArguments extends WebAPICallOptions, TokenOverridable {
}
export interface UsersInfoArguments extends WebAPICallOptions, TokenOverridable, LocaleAware {
    user: string;
}
export interface UsersListArguments extends WebAPICallOptions, TokenOverridable, CursorPaginationEnabled, LocaleAware {
    presence?: boolean;
}
export interface UsersLookupByEmailArguments extends WebAPICallOptions, TokenOverridable {
    email: string;
}
export interface UsersSetPhotoArguments extends WebAPICallOptions, TokenOverridable {
    image: Buffer | Stream;
    crop_w?: number;
    crop_x?: number;
    crop_y?: number;
}
export interface UsersSetPresenceArguments extends WebAPICallOptions, TokenOverridable {
    presence: 'auto' | 'away';
}
export interface UsersProfileGetArguments extends WebAPICallOptions, TokenOverridable {
    include_labels?: boolean;
    user?: string;
}
export interface UsersProfileSetArguments extends WebAPICallOptions, TokenOverridable {
    profile?: string;
    user?: string;
    name?: string;
    value?: string;
}
export interface ViewsOpenArguments extends WebAPICallOptions, TokenOverridable {
    trigger_id: string;
    view: View;
}
export interface ViewsPushArguments extends WebAPICallOptions, TokenOverridable {
    trigger_id: string;
    view: View;
}
export interface ViewsPublishArguments extends WebAPICallOptions, TokenOverridable {
    user_id: string;
    view: View;
    hash?: string;
}
export interface ViewsUpdateArguments extends WebAPICallOptions, TokenOverridable {
    view_id: string;
    view: View;
    external_id?: string;
    hash?: string;
}
export * from '@slack/types';
//# sourceMappingURL=methods.d.ts.map