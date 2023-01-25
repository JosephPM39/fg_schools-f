import {default as TabM} from '@mui/material/Tab';

interface TabProps {
  label: string
  index: number
  idPrefix: string
  orientation: "vertical" | "horizontal"
}

function a11yProps(props: { index: number, orientation: TabProps['orientation'], idPrefix: string}) {
  const {idPrefix,orientation,index} = props
  return {
    id: `${idPrefix}-${orientation}-tab-${index}`,
    'aria-controls': `${idPrefix}-${orientation}-tabpanel-${index}`,
  };
}

export const Tab = (props: TabProps) => {

  const {idPrefix, index: i, orientation, ...other} = props

  return <TabM
    {...a11yProps({idPrefix,index: i, orientation})}
    {...other}
    wrapped
  />
}
