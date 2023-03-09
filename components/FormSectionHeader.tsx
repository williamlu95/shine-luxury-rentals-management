import { Stack, Typography, Divider } from '@mui/material';

export default function FormSectionHeader({
  label,
}: {
  label: string;
}): JSX.Element {
  return (
    <Stack direction="column" pt={2}>
      <Typography variant="h6" component="div" fontWeight={400}>
        {label}
      </Typography>
      <Divider />
    </Stack>
  );
}
