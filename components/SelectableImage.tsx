import { CheckCircle } from '@mui/icons-material';
import { IconButton, ImageListItemBar } from '@mui/material';
import { useState } from 'react';
import Image from 'next/image';

type Props = {
  selected: boolean;
  fileName: string;
  onClick: (fileName: string) => void;
};

export default function SelectableImage({
  selected,
  fileName,
  onClick,
}: Props): JSX.Element {
  const [showbar, setShowBar] = useState(false);

  const handleClick = () => {
    onClick(fileName);
  };

  return (
    <>
      <ImageListItemBar
        position="top"
        sx={{
          visibility: showbar || selected ? 'visible' : 'hidden',
        }}
        onMouseEnter={() => setShowBar(true)}
        onMouseLeave={() => setShowBar(false)}
        actionIcon={
          <IconButton
            onClick={handleClick}
            color={selected ? 'success' : 'default'}
          >
            <CheckCircle
              sx={{
                opacity: selected ? 1 : 0.3,
              }}
            />
          </IconButton>
        }
      />

      <Image
        alt="Shine Luxury Rental Image"
        src={`${process.env.NEXT_PUBLIC_SPACE_URL}/${fileName}`}
        width={120}
        height={140}
        onMouseEnter={() => setShowBar(true)}
        onMouseLeave={() => setShowBar(false)}
      />
    </>
  );
}
