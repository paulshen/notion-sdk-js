import got from 'https://cdn.skypack.dev/ky';

/**
 * Utility for enforcing exhaustiveness checks in the type system.
 *
 * @see https://basarat.gitbook.io/typescript/type-system/discriminated-unions#throw-in-exhaustive-checks
 *
 * @param _x The variable with no remaining values
 */
function assertNever(_x) {
    throw new Error("Unexpected value. Should have been never.");
}
function pick(base, keys) {
    const entries = keys.map(key => [key, base === null || base === void 0 ? void 0 : base[key]]).filter(([k, v]) => v !== undefined);
    return Object.fromEntries(entries);
}
function isObject(o) {
    return typeof o === "object" && o !== null;
}

var LogLevel;
(function (LogLevel) {
    LogLevel["DEBUG"] = "debug";
    LogLevel["INFO"] = "info";
    LogLevel["WARN"] = "warn";
    LogLevel["ERROR"] = "error";
})(LogLevel || (LogLevel = {}));
function makeConsoleLogger(name) {
    return (level, message, extraInfo) => {
        console[level](`${name} ${level}:`, message, extraInfo);
    };
}
/**
 * Transforms a log level into a comparable (numerical) value ordered by severity.
 */
function logLevelSeverity(level) {
    switch (level) {
        case LogLevel.DEBUG:
            return 20;
        case LogLevel.INFO:
            return 40;
        case LogLevel.WARN:
            return 60;
        case LogLevel.ERROR:
            return 80;
        default:
            return assertNever();
    }
}

class RequestTimeoutError extends Error {
    constructor(message = "Request to Notion API has timed out") {
        super(message);
        this.code = "notionhq_client_request_timeout";
        this.name = "RequestTimeoutError";
    }
    static isRequestTimeoutError(error) {
        return (error instanceof Error &&
            error.name === "RequestTimeoutError" &&
            "code" in error &&
            error["code"] === RequestTimeoutError.prototype.code);
    }
}
class HTTPResponseError extends Error {
    // readonly body: string
    constructor(response, message) {
        super(message !== null && message !== void 0 ? message : `Request to Notion API failed with status: ${response.status}`);
        this.code = "notionhq_client_response_error";
        this.name = "HTTPResponseError";
        this.status = response.status;
        this.headers = response.headers;
        // this.body = response.body;
    }
    static isHTTPResponseError(error) {
        return (error instanceof Error &&
            error.name === "HTTPResponseError" &&
            "code" in error &&
            error["code"] === HTTPResponseError.prototype.code);
    }
}
/**
 * Error codes for responses from the API.
 */
var APIErrorCode;
(function (APIErrorCode) {
    APIErrorCode["Unauthorized"] = "unauthorized";
    APIErrorCode["RestrictedResource"] = "restricted_resource";
    APIErrorCode["ObjectNotFound"] = "object_not_found";
    APIErrorCode["RateLimited"] = "rate_limited";
    APIErrorCode["InvalidJSON"] = "invalid_json";
    APIErrorCode["InvalidRequestURL"] = "invalid_request_url";
    APIErrorCode["InvalidRequest"] = "invalid_request";
    APIErrorCode["ValidationError"] = "validation_error";
    APIErrorCode["ConflictError"] = "conflict_error";
    APIErrorCode["InternalServerError"] = "internal_server_error";
    APIErrorCode["ServiceUnavailable"] = "service_unavailable";
})(APIErrorCode || (APIErrorCode = {}));
/**
 * A response from the API indicating a problem.
 *
 * Use the `code` property to handle various kinds of errors. All its possible values are in `APIErrorCode`.
 */
class APIResponseError extends HTTPResponseError {
    constructor(response, body) {
        super(response, body.message);
        this.name = "APIResponseError";
        this.code = body.code;
    }
    static isAPIResponseError(error) {
        return (error instanceof Error &&
            error.name === "APIResponseError" &&
            "code" in error &&
            isAPIErrorCode(error["code"]));
    }
}
function buildRequestError(error) {
    if (isGotTimeoutError(error)) {
        return new RequestTimeoutError();
    }
    if (isGotHTTPError(error)) {
        const apiErrorResponseBody = parseAPIErrorResponseBody(error.response.body);
        if (apiErrorResponseBody !== undefined) {
            return new APIResponseError(error.response, apiErrorResponseBody);
        }
        return new HTTPResponseError(error.response);
    }
    return;
}
function parseAPIErrorResponseBody(body) {
    if (typeof body !== "string") {
        return;
    }
    let parsed;
    try {
        parsed = JSON.parse(body);
    }
    catch (parseError) {
        return;
    }
    if (!isObject(parsed) ||
        typeof parsed["message"] !== "string" ||
        !isAPIErrorCode(parsed["code"])) {
        return;
    }
    return {
        ...parsed,
        code: parsed["code"],
        message: parsed["message"],
    };
}
/*
 * Type guards
 */
function isAPIErrorCode(code) {
    return (typeof code === "string" &&
        Object.values(APIErrorCode).includes(code));
}
function isGotTimeoutError(error) {
    return (error instanceof Error &&
        error.name === "TimeoutError" &&
        "event" in error &&
        typeof error["event"] === "string" &&
        isObject(error["request"]) &&
        isObject(error["timings"]));
}
function isGotHTTPError(error) {
    return (error instanceof Error &&
        error.name === "HTTPError" &&
        "request" in error &&
        isObject(error["request"]) &&
        "response" in error &&
        isObject(error["response"]) &&
        "timings" in error &&
        isObject(error["timings"]));
}

/* eslint-disable @typescript-eslint/no-empty-interface */
/**
 * Notion API Endpoints
 *
 * This file contains metadata about each of the API endpoints such as the HTTP method, the parameters, and the types.
 * In the future, the contents of this file will be generated from an API definition.
 */
const blocksChildrenAppend = {
    method: "patch",
    pathParams: ["block_id"],
    queryParams: [],
    bodyParams: ["children"],
    path: (p) => `blocks/${p.block_id}/children`,
};
const blocksChildrenList = {
    method: "get",
    pathParams: ["block_id"],
    queryParams: ["start_cursor", "page_size"],
    bodyParams: [],
    path: (p) => `blocks/${p.block_id}/children`,
};
const databasesList = {
    method: "get",
    pathParams: [],
    queryParams: ["start_cursor", "page_size"],
    bodyParams: [],
    path: () => `databases`,
};
const databasesQuery = {
    method: "post",
    pathParams: ["database_id"],
    queryParams: [],
    bodyParams: ["filter", "sorts", "start_cursor", "page_size"],
    path: (p) => `databases/${p.database_id}/query`,
};
const databasesRetrieve = {
    method: "get",
    pathParams: ["database_id"],
    queryParams: [],
    bodyParams: [],
    path: (p) => `databases/${p.database_id}`,
};
const pagesCreate = {
    method: "post",
    pathParams: [],
    queryParams: [],
    bodyParams: ["parent", "properties", "children"],
    path: () => `pages`,
};
const pagesRetrieve = {
    method: "get",
    pathParams: ["page_id"],
    queryParams: [],
    bodyParams: [],
    path: (p) => `pages/${p.page_id}`,
};
const pagesUpdate = {
    method: "patch",
    pathParams: ["page_id"],
    queryParams: [],
    bodyParams: ["properties"],
    path: (p) => `pages/${p.page_id}`,
};
const usersRetrieve = {
    method: "get",
    pathParams: ["user_id"],
    queryParams: [],
    bodyParams: [],
    path: (p) => `users/${p.user_id}`,
};
const usersList = {
    method: "get",
    pathParams: [],
    queryParams: ["start_cursor", "page_size"],
    bodyParams: [],
    path: () => `users`,
};
const search = {
    method: "post",
    pathParams: [],
    queryParams: [],
    bodyParams: ["query", "sort", "filter", "start_cursor", "page_size"],
    path: () => `search`,
};

// import type { Agent } from "http"
class Client {
    constructor(options) {
        var _a, _b, _c, _d, _e;
        /*
         * Notion API endpoints
         */
        this.blocks = {
            children: {
                /**
                 * Append block children
                 */
                append: (args) => {
                    return this.request({
                        path: blocksChildrenAppend.path(args),
                        method: blocksChildrenAppend.method,
                        query: pick(args, blocksChildrenAppend.queryParams),
                        body: pick(args, blocksChildrenAppend.bodyParams),
                        auth: args === null || args === void 0 ? void 0 : args.auth,
                    });
                },
                /**
                 * Retrieve block children
                 */
                list: (args) => {
                    return this.request({
                        path: blocksChildrenList.path(args),
                        method: blocksChildrenList.method,
                        query: pick(args, blocksChildrenList.queryParams),
                        body: pick(args, blocksChildrenList.bodyParams),
                        auth: args === null || args === void 0 ? void 0 : args.auth,
                    });
                },
            },
        };
        this.databases = {
            /**
             * List databases
             *
             * @deprecated Please use `search`
             */
            list: (args = {}) => {
                return this.request({
                    path: databasesList.path(),
                    method: databasesList.method,
                    query: pick(args, databasesList.queryParams),
                    body: pick(args, databasesList.bodyParams),
                    auth: args === null || args === void 0 ? void 0 : args.auth,
                });
            },
            /**
             * Retrieve a database
             */
            retrieve: (args) => {
                return this.request({
                    path: databasesRetrieve.path(args),
                    method: databasesRetrieve.method,
                    query: pick(args, databasesRetrieve.queryParams),
                    body: pick(args, databasesRetrieve.bodyParams),
                    auth: args === null || args === void 0 ? void 0 : args.auth,
                });
            },
            /**
             * Query a database
             */
            query: (args) => {
                return this.request({
                    path: databasesQuery.path(args),
                    method: databasesQuery.method,
                    query: pick(args, databasesQuery.queryParams),
                    body: pick(args, databasesQuery.bodyParams),
                    auth: args === null || args === void 0 ? void 0 : args.auth,
                });
            },
        };
        this.pages = {
            /**
             * Create a page
             */
            create: (args) => {
                return this.request({
                    path: pagesCreate.path(),
                    method: pagesCreate.method,
                    query: pick(args, pagesCreate.queryParams),
                    body: pick(args, pagesCreate.bodyParams),
                    auth: args === null || args === void 0 ? void 0 : args.auth,
                });
            },
            /**
             * Retrieve a page
             */
            retrieve: (args) => {
                return this.request({
                    path: pagesRetrieve.path(args),
                    method: pagesRetrieve.method,
                    query: pick(args, pagesRetrieve.queryParams),
                    body: pick(args, pagesRetrieve.bodyParams),
                    auth: args === null || args === void 0 ? void 0 : args.auth,
                });
            },
            /**
             * Update page properties
             */
            update: (args) => {
                return this.request({
                    path: pagesUpdate.path(args),
                    method: pagesUpdate.method,
                    query: pick(args, pagesUpdate.queryParams),
                    body: pick(args, pagesUpdate.bodyParams),
                    auth: args === null || args === void 0 ? void 0 : args.auth,
                });
            },
        };
        this.users = {
            /**
             * Retrieve a user
             */
            retrieve: (args) => {
                return this.request({
                    path: usersRetrieve.path(args),
                    method: usersRetrieve.method,
                    query: pick(args, usersRetrieve.queryParams),
                    body: pick(args, usersRetrieve.bodyParams),
                    auth: args === null || args === void 0 ? void 0 : args.auth,
                });
            },
            /**
             * List all users
             */
            list: (args = {}) => {
                return this.request({
                    path: usersList.path(),
                    method: usersList.method,
                    query: pick(args, usersList.queryParams),
                    body: pick(args, usersList.bodyParams),
                    auth: args === null || args === void 0 ? void 0 : args.auth,
                });
            },
        };
        this.auth = options === null || options === void 0 ? void 0 : options.auth;
        this.logLevel = (_a = options === null || options === void 0 ? void 0 : options.logLevel) !== null && _a !== void 0 ? _a : LogLevel.WARN;
        this.logger = (_b = options === null || options === void 0 ? void 0 : options.logger) !== null && _b !== void 0 ? _b : makeConsoleLogger(this.constructor.name);
        const prefixUrl = ((_c = options === null || options === void 0 ? void 0 : options.baseUrl) !== null && _c !== void 0 ? _c : "https://api.notion.com") + "/v1/";
        const timeout = (_d = options === null || options === void 0 ? void 0 : options.timeoutMs) !== null && _d !== void 0 ? _d : 60000;
        const notionVersion = (_e = options === null || options === void 0 ? void 0 : options.notionVersion) !== null && _e !== void 0 ? _e : Client.defaultNotionVersion;
        this.got = got.extend({
            prefixUrl,
            timeout,
            headers: {
                "Notion-Version": notionVersion,
                // TODO: update with format appropriate for telemetry, use version from package.json
                "user-agent": "notionhq-client/0.1.0",
            },
            retry: 0,
            // agent: makeAgentOption(prefixUrl, options?.agent),
        });
    }
    /**
     * Sends a request.
     *
     * @param path
     * @param method
     * @param query
     * @param body
     * @returns
     */
    async request({ path, method, query, body, auth, }) {
        this.log(LogLevel.INFO, "request start", { method, path });
        // If the body is empty, don't send the body in the HTTP request
        const json = body !== undefined && Object.entries(body).length === 0 ? undefined : body;
        try {
            const response = await this.got(path, {
                method,
                searchParams: query,
                json,
                headers: this.authAsHeaders(auth),
            }).json();
            this.log(LogLevel.INFO, `request success`, { method, path });
            return response;
        }
        catch (error) {
            // Build an error of a known type, otherwise throw unexpected errors
            const requestError = buildRequestError(error);
            if (requestError === undefined) {
                throw error;
            }
            this.log(LogLevel.WARN, `request fail`, {
                code: requestError.code,
                message: requestError.message,
            });
            if (HTTPResponseError.isHTTPResponseError(requestError)) {
                // The response body may contain sensitive information so it is logged separately at the DEBUG level
                this.log(LogLevel.DEBUG, `failed response body`, {
                // body: requestError.body,
                });
            }
            // Throw as a known error type
            throw requestError;
        }
    }
    /**
     * Search
     */
    search(args) {
        return this.request({
            path: search.path(),
            method: search.method,
            query: pick(args, search.queryParams),
            body: pick(args, search.bodyParams),
            auth: args === null || args === void 0 ? void 0 : args.auth,
        });
    }
    /**
     * Emits a log message to the console.
     *
     * @param level The level for this message
     * @param args Arguments to send to the console
     */
    log(level, message, extraInfo) {
        if (logLevelSeverity(level) >= logLevelSeverity(this.logLevel)) {
            this.logger(level, message, extraInfo);
        }
    }
    /**
     * Transforms an API key or access token into a headers object suitable for an HTTP request.
     *
     * This method uses the instance's value as the default when the input is undefined. If neither are defined, it returns
     * an empty object
     *
     * @param auth API key or access token
     * @returns headers key-value object
     */
    authAsHeaders(auth) {
        const headers = {};
        const authHeaderValue = auth !== null && auth !== void 0 ? auth : this.auth;
        if (authHeaderValue !== undefined) {
            headers["authorization"] = `Bearer ${authHeaderValue}`;
        }
        return headers;
    }
}
Client.defaultNotionVersion = "2021-05-13";
/*
 * Helper functions
 */
// function makeAgentOption(
//   prefixUrl: string,
//   agent: Agent | undefined
// ): GotAgents | undefined {
//   if (agent === undefined) {
//     return undefined
//   }
//   return {
//     [selectProtocol(prefixUrl)]: agent,
//   }
// }
// function selectProtocol(prefixUrl: string): "http" | "https" {
//   const url = new URL(prefixUrl)
//   if (url.protocol === "https:") {
//     return "https"
//   } else if (url.protocol === "http:") {
//     return "http"
//   }
//   throw new TypeError(`baseUrl option must begin with "https://" or "http://"`)
// }

export { APIErrorCode, APIResponseError, Client, HTTPResponseError, LogLevel, RequestTimeoutError };
