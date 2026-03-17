export type CategoryType = {
  _id: string;
  parent_id: string | null;
  description: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export type CategoryResponse = {
  items: CategoryType[];
  total: number;
  page: number;
  size: number;
  pages: number;
}
