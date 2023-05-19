export interface ImageKitResponse {
  fileId: string;
  name: string;
  size: number;
  versionInfo: {
    id: string;
    name: string;
  };
  filePath: string;
  url: string;
  fileType: string;
  height: number;
  width: number;
  thumbnailUrl: string;
  AITags: string | null;
}
