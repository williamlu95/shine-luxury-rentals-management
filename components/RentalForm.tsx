import { zodResolver } from '@hookform/resolvers/zod';
import { Add } from '@mui/icons-material';
import { Stack, Button, TextField } from '@mui/material';
import { useEffect } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { RentalModel } from '../types/rentals';
import { RentalSchema } from '../zod-schemas/Rentals';
import FormSectionHeader from './FormSectionHeader';
import KeyFactsInput from './KeyFactsInput';
import ImagesInput from './ImagesInput';
import PriceInput from './PriceInput';

type ImageType = {
  id?: string;
  fileName: string;
  caption?: string;
};

type Props = {
  rental?: RentalModel;
  children: JSX.Element;
  onDirty: (isDirty: boolean) => void;
  onSubmit: (data: RentalModel) => Promise<void>;
};

const SET_VALUE_OPTIONS = {
  shouldDirty: true,
  shouldValidate: true,
};

export default function RentalForm({
  rental,
  children,
  onDirty,
  onSubmit,
}: Props): JSX.Element {
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { isDirty, errors },
  } = useForm<RentalModel>({
    resolver: zodResolver(RentalSchema),
    defaultValues: {
      name: '',
      description: '',
      price: {
        oneDay: 0,
        threeDay: 0,
        sevenDay: 0,
      },
      images: [],
      keyFacts: [{ fact: '' }],
      ...rental,
    },
  });

  console.log('errors :>> ', errors);

  const keyFacts = useFieldArray({
    control,
    name: 'keyFacts',
  });

  const images = useFieldArray({
    control,
    name: 'images',
  });

  watch('images');

  useEffect(() => {
    onDirty(isDirty);
  }, [onDirty, isDirty]);

  const handleAddMoreHours = () => keyFacts.append({ fact: '' });

  const handleRemoveClick = (index: number) => keyFacts.remove(index);

  const handleImagesChange = (newImages: ImageType[]) => {
    const newImagesWithoutIds = newImages.map(({ fileName, caption }) => ({
      fileName,
      caption,
    }));

    setValue('images', newImagesWithoutIds, SET_VALUE_OPTIONS);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Stack spacing={2}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              error={!!errors?.name}
              helperText={errors?.name?.message}
              label="Name"
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              error={!!errors?.description}
              helperText={errors?.description?.message}
              label="Description"
              multiline
              rows={3}
            />
          )}
        />

        <FormSectionHeader label="Prices" />
        <PriceInput control={control} />

        <FormSectionHeader label="Key Facts" />
        {keyFacts.fields.map((field, index) => (
          <KeyFactsInput
            key={field.id}
            control={control}
            index={index}
            hideRemoveButton={keyFacts.fields.length <= 1}
            onRemoveClick={handleRemoveClick}
          />
        ))}

        <Button onClick={handleAddMoreHours}>
          <Add />
          Add More Key Facts
        </Button>

        <ImagesInput
          images={images.fields}
          error={errors?.images?.message}
          onImagesChange={handleImagesChange}
        />
        {children}
      </Stack>
    </form>
  );
}
