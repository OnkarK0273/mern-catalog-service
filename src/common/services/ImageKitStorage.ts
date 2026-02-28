import ImageKit from '@imagekit/nodejs';
import config from 'config';
import { FileData, FileStorage, FileUploadResult } from '../types/storage';

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

    // Note: In @imagekit/nodejs, upload is scoped under the `files` namespace
    const response = await this.ik.files.upload({
      file: data.fileData.toString('base64'), // Accepts Buffer, Base64 string, readable stream, or URL
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
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const endpoint = config.get('imagekit.urlEndpoint') as string;
    const baseUrl = endpoint.replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    return `${baseUrl}${cleanPath}?${transformations}`;
  }

  async delete(fileId: string): Promise<void> {
    // In @imagekit/nodejs, deleteFile is replaced by `files.delete`
    await this.ik.files.delete(fileId);
  }
}
