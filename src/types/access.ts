export interface TaskAccessUser {
  id: number;
  name: string;
  email: string;
  access_level: 'view' | 'edit' | 'admin';
}

export interface TaskAccessOrganization {
  org_code: string;
  name: string;
  access_level: 'view' | 'edit' | 'admin';
}
