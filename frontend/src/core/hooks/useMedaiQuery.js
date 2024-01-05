import { useMediaQuery } from '@mui/material';

const useResponsiveStyles = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const upMedium = useMediaQuery('(min-width:601px)');
  const isMedium = useMediaQuery('(min-width:601px) and (max-width:1200px)');
  const isLarger = useMediaQuery('(min-width:1201px)');
  return {
    isMobile,
    isMedium,
    isLarger,
    upMedium
  };
};

export default useResponsiveStyles;
