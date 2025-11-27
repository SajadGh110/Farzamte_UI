export interface QAModel {
  agent: string;
  averageScore: number;
  criticalErrors: number;
  portType: string;
  scores: {
    i1: number;
    i2: number;
    i3: number;
    i4: number;
    i5: number;
    i6: number;
    i7: number;
    i8: number;
  };
  totalCalls: number;
}
