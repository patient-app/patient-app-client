export interface JournalEntryDTO{
    id: string;
    createdAt: string;
    updatedAt: string;
    title: string;
    content?: string;
    tags: string[];
    sharedWithTherapist: boolean;
    aiAccessAllowed: boolean;
}