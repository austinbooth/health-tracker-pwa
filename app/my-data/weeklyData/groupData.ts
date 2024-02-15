import { DateTime } from 'luxon'
import { ValuesFromDB } from '../../../types'

interface GroupedData {
  [yearWeek: string]: ValuesFromDB[]
}

const groupByWeek = (data: ValuesFromDB[]): GroupedData => {
  const groupedData: GroupedData = {}

  data.forEach(item => {
    const date = DateTime.fromISO(item.date)
    const weekNumber = date.weekNumber
    const year = date.year
    const yearWeek = `${year}-${weekNumber}`

    if (!groupedData[yearWeek]) {
      groupedData[yearWeek] = []
    }

    groupedData[yearWeek].push(item)
  })

  return groupedData
}

export interface GroupedDataWithAverages {
  [yearWeek: string]: {
    averageWeight: number | null,
    averageDailySteps: number,
    data: ValuesFromDB[],
  }
}

function calculateAverageWeight(data: ValuesFromDB[]): number | null {
  let numberOfNonNullWeightValues = 0
  let sum = 0
  data.forEach(value => {
    if (value.weight_kg !== null) {
      sum += parseFloat(value.weight_kg)
      numberOfNonNullWeightValues++;
    }
  })
  
  return numberOfNonNullWeightValues > 0 ? sum / numberOfNonNullWeightValues : null;
}

const calculateAverages = (data: GroupedData): GroupedDataWithAverages => {
  const currentYearWeek = `${DateTime.now().year}-${DateTime.now().weekNumber}`
  const groupedDataWithAverages: GroupedDataWithAverages = {}
  Object.entries(data).forEach(([yearWeek, valuesFromDb]) => {
    const averageWeight = calculateAverageWeight(valuesFromDb)

    const averageDailySteps = valuesFromDb.reduce((acc, value) => {
      if (value.steps) {
        return acc + parseInt(value.steps)
      }
      return acc
    }, 0) / (yearWeek === currentYearWeek ? DateTime.now().weekday : 7)

    groupedDataWithAverages[yearWeek] = {
      averageWeight: averageWeight === null ? null : parseFloat(averageWeight.toFixed(1)),
      averageDailySteps: Math.round(averageDailySteps),
      data: valuesFromDb,
    }
  })
  return groupedDataWithAverages
}

const getWeeklyAverages = (data: ValuesFromDB[]): GroupedDataWithAverages => {
  const groupedData = groupByWeek(data)
  return calculateAverages(groupedData)
}

export default getWeeklyAverages
