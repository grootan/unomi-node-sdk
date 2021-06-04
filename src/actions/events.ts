import { stringify as queryStringify } from "querystring";
import { AxiosInstance } from "axios";
import { callUnomi } from "../utils/index";
import { QueryConfig } from "../types/profiles";
import { FilteredResponse } from "../types/sdkResponse";
import { QueryParams } from "../types/queryBuilder";
import { SessionEventQueryConfig } from "../types/events";

/**
 * @function query
 * @param {AxiosInstance} axios 
 * @param {QueryConfig} params
 * @param {QueryParams[]} query
 * @returns {FilteredResponse}
 */
export function query(axios: AxiosInstance, params: QueryConfig, query: QueryParams[]): FilteredResponse {
  const subConditions = query.map((queryCond: QueryParams) => {
    return {
      type: "eventPropertyCondition",
      parameterValues: {
        propertyName: queryCond.prop,
        comparisonOperator: queryCond.operator,
        propertyValue: queryCond.value
      }
    }
  });

  const fullQuery = {
    offset: params.offset || 0,
    limit: params.limit || 100,
    condition: {
      type: "booleanCondition",
      parameterValues: {
        operator: params.operator || "and",
        subConditions
      }
    },
    forceRefresh: params.forceRefresh || true
  }

  return callUnomi(() => axios.post(`cxs/events/search`, fullQuery));

}

/**
 * @function getBySession
 * @param {AxiosInstance} axios 
 * @param {string} sessionId
 * @param {SessionEventQueryConfig} params
 * @returns {FilteredResponse}
 */
export function getBySession(axios: AxiosInstance, sessionId: string, params: SessionEventQueryConfig): FilteredResponse {

  if (!sessionId) {
    throw new Error(`Session ID is not valid. Received: ${sessionId}`);
  }

  return callUnomi(() => axios.get(`/cxs/profiles/sessions/${sessionId}/events/?${queryStringify({ ...params })}`));
}

/**
 * @function count
 * @param {AxiosInstance} axios 
 * @param {string} appName
 * @returns {FilteredResponse}
 */
export function count(axios: AxiosInstance, query: QueryParams[]): FilteredResponse {

  const subConditions = query.map((queryCond: QueryParams) => {
    return {
      type: "eventPropertyCondition",
      parameterValues: {
        propertyName: queryCond.prop,
        comparisonOperator: queryCond.operator,
        propertyValue: queryCond.value
      }
    }
  });

  const fullQuery = {
    parameterValues: {
      subConditions,
      operator: "and"
    },
    type: "booleanCondition"
  };

  return callUnomi(() => axios.post(`cxs/query/event/count`, fullQuery));
}