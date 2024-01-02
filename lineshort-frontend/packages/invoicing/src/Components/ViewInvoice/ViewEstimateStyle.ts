import { Box, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

interface ViewEstimateMainProps {
  padding?: string;
}

export const ViewEstimateMain = styled(Box)<ViewEstimateMainProps>((props) => ({
  padding: props.padding || "1rem 3rem",
}));

interface ViewEstimateTableContainerProps {
  padding?: string;
}

export const ViewEstimateTableContainer = styled(Box)<ViewEstimateTableContainerProps>(
  (props) => ({
    padding: props.padding || "3rem 6rem",
    border: ".5px solid grey",
  })
);

export const ViewEstimateFooter = styled(Box)({
  // Your styles here
});
