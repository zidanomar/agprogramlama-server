import { createDecipheriv } from 'crypto';
import { MessageDetail } from 'src/api/conversation/entities/message.entity';

export default function messageDecoder(message: MessageDetail) {
  const decryptionKey = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  const receivedIV = Buffer.from(message.iv, 'hex');
  const algorithm = 'aes-256-cbc';

  try {
    const decipher = createDecipheriv(algorithm, decryptionKey, receivedIV);
    let decryptedContent = decipher.update(message.content, 'hex', 'utf8');
    decryptedContent += decipher.final('utf8');

    message.content = decryptedContent;

    return message;
  } catch (error) {
    throw new Error(
      'Decryption failed. Invalid encryption key or initialization vector (IV).',
    );
  }
}
