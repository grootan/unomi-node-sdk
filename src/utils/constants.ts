export const ES_TENANT_INDEX = "tenant-cdp";
export enum AggregateEventType {
    EventType = "eventType|aggregate" as any,
    Path = "target.properties.path|aggregate" as any
}

export enum AggregateSessionType {
    DeviceCategory = "properties.deviceCategory|aggregate" as any,
    Browser = "properties.userAgentName|aggregate" as any,
    DeviceBrand = "properties.deviceBrand|aggregate" as any,
    Visits = "profile.properties.nbOfVisits|sum" as any,
    LiveTime = "duration|max" as any,
    Country = "properties.sessionCountryName|aggregate" as any
}