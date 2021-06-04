import { callElastic } from "../utils/index";
import { SdkResponse } from "../types/sdkResponse";
import { CreateAppProperties } from "../types/apps";
import { Client } from "@elastic/elasticsearch";
import * as constants from "../utils/constants";
import { nanoid } from "nanoid";

/**
 * @function registerApp
 * @param {Client} elasticClient 
 * @param {CreateAppProperties} properties
 * @returns {Promise}
 */
export async function registerApp(elasticClient: Client, properties: CreateAppProperties): Promise<any> {
    var appName = properties.appName.trim().toLowerCase();
    var { success, data }: any = await callElastic(() => elasticClient.search({
        index: constants.ES_TENANT_INDEX, body:
        {
            query:
            {
                match: {
                    name: properties.tenantName
                }
            }
        }
    }), "rawget");
    if (!success) {
        return new Promise(async (resolve, reject) => {
            resolve({
                success: false,
                status: 404,
                data: "Tenant is not available, try to register tenant first"
            });
        });
    }
    else if (data.apps && data.apps.filter((app:any) => { return app.appName === properties.appName}).length > 0) {
        return new Promise(async (resolve, reject) => {
            resolve({
                success: false,
                status: 409,
                data: "App already added"
            });
        });
    }
    else {
        var tenantbody: any = {};
        tenantbody.name = data.name;
        tenantbody.apps = data.apps;
        if (!tenantbody.apps) {
            tenantbody.apps = [];
        }
        tenantbody.apps.push({apiKey : nanoid(),appName: properties.appName});
        return callElastic(() => elasticClient.index({ index: constants.ES_TENANT_INDEX, body: tenantbody }), 'create');
    }
}

/**
 * @function deleteApp
 * @param {Client} elasticClient 
 * @param {CreateAppProperties} properties
 * @returns {Promise}
 */
export async function deleteApp(elasticClient: Client, properties: CreateAppProperties): Promise<any> {
    var { success, data }: any = await callElastic(() => elasticClient.search({
        index: constants.ES_TENANT_INDEX, body:
        {
            query:
            {
                match: {
                    name: properties.tenantName
                }
            }
        }
    }), "rawget");
    if (!success) {
        return new Promise(async (resolve, reject) => {
            resolve({
                success: false,
                status: 404,
                data: "Tenant is not available, try to register tenant first"
            });
        });
    }
    else if (data.apps && data.apps.filter((app:any) => { return app.appName === properties.appName}).length == 0) {
        return new Promise(async (resolve, reject) => {
            resolve({
                success: false,
                status: 404,
                data: "App is not available"
            });
        });
    }
    else {
        var tenantbody: any = {};
        tenantbody.name = data.name;
        var filtered = data.apps;
        if (data.apps && data.apps.length > 0) {
            filtered = data.apps.filter((app:any) => { return app.appName != properties.appName});
        }
        tenantbody.apps = filtered;

        return callElastic(() => elasticClient.index({ index: constants.ES_TENANT_INDEX, body: tenantbody }), 'create');
    }
}

/**
 * @function getApps
 * @param {Client} elasticClient 
 * @param {string} tenantName
 * @returns {Promise}
 */
export async function getApps(elasticClient: Client, tenantName: String): Promise<SdkResponse> {
    const { success, data }: any = await callElastic(() => elasticClient.search({
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

    if (!success) {
        return new Promise(async (resolve, reject) => {
            resolve({
                success: false,
                status: 400,
                data: []
            });
        });
    }

    return new Promise(async (resolve, reject) => {
        resolve({
            success: true,
            status: 200,
            data: data.apps ? data.apps : []
        });
    });
}

/**
 * @function isValid
 * @param {Client} elasticClient 
 * @param {string} apiKey
 * @returns {Promise}
 */
 export async function isValid(elasticClient: Client, apiKey: string): Promise<any> {
    const { success, data }: any = await callElastic(() => elasticClient.search({
        index: constants.ES_TENANT_INDEX, body:
        {
            query:
            {
                match: {
                    "apps.apiKey" : apiKey
                }
            }
        }
    }), "get");


    if (!success) {
        return new Promise(async (resolve, reject) => {
            resolve({
                success: false,
                status: 400,
                data: {}
            });
        });
    }

    var appData = data.apps.find((app:any) => app.apiKey === apiKey);
    if(!appData)
    {
        return new Promise(async (resolve, reject) => {
            resolve({
                success: false,
                status: 200
            });
        });
    }

    return new Promise(async (resolve, reject) => {
        resolve({
            success: true,
            status: 200,
            data : {
                tenantName: data.name,
                appName : appData.appName
            }
        });
    });
    
}