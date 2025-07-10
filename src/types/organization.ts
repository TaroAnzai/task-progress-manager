export interface Organization {
  id: number;
  name: string;
  org_code: string;
  parent_code?: string | null;
  company_id?: number; // 複数会社対応があれば
}
