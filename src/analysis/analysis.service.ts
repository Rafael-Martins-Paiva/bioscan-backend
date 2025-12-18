import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { analysisSchema } from './schemas/analysis.schema';
import { AnalysisResult } from '../types/analysis-result.type';
import * as crypto from 'crypto';

@Injectable()
export class AnalysisService {
  private readonly ai: GoogleGenAI;
  private readonly cache = new Map<string, AnalysisResult>();

  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });
  }

  private hashImage(base64: string): string {
    return crypto.createHash('sha256').update(base64).digest('hex');
  }

  async analyzeImage(base64Image: string): Promise<AnalysisResult> {
    const hash = this.hashImage(base64Image);

    if (this.cache.has(hash)) {
      return this.cache.get(hash)!;
    }

    try {
      const cleanBase64 = base64Image.replace(
        /^data:image\/(png|jpeg|jpg);base64,/,
        '',
      );

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64,
            },
          },
          {
            text: `
Analyze this image for biometric data.
Determine if it is a human, estimate age range and gender.
Be precise.
            `,
          },
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: analysisSchema,
          systemInstruction:
            'You are a precise biometric scanner AI. Output strictly valid JSON. If no human is clearly visible, set isHuman to false.',
        },
      });

      if (!response.text) {
        throw new Error('Empty Gemini response');
      }

      const result = JSON.parse(response.text) as AnalysisResult;

      this.cache.set(hash, result);
      setTimeout(() => this.cache.delete(hash), 120_000);

      return result;
    } catch (err) {
      throw new InternalServerErrorException({
        isHuman: false,
        estimatedAge: '--',
        estimatedGender: '--',
        confidence: 0,
        notes: 'Erro na análise',
        detectedFeatures: [],
      });
    }
  }
}
