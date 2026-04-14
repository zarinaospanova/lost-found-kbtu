export interface ItemPost {
  id: number;
  title: string;
  description: string;
  item_type: 'lost' | 'found';
  status: 'open' | 'resolved';
  date_event: string;
  contact_info: string;
  latitude?: number | null;
  longitude?: number | null;
  user: number;
  username: string;
  category: number;
  category_name: string;
  location: number;
  location_name: string;
  building_name: string;
  created_at: string;
  updated_at: string;
}
