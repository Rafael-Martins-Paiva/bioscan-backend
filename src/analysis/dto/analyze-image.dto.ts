import { IsString, IsNotEmpty } from 'class-validator';

export class AnalyzeImageDto {
  @IsString()
  @IsNotEmpty()
  image: string; 
}
