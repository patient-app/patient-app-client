export interface MeetingDTO {
    id: string;
    externalMeetingId: string;
    createdAt: string;
    updatedAt: string;
    patientId: string;
    startAt: string;
    endAt: string;
    location: string;
    meetingStatus: string;
}
