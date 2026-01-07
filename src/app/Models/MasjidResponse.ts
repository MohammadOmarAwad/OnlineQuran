export interface MasjidResponse {
  code: number
  status: string
  data: Data
}

export interface Data {
  metaData: string
  masjids: Masjid[]
  message: string
  errorDetails: string
}

export interface Masjid {
  masjidAddress: MasjidAddress
  masjidLocation: MasjidLocation
  masjidTimings: MasjidTimings
  _id: string
  masjidName: string
}

export interface MasjidAddress {
  description: string
  street: string
  zipcode: string
  country: string
  state: string
  city?: string
  locality: any
  phone: any
  googlePlaceId: string
}

export interface MasjidLocation {
  type: string
  coordinates: number[]
}

export interface MasjidTimings {
  fajr: any
  zuhr: any
  asr: any
  maghrib: any
  isha: any
  jumah: any
}
