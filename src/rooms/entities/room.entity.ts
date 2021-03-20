import { v4 as uuid } from 'uuid';

interface RoomObject {
  id: string;
  name: string;
  password: string;
  length: number;
}

const Room: Array<RoomObject> = [];

export const create = (name: string, password: string, length: number) => {
  const id = uuid();
  Room.push({ id, name, password, length });

  return id;
};

export const index = () => {
  return Room;
};

export const find = (id: string) => {
  return Room.find((item) => item.id === id);
};

export const findByName = (name: string) => {
  return Room.find((item) => item.name === name);
};

export const updateLength = (id: string, length: number = 0) => {
  const room = Room.find((item) => item.id === id);

  if (room) {
    room.length = length;
  }
};
