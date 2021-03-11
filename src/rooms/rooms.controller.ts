import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { EnterRoomDto } from './dto/enter-room.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Create room' })
  @ApiResponse({ status: 200, description: 'Success' })
  async create(@Body() createRoomDto: CreateRoomDto) {
    return await this.roomsService.create(createRoomDto);
  }
  @Get()
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'get all rooms' })
  @ApiResponse({ status: 200, description: 'Success' })
  findAll() {
    return this.roomsService.findAll();
  }

  @Post('/enter')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'enter in a room' })
  @ApiResponse({ status: 200, description: 'Success' })
  enter(@Body() enterRoomDto: EnterRoomDto) {
    return this.roomsService.enter(enterRoomDto);
  }
}
