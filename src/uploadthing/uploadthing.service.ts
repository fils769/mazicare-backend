import { Injectable, InternalServerErrorException, BadRequestException } from "@nestjs/common";
import { UTApi } from "uploadthing/server";

@Injectable()
export class UploadThingService {
  private utapi: UTApi;

  constructor() {
    // Initialize UploadThing API with token from environment
    this.utapi = new UTApi({
      token: process.env.UPLOADTHING_TOKEN,
    });
  }

  /**
   * Uploads a file to UploadThing
   * @param file Express.Multer.File object
   * @returns Upload result with file URL and key
   */
  async uploadFile(file: Express.Multer.File) {
    try {
      if (!this.utapi) {
        throw new InternalServerErrorException("UploadThing client is not initialized");
      }

      if (!file || !file.buffer) {
        throw new BadRequestException("File buffer is required");
      }

      console.log(`Preparing to upload file: ${file.originalname}, size: ${file.size}, type: ${file.mimetype}`);

      // Create a Blob first to ensure correct handling of the buffer
      const blob = new Blob([new Uint8Array(file.buffer)], { type: file.mimetype });

      // Create the File object from the Blob
      const fileObject = new File([blob], file.originalname, {
        type: file.mimetype,
      });

      console.log(`Created File object: name=${fileObject.name}, size=${fileObject.size}, type=${fileObject.type}`);

      // Upload to UploadThing
      const response = await this.utapi.uploadFiles(fileObject);

      console.log('UploadThing response received');

      if (!response) {
        throw new InternalServerErrorException("No response from UploadThing");
      }

      if (response.error) {
        console.error('UploadThing error response:', response.error);
        throw new InternalServerErrorException(
          `UploadThing upload failed: ${response.error.message}`
        );
      }

      console.log('Upload successful:', response.data);

      return {
        key: response.data.key,
        url: response.data.ufsUrl || response.data.url,
        name: response.data.name,
        size: response.data.size,
        type: response.data.type,
      };
    } catch (error) {
      console.error("UploadThing upload exception:", error);
      // Log the full error object for debugging
      console.dir(error, { depth: null });

      throw new InternalServerErrorException(
        "Failed to upload file to UploadThing",
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  /**
   * Deletes a file from UploadThing by its key
   * @param fileKey The UploadThing file key
   */
  async deleteFile(fileKey: string) {
    try {
      await this.utapi.deleteFiles(fileKey);
      return { success: true };
    } catch (error) {
      console.error("UploadThing delete error:", error);
      throw new InternalServerErrorException(
        "Failed to delete file from UploadThing",
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  /**
   * Deletes multiple files from UploadThing
   * @param fileKeys Array of UploadThing file keys
   */
  async deleteFiles(fileKeys: string[]) {
    try {
      await this.utapi.deleteFiles(fileKeys);
      return { success: true };
    } catch (error) {
      console.error("UploadThing batch delete error:", error);
      throw new InternalServerErrorException(
        "Failed to delete files from UploadThing",
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  /**
   * Gets file URL from UploadThing key
   * @param fileKey The UploadThing file key
   * @returns The file URL
   */
  getFileUrl(fileKey: string): string {
    // UploadThing URLs follow the pattern: https://utfs.io/f/{fileKey}
    return `https://utfs.io/f/${fileKey}`;
  }

  /**
   * Lists files from UploadThing
   * @param limit Number of files to retrieve
   * @param offset Offset for pagination
   */
  async listFiles(limit: number = 100, offset: number = 0) {
    try {
      const response = await this.utapi.listFiles({ limit, offset });
      return response;
    } catch (error) {
      console.error("UploadThing list files error:", error);
      throw new InternalServerErrorException(
        "Failed to list files from UploadThing",
        error instanceof Error ? error.message : String(error),
      );
    }
  }
}
