/* eslint-disable @typescript-eslint/no-empty-interface */
/**
 * Notion API Endpoints
 *
 * This file contains metadata about each of the API endpoints such as the HTTP method, the parameters, and the types.
 * In the future, the contents of this file will be generated from an API definition.
 */
export const blocksChildrenAppend = {
    method: "patch",
    pathParams: ["block_id"],
    queryParams: [],
    bodyParams: ["children"],
    path: (p) => `blocks/${p.block_id}/children`,
};
export const blocksChildrenList = {
    method: "get",
    pathParams: ["block_id"],
    queryParams: ["start_cursor", "page_size"],
    bodyParams: [],
    path: (p) => `blocks/${p.block_id}/children`,
};
export const databasesList = {
    method: "get",
    pathParams: [],
    queryParams: ["start_cursor", "page_size"],
    bodyParams: [],
    path: () => `databases`,
};
export const databasesQuery = {
    method: "post",
    pathParams: ["database_id"],
    queryParams: [],
    bodyParams: ["filter", "sorts", "start_cursor", "page_size"],
    path: (p) => `databases/${p.database_id}/query`,
};
export const databasesRetrieve = {
    method: "get",
    pathParams: ["database_id"],
    queryParams: [],
    bodyParams: [],
    path: (p) => `databases/${p.database_id}`,
};
export const pagesCreate = {
    method: "post",
    pathParams: [],
    queryParams: [],
    bodyParams: ["parent", "properties", "children"],
    path: () => `pages`,
};
export const pagesRetrieve = {
    method: "get",
    pathParams: ["page_id"],
    queryParams: [],
    bodyParams: [],
    path: (p) => `pages/${p.page_id}`,
};
export const pagesUpdate = {
    method: "patch",
    pathParams: ["page_id"],
    queryParams: [],
    bodyParams: ["properties"],
    path: (p) => `pages/${p.page_id}`,
};
export const usersRetrieve = {
    method: "get",
    pathParams: ["user_id"],
    queryParams: [],
    bodyParams: [],
    path: (p) => `users/${p.user_id}`,
};
export const usersList = {
    method: "get",
    pathParams: [],
    queryParams: ["start_cursor", "page_size"],
    bodyParams: [],
    path: () => `users`,
};
export const search = {
    method: "post",
    pathParams: [],
    queryParams: [],
    bodyParams: ["query", "sort", "filter", "start_cursor", "page_size"],
    path: () => `search`,
};
//# sourceMappingURL=api-endpoints.js.map