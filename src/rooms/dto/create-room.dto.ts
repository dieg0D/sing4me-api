import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'Informe o nome da sala',
  })
  name: string;
  @ApiProperty()
  @IsNotEmpty({
    message: 'Informe uma senha',
  })
  @MinLength(6, {
    message: 'A senha deve ter no mínimo 6 caracteres',
  })
  password: string;
}
