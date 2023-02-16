import * as React from 'react';
import {default as TabsM } from '@mui/material/Tabs';
import {Tab} from './Tab'
import Box from '@mui/material/Box';
import { TabPanel } from './TabPanel';

type TabsProps = {
  data: Array<{
    label: string
    content: JSX.Element
  }>
  idPrefix: string
  contentPadding?: number | string
} & ({
  orientation: "horizontal"
} | {
  orientation: "vertical"
  height?: string
})

export const Tabs = (props: TabsProps) => {
  const [value, setValue] = React.useState(0);
  const {orientation, idPrefix, data} = props

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const TabsPanels = () => {
    return <> { data.map(
      (dto, i) => <TabPanel
        orientation={orientation}
        index={i}
        idPrefix={idPrefix}
        value={value}
        key={`${idPrefix}-${i}`}
        contentPadding={props.contentPadding}
      >
        {dto.content}
      </TabPanel>
    ) }
    </>
  }

  const boxH = orientation === 'vertical' ? (props.height ?? '100vh') : undefined

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: boxH }}
      >
        <TabsM
          orientation={orientation}
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{ borderRight: 1, borderColor: 'divider' }}
        > {
            data.map(
              (dto, i) => <Tab
                orientation={orientation}
                label={dto.label}
                index={i}
                idPrefix={idPrefix}
                key={`${idPrefix}-${i}`}
              />
            )
          }
        </TabsM>
        {orientation==='vertical' && <TabsPanels/>}
      </Box>
      {orientation==='horizontal' && <TabsPanels/>}
    </Box>
  );
}
