import { FC, useState } from 'react'
import { WithAuthPageProps } from '../../HOCs/withAuth'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import DailyDataTable from './DailyDataTable'
import WeeklyData from './weeklyData/WeeklyData'
import AvgWeeklyWeightGraph from './AvgWeeklyWeightGraph'

const DataInput: FC<WithAuthPageProps> = ({userId}) => {
  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered aria-label="basic tabs example">
          <Tab label="Daily data" {...a11yProps(0)} />
          <Tab label="Weekly data" {...a11yProps(1)} />
          <Tab label="Graphs" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={activeTab} index={0}>
        <DailyDataTable userId={userId} />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <WeeklyData userId={userId} />
      </TabPanel>
      <TabPanel value={activeTab} index={2}>
        <AvgWeeklyWeightGraph userId={userId} />
      </TabPanel>
    </Box>
  )
}

export default DataInput

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}
