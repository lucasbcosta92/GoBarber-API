import fs from 'fs';
import path from 'path';
import aws, { S3 } from 'aws-sdk';
import mime from 'mime';

import uploadConfig from '@config/upload';
import IStorageProviders from '../models/IStorageProviders';

class S3StorageProvider implements IStorageProviders {
  private client: S3;

  constructor() {
    this.client = new aws.S3({
      region: 'us-east-1',
    });
  }

  public async saveFile(file: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tmpFolder, file);

    // pegando o tipo da imagem
    const ContentType = mime.getType(originalPath);

    if (!ContentType) {
      throw new Error('File not found');
    }

    const fileContent = await fs.promises.readFile(originalPath);

    // Salvando o arquivo no servidor
    await this.client
      .putObject({
        Bucket: uploadConfig.config.disk.aws.bucket,
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        ContentType,
      })
      .promise();

    // remove ele da pasta temp depois de subir pro servidor
    await fs.promises.unlink(originalPath);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: uploadConfig.config.disk.aws.bucket,
        Key: file,
      })
      .promise();
  }
}

export default S3StorageProvider;
