import { AxiosResponse } from "axios";
import * as ProfileTypes from "./profiles";
import * as EventTypes from "./events";
import * as TenantTypes from "./tenants";
import * as AppTypes from "./apps";
import { QueryParams } from "./queryBuilder"
import { FilteredResponse } from "./sdkResponse";
import { AggregateEventType, AggregateSessionType } from "../utils/constants";

export type AxiosRes = Promise<AxiosResponse>;

export interface ConnectionData {
  url:  string;
  auth: {
    username: string;
    password: string;
  };
  elasticUrl: string;
  //TODO: here we have to see how to enable authentication
}

export interface Connection {
  profile: {
    create:              (profileData: ProfileTypes.CreateProperties)             => FilteredResponse;
    get:                 (profileId: string)                                      => FilteredResponse;
    delete:              (profileId: string)                                      => FilteredResponse;
    countByApp:          (query: QueryParams[])                                   => FilteredResponse;
    existingProperties:  (params: ProfileTypes.ExistingProperties)                => FilteredResponse;
    allProperties:       ()                                                       => FilteredResponse;
    countSessionByApp:   (query: QueryParams[])                                          => FilteredResponse;
    sessions:            (profileId: string)                                      => FilteredResponse;
    getSession:          (sessionId: string)                                      => FilteredResponse;
    getBySingleProperty: (params: ProfileTypes.GetByProperty)                     => FilteredResponse;
    query:               (params: ProfileTypes.QueryConfig, query: QueryParams[]) => FilteredResponse;
    totalVisits:         (query: QueryParams[])                                          => FilteredResponse
  },
  segment: {
    create:             (params: object) => FilteredResponse
  },
  rule: {
    create:             (params: object) => FilteredResponse,
    getAll:             ()               => FilteredResponse,
    get:                (rule: string)   => FilteredResponse
  },
  event: {
    query:               (params: EventTypes.QueryConfig, query: QueryParams[])          => FilteredResponse,
    getBySession:        (sessionId: string, params: EventTypes.SessionEventQueryConfig) => FilteredResponse,
    countByApp:          (query: QueryParams[])                                               => FilteredResponse
  },
  tenant: {
    register:            (tenantData: TenantTypes.CreateProperties) => FilteredResponse;
    get:                 (tenantName: string)                       => FilteredResponse;
    getAll:              ()                                         => FilteredResponse;
    delete:              (tenantKey: string)                        => FilteredResponse;
  },
  app: {
    get:                 (tenantKey:string)                          => FilteredResponse;
    register:            (appData: AppTypes.CreateAppProperties)   => FilteredResponse;
    delete:              (appData: AppTypes.CreateAppProperties)   => FilteredResponse;
    validateKey :        (tenantKey: string)                        => FilteredResponse;
  },
  aggregate: {
    event:  (aggregateType: AggregateEventType, query: QueryParams[]) => FilteredResponse;
    session:  (aggregateType: AggregateSessionType, query: QueryParams[]) => FilteredResponse
  }
} 