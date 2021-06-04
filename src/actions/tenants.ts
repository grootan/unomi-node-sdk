
import { callElastic } from "../utils/index";
import { FilteredResponse } from "../types/sdkResponse";
import { CreateProperties } from "../types/tenants";
import { Client } from "@elastic/elasticsearch";
import * as constants from "../utils/constants";

/**
 * @function register
 * @param {Client} elasticClient 
 * @param {CreateProperties} properties
 * @returns {Promise}
 */
export async function register(elasticClient: Client, properties: CreateProperties): Promise<any> {
    var tenantName = properties.name.trim().toLowerCase();
    var tenantData = await callElastic(() => elasticClient.search({
        index: constants.ES_TENANT_INDEX, body:
        {
            query:
            {
                match: {
                    name: tenantName
                }
            }
        }
    }), "rawget");
    if (tenantData.success) {
        return new Promise(async (resolve, reject) => {
            resolve({
                success: false,
                status: 409,
                data: "Tenant is already registered"
            });
        });
    }
    else {
        return callElastic(() => elasticClient.index({ index: constants.ES_TENANT_INDEX, body: properties, refresh: true }), 'create');
    }
}

/**
 * @function deleteTenant
 * @param {Client} elasticClient 
 * @param {string} tenantKey
 * @returns {Promise}
 */
export async function deleteTenant(elasticClient: Client, tenantName: string): Promise<any> {
    return callElastic(() => elasticClient.deleteByQuery({
        index: constants.ES_TENANT_INDEX, body:
        {
            query:
            {
                match: {
                    name: tenantName
                }
            }
        }
    }), "delete");
}

/**
 * @function get
 * @param {Client} elasticClient 
 * @param {string} tenantName
 * @returns {Promise}
 */
export function get(elasticClient: Client, tenantName: string): FilteredResponse {
    return callElastic(() => elasticClient.search({
        index: constants.ES_TENANT_INDEX, body:
        {
            query:
            {
                match: {
                    name: tenantName
                }
            }
        }
    }), "get");
}

/**
 * @function getAll
 * @param {Client} elasticClient 
 * @returns {Promise}
 */
export function getAll(elasticClient: Client): FilteredResponse {
    return callElastic(() => elasticClient.search({
        index: constants.ES_TENANT_INDEX, body:
        {
            query:
            {
                match_all: {}
            }
        }
    }), "getall");
}

