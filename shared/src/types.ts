export interface Group {
  id: string;
  name: string;
  description?: string;
  date: string;
  created_at: Date;
  updated_at: Date;
}

export interface Response {
  id: string;
  group_id: string;
  user_name: string;
  is_available: boolean;
  message?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
  date: string;
}

export interface CreateGroupResponse {
  id: string;
  name: string;
  description?: string;
  date: string;
}

export interface GroupWithResponses {
  group: Group;
  responses: Response[];
}

export interface CreateResponseRequest {
  userName: string;
  isAvailable: boolean;
  message?: string;
}

export interface CreateResponseResponse {
  success: boolean;
  response: Response;
}