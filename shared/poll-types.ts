export interface Participants {
    [participantID: string]: string;
}

export interface Poll{
    id: string;
    topic: string;
    votesPerVoter: number;
    participanrs: Participants;
    adminID: string;
}