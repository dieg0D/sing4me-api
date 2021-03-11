import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { findByName, index, create, find } from './entities/room.entity';
import { hash, compare } from 'bcryptjs';
import { EnterRoomDto } from './dto/enter-room.dto';

@Injectable()
export class RoomsService {
  async create(createRoomDto: CreateRoomDto) {
    const { name, password } = createRoomDto;

    const checkRoomExists = findByName(name);

    if (checkRoomExists) {
      throw new ConflictException('O nome da sala inserido já foi cadastrado.');
    }

    const hashedPassword = await hash(password, 8);

    const roomID = create(name, hashedPassword, 0);

    return { msg: 'Sala criada com sucesso!', id: roomID };
  }

  findAll() {
    const rooms = index().map((room) => ({
      id: room.id,
      name: room.name,
      length: room.length,
    }));

    return rooms;
  }

  async enter(enterRoomDto: EnterRoomDto) {
    const { id, password } = enterRoomDto;

    const room = find(id);

    if (!room) {
      throw new NotFoundException('A sala não existe!');
    }

    const passwordMatched = await compare(password, room.password);

    if (!passwordMatched) {
      throw new UnauthorizedException('Senha incorreta!');
    }

    return { msg: 'Entrada liberada!', id: room.id };
  }
}
