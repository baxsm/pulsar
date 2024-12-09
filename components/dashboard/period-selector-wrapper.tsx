import { FC } from 'react'
import PeriodSelector from './period-selector'
import { Period } from '@/types/analytics'
import { getPeriods } from '@/actions/dashboard'

interface PeriodSelectorWrapperProps {
  selectedPeriod: Period
}

const PeriodSelectorWrapper: FC<PeriodSelectorWrapperProps> = async ({selectedPeriod}) => {

  const periods = await getPeriods()

  return (
    <PeriodSelector selectedPeriod={selectedPeriod} periods={periods}/>
  )
}

export default PeriodSelectorWrapper