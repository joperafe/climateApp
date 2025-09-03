
import { http } from './http'
import { settings } from '../config/config'
import type { Sensor } from '../types/sensor'

export async function fetchSensors(): Promise<Sensor[]> {
  const url = settings.data.sensors
  const { data } = await http.get(url)
  return data
}
