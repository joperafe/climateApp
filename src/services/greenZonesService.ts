
import { http } from './http'
import { settings } from '../config/config'
import type { GreenZone } from '../types/greenzone'

export async function fetchGreenZones(): Promise<GreenZone[]> {
  const url = settings.data.greenzones
  const { data } = await http.get(url)
  return data
}
