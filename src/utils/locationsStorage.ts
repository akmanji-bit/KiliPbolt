export interface CourtCharge {
  duration: string;
  amount: number;
}

export interface PlayerLimit {
  courts: number;
  maxPlayers: number;
}

export interface Location {
  id: string;
  name: string;
  sessionFee: number;
  currency: string;
  courtCharges: CourtCharge[];
  playerLimits: PlayerLimit[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'locationsData';

export const getDefaultCourtCharges = (): CourtCharge[] => [
  { duration: '0.5', amount: 12500 },
  { duration: '1', amount: 25000 },
  { duration: '1.5', amount: 37500 },
  { duration: '2', amount: 50000 },
  { duration: '2.5', amount: 62500 },
  { duration: '3', amount: 75000 },
  { duration: '3.5', amount: 87500 },
  { duration: '4', amount: 100000 },
  { duration: '4.5', amount: 112500 },
  { duration: '5', amount: 125000 },
  { duration: '5.5', amount: 137500 },
  { duration: '6', amount: 150000 },
];

export const getDefaultPlayerLimits = (): PlayerLimit[] => [
  { courts: 1, maxPlayers: 6 },
  { courts: 2, maxPlayers: 10 },
  { courts: 3, maxPlayers: 14 },
  { courts: 4, maxPlayers: 20 },
  { courts: 5, maxPlayers: 24 },
  { courts: 6, maxPlayers: 26 },
];

export const getLocations = (): Location[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading locations from localStorage:', error);
    return [];
  }
};

export const saveLocations = (locations: Location[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('locationsDataChanged'));
  } catch (error) {
    console.error('Error saving locations to localStorage:', error);
  }
};

export const addLocation = (locationData: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>): Location => {
  const newLocation: Location = {
    ...locationData,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const locations = getLocations();
  locations.push(newLocation);
  saveLocations(locations);
  
  return newLocation;
};

export const updateLocation = (id: string, updates: Partial<Location>): Location | null => {
  const locations = getLocations();
  const index = locations.findIndex(loc => loc.id === id);
  
  if (index === -1) return null;
  
  locations[index] = {
    ...locations[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  saveLocations(locations);
  return locations[index];
};

export const deleteLocation = (id: string): boolean => {
  const locations = getLocations();
  const filteredLocations = locations.filter(loc => loc.id !== id);
  
  if (filteredLocations.length === locations.length) return false;
  
  saveLocations(filteredLocations);
  return true;
};