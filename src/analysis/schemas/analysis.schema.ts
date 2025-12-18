import { Type } from '@google/genai';

export const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    isHuman: {
      type: Type.BOOLEAN,
    },
    estimatedAge: {
      type: Type.STRING,
    },
    estimatedGender: {
      type: Type.STRING,
    },
    confidence: {
      type: Type.NUMBER,
    },
    notes: {
      type: Type.STRING,
    },
    detectedFeatures: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: [
    'isHuman',
    'estimatedAge',
    'estimatedGender',
    'confidence',
    'notes',
    'detectedFeatures',
  ],
};
