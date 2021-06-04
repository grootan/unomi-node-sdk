import { AxiosInstance } from "axios";
import { validateRequiredProps, callUnomi } from "../utils/index";
import { FilteredResponse } from "../types/sdkResponse";
import { QueryParams } from "../types/queryBuilder"
import { AggregateEventType, AggregateSessionType } from "../utils/constants";


/**
 * @function event
 * @param {AxiosInstance} axios 
 * @param {string} appName
 * @param {AggregateEventType} aggType
 * @returns {FilteredResponse}
 */
export function event(axios: AxiosInstance, aggType: any, query: QueryParams[]): FilteredResponse {

  const aggValue = AggregateEventType[aggType];
  var aggSplit = aggValue.split("|");
  var partUrl = `${aggSplit[0]}/${aggSplit[1]}`
  if (aggSplit[1] === "aggregate") {
    return aggregateEventFunction(axios, aggSplit,query);
  }

  return arithmeticEventFunction(axios, partUrl, aggSplit,query);
}


/**
* @function session
* @param {AxiosInstance} axios 
* @param {string} appName
* @param {AggregateEventType} aggType
* @returns {FilteredResponse}
*/
export function session(axios: AxiosInstance, aggType: any, query: QueryParams[]): FilteredResponse {

  const aggValue = AggregateSessionType[aggType];
  var aggSplit = aggValue.split("|");
  var partUrl = `${aggSplit[0]}/${aggSplit[1]}`
  if (aggSplit[1] === "aggregate") {
    return aggregateSessionFunction(axios, aggSplit,query);
  }

  return arthimeticSessionFunction(axios, partUrl, aggSplit,query);

}

function arthimeticSessionFunction(axios: AxiosInstance, partUrl: string, aggSplit: string[],query: QueryParams[]) {

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

  const aggregateQuery = {
    parameterValues: {
      subConditions,
      operator: "and"
    },
    type: "booleanCondition"
  };

  return callUnomi(() => axios.post(`cxs/query/session/${partUrl}`, aggregateQuery), "query-" + aggSplit[1]);
}

function aggregateSessionFunction(axios: AxiosInstance, aggSplit: string[],query: QueryParams[]) {
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
    aggregate: {
      property: aggSplit[0]
    },
    condition: {
      type: "booleanCondition",
      parameterValues: {
        operator: "and",
        subConditions
      }
    }
  };


  return callUnomi(() => axios.post(`cxs/query/session/${aggSplit[0]}`, fullQuery), "query-" + aggSplit[1]);
}


function aggregateEventFunction(axios: AxiosInstance, aggSplit: string[],query: QueryParams[]) {
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
    aggregate: {
      property: aggSplit[0]
    },
    condition: {
      type: "booleanCondition",
      parameterValues: {
        operator: "and",
        subConditions
      }
    }
  };

  return callUnomi(() => axios.post(`cxs/query/event/${aggSplit[0]}`, fullQuery), "query-" + aggSplit[1]);
}

function arithmeticEventFunction(axios: AxiosInstance, partUrl: string, aggSplit: string[],query: QueryParams[]) {
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
  

  return callUnomi(() => axios.post(`cxs/query/event/${partUrl}`, fullQuery), "query-" + aggSplit[1]);
}