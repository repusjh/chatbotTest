"use strict";
/// <reference lib="esnext.asynciterable" />
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// polyfill for async iterable. see: https://stackoverflow.com/a/43694282/305340
// can be removed once node v10 is the minimum target (node v8 and v9 require --harmony_async_iteration flag)
if (Symbol['asyncIterator'] === undefined) {
    (Symbol['asyncIterator']) = Symbol.for('asyncIterator');
}
const querystring_1 = require("querystring");
const path_1 = require("path");
const is_stream_1 = __importDefault(require("is-stream"));
const eventemitter3_1 = require("eventemitter3");
const p_queue_1 = __importDefault(require("p-queue")); // tslint:disable-line:import-name
const p_retry_1 = __importStar(require("p-retry"));
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data")); // tslint:disable-line:import-name
const methods = __importStar(require("./methods")); // tslint:disable-line:import-name
const instrument_1 = require("./instrument");
const errors_1 = require("./errors");
const logger_1 = require("./logger");
const retry_policies_1 = __importDefault(require("./retry-policies"));
const helpers_1 = require("./helpers");
/**
 * A client for Slack's Web API
 *
 * This client provides an alias for each {@link https://api.slack.com/methods|Web API method}. Each method is
 * a convenience wrapper for calling the {@link WebClient#apiCall} method using the method name as the first parameter.
 */
class WebClient extends eventemitter3_1.EventEmitter {
    /**
     * @param token - An API token to authenticate/authorize with Slack (usually start with `xoxp`, `xoxb`)
     */
    constructor(token, { slackApiUrl = 'https://slack.com/api/', logger = undefined, logLevel = logger_1.LogLevel.INFO, maxRequestConcurrency = 3, retryConfig = retry_policies_1.default.tenRetriesInAboutThirtyMinutes, agent = undefined, tls = undefined, rejectRateLimitedCalls = false, headers = {}, } = {}) {
        super();
        /**
         * admin method family
         */
        this.admin = {
            apps: {
                approve: (this.apiCall.bind(this, 'admin.apps.approve')),
                requests: {
                    list: (this.apiCall.bind(this, 'admin.apps.requests.list')),
                },
                restrict: (this.apiCall.bind(this, 'admin.apps.restrict')),
            },
            teams: {
                admins: {
                    list: (this.apiCall.bind(this, 'admin.teams.admins.list')),
                },
                owners: {
                    list: (this.apiCall.bind(this, 'admin.teams.owners.list')),
                },
                create: (this.apiCall.bind(this, 'admin.teams.create')),
            },
            users: {
                session: {
                    reset: (this.apiCall.bind(this, 'admin.users.session.reset')),
                },
                assign: (this.apiCall.bind(this, 'admin.users.assign')),
                invite: (this.apiCall.bind(this, 'admin.users.invite')),
                remove: (this.apiCall.bind(this, 'admin.users.remove')),
                setAdmin: (this.apiCall.bind(this, 'admin.users.setAdmin')),
                setOwner: (this.apiCall.bind(this, 'admin.users.setOwner')),
                setRegular: (this.apiCall.bind(this, 'admin.users.setRegular')),
            },
        };
        /**
         * api method family
         */
        this.api = {
            test: (this.apiCall.bind(this, 'api.test')),
        };
        /**
         * auth method family
         */
        this.auth = {
            revoke: (this.apiCall.bind(this, 'auth.revoke')),
            test: (this.apiCall.bind(this, 'auth.test')),
        };
        /**
         * bots method family
         */
        this.bots = {
            info: (this.apiCall.bind(this, 'bots.info')),
        };
        /**
         * channels method family
         */
        this.channels = {
            archive: (this.apiCall.bind(this, 'channels.archive')),
            create: (this.apiCall.bind(this, 'channels.create')),
            history: (this.apiCall.bind(this, 'channels.history')),
            info: (this.apiCall.bind(this, 'channels.info')),
            invite: (this.apiCall.bind(this, 'channels.invite')),
            join: (this.apiCall.bind(this, 'channels.join')),
            kick: (this.apiCall.bind(this, 'channels.kick')),
            leave: (this.apiCall.bind(this, 'channels.leave')),
            list: (this.apiCall.bind(this, 'channels.list')),
            mark: (this.apiCall.bind(this, 'channels.mark')),
            rename: (this.apiCall.bind(this, 'channels.rename')),
            replies: (this.apiCall.bind(this, 'channels.replies')),
            setPurpose: (this.apiCall.bind(this, 'channels.setPurpose')),
            setTopic: (this.apiCall.bind(this, 'channels.setTopic')),
            unarchive: (this.apiCall.bind(this, 'channels.unarchive')),
        };
        /**
         * chat method family
         */
        this.chat = {
            delete: (this.apiCall.bind(this, 'chat.delete')),
            deleteScheduledMessage: (this.apiCall.bind(this, 'chat.deleteScheduledMessage')),
            getPermalink: (this.apiCall.bind(this, 'chat.getPermalink')),
            meMessage: (this.apiCall.bind(this, 'chat.meMessage')),
            postEphemeral: (this.apiCall.bind(this, 'chat.postEphemeral')),
            postMessage: (this.apiCall.bind(this, 'chat.postMessage')),
            scheduleMessage: (this.apiCall.bind(this, 'chat.scheduleMessage')),
            scheduledMessages: {
                list: (this.apiCall.bind(this, 'chat.scheduledMessages.list')),
            },
            unfurl: (this.apiCall.bind(this, 'chat.unfurl')),
            update: (this.apiCall.bind(this, 'chat.update')),
        };
        /**
         * conversations method family
         */
        this.conversations = {
            archive: (this.apiCall.bind(this, 'conversations.archive')),
            close: (this.apiCall.bind(this, 'conversations.close')),
            create: (this.apiCall.bind(this, 'conversations.create')),
            history: (this.apiCall.bind(this, 'conversations.history')),
            info: (this.apiCall.bind(this, 'conversations.info')),
            invite: (this.apiCall.bind(this, 'conversations.invite')),
            join: (this.apiCall.bind(this, 'conversations.join')),
            kick: (this.apiCall.bind(this, 'conversations.kick')),
            leave: (this.apiCall.bind(this, 'conversations.leave')),
            list: (this.apiCall.bind(this, 'conversations.list')),
            members: (this.apiCall.bind(this, 'conversations.members')),
            open: (this.apiCall.bind(this, 'conversations.open')),
            rename: (this.apiCall.bind(this, 'conversations.rename')),
            replies: (this.apiCall.bind(this, 'conversations.replies')),
            setPurpose: (this.apiCall.bind(this, 'conversations.setPurpose')),
            setTopic: (this.apiCall.bind(this, 'conversations.setTopic')),
            unarchive: (this.apiCall.bind(this, 'conversations.unarchive')),
        };
        /**
         * view method family
         */
        this.views = {
            open: (this.apiCall.bind(this, 'views.open')),
            publish: (this.apiCall.bind(this, 'views.publish')),
            push: (this.apiCall.bind(this, 'views.push')),
            update: (this.apiCall.bind(this, 'views.update')),
        };
        /**
         * dialog method family
         */
        this.dialog = {
            open: (this.apiCall.bind(this, 'dialog.open')),
        };
        /**
         * dnd method family
         */
        this.dnd = {
            endDnd: (this.apiCall.bind(this, 'dnd.endDnd')),
            endSnooze: (this.apiCall.bind(this, 'dnd.endSnooze')),
            info: (this.apiCall.bind(this, 'dnd.info')),
            setSnooze: (this.apiCall.bind(this, 'dnd.setSnooze')),
            teamInfo: (this.apiCall.bind(this, 'dnd.teamInfo')),
        };
        /**
         * emoji method family
         */
        this.emoji = {
            list: (this.apiCall.bind(this, 'emoji.list')),
        };
        /**
         * files method family
         */
        this.files = {
            delete: (this.apiCall.bind(this, 'files.delete')),
            info: (this.apiCall.bind(this, 'files.info')),
            list: (this.apiCall.bind(this, 'files.list')),
            revokePublicURL: (this.apiCall.bind(this, 'files.revokePublicURL')),
            sharedPublicURL: (this.apiCall.bind(this, 'files.sharedPublicURL')),
            upload: (this.apiCall.bind(this, 'files.upload')),
            comments: {
                delete: (this.apiCall.bind(this, 'files.comments.delete')),
            },
            remote: {
                info: (this.apiCall.bind(this, 'files.remote.info')),
                list: (this.apiCall.bind(this, 'files.remote.list')),
                add: (this.apiCall.bind(this, 'files.remote.add')),
                update: (this.apiCall.bind(this, 'files.remote.update')),
                remove: (this.apiCall.bind(this, 'files.remote.remove')),
                share: (this.apiCall.bind(this, 'files.remote.share')),
            },
        };
        /**
         * groups method family
         */
        this.groups = {
            archive: (this.apiCall.bind(this, 'groups.archive')),
            create: (this.apiCall.bind(this, 'groups.create')),
            createChild: (this.apiCall.bind(this, 'groups.createChild')),
            history: (this.apiCall.bind(this, 'groups.history')),
            info: (this.apiCall.bind(this, 'groups.info')),
            invite: (this.apiCall.bind(this, 'groups.invite')),
            kick: (this.apiCall.bind(this, 'groups.kick')),
            leave: (this.apiCall.bind(this, 'groups.leave')),
            list: (this.apiCall.bind(this, 'groups.list')),
            mark: (this.apiCall.bind(this, 'groups.mark')),
            open: (this.apiCall.bind(this, 'groups.open')),
            rename: (this.apiCall.bind(this, 'groups.rename')),
            replies: (this.apiCall.bind(this, 'groups.replies')),
            setPurpose: (this.apiCall.bind(this, 'groups.setPurpose')),
            setTopic: (this.apiCall.bind(this, 'groups.setTopic')),
            unarchive: (this.apiCall.bind(this, 'groups.unarchive')),
        };
        /**
         * im method family
         */
        this.im = {
            close: (this.apiCall.bind(this, 'im.close')),
            history: (this.apiCall.bind(this, 'im.history')),
            list: (this.apiCall.bind(this, 'im.list')),
            mark: (this.apiCall.bind(this, 'im.mark')),
            open: (this.apiCall.bind(this, 'im.open')),
            replies: (this.apiCall.bind(this, 'im.replies')),
        };
        /**
         * migration method family
         */
        this.migration = {
            exchange: (this.apiCall.bind(this, 'migration.exchange')),
        };
        /**
         * mpim method family
         */
        this.mpim = {
            close: (this.apiCall.bind(this, 'mpim.close')),
            history: (this.apiCall.bind(this, 'mpim.history')),
            list: (this.apiCall.bind(this, 'mpim.list')),
            mark: (this.apiCall.bind(this, 'mpim.mark')),
            open: (this.apiCall.bind(this, 'mpim.open')),
            replies: (this.apiCall.bind(this, 'mpim.replies')),
        };
        /**
         * oauth method family
         */
        this.oauth = {
            access: (this.apiCall.bind(this, 'oauth.access')),
        };
        /**
         * pins method family
         */
        this.pins = {
            add: (this.apiCall.bind(this, 'pins.add')),
            list: (this.apiCall.bind(this, 'pins.list')),
            remove: (this.apiCall.bind(this, 'pins.remove')),
        };
        /**
         * reactions method family
         */
        this.reactions = {
            add: (this.apiCall.bind(this, 'reactions.add')),
            get: (this.apiCall.bind(this, 'reactions.get')),
            list: (this.apiCall.bind(this, 'reactions.list')),
            remove: (this.apiCall.bind(this, 'reactions.remove')),
        };
        /**
         * reminders method family
         */
        this.reminders = {
            add: (this.apiCall.bind(this, 'reminders.add')),
            complete: (this.apiCall.bind(this, 'reminders.complete')),
            delete: (this.apiCall.bind(this, 'reminders.delete')),
            info: (this.apiCall.bind(this, 'reminders.info')),
            list: (this.apiCall.bind(this, 'reminders.list')),
        };
        /**
         * rtm method family
         */
        this.rtm = {
            connect: (this.apiCall.bind(this, 'rtm.connect')),
            start: (this.apiCall.bind(this, 'rtm.start')),
        };
        /**
         * search method family
         */
        this.search = {
            all: (this.apiCall.bind(this, 'search.all')),
            files: (this.apiCall.bind(this, 'search.files')),
            messages: (this.apiCall.bind(this, 'search.messages')),
        };
        /**
         * stars method family
         */
        this.stars = {
            add: (this.apiCall.bind(this, 'stars.add')),
            list: (this.apiCall.bind(this, 'stars.list')),
            remove: (this.apiCall.bind(this, 'stars.remove')),
        };
        /**
         * team method family
         */
        this.team = {
            accessLogs: (this.apiCall.bind(this, 'team.accessLogs')),
            billableInfo: (this.apiCall.bind(this, 'team.billableInfo')),
            info: (this.apiCall.bind(this, 'team.info')),
            integrationLogs: (this.apiCall.bind(this, 'team.integrationLogs')),
            profile: {
                get: (this.apiCall.bind(this, 'team.profile.get')),
            },
        };
        /**
         * usergroups method family
         */
        this.usergroups = {
            create: (this.apiCall.bind(this, 'usergroups.create')),
            disable: (this.apiCall.bind(this, 'usergroups.disable')),
            enable: (this.apiCall.bind(this, 'usergroups.enable')),
            list: (this.apiCall.bind(this, 'usergroups.list')),
            update: (this.apiCall.bind(this, 'usergroups.update')),
            users: {
                list: (this.apiCall.bind(this, 'usergroups.users.list')),
                update: (this.apiCall.bind(this, 'usergroups.users.update')),
            },
        };
        /**
         * users method family
         */
        this.users = {
            conversations: (this.apiCall.bind(this, 'users.conversations')),
            deletePhoto: (this.apiCall.bind(this, 'users.deletePhoto')),
            getPresence: (this.apiCall.bind(this, 'users.getPresence')),
            identity: (this.apiCall.bind(this, 'users.identity')),
            info: (this.apiCall.bind(this, 'users.info')),
            list: (this.apiCall.bind(this, 'users.list')),
            lookupByEmail: (this.apiCall.bind(this, 'users.lookupByEmail')),
            setPhoto: (this.apiCall.bind(this, 'users.setPhoto')),
            setPresence: (this.apiCall.bind(this, 'users.setPresence')),
            profile: {
                get: (this.apiCall.bind(this, 'users.profile.get')),
                set: (this.apiCall.bind(this, 'users.profile.set')),
            },
        };
        this.token = token;
        this.slackApiUrl = slackApiUrl;
        this.retryConfig = retryConfig;
        this.requestQueue = new p_queue_1.default({ concurrency: maxRequestConcurrency });
        // NOTE: may want to filter the keys to only those acceptable for TLS options
        this.tlsConfig = tls !== undefined ? tls : {};
        this.rejectRateLimitedCalls = rejectRateLimitedCalls;
        // Logging
        this.logger = logger_1.getLogger(WebClient.loggerName, logLevel, logger);
        this.axios = axios_1.default.create({
            baseURL: slackApiUrl,
            headers: Object.assign({
                'User-Agent': instrument_1.getUserAgent(),
            }, headers),
            httpAgent: agent,
            httpsAgent: agent,
            transformRequest: [this.serializeApiCallOptions.bind(this)],
            validateStatus: () => true,
            maxRedirects: 0,
            // disabling axios' automatic proxy support:
            // axios would read from envvars to configure a proxy automatically, but it doesn't support TLS destinations.
            // for compatibility with https://api.slack.com, and for a larger set of possible proxies (SOCKS or other
            // protocols), users of this package should use the `agent` option to configure a proxy.
            proxy: false,
        });
        // serializeApiCallOptions will always determine the appropriate content-type
        delete this.axios.defaults.headers.post['Content-Type'];
        this.logger.debug('initialized');
    }
    /**
     * Generic method for calling a Web API method
     *
     * @param method the Web API method to call {@see https://api.slack.com/methods}
     * @param options options
     */
    async apiCall(method, options) {
        this.logger.debug(`apiCall('${method}') start`);
        if (typeof options === 'string' || typeof options === 'number' || typeof options === 'boolean') {
            throw new TypeError(`Expected an options argument but instead received a ${typeof options}`);
        }
        const response = await this.makeRequest(method, Object.assign({ token: this.token }, options));
        const result = this.buildResult(response);
        // log warnings in response metadata
        if (result.response_metadata !== undefined && result.response_metadata.warnings !== undefined) {
            result.response_metadata.warnings.forEach(this.logger.warn.bind(this.logger));
        }
        if (!result.ok) {
            throw errors_1.platformErrorFromResult(result);
        }
        return result;
    }
    paginate(method, options, shouldStop, reduce) {
        if (!methods.cursorPaginationEnabledMethods.has(method)) {
            this.logger.warn(`paginate() called with method ${method}, which is not known to be cursor pagination enabled.`);
        }
        const pageSize = (() => {
            if (options !== undefined && typeof options.limit === 'number') {
                const limit = options.limit;
                delete options.limit;
                return limit;
            }
            return defaultPageSize;
        })();
        function generatePages() {
            return __asyncGenerator(this, arguments, function* generatePages_1() {
                // when result is undefined, that signals that the first of potentially many calls has not yet been made
                let result = undefined;
                // paginationOptions stores pagination options not already stored in the options argument
                let paginationOptions = {
                    limit: pageSize,
                };
                if (options !== undefined && options.cursor !== undefined) {
                    paginationOptions.cursor = options.cursor;
                }
                // NOTE: test for the situation where you're resuming a pagination using and existing cursor
                while (result === undefined || paginationOptions !== undefined) {
                    result = yield __await(this.apiCall(method, Object.assign(options !== undefined ? options : {}, paginationOptions)));
                    yield yield __await(result);
                    paginationOptions = paginationOptionsForNextPage(result, pageSize);
                }
            });
        }
        if (shouldStop === undefined) {
            return generatePages.call(this);
        }
        const pageReducer = (reduce !== undefined) ? reduce : noopPageReducer;
        let index = 0;
        return (async () => {
            // Unroll the first iteration of the iterator
            // This is done primarily because in order to satisfy the type system, we need a variable that is typed as A
            // (shown as accumulator before), but before the first iteration all we have is a variable typed A | undefined.
            // Unrolling the first iteration allows us to deal with undefined as a special case.
            var e_1, _a;
            const pageIterator = generatePages.call(this);
            const firstIteratorResult = await pageIterator.next(undefined);
            // Assumption: there will always be at least one result in a paginated API request
            // if (firstIteratorResult.done) { return; }
            const firstPage = firstIteratorResult.value;
            let accumulator = pageReducer(undefined, firstPage, index);
            index += 1;
            if (shouldStop(firstPage)) {
                return accumulator;
            }
            try {
                // Continue iteration
                for (var pageIterator_1 = __asyncValues(pageIterator), pageIterator_1_1; pageIterator_1_1 = await pageIterator_1.next(), !pageIterator_1_1.done;) {
                    const page = pageIterator_1_1.value;
                    accumulator = pageReducer(accumulator, page, index);
                    if (shouldStop(page)) {
                        return accumulator;
                    }
                    index += 1;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (pageIterator_1_1 && !pageIterator_1_1.done && (_a = pageIterator_1.return)) await _a.call(pageIterator_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return accumulator;
        })();
    }
    /**
     * Low-level function to make a single API request. handles queuing, retries, and http-level errors
     */
    async makeRequest(url, body, headers = {}) {
        // TODO: better input types - remove any
        const task = () => this.requestQueue.add(async () => {
            this.logger.debug('will perform http request');
            try {
                const response = await this.axios.post(url, body, Object.assign({
                    headers,
                }, this.tlsConfig));
                this.logger.debug('http response received');
                if (response.status === 429) {
                    const retrySec = parseRetryHeaders(response);
                    if (retrySec !== undefined) {
                        this.emit(WebClientEvent.RATE_LIMITED, retrySec);
                        if (this.rejectRateLimitedCalls) {
                            throw new p_retry_1.AbortError(errors_1.rateLimitedErrorWithDelay(retrySec));
                        }
                        this.logger.info(`API Call failed due to rate limiting. Will retry in ${retrySec} seconds.`);
                        // pause the request queue and then delay the rejection by the amount of time in the retry header
                        this.requestQueue.pause();
                        // NOTE: if there was a way to introspect the current RetryOperation and know what the next timeout
                        // would be, then we could subtract that time from the following delay, knowing that it the next
                        // attempt still wouldn't occur until after the rate-limit header has specified. an even better
                        // solution would be to subtract the time from only the timeout of this next attempt of the
                        // RetryOperation. this would result in the staying paused for the entire duration specified in the
                        // header, yet this operation not having to pay the timeout cost in addition to that.
                        await helpers_1.delay(retrySec * 1000);
                        // resume the request queue and throw a non-abort error to signal a retry
                        this.requestQueue.start();
                        throw Error('A rate limit was exceeded.');
                    }
                    else {
                        // TODO: turn this into some CodedError
                        throw new p_retry_1.AbortError(new Error('Retry header did not contain a valid timeout.'));
                    }
                }
                // Slack's Web API doesn't use meaningful status codes besides 429 and 200
                if (response.status !== 200) {
                    throw errors_1.httpErrorFromResponse(response);
                }
                return response;
            }
            catch (error) {
                this.logger.warn('http request failed', error.message);
                if (error.request) {
                    throw errors_1.requestErrorWithOriginal(error);
                }
                throw error;
            }
        });
        return p_retry_1.default(task, this.retryConfig);
    }
    /**
     * Transforms options (a simple key-value object) into an acceptable value for a body. This can be either
     * a string, used when posting with a content-type of url-encoded. Or, it can be a readable stream, used
     * when the options contain a binary (a stream or a buffer) and the upload should be done with content-type
     * multipart/form-data.
     *
     * @param options arguments for the Web API method
     * @param headers a mutable object representing the HTTP headers for the outgoing request
     */
    serializeApiCallOptions(options, headers) {
        // The following operation both flattens complex objects into a JSON-encoded strings and searches the values for
        // binary content
        let containsBinaryData = false;
        const flattened = Object.entries(options)
            .map(([key, value]) => {
            if (value === undefined || value === null) {
                return [];
            }
            let serializedValue = value;
            if (Buffer.isBuffer(value) || is_stream_1.default(value)) {
                containsBinaryData = true;
            }
            else if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
                // if value is anything other than string, number, boolean, binary data, a Stream, or a Buffer, then encode it
                // as a JSON string.
                serializedValue = JSON.stringify(value);
            }
            return [key, serializedValue];
        });
        // A body with binary content should be serialized as multipart/form-data
        if (containsBinaryData) {
            this.logger.debug('request arguments contain binary data');
            const form = flattened.reduce((form, [key, value]) => {
                if (Buffer.isBuffer(value) || is_stream_1.default(value)) {
                    const options = {};
                    options.filename = (() => {
                        // attempt to find filename from `value`. adapted from:
                        // tslint:disable-next-line:max-line-length
                        // https://github.com/form-data/form-data/blob/028c21e0f93c5fefa46a7bbf1ba753e4f627ab7a/lib/form_data.js#L227-L230
                        // formidable and the browser add a name property
                        // fs- and request- streams have path property
                        const streamOrBuffer = value;
                        if (typeof streamOrBuffer.name === 'string') {
                            return path_1.basename(streamOrBuffer.name);
                        }
                        if (typeof streamOrBuffer.path === 'string') {
                            return path_1.basename(streamOrBuffer.path);
                        }
                        return defaultFilename;
                    })();
                    form.append(key, value, options);
                }
                else if (key !== undefined && value !== undefined) {
                    form.append(key, value);
                }
                return form;
            }, new form_data_1.default());
            // Copying FormData-generated headers into headers param
            // not reassigning to headers param since it is passed by reference and behaves as an inout param
            for (const [header, value] of Object.entries(form.getHeaders())) {
                headers[header] = value;
            }
            return form;
        }
        // Otherwise, a simple key-value object is returned
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
        const initialValue = {};
        return querystring_1.stringify(flattened.reduce((accumulator, [key, value]) => {
            if (key !== undefined && value !== undefined) {
                accumulator[key] = value;
            }
            return accumulator;
        }, initialValue));
    }
    /**
     * Processes an HTTP response into a WebAPICallResult by performing JSON parsing on the body and merging relevent
     * HTTP headers into the object.
     * @param response - an http response
     */
    buildResult(response) {
        const data = response.data;
        if (data.response_metadata === undefined) {
            data.response_metadata = {};
        }
        // add scopes metadata from headers
        if (response.headers['x-oauth-scopes'] !== undefined) {
            data.response_metadata.scopes = response.headers['x-oauth-scopes'].trim().split(/\s*,\s*/);
        }
        if (response.headers['x-accepted-oauth-scopes'] !== undefined) {
            data.response_metadata.acceptedScopes =
                response.headers['x-accepted-oauth-scopes'].trim().split(/\s*,\s*/);
        }
        // add retry metadata from headers
        const retrySec = parseRetryHeaders(response);
        if (retrySec !== undefined) {
            data.response_metadata.retryAfter = retrySec;
        }
        return data;
    }
}
exports.WebClient = WebClient;
/**
 * The name used to prefix all logging generated from this object
 */
WebClient.loggerName = 'WebClient';
exports.default = WebClient;
var WebClientEvent;
(function (WebClientEvent) {
    WebClientEvent["RATE_LIMITED"] = "rate_limited";
})(WebClientEvent = exports.WebClientEvent || (exports.WebClientEvent = {}));
/*
 * Helpers
 */
const defaultFilename = 'Untitled';
const defaultPageSize = 200;
const noopPageReducer = () => undefined;
/**
 * Determines an appropriate set of cursor pagination options for the next request to a paginated API method.
 * @param previousResult - the result of the last request, where the next cursor might be found.
 * @param pageSize - the maximum number of additional items to fetch in the next request.
 */
function paginationOptionsForNextPage(previousResult, pageSize) {
    if (previousResult !== undefined &&
        previousResult.response_metadata !== undefined &&
        previousResult.response_metadata.next_cursor !== undefined &&
        previousResult.response_metadata.next_cursor !== '') {
        return {
            limit: pageSize,
            cursor: previousResult.response_metadata.next_cursor,
        };
    }
    return;
}
/**
 * Extract the amount of time (in seconds) the platform has recommended this client wait before sending another request
 * from a rate-limited HTTP response (statusCode = 429).
 */
function parseRetryHeaders(response) {
    if (response.headers['retry-after'] !== undefined) {
        const retryAfter = parseInt(response.headers['retry-after'], 10);
        if (!Number.isNaN(retryAfter)) {
            return retryAfter;
        }
    }
    return undefined;
}
//# sourceMappingURL=WebClient.js.map