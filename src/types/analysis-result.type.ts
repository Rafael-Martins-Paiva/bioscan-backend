export interface AnalysisResult {
  isHuman: boolean;
  estimatedAge: string;
  estimatedGender: string;
  confidence: number;
  notes: string;
  detectedFeatures: string[];
}
