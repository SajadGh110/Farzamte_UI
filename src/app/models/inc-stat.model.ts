export interface IncStatRow {
  type: string;
  date: string;      // فرض: yyyy-MM-dd
  answered: number;
  avgWait: string;   // فرمت: HH:mm:ss
  avgTalk: string;   // فرمت: HH:mm:ss
}
