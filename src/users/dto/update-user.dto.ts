import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
export class UpdateUserDto {
  @IsOptional()
  @IsString({
    message: 'Informe um nome de usuário válido',
  })
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsString({
    message: 'selecione avatar válido',
  })
  @ApiProperty()
  avatar: string;

  @IsOptional()
  @ApiProperty()
  oldPassword: string;

  @IsOptional()
  @ApiProperty()
  newPassword: string;
}
