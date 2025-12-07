export type Schema = {
    _id: string,
    target_amount: string,
    //created_at: string,
    title: string,
    description:  string,
    access: boolean,
    start_date: string,
    end_date: string,
    owner_info: {
        fullname: string,
    },
    collect_id: boolean,
    contributors: Array<string>,
    status: string,
    created_at: string,
}