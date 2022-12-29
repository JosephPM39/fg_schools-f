import * as React from 'react';
import {default as TabsM } from '@mui/material/Tabs';
import {Tab} from './Tab'
import Box from '@mui/material/Box';
import { TabPanel } from './TabPanel';

interface TabsProps {
  data: Array<{
    label: string
    content: JSX.Element
  }>
  orientation: "vertical" | "horizontal"
  idPrefix: string
}

export const Tabs = (props: TabsProps) => {
  const [value, setValue] = React.useState(0);
  const {orientation, idPrefix, data} = props

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 224 }}
    >
      <TabsM
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider' }}
      > {
          data.map(
            (dto, i) => <Tab orientation={orientation} label={dto.label} index={i} idPrefix={idPrefix} key={`${idPrefix}-${i}`} />
          )
        }
      </TabsM>
      {
        data.map(
          (dto, i) => <TabPanel orientation={orientation} index={i} idPrefix={idPrefix} value={value} key={`${idPrefix}-${i}`}>
            {dto.content}
          </TabPanel>
        )

      }
    </Box>
  );
}
