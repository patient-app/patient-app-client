export interface JournalEntryCreationDTO {
    title: string;
    content: string;
    tags: string[];
    sharedWithTherapist: boolean;
    aiAccessAllowed: boolean;
}