import fs from 'fs';
import path from 'path';

import uploadConfig from '@config/upload';

import IStorageProviders from '../models/IStorageProviders';

class DiskStorageProvider implements IStorageProviders {
  public async saveFile(file: string): Promise<string> {
    // rename -> Move o arquivo de uma pasta para outra
    await fs.promises.rename(
      path.resolve(uploadConfig.tmpFolder, file),
      path.resolve(uploadConfig.uploadsFolder, file),
    );

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(uploadConfig.uploadsFolder, file);

    try {
      // fs.promises.stat -> verificando se o arquivo foi encontrado
      await fs.promises.stat(filePath);
    } catch (error) {
      return;
    }

    // deletando o arquivo
    await fs.promises.unlink(filePath);
  }
}

export default DiskStorageProvider;
