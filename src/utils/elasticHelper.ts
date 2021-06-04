import axios, { AxiosInstance } from "axios";

export async function hasIndex(connectionUrl: string, indexName: string) : Promise<any> {
    return new Promise(async (resolve, reject) => {
        try{
            const result = await axios.head(connectionUrl+'/'+indexName);
            resolve({
                "exists" : result.status != 404
            });
        }
        catch(err)
        {
            resolve({
                "exists" : false
            });
        }
    });
}

export async function createIndex(connectionUrl: string, indexName: string) : Promise<any> {
    const result: any = await axios.put(connectionUrl+'/'+indexName);
    return new Promise(async (resolve, reject) => {
        resolve({
            "created" : result.data && result.data.acknowledged == true
        });
    });
}