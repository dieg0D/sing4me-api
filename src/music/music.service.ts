import { InternalServerErrorException, Injectable } from '@nestjs/common';
import * as ytdl from 'ytdl-core';
import * as ytsr from 'ytsr';

import { Response } from 'express';

@Injectable()
export class MusicService {
  findOne(id: string, res: Response) {
    try {
      if (!id) {
        throw new InternalServerErrorException(
          'Ocorreu um erro tente novamente!',
        );
      }
      res.header('Content-Disposition', `attachment; filename="${id}.mp4"`);

      return ytdl(`https://www.youtube.com/watch?v=${id}`, {
        filter: 'videoandaudio',
      }).pipe(res);
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocorreu um erro tente novamente!',
      );
    }
  }

  async search(title: string) {
    try {
      if (!title) {
        throw new InternalServerErrorException(
          'Ocorreu um erro tente novamente!',
        );
      }

      const searchResults = await ytsr(title, { limit: 20 });
      return searchResults;
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocorreu um erro tente novamente!',
      );
    }
  }
}
