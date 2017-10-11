export interface Location {
  address: string,
  latitude: number,
  longitude: number,
  altitude?: number,
  street: string,
  zip: string,
  city: string,
  country: string
  googlePlacesId?: string,
  polylineCoordinates?: string,
  workTime?: [{
    workers: number,
    time: number
  }],
  meta?: {
    [key: string]: {
      user: string,
      ts: any
    }
  }
}