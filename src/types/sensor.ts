
export type Sensor = {
  id: string
  name: string
  coordinates: [number, number] // [lat, lng]
  data: {
    temperature?: number
    humidity?: number
    airQualityIndex?: number
    noiseLevel?: number
  }
  lastUpdated: string
}
