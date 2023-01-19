import { useNetStatus } from '../../useNetStatus'
export type NetStatus = Pick<ReturnType<typeof useNetStatus>, 'offlineMode' | 'netOnline'>
export interface BaseParams {
  netStatus: NetStatus
}
