import { MongooseModule } from '@nestjs/mongoose';

export function mongooseConfig() {
  const mongodbUri = process.env.MONGODB_URI_LOCAL;
  return MongooseModule.forRoot(mongodbUri);
}
