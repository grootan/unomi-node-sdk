import { stringify as queryStringify } from "querystring";
import { AxiosInstance } from "axios";
import { validateRequiredProps, callUnomi } from "../utils/index";
import { queryBuilder } from "../queryBuilder/profileGetByProperty";
import { CreateProperties, ExistingProperties, GetByProperty, QueryConfig } from "../types/profiles";
import { FilteredResponse } from "../types/sdkResponse";
import { QueryParams } from "../types/queryBuilder"

const defaultProperties: CreateProperties = {
  consents: {},
  itemId: undefined,
  itemType: "profile",
  mergedWith: null,
  properties: undefined,
  scores: {},
  segments: [],
  systemProperties: {},
  version: null
};

/**
 * @function create
 * @param {AxiosInterface} axios
 * @param {CreateProperties} properties
 * @returns {FilteredResponse}
 */

export function create(axios: AxiosInstance, properties: CreateProperties): FilteredResponse {
  const requiredProperties = ["itemId", "properties"];
  const propsValidation = validateRequiredProps(requiredProperties, properties);

  if (!propsValidation.valid) {
    throw new Error(`The following properties are missing, null or undefined: ${propsValidation.missing.join(',')}`);
  }

  return callUnomi(() => axios.post(`/cxs/profiles`, { ...defaultProperties, ...properties }));
}

/**
 * @function get
 * @param {AxiosInterface} axios
 * @param {string} profileId
 * @returns {FilteredResponse}
 */
export function get(axios: AxiosInstance, profileId: string): FilteredResponse {

  if (!profileId) {
    throw new Error(`profileId argument is missing, null or undefined.`);
  }

  return callUnomi(() => axios.get(`/cxs/profiles/${profileId}`));
}

/**
 * @function getSession
 * @param {AxiosInterface} axios
 * @param {string} sessionId
 * @returns {FilteredResponse}
 */
export function getSession(axios: AxiosInstance, sessionId: string): FilteredResponse {

  if (!sessionId) {
    throw new Error(`sessionId argument is missing, null or undefined.`);
  }

  return callUnomi(() => axios.get(`/cxs/profiles/sessions/${sessionId}`));
}

/**
 * @function delete
 * @param {AxiosInterface} axios
 * @param {string} profileId
 * @returns {FilteredResponse}
 */
export function deleteProfile(axios: AxiosInstance, profileId: string): FilteredResponse {

  if (!profileId) {
    throw new Error(`profileId argument is missing, null or undefined.`);
  }

  return callUnomi(() => axios.delete(`/cxs/profiles/${profileId}`), "deleteProfile");
}


/**
 * @function countByApp
 * @param {AxiosInterface} axios
 * @param {string} appName
 * @returns {FilteredResponse}
 */

export function countByApp(axios: AxiosInstance, query: QueryParams[]): FilteredResponse {
  const subConditions = query.map((queryCond: QueryParams) => {
    return {
      type: "profilePropertyCondition",
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

  console.log(fullQuery);

  return callUnomi(() => axios.post(`/cxs/query/profile/count`, fullQuery));
}

/**
 * @function countSessionByApp
 * @param {AxiosInterface} axios
 * @param {AxiosInterface} appName
 * @returns {FilteredResponse}
 */
export function countSessionByApp(axios: AxiosInstance, query: QueryParams[]): FilteredResponse {
  
  const subConditions = query.map((queryCond: QueryParams) => {
    return {
      type: "sessionPropertyCondition",
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

  return callUnomi(() => axios.post(`/cxs/query/session/count`, fullQuery));
}

/**
 * @function existingProperties
 * @param {AxiosInterface} axios
 * @param {ExistingProperties} params
 * @returns {FilteredResponse}
 */

export function existingProperties(axios: AxiosInstance, params: ExistingProperties): FilteredResponse {
  const requiredProperties = ["tag", "itemType"];
  const propsValidation = validateRequiredProps(requiredProperties, params);

  if (!propsValidation.valid) {
    throw new Error(`The following properties are missing, null or undefined: ${propsValidation.missing.join(',')}`);
  }

  return callUnomi(() => axios.get(`/cxs/profiles/existingProperties?${queryStringify({ ...params })}`));
}

/**
 * @function allProperties
 * @param {AxiosInterface} axios
 * @returns {FilteredResponse}
 */

export function allProperties(axios: AxiosInstance): FilteredResponse {
  return callUnomi(() => axios.get(`/cxs/profiles/properties`));
}

/**
 * @function sessions
 * @param {AxiosInstance} axios 
 * @param {FilteredResponse} profileId
 * @returns {FilteredResponse}
 */

export function sessions(axios: AxiosInstance, profileId: string): FilteredResponse {

  if (!profileId) {
    throw new Error(`Profile ID is not valid. Received: ${profileId}`);
  }

  return callUnomi(() => axios.get(`/cxs/profiles/${profileId}/sessions`));
}

/**
 * @function getByProperty
 * @param {AxiosInstance} axios 
 * @param {GetByProperty} params
 * @returns {FilteredResponse}
 */

export function getBySingleProperty(axios: AxiosInstance, params: GetByProperty): FilteredResponse {

  const requiredProperties = ["query", "limit"];
  const propsValidation = validateRequiredProps(requiredProperties, params);

  if (!propsValidation.valid) {
    throw new Error(`The following properties are missing, null or undefined: ${propsValidation.missing.join(',')}`);
  }

  const query = queryBuilder(params.query);

  const queryparam = {
    offset: params.offset || 0,
    limit: params.limit || 100,
    condition: {
      type: "profilePropertyCondition",
      parameterValues: {
        propertyName: `properties.${query.key}`,
        comparisonOperator: query.operator,
        propertyValue: query.value
      }
    },
    forceRefresh: params.forceRefresh || false
  }

  return callUnomi(() => axios.post(`cxs/profiles/search`, queryparam));
}

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
      type: "profilePropertyCondition",
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

  return callUnomi(() => axios.post(`cxs/profiles/search`, fullQuery));

}

/**
 * @function totalVisits
 * @param {AxiosInstance} axios 
 * @param {string} appName
 * @returns {FilteredResponse}
 */
export function totalVisits(axios: AxiosInstance, query: QueryParams[]): FilteredResponse {
  const subConditions = query.map((queryCond: QueryParams) => {
    return {
      type: "profilePropertyCondition",
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

  return callUnomi(() => axios.post(`cxs/query/profile/properties.nbOfVisits/sum`, fullQuery), "query-sum");
}