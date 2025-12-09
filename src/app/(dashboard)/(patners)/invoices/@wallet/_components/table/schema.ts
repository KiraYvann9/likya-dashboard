export interface TransactionColumnsSchema {
    _id: string
    amount: string
    description: string
    fees: string
    metadata: {
        device: string
        ip: string
    }
    timestamp: string
    transaction_author: string
    transaction_direction: string
    transaction_receiver: string
    transaction_ref: string
    transaction_status: string
    transaction_type: string
    wallet_from_id: string
    wallet_to_id: string
}