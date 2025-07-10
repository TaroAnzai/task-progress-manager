export interface User {
  id: number;
  name: string;
  email: string;
  wp_user_id?: number;
  organization_code?: string;
}

export interface AccessScope {
  id: number;
  organization_code: string;
  role: 'system_admin' | 'org_admin' | 'member';
}
