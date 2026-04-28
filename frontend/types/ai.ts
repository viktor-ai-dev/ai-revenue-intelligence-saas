
export type AIAlert = {
  type: "risk" | "opportunity" | "anomaly";
  severity: "low" | "medium" | "high";
  title: string;
  explanation: string;
  recommendation: string;
};