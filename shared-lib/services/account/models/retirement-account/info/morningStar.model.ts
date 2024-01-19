export interface Plans {
  id: string;
  adviceStatus: string;
}
export interface Clients {
  id: string;
  plans: Plans[];
}
