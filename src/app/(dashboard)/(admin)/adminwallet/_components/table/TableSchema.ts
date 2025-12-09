export type USerType = {
    _id: string
    user_id: string,
    balance: string,
    currency: string,
    wallet_ref: string,
    state: 'enabled' | 'disabled' | 'locked',
    created_at: string,
    updated_at: string,
}