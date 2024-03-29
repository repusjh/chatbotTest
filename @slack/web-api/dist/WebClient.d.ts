/// <reference types="node" />
/// <reference lib="esnext.asynciterable" />
import { Agent } from 'http';
import { SecureContextOptions } from 'tls';
import { EventEmitter } from 'eventemitter3';
import Method, * as methods from './methods';
import { LogLevel, Logger } from './logger';
import { RetryOptions } from './retry-policies';
/**
 * A client for Slack's Web API
 *
 * This client provides an alias for each {@link https://api.slack.com/methods|Web API method}. Each method is
 * a convenience wrapper for calling the {@link WebClient#apiCall} method using the method name as the first parameter.
 */
export declare class WebClient extends EventEmitter<WebClientEvent> {
    /**
     * The base URL for reaching Slack's Web API. Consider changing this value for testing purposes.
     */
    readonly slackApiUrl: string;
    /**
     * Authentication and authorization token for accessing Slack Web API (usually begins with `xoxp` or `xoxb`)
     */
    readonly token?: string;
    /**
     * Configuration for retry operations. See {@link https://github.com/tim-kos/node-retry|node-retry} for more details.
     */
    private retryConfig;
    /**
     * Queue of requests in which a maximum of {@link WebClientOptions.maxRequestConcurrency} can concurrently be
     * in-flight.
     */
    private requestQueue;
    /**
     * Axios HTTP client instance used by this client
     */
    private axios;
    /**
     * Configuration for custom TLS handling
     */
    private tlsConfig;
    /**
     * Preference for immediately rejecting API calls which result in a rate-limited response
     */
    private rejectRateLimitedCalls;
    /**
     * The name used to prefix all logging generated from this object
     */
    private static loggerName;
    /**
     * This object's logger instance
     */
    private logger;
    /**
     * @param token - An API token to authenticate/authorize with Slack (usually start with `xoxp`, `xoxb`)
     */
    constructor(token?: string, { slackApiUrl, logger, logLevel, maxRequestConcurrency, retryConfig, agent, tls, rejectRateLimitedCalls, headers, }?: WebClientOptions);
    /**
     * Generic method for calling a Web API method
     *
     * @param method the Web API method to call {@see https://api.slack.com/methods}
     * @param options options
     */
    apiCall(method: string, options?: WebAPICallOptions): Promise<WebAPICallResult>;
    /**
     * Iterate over the result pages of a cursor-paginated Web API method. This method can return two types of values,
     * depending on which arguments are used. When up to two parameters are used, the return value is an async iterator
     * which can be used as the iterable in a for-await-of loop. When three or four parameters are used, the return
     * value is a promise that resolves at the end of iteration. The third parameter, `shouldStop`, is a function that is
     * called with each `page` and can end iteration by returning `true`. The fourth parameter, `reduce`, is a function
     * that is called with three arguments: `accumulator`, `page`, and `index`. The `accumulator` is a value of any type
     * you choose, but it will contain `undefined` when `reduce` is called for the first time. The `page` argument and
     * `index` arguments are exactly what they say they are. The `reduce` function's return value will be passed in as
     * `accumulator` the next time its called, and the returned promise will resolve to the last value of `accumulator`.
     *
     * The for-await-of syntax is part of ES2018. It is available natively in Node starting with v10.0.0. You may be able
     * to use it in earlier JavaScript runtimes by transpiling your source with a tool like Babel. However, the
     * transpiled code will likely sacrifice performance.
     *
     * @param method the cursor-paginated Web API method to call {@see https://api.slack.com/docs/pagination}
     * @param options options
     * @param shouldStop a predicate that is called with each page, and should return true when pagination can end.
     * @param reduce a callback that can be used to accumulate a value that the return promise is resolved to
     */
    paginate(method: string, options?: WebAPICallOptions): AsyncIterator<WebAPICallResult>;
    paginate(method: string, options: WebAPICallOptions, shouldStop: PaginatePredicate): Promise<void>;
    paginate<R extends PageReducer, A extends PageAccumulator<R>>(method: string, options: WebAPICallOptions, shouldStop: PaginatePredicate, reduce?: PageReducer<A>): Promise<A>;
    /**
     * admin method family
     */
    readonly admin: {
        apps: {
            approve: Method<methods.AdminAppsApproveArguments>;
            requests: {
                list: Method<methods.AdminAppsRequestsListArguments>;
            };
            restrict: Method<methods.AdminAppsRestrictArguments>;
        };
        teams: {
            admins: {
                list: Method<methods.AdminTeamsAdminsListArguments>;
            };
            owners: {
                list: Method<methods.AdminTeamsOwnersListArguments>;
            };
            create: Method<methods.AdminTeamsCreateArguments>;
        };
        users: {
            session: {
                reset: Method<methods.AdminUsersSessionResetArguments>;
            };
            assign: Method<methods.AdminUsersAssignArguments>;
            invite: Method<methods.AdminUsersInviteArguments>;
            remove: Method<methods.AdminUsersRemoveArguments>;
            setAdmin: Method<methods.AdminUsersSetAdminArguments>;
            setOwner: Method<methods.AdminUsersSetOwnerArguments>;
            setRegular: Method<methods.AdminUsersSetRegularArguments>;
        };
    };
    /**
     * api method family
     */
    readonly api: {
        test: Method<methods.APITestArguments>;
    };
    /**
     * auth method family
     */
    readonly auth: {
        revoke: Method<methods.AuthRevokeArguments>;
        test: Method<methods.AuthTestArguments>;
    };
    /**
     * bots method family
     */
    readonly bots: {
        info: Method<methods.BotsInfoArguments>;
    };
    /**
     * channels method family
     */
    readonly channels: {
        archive: Method<methods.ChannelsArchiveArguments>;
        create: Method<methods.ChannelsCreateArguments>;
        history: Method<methods.ChannelsHistoryArguments>;
        info: Method<methods.ChannelsInfoArguments>;
        invite: Method<methods.ChannelsInviteArguments>;
        join: Method<methods.ChannelsJoinArguments>;
        kick: Method<methods.ChannelsKickArguments>;
        leave: Method<methods.ChannelsLeaveArguments>;
        list: Method<methods.ChannelsListArguments>;
        mark: Method<methods.ChannelsMarkArguments>;
        rename: Method<methods.ChannelsRenameArguments>;
        replies: Method<methods.ChannelsRepliesArguments>;
        setPurpose: Method<methods.ChannelsSetPurposeArguments>;
        setTopic: Method<methods.ChannelsSetTopicArguments>;
        unarchive: Method<methods.ChannelsUnarchiveArguments>;
    };
    /**
     * chat method family
     */
    readonly chat: {
        delete: Method<methods.ChatDeleteArguments>;
        deleteScheduledMessage: Method<methods.ChatDeleteScheduledMessageArguments>;
        getPermalink: Method<methods.ChatGetPermalinkArguments>;
        meMessage: Method<methods.ChatMeMessageArguments>;
        postEphemeral: Method<methods.ChatPostEphemeralArguments>;
        postMessage: Method<methods.ChatPostMessageArguments>;
        scheduleMessage: Method<methods.ChatScheduleMessageArguments>;
        scheduledMessages: {
            list: Method<methods.ChatScheduledMessagesListArguments>;
        };
        unfurl: Method<methods.ChatUnfurlArguments>;
        update: Method<methods.ChatUpdateArguments>;
    };
    /**
     * conversations method family
     */
    readonly conversations: {
        archive: Method<methods.ConversationsArchiveArguments>;
        close: Method<methods.ConversationsCloseArguments>;
        create: Method<methods.ConversationsCreateArguments>;
        history: Method<methods.ConversationsHistoryArguments>;
        info: Method<methods.ConversationsInfoArguments>;
        invite: Method<methods.ConversationsInviteArguments>;
        join: Method<methods.ConversationsJoinArguments>;
        kick: Method<methods.ConversationsKickArguments>;
        leave: Method<methods.ConversationsLeaveArguments>;
        list: Method<methods.ConversationsListArguments>;
        members: Method<methods.ConversationsMembersArguments>;
        open: Method<methods.ConversationsOpenArguments>;
        rename: Method<methods.ConversationsRenameArguments>;
        replies: Method<methods.ConversationsRepliesArguments>;
        setPurpose: Method<methods.ConversationsSetPurposeArguments>;
        setTopic: Method<methods.ConversationsSetTopicArguments>;
        unarchive: Method<methods.ConversationsUnarchiveArguments>;
    };
    /**
     * view method family
     */
    readonly views: {
        open: Method<methods.ViewsOpenArguments>;
        publish: Method<methods.ViewsPublishArguments>;
        push: Method<methods.ViewsPushArguments>;
        update: Method<methods.ViewsUpdateArguments>;
    };
    /**
     * dialog method family
     */
    readonly dialog: {
        open: Method<methods.DialogOpenArguments>;
    };
    /**
     * dnd method family
     */
    readonly dnd: {
        endDnd: Method<methods.DndEndDndArguments>;
        endSnooze: Method<methods.DndEndSnoozeArguments>;
        info: Method<methods.DndInfoArguments>;
        setSnooze: Method<methods.DndSetSnoozeArguments>;
        teamInfo: Method<methods.DndTeamInfoArguments>;
    };
    /**
     * emoji method family
     */
    readonly emoji: {
        list: Method<methods.EmojiListArguments>;
    };
    /**
     * files method family
     */
    readonly files: {
        delete: Method<methods.FilesDeleteArguments>;
        info: Method<methods.FilesInfoArguments>;
        list: Method<methods.FilesListArguments>;
        revokePublicURL: Method<methods.FilesRevokePublicURLArguments>;
        sharedPublicURL: Method<methods.FilesSharedPublicURLArguments>;
        upload: Method<methods.FilesUploadArguments>;
        comments: {
            delete: Method<methods.FilesCommentsDeleteArguments>;
        };
        remote: {
            info: Method<methods.FilesRemoteInfoArguments>;
            list: Method<methods.FilesRemoteListArguments>;
            add: Method<methods.FilesRemoteAddArguments>;
            update: Method<methods.FilesRemoteUpdateArguments>;
            remove: Method<methods.FilesRemoteRemoveArguments>;
            share: Method<methods.FilesRemoteShareArguments>;
        };
    };
    /**
     * groups method family
     */
    readonly groups: {
        archive: Method<methods.GroupsArchiveArguments>;
        create: Method<methods.GroupsCreateArguments>;
        createChild: Method<methods.GroupsCreateChildArguments>;
        history: Method<methods.GroupsHistoryArguments>;
        info: Method<methods.GroupsInfoArguments>;
        invite: Method<methods.GroupsInviteArguments>;
        kick: Method<methods.GroupsKickArguments>;
        leave: Method<methods.GroupsLeaveArguments>;
        list: Method<methods.GroupsListArguments>;
        mark: Method<methods.GroupsMarkArguments>;
        open: Method<methods.GroupsOpenArguments>;
        rename: Method<methods.GroupsRenameArguments>;
        replies: Method<methods.GroupsRepliesArguments>;
        setPurpose: Method<methods.GroupsSetPurposeArguments>;
        setTopic: Method<methods.GroupsSetTopicArguments>;
        unarchive: Method<methods.GroupsUnarchiveArguments>;
    };
    /**
     * im method family
     */
    readonly im: {
        close: Method<methods.IMCloseArguments>;
        history: Method<methods.IMHistoryArguments>;
        list: Method<methods.IMListArguments>;
        mark: Method<methods.IMMarkArguments>;
        open: Method<methods.IMOpenArguments>;
        replies: Method<methods.IMRepliesArguments>;
    };
    /**
     * migration method family
     */
    readonly migration: {
        exchange: Method<methods.MigrationExchangeArguments>;
    };
    /**
     * mpim method family
     */
    readonly mpim: {
        close: Method<methods.MPIMCloseArguments>;
        history: Method<methods.MPIMHistoryArguments>;
        list: Method<methods.MPIMListArguments>;
        mark: Method<methods.MPIMMarkArguments>;
        open: Method<methods.MPIMOpenArguments>;
        replies: Method<methods.MPIMRepliesArguments>;
    };
    /**
     * oauth method family
     */
    readonly oauth: {
        access: Method<methods.OAuthAccessArguments>;
    };
    /**
     * pins method family
     */
    readonly pins: {
        add: Method<methods.PinsAddArguments>;
        list: Method<methods.PinsListArguments>;
        remove: Method<methods.PinsRemoveArguments>;
    };
    /**
     * reactions method family
     */
    readonly reactions: {
        add: Method<methods.ReactionsAddArguments>;
        get: Method<methods.ReactionsGetArguments>;
        list: Method<methods.ReactionsListArguments>;
        remove: Method<methods.ReactionsRemoveArguments>;
    };
    /**
     * reminders method family
     */
    readonly reminders: {
        add: Method<methods.RemindersAddArguments>;
        complete: Method<methods.RemindersCompleteArguments>;
        delete: Method<methods.RemindersDeleteArguments>;
        info: Method<methods.RemindersInfoArguments>;
        list: Method<methods.RemindersListArguments>;
    };
    /**
     * rtm method family
     */
    readonly rtm: {
        connect: Method<methods.RTMConnectArguments>;
        start: Method<methods.RTMStartArguments>;
    };
    /**
     * search method family
     */
    readonly search: {
        all: Method<methods.SearchAllArguments>;
        files: Method<methods.SearchFilesArguments>;
        messages: Method<methods.SearchMessagesArguments>;
    };
    /**
     * stars method family
     */
    readonly stars: {
        add: Method<methods.StarsAddArguments>;
        list: Method<methods.StarsListArguments>;
        remove: Method<methods.StarsRemoveArguments>;
    };
    /**
     * team method family
     */
    readonly team: {
        accessLogs: Method<methods.TeamAccessLogsArguments>;
        billableInfo: Method<methods.TeamBillableInfoArguments>;
        info: Method<methods.TeamInfoArguments>;
        integrationLogs: Method<methods.TeamIntegrationLogsArguments>;
        profile: {
            get: Method<methods.TeamProfileGetArguments>;
        };
    };
    /**
     * usergroups method family
     */
    readonly usergroups: {
        create: Method<methods.UsergroupsCreateArguments>;
        disable: Method<methods.UsergroupsDisableArguments>;
        enable: Method<methods.UsergroupsEnableArguments>;
        list: Method<methods.UsergroupsListArguments>;
        update: Method<methods.UsergroupsUpdateArguments>;
        users: {
            list: Method<methods.UsergroupsUsersListArguments>;
            update: Method<methods.UsergroupsUsersUpdateArguments>;
        };
    };
    /**
     * users method family
     */
    readonly users: {
        conversations: Method<methods.UsersConversationsArguments>;
        deletePhoto: Method<methods.UsersDeletePhotoArguments>;
        getPresence: Method<methods.UsersGetPresenceArguments>;
        identity: Method<methods.UsersIdentityArguments>;
        info: Method<methods.UsersInfoArguments>;
        list: Method<methods.UsersListArguments>;
        lookupByEmail: Method<methods.UsersLookupByEmailArguments>;
        setPhoto: Method<methods.UsersSetPhotoArguments>;
        setPresence: Method<methods.UsersSetPresenceArguments>;
        profile: {
            get: Method<methods.UsersProfileGetArguments>;
            set: Method<methods.UsersProfileSetArguments>;
        };
    };
    /**
     * Low-level function to make a single API request. handles queuing, retries, and http-level errors
     */
    private makeRequest;
    /**
     * Transforms options (a simple key-value object) into an acceptable value for a body. This can be either
     * a string, used when posting with a content-type of url-encoded. Or, it can be a readable stream, used
     * when the options contain a binary (a stream or a buffer) and the upload should be done with content-type
     * multipart/form-data.
     *
     * @param options arguments for the Web API method
     * @param headers a mutable object representing the HTTP headers for the outgoing request
     */
    private serializeApiCallOptions;
    /**
     * Processes an HTTP response into a WebAPICallResult by performing JSON parsing on the body and merging relevent
     * HTTP headers into the object.
     * @param response - an http response
     */
    private buildResult;
}
export default WebClient;
export interface WebClientOptions {
    slackApiUrl?: string;
    logger?: Logger;
    logLevel?: LogLevel;
    maxRequestConcurrency?: number;
    retryConfig?: RetryOptions;
    agent?: Agent;
    tls?: TLSOptions;
    rejectRateLimitedCalls?: boolean;
    headers?: object;
}
export declare type TLSOptions = Pick<SecureContextOptions, 'pfx' | 'key' | 'passphrase' | 'cert' | 'ca'>;
export declare enum WebClientEvent {
    RATE_LIMITED = "rate_limited"
}
export interface WebAPICallOptions {
    [argument: string]: unknown;
}
export interface WebAPICallResult {
    ok: boolean;
    error?: string;
    response_metadata?: {
        warnings?: string[];
        next_cursor?: string;
        scopes?: string[];
        acceptedScopes?: string[];
        retryAfter?: number;
        messages?: string[];
    };
    [key: string]: unknown;
}
export interface PaginatePredicate {
    (page: WebAPICallResult): boolean | undefined | void;
}
interface PageReducer<A = any> {
    (accumulator: A | undefined, page: WebAPICallResult, index: number): A;
}
declare type PageAccumulator<R extends PageReducer> = R extends (accumulator: (infer A) | undefined, page: WebAPICallResult, index: number) => infer A ? A : never;
//# sourceMappingURL=WebClient.d.ts.map