import axios, { AxiosProgressEvent } from 'axios';
import { v4 as uuid } from 'uuid';

export default function useImageService() {
  const getSignedUrl = async (
    type: string,
    fileName: string,
  ): Promise<string> => {
    try {
      const response = await axios.get('/api/images/signed-url', {
        params: {
          contentType: type,
          key: fileName,
        },
      });
      return response.data;
    } catch (err) {
      console.error('Getting signed url failed: ', err);
      throw err;
    }
  };

  const generateNewFileName = (previousFileName: string) => {
    const fileNames = previousFileName.split('.');
    const fileExtension = fileNames.pop();
    return `${uuid()}.${fileExtension}`;
  };

  const uploadImage = async (
    image: File,
    fileName: string,
    onImageUploadProgress: (progressEvent: AxiosProgressEvent) => void,
  ): Promise<boolean> => {
    try {
      const url = await getSignedUrl(image.type, fileName);

      await axios.put(url, image, {
        headers: { 'Content-Type': image.type, 'x-amz-acl': 'public-read' },
        onUploadProgress: onImageUploadProgress,
      });

      return true;
    } catch (err) {
      console.error('Uploading image failed: ', err);
      return false;
    }
  };

  return {
    uploadImage,
    generateNewFileName,
  };
}
