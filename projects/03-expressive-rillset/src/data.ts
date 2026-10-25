export interface RouteRecord {
  route_id: string;
  route_name: string;
  service_region: string;
  origin_port: string;
  dest_terminal: string;
  coordinates: [number, number];
  departure_at: string;
  arrival_at: string;
  capacity_teu: number;
  vessel_type: string;
  transit_status: 'On Schedule' | 'Dispatched' | 'Boarding' | 'In Bay';
  channel_code: string;
  isNewRow?: boolean;
}

export interface SchemaField {
  name: string;
  type: 'text' | 'timestamp' | 'integer' | 'geo_point';
  change: 'Added' | 'Unchanged' | 'Modified';
  description: string;
  sampleValues: string[];
}

export const SCHEMA_FIELDS: SchemaField[] = [
  {
    name: 'service_region',
    type: 'text',
    change: 'Added',
    description: 'Regional grouping for each route.',
    sampleValues: ['North', 'Central', 'South'],
  },
  {
    name: 'route_id',
    type: 'text',
    change: 'Unchanged',
    description: 'Unique identifier for each harbor route.',
    sampleValues: ['HBR-091', 'HBR-104', 'HBR-218'],
  },
  {
    name: 'departure_at',
    type: 'timestamp',
    change: 'Unchanged',
    description: 'Scheduled departure time in ISO 8601.',
    sampleValues: ['06:30:00Z', '08:15:00Z', '11:45:00Z'],
  },
  {
    name: 'capacity',
    type: 'integer',
    change: 'Unchanged',
    description: 'Passenger and vessel capacity per trip.',
    sampleValues: ['1,850', '3,400', '4,200'],
  },
];
