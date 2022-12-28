import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { IProm, ITitle, IGroup } from '../api/models_school';
import { ApiContext } from '../context/ApiContext';

interface Params {
  proms: IProm[]
}

interface Section {
  promId?: IProm['id']
  title?: ITitle
  group?: IGroup
}

export const SectionsTabs = (params: Params) => {
  const [value, setValue] = React.useState(0);
  const [sections, setSections] = React.useState<Array<Section>>([])

  const api = React.useContext(ApiContext)

  const getSection = (prom: IProm) => {
    return sections.find((s) => s.promId === prom.id)
  }

  const getSectionName = (section?: Section) => {
    return `${section?.title?.name} - ${section?.group?.name}`
  }

  React.useEffect(() => {
    const getData = async () => {
      const sectionsBuilt = await Promise.all(
        params.proms.map(
          async (prom) => ({
            promId: prom.id,
            title: await api?.useTitle.findOne({id: prom.titleId}),
            group: await api?.useGroup.findOne({id: prom.groupId})
          })
        )
      )
      if (sectionsBuilt) {
        setSections(sectionsBuilt)
      }
    }
    if (sections?.length < 1) getData()
  })

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 224 }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        {params.proms.map(
          (prom, i) => <Tab
            key={i}
            label={getSectionName(getSection(prom))}
            {...a11yProps(i)}
          />
        )}
      </Tabs>
      {params.proms.map((prom, i) => <TabPanel key={i} value={value} index={i}>
        <>
          {prom.id}
          {sections.find((s) => s.promId === prom.id)?.title?.name}
        </>
      </TabPanel>)}
    </Box>
  );
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}
