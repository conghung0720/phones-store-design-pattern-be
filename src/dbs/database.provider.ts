import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: process.env.DATABASE_CONNECT,
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(process.env.CONNECT_STRING),
  },
];
