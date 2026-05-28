import { HeadacheIntensity, WorkEnvironment } from '@/types/enums'

export const headacheOptions = [
  HeadacheIntensity.None,
  HeadacheIntensity.Low,
  HeadacheIntensity.Medium,
  HeadacheIntensity.High,
] as const

export const workEnvironmentOptions = [
  WorkEnvironment.Office,
  WorkEnvironment.HomeOffice,
  WorkEnvironment.RemoteSpot,
  WorkEnvironment.NoWork,
] as const

export const headacheLabels: Record<HeadacheIntensity, string> = {
  [HeadacheIntensity.None]: 'None',
  [HeadacheIntensity.Low]: 'Low',
  [HeadacheIntensity.Medium]: 'Medium',
  [HeadacheIntensity.High]: 'High',
}

export const workEnvironmentLabels: Record<WorkEnvironment, string> = {
  [WorkEnvironment.Office]: 'Office',
  [WorkEnvironment.HomeOffice]: 'Home Office',
  [WorkEnvironment.RemoteSpot]: 'Remote Spot',
  [WorkEnvironment.NoWork]: 'No Work',
}
