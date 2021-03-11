import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class EnterRoomDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'Informe o id da sala',
  })
  id: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'Informe uma senha',
  })
  @MinLength(6, {
    message: 'A senha deve ter no mínimo 6 caracteres',
  })
  password: string;
}
