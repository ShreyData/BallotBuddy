export interface AIQueryResponse {
  answer: string;
  reasoning?: string;
  confidence_score?: number;
  source: string;
  type: string;
  structured: boolean;
  language: string;
}

export interface ElectionGuideResponse {
  role: string;
  steps: string[];
}

export interface TimelinePhase {
  phase: string;
  description: string;
  date?: string;
}

export interface TimelineResponse {
  events: TimelinePhase[];
}

export interface MisinformationResponse {
  claim: string;
  is_true: boolean;
  explanation: string;
}
