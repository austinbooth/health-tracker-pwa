import { FC, useMemo } from 'react'
import { ResponsiveLine } from '@nivo/line'
import { DateTime } from 'luxon'
import { useGetValuesForUser } from '../../queryUtils'
import getWeeklyAverages, { GroupedDataWithAverages } from './weeklyData/groupData'

interface Props {
  userId: string
}

const AvgWeeklyWeightGraph: FC<Props> = ({ userId }) => {
  const { data, isError, isLoading } = useGetValuesForUser(userId)

  const graphData = useMemo(() => processDataForGraph(getWeeklyAverages(data ?? [])), [data])

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error fetching data</div>

  return (
    <div style={{ height: '400px' }}>
      <p className="text-center text-base">Avg weekly weight</p>
      <ResponsiveLine
        data={graphData}
        margin={{ top: 20, right: 10, bottom: 50, left: 50 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: 'Week',
          legendOffset: 36,
          legendPosition: 'middle',
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: 'Weight (kg)',
          legendOffset: -40,
          legendPosition: 'middle',
        }}
        colors={{ scheme: 'accent' }}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
      />
    </div>
  )

}

export default AvgWeeklyWeightGraph

function processDataForGraph(data: GroupedDataWithAverages): {id: string, data: {x: string, y: number}[]}[] {
  const flatData = Object.entries(data).map(([yearWeek, weekData]) => ({
    x: DateTime.fromObject({
      weekYear: parseInt(yearWeek.slice(0, 4)),
      weekNumber: parseInt(yearWeek.slice(5, 7)),
    }).toFormat('dd-MM-yy'),
    y: weekData.averageWeight,
  })).sort((a, b) => a.x.localeCompare(b.x))

  return [{
    id: 'Weight',
    data: flatData,
  }]
}
