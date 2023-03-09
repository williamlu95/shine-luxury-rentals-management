export type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

type LatLng = {
  lat: number | null | undefined;
  lng: number | null | undefined;
};

export type Geometry = {
  location: LatLng;
  viewport?: {
    northeast: LatLng;
    southwest: LatLng;
  };
};

export type Place = {
  place_id: string | null;
  formatted_address: string;
  geometry: Geometry;
  name: string;
};
