import axios, { AxiosInstance } from "axios";
import * as profile from "./actions/profiles";
import * as rule from "./actions/rules";
import * as segment from "./actions/segments";
import * as event from "./actions/events";
import * as tenant from "./actions/tenants";
import * as app from "./actions/apps";
import * as aggregate from "./actions/aggregate";
import * as constants from "./utils/constants";
import { Connection, ConnectionData } from "./types/main";
import {
  Client
} from '@elastic/elasticsearch';
import { createIndex, hasIndex } from "./utils/elasticHelper";

export function connect(connectionData: ConnectionData): Connection {
  const axiosInterface: AxiosInstance = axios.create({
    baseURL: connectionData.url,
    auth: {
      password: connectionData.auth.password,
      username: connectionData.auth.username
    }
  });

  const elasticClient = new Client({
    node: connectionData.elasticUrl
  });

  createIndexes(connectionData.elasticUrl);

  return {
    profile: {
      allProperties: () => profile.allProperties(axiosInterface),
      countByApp: (query) => profile.countByApp(axiosInterface,query),
      create: (profileData) => profile.create(axiosInterface, profileData),
      delete: (profileId) => profile.deleteProfile(axiosInterface, profileId),
      existingProperties: (params) => profile.existingProperties(axiosInterface, params),
      get: (profileId) => profile.get(axiosInterface, profileId),
      getBySingleProperty: (params) => profile.getBySingleProperty(axiosInterface, params),
      countSessionByApp: (query) => profile.countSessionByApp(axiosInterface,query),
      getSession: (sessionId) => profile.getSession(axiosInterface,sessionId),
      sessions: (profileId) => profile.sessions(axiosInterface, profileId),
      query: (params, query) => profile.query(axiosInterface, params, query),
      totalVisits: (query)   => profile.totalVisits(axiosInterface,query)
    },
    rule: {
      create: (params) => rule.create(axiosInterface, params),
      get: (param) => rule.get(axiosInterface, param),
      getAll: () => rule.getAll(axiosInterface)
    },
    segment: {
      create: (params) => segment.create(axiosInterface, params)
    },
    event: {
      query: (params, query) => event.query(axiosInterface, params, query),
      getBySession: (sessionId, params) => event.getBySession(axiosInterface, sessionId, params),
      countByApp:(query) => event.count(axiosInterface,query)
    },
    tenant: {
      register: (tenantData) => tenant.register(elasticClient, tenantData),
      get: (tenantName) => tenant.get(elasticClient, tenantName),
      getAll: () => tenant.getAll(elasticClient),
      delete: (tenantKey) => tenant.deleteTenant(elasticClient, tenantKey),
      
    },
    app: {
      register: (appData) => app.registerApp(elasticClient,appData),
      get:(apiKey) => app.getApps(elasticClient,apiKey),
      delete:(appData) => app.deleteApp(elasticClient,appData),
      validateKey:(apiKey) => app.isValid(elasticClient,apiKey)
    },
    aggregate: {
      event: (aggregatetype,query) => aggregate.event(axiosInterface,aggregatetype,query),
      session: (aggregatetype,query) => aggregate.session(axiosInterface,aggregatetype,query)
    }
  }
}

async function createIndexes(connectionUrl: string) {
  const indexName =  constants.ES_TENANT_INDEX;
  hasIndex(connectionUrl,indexName)
  .then(function(result){
    if(!result.exists)
    {
      createIndex(connectionUrl,indexName).then(function(res){
        if(res.created)
        {
          console.log('Index %s created:', indexName);
        }
        else{
          console.log('Unable to create index index %s ...', indexName);
        }
      });
    }
    else{
      console.log('Index %s exists', indexName);
    }
  });
}
