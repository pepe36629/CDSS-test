import type { Sensitivity } from "./plasters";

export interface ConsultationRecord {
  id: string;
  createdAt: string;
  woundSummary: string;
  recommendedCategory: string;
  products: string[];
  sensitivities: Sensitivity[];
}
