import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomBytes, createCipheriv } from 'crypto';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
    this.$use(async (params, next) => {
      if (params.action === 'create' && params.model === 'User') {
        const user = params.args.data;
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(user.userCredential.create.password, salt);
        user.userCredential.create.password = hash;
        params.args.data = user;
      }

      if (params.action === 'create' && params.model === 'Message') {
        const message = params.args.data;
        const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
        const iv = randomBytes(16);
        const algorithm = 'aes-256-cbc';

        const cipher = createCipheriv(algorithm, encryptionKey, iv);
        let encryptedContent = cipher.update(message.content, 'utf8', 'hex');
        encryptedContent += cipher.final('hex');

        message.content = encryptedContent;
        message.iv = iv.toString('hex'); // Store the IV along with the encrypted message
        params.args.data = message;
      }

      return next(params);
    });
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
