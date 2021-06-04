import { ApiResponse } from "@elastic/elasticsearch";
import { AxiosResponse } from "axios";

export interface validateProps {
  valid:   boolean;
  missing: string[];
}

export type callUnomi = () => Promise<AxiosResponse<any>>;
export type callElastic = () => Promise<ApiResponse<any>>;