import { CloudUpload, Delete } from '@mui/icons-material';
import {
  Paper,
  Stack,
  ImageList,
  ImageListItem,
  CircularProgress,
  Button,
  FormHelperText,
} from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import useImageService from '../hooks/useImageService';
import FormSectionHeader from './FormSectionHeader';
import { AxiosProgressEvent } from 'axios';
import SelectableImage from './SelectableImage';

type ImageType = {
  id?: string;
  fileName: string;
  caption?: string;
};

type Props = {
  images: ImageType[];
  onImagesChange: (images: ImageType[]) => void;
  error?: string;
};

export default function ImagesInput({
  error,
  images,
  onImagesChange,
}: Props): JSX.Element {
  const { uploadImage, generateNewFileName } = useImageService();
  const [stateImages, setStateImages] = useState<ImageType[]>(images);
  const [selectedImages, setSelectedImages] = useState(new Set<string>());
  const [imagesLoaded, setImagesLoaded] = useState(
    new Set(Object.values(images).map(({ fileName }) => fileName)),
  );
  const [imagesLoading, setImagesLoading] = useState<
    Record<string, number | undefined>
  >({});

  const areImagesLoading = () => {
    return Object.values(imagesLoading).some(
      (loaded) => typeof loaded === 'number',
    );
  };

  useEffect(() => {
    const imageKeys = images.map(
      ({ fileName, caption }) => `${fileName}${caption}`,
    );

    const imageSet = new Set(imageKeys);

    const isSameImages =
      stateImages.every(({ fileName, caption }) =>
        imageSet.has(`${fileName}${caption}`),
      ) && stateImages.length === images.length;

    if (areImagesLoading() || isSameImages) {
      return;
    }

    onImagesChange(stateImages);
  }, [stateImages, imagesLoading]);

  const handleImageUploadProgress =
    (fileName: string) => (progressEvent: AxiosProgressEvent) => {
      if (!progressEvent.total) {
        return;
      }

      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total,
      );

      setImagesLoading((imagesLoading) => ({
        ...imagesLoading,
        [fileName]: percentCompleted,
      }));
    };

  const handleImageUploadClick = () => {
    document.getElementById('file-upload')?.click();
  };

  const processImage = async (file: File, fileName: string) => {
    const uploadSuccessful = await uploadImage(
      file,
      fileName,
      handleImageUploadProgress(fileName),
    );

    setImagesLoading((imagesLoading) => ({
      ...imagesLoading,
      [fileName]: undefined,
    }));

    if (!uploadSuccessful) {
      setStateImages(
        stateImages.filter((stateImage) => stateImage.fileName !== fileName),
      );
      return;
    }

    imagesLoaded.add(fileName);
    setImagesLoaded(new Set(imagesLoaded));
  };

  const handleImagesUploaded = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }

    const { files } = e.target;

    const newImagesLoading: Record<string, number> = {};

    const newImages = Array.from(files).map((file) => {
      const newFileName = generateNewFileName(file.name);
      newImagesLoading[newFileName] = 0;
      return { fileName: newFileName, caption: '' };
    });

    setImagesLoading((imagesLoading) => ({
      ...newImagesLoading,
      ...imagesLoading,
    }));

    setStateImages((stateImages) => [...newImages, ...stateImages]);

    await Promise.all(
      newImages.map((newImage, index) =>
        processImage(files[index], newImage.fileName),
      ),
    );
  };

  const handleImageSelect = (fileName: string) => {
    if (selectedImages.has(fileName)) {
      selectedImages.delete(fileName);
    } else {
      selectedImages.add(fileName);
    }

    setSelectedImages(new Set(selectedImages));
  };

  const handleImageDeletion = async () => {
    const newStateImages = stateImages.filter(
      (image) => !selectedImages.has(image.fileName),
    );

    setSelectedImages(new Set());
    setStateImages(newStateImages);
  };

  const renderImage = (imageFileName: string) => {
    if (typeof imagesLoading[imageFileName] === 'number') {
      return (
        <Stack
          height="140px"
          alignItems="center"
          justifyContent="center"
          position="relative"
        >
          <CircularProgress
            variant="determinate"
            value={imagesLoading[imageFileName]}
          />
        </Stack>
      );
    }

    if (imagesLoaded.has(imageFileName)) {
      return (
        <Stack position="relative">
          <SelectableImage
            selected={selectedImages.has(imageFileName)}
            fileName={imageFileName}
            onClick={handleImageSelect}
          />
        </Stack>
      );
    }

    return <Stack height="140px" />;
  };

  return (
    <>
      <FormSectionHeader label="Images" />

      <Stack direction="row" spacing={1} justifyContent="space-between">
        <Button
          variant="outlined"
          onClick={handleImageUploadClick}
          disabled={areImagesLoading()}
          startIcon={<CloudUpload />}
        >
          <input
            id="file-upload"
            type="file"
            multiple
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImagesUploaded}
          />
          Upload Images
        </Button>

        {selectedImages.size ? (
          <Button
            color="error"
            variant="outlined"
            onClick={handleImageDeletion}
            disabled={areImagesLoading()}
            startIcon={<Delete />}
          >
            Delete Images
          </Button>
        ) : (
          <></>
        )}
      </Stack>

      {
        <ImageList
          rowHeight={150}
          style={{
            gridAutoFlow: 'column',
            gridTemplateColumns: 'repeat(auto-fill, 120px)',
            gridAutoColumns: '120px',
          }}
          sx={{
            border: (theme) => `1px solid ${theme.palette.divider}`,
            borderRadius: '4px',
            pb: 0.5,
          }}
        >
          {stateImages.length ? (
            stateImages.map((stateImages) => (
              <ImageListItem key={stateImages.fileName}>
                <Paper
                  elevation={1}
                  sx={{ height: '150px', m: 1, width: '120px' }}
                >
                  {renderImage(stateImages.fileName)}
                </Paper>
              </ImageListItem>
            ))
          ) : (
            <ImageListItem />
          )}
        </ImageList>
      }
      <FormHelperText error={true}>{error}</FormHelperText>
    </>
  );
}
