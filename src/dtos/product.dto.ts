import { IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  public title?: string;

  @IsString()
  public description: string | undefined;

  @IsString()
  public price!: number;

  @IsString()
  public image!: string;

  @IsString()
  public category!: string;

  @IsString()
  public quantity!: number;

  @IsString()
  public productId!: string;
}
