
export type AIAlert = {
  type: "risk" | "opportunity" | "anomaly";
  severity: "low" | "medium" | "high";
  title: string;
  explanation: string;
  recommendation: string;
};

export type AIAction = {
  priority: "low" | "medium" | "high";
  action: string;
  reason: string;
  expectedImpact: string;
  risk: "low" | "medium" | "high";
};

export type AIDecision = {
  action: string;
  execute: boolean;
  priority: number;
  reason: string;
  impact: string;
}

export type AIAnalyzeResponse = {
  summary: string;
  products: [{name:string, profit:number, insights: string[]}];
  answer: string;
}
