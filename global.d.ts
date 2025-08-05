import type { Mongoose, Connection } from 'mongoose';

declare namespace NodeJS {
  interface Global {
    mongoose: {
      conn: Connection | null;
      promise: Promise<Mongoose> | null;
    };
  }
}