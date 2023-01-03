import { Box, Divider, Typography } from "@mui/material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  orientation: "vertical" | "horizontal"
  idPrefix: string
}

export const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, orientation, idPrefix, ...other } = props;

  return (
    <>
      <Divider/>
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`${idPrefix}-${orientation}-tabpanel-${index}`}
        aria-labelledby={`${idPrefix}-${orientation}-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    </>
  );
}


