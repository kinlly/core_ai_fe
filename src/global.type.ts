export type SFTType = { instruction: string, output: string }
export type ConversationClientType = {
    question: string,
    answer: string,
    rejected: string[],
}
export type CandidateType = { dislike: boolean, like: boolean, value: string }

export type DialogType = {
    from: string,
    value: string
}

export type ConversationType = {
    conversations: DialogType[]
}

export type DPOConversationLinesType = {
    chosen: ConversationType,
    rejected: ConversationType
}