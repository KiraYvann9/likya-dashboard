export interface Campaign {
    name: string;
    description: string;
    cover_uri: string;
    category_ids: string[];
    target_amount: number;
    minimum_contribution_amount: number;
    fixed_contribution_amount: number;
    start_date: string;
    end_date: string;
    _id: string;
    author_id: string;
    slug: string;
    created_at: string;
    updated_at: string;
    deleted: boolean;
}