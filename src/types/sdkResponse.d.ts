import { JsonGenericArrayValue } from "./generics";

export interface SdkResponse {
  success: boolean;
  status:  number;
  data:    JsonGenericArrayValue;
}

export type FilteredResponse = Promise<SdkResponse>;