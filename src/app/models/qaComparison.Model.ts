export interface QAComparisonModel {
  agent: string;
  details: {
    month: string;
    portType: string;
    totalCalls: number;
    faultyCalls: number;
    criticalErrors: number;
    averageScore: number;
    scores: any;
  }[];
}