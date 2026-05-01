export interface AIQueryResponse {
  answer: string;
  confidence: number;
  source: string;
  type: string;
  structured: boolean;
}

export interface ElectionGuideResponse {
  role: string;
  steps: string[];
}

export interface TimelinePhase {
  phase: string;
  description: string;
}

export interface TimelineResponse {
  events: TimelinePhase[];
}

export interface MisinformationResponse {
  claim: string;
  is_true: boolean;
  explanation: string;
}
