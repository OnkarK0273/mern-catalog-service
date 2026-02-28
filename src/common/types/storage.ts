export interface FileData {
  filename: string;
  fileData: Buffer<ArrayBufferLike>; // Updated for compatibility with imagekit-nodejs
  folder?: string;
}

export interface FileUploadResult {
  filePath: string;
  fileId: string;
}

export interface FileStorage {
  upload(data: FileData): Promise<FileUploadResult>;
  delete(fileId: string): Promise<void>;
  getObjectUri(path: string, transformations?: string): string;
}
