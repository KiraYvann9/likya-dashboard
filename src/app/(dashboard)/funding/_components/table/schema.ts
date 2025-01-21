export type Schema = {
    _id: string
    created_at: string,
    target_amount: string,
    title: string,
    description:  string,
    device: string,
    access: boolean,
    start_date: string,
    end_date: string,
    created_by: string,
    collect_id: boolean,
    contributors: Array<string>,
    status: string,
}