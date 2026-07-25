export interface SystemMetricsSummary {

  requests: number;

  requestDuration: number;

  marketFetchSuccess: number;

  marketFetchFailure: number;

  marketFetchDuration: number;

  cacheHits: number;

  cacheMisses: number;

  cacheErrors: number;

}



export interface SystemMetricItem {

  type: string;

  value: number;

  createdAt: string;

}



export interface SystemMetricsReport {

  summary: SystemMetricsSummary;

  items: SystemMetricItem[];

}