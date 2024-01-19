export interface MxWidget {
  url: string;
  type: string;
  user_id: string;
}

export interface MXRootObject {
  url: MxWidget;
}

export interface Member {
  guid: string;
  aggregated_at: Date;
  name: string;
  connection_status: string;
  is_user_created: string;
  user_guid: string;
  connection_status_message: string;
}

export interface MXRootMemberObject {
  members: Member[];
}

export interface MXWidgetOptions {
  id: string;
  height?: string;
  width?: string;
  autoload?: boolean;
}

export interface MXAccount {
  account_number: string;
  account_type_name: string;
  available_balance: string;
  balance: string;
  currency_code: string;
  guid: string;
  institution_guid: string;
  medium_logo_url: string;
  name: string;
  routing_number: string;
  small_logo_url: string;
  updated_at: string;
  user_guid: string;
  institution_name: string;
  account_subtype_name?: string;
  radioButtonIconName?: string;
}
export interface MXAccountRootObject {
  accounts: MXAccount[];
}
export interface SpendingBudgetDescription {
  top_text?: string;
  image_url?: string;
  bottom_text?: string;
}

export interface MX {
  spending_budget_title?: string;
  spending_budget_description?: SpendingBudgetDescription[];
}

export interface RootObjectMX {
  MX?: MX[];
}

export interface RootObjectNetworth {
  total_networth: string;
}
export interface RootObjectMXJSON {
  MXJSON: string;
}
