import { Controller, Post, Body } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { AnalyzeImageDto } from './dto/analyze-image.dto';
import { AnalysisResult } from '../types/analysis-result.type';

@Controller('api/analyze')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Post()
  async analyze(@Body() body: AnalyzeImageDto): Promise<AnalysisResult> {
    return this.analysisService.analyzeImage(body.image);
  }
}
