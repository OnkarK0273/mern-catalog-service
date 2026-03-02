import ImageKit from '@imagekit/nodejs';
import config from 'config';
import { FileData, FileStorage, FileUploadResult } from '../types/storage';
import createHttpError from 'http-errors';

export class ImageKitStorage implements FileStorage {
  private ik: ImageKit;
  private readonly parentFolder = 'mern-project';

  constructor() {
    this.ik = new ImageKit({
      privateKey: config.get('imagekit.privateKey'),
    });
  }

  async upload(data: FileData): Promise<FileUploadResult> {
    const fullPath = data.folder ? `${this.parentFolder}/${data.folder}` : this.parentFolder;

    const response = await this.ik.files.upload({
      file: data.fileData.toString('base64'),
      fileName: data.filename,
      folder: fullPath,
      useUniqueFileName: true,
    });

    // Ensure both required fields exist
    if (!response.filePath || !response.fileId) {
      throw new Error('Upload succeeded but ImageKit returned missing file data.');
    }

    // Return the object with both properties
    return {
      filePath: response.filePath,
      fileId: response.fileId,
    };
  }

  getObjectUri(path: string, transformations: string = 'tr=f-auto'): string {
    const baseUrl = config.get('imagekit.urlEndpoint');

    if (typeof baseUrl === 'string') {
      return `${baseUrl}${path}?${transformations}`;
    }
    const error = createHttpError(500, 'Invalid S3 configuration');
    throw error;
  }

  async delete(fileId: string): Promise<void> {
    await this.ik.files.delete(fileId);
  }
}
