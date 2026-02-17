export interface POI {
  id: number;
  name: string;
  lat: number;
  lng: number;
  radius: number;
}

export const POIs: POI[] = [
  // { id: 1, name: "POI1", lng: 0.384751, lat: 41.007177, radius: 5 },
  { id: 1, name: "POI1", lng: 74.383200, lat: 31.580900, radius: 5 },
  { id: 2, name: "POI2", lng: 0.385187, lat: 41.008508, radius: 5 },
  { id: 3, name: "POI3", lng: 0.38491, lat: 41.009507, radius: 5 },
  { id: 4, name: "POI4", lng: 0.385187, lat: 41.008508, radius: 5 },
  { id: 5, name: "POI5", lng: 0.404048, lat: 41.006102, radius: 5 },
];
