import { Injectable } from '@nestjs/common';
import * as ytdl from 'ytdl-core';
import * as ytsr from 'ytsr';

import { Response } from 'express';

@Injectable()
export class MusicService {
  findOne(id: string, res: Response) {
    res.header('Content-Disposition', `attachment; filename="${id}.mp4"`);

    return ytdl(`https://www.youtube.com/watch?v=${id}`, {
      filter: 'videoandaudio',
    }).pipe(res);
  }

  async search(title: string) {
    const searchResults = await ytsr(title, { limit: 10 });
    return searchResults;
  }
}
