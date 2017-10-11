import { Location } from './location.interface';

export interface Route {
  travelTime: number,
  travelDistance: number,
  specificTimes?: {
    start?: {
      [time: string]: {
        travelTime: number,
        travelDistance: number
      }
    },
    end?: {
      [time: string]: {
        travelTime: number,
        travelDistance: number
      }
    }
  },
  meta?: {
    [key: string]: {
      user: string,
      ts: any
    }
  }
}