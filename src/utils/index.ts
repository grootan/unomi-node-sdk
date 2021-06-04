import { SIGQUIT } from "constants";
import { FilteredResponse } from "../types/sdkResponse";
import * as UtilsTypes from "../types/utils";

/**
 * @function validateRequiredProps
 * @param {string[]} required
 * @param {{[key: string]: any}} props
 */
export function validateRequiredProps(required: string[], props: { [key: string]: any }): UtilsTypes.validateProps {

  let missing = [];

  for (const prop of required) {
    if (!Object.keys(props).includes(prop)
      || props[prop] === null
      || props[prop] === undefined) {
      missing.push(prop)
    }
  }

  return {
    valid: !missing.length,
    missing,
  }
}

/**
 * @function callUnomi
 * @param {UtilsTypes.callUnomi} axiosInstance
 * @param {string} method 
 * @returns {FilteredResponse}
 */

export function callUnomi(axiosInstance: UtilsTypes.callUnomi, method?: string): FilteredResponse {

  let validStatus: number;

  switch (method) {
    case "createRule":
    case "deleteProfile":
      validStatus = 204;
      break;
    default:
      validStatus = 200;
      break;
  }

  return new Promise(async (resolve, reject) => {
    try {
      const response = await axiosInstance();
      var resBody = response.data;
      switch(method)
      {
        case "query-sum":
          resBody = response.data._sum
          break;
        case "query-max":
          resBody = response.data._max
          break;
        case "query-aggregate":
          resBody = response.data;
          delete resBody._all;
          var total = resBody._filtered;
          delete resBody._filtered;
          resBody.total = total;
          break;
        default:
          break;
      }
      resolve({
        success: (response.status === validStatus),
        status: response.status,
        data: resBody
      });

    } catch (err) {
      reject({
        success: false,
        status: err.response ? err.response.status : null,
        data: err.response ? err.response.statusText : null
      });

    }
  });
}


export function callElastic(elasticInstance: UtilsTypes.callElastic, method?: string): FilteredResponse {

  let validStatus: number;

  switch (method) {
    case "create":
      validStatus = 201;
      break;
    default:
      validStatus = 200;
      break;
  }

  return new Promise(async (resolve, reject) => {
    try {
      const response = await elasticInstance();
      let resBody: any;
      switch (method) {
        case "create":
          resBody = response.statusCode === validStatus ? "created" : "failed to create";
          break;
        case "delete":
          resBody = response.statusCode === validStatus ? "deleted" : "failed to delete";
          break;
        case "get":
          if (response.body.hits.total.value > 0) {
            resBody = response.body.hits.hits[response.body.hits.total.value - 1]._source;
          }
          else {
            resBody = {};
            response.statusCode = 404;
          }
          break;
        case "getall":
          if (response.body.hits.total.value > 0) {
            resBody = response.body.hits.hits.map((element:any) => {
              return element._source.name;
            }).filter((value:any,i:any,arr:any) => arr.indexOf(value) === i);
          }
          else {
            resBody = {};
            response.statusCode = 404;
          }
        break;
        case "rawget":
          if (response.body.hits.total.value > 0) {
            resBody = response.body.hits.hits[response.body.hits.total.value - 1]._source;
            resBody.id = response.body.hits.hits[response.body.hits.total.value - 1]._id;
          }
          else {
            resBody = {};
            response.statusCode = 404;
          }
          break;
        default:
          resBody = response.body;
      }

      resolve({
        success: (response.statusCode === validStatus),
        status: response.statusCode,
        data: resBody
      });

    } catch (err) {
      reject({
        success: false,
        status: err.response ? err.response.status : null,
        data: err.response ? err.response.statusText : null
      });

    }
  });
}