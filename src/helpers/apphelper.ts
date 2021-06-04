import { callElastic } from "../utils/index";
import { Client } from "@elastic/elasticsearch";
import * as constants from "../utils/constants";

/**
 * @function getAppName
 * @param {string[]} required
 * @param {{[key: string]: any}} props
 */
 export async function getAppName(elasticClient: Client,apiKey:string): Promise<any> {

   var app = await callElastic(() => elasticClient.search({
        index: constants.ES_TENANT_INDEX, body:
        {
            query:
            {
                match: {
                    apiKey: apiKey
                }
            } 
        }
    }), "get");

    if(!app.success)
        return null;

    return app.data;
}