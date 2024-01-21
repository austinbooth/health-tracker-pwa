import { FC, PropsWithChildren, useMemo } from 'react'
import { useGetValuesForUser } from '../queryUtils'
import getWeeklyAverages from '../app/my-data/weeklyData/groupData'
import { calculateWeeklyWeightDecrease } from '../app/my-data/weeklyData/WeeklyData'
import { DateTime } from 'luxon'

interface WeightLossStatsProps {
  userId: string
}
const WeightLossStats: FC<WeightLossStatsProps> = ({userId}) => {
  const { data, isError, isLoading } = useGetValuesForUser(userId)

  const groupedAvgDataByWeek = useMemo(() => getWeeklyAverages(data ?? []), [data])
  const weightDecreases = useMemo(() => calculateWeeklyWeightDecrease(groupedAvgDataByWeek), [groupedAvgDataByWeek])
  const sortedWeeks = Object.keys(weightDecreases).sort((a, b) => a.localeCompare(b))

  const totalLoss = useMemo(() => {
    return sortedWeeks.reduce((acc, week) => {
      return acc + parseFloat(weightDecreases[week])
    }, 0).toString()
  }, [weightDecreases, sortedWeeks])
  
  const thisWeek = useMemo(() => {
    const now = DateTime.local()
    const yearWeek = `${now.weekYear}-${now.weekNumber}`
    return weightDecreases[yearWeek] ?? '0'
  }, [weightDecreases])

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error fetching data</div>

  return (
    <div className='flex flex-row gap-x-10 mb-3'>
      <StatItem value={totalLoss}>
        <div className='text-gray-500'>Total loss</div>
      </StatItem>
      <StatItem value={thisWeek}>
        <div className='text-gray-500'>This week</div>
      </StatItem>
    </div>
  )
}

interface StatItemProps {
  value: string
}
const StatItem: FC<PropsWithChildren<StatItemProps>> = ({ children, value }) => (
  <div className='flex flex-col items-center'>
    <div className='text-2xl font-semibold'>{value}</div>
    {children}
  </div>
)

export default WeightLossStats
