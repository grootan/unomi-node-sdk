import { JsonGenericProperty } from "./generics";

export interface QueryConfig {
  limit?:        number;
  offset?:       number;
  forceRefresh?: boolean;
  operator:      "and" | "or";
}



export interface SessionEventQueryConfig{
  eventType?: string[];
  queryText?: string;
  offset?: number;
  limit?: number;
  sort?: string;
}