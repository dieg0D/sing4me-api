import { Controller, Get, Param, UseGuards, Res, Header } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MusicService } from './music.service';

@ApiBearerAuth()
@ApiTags('music')
@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Get(':id')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'get music' })
  @ApiResponse({ status: 200, description: 'Success' })
  findOne(@Param('id') id: string, @Res() res: Response) {
    return this.musicService.findOne(id, res);
  }

  @Get('/search/:title')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'search music' })
  @ApiResponse({ status: 200, description: 'Success' })
  search(@Param('title') title: string) {
    return this.musicService.search(title);
  }
}
