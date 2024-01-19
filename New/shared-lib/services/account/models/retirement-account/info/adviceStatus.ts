export interface Plans {
  id: string;
  adviceStatus: string;
}
export interface Client {
  id: string;
  domain: string;
  plans: Plans[];
}
export interface PlanAdviceStatusClient {
  clients: Client[];
}
