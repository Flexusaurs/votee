//svc types
export type CreatePollFields = {
  topic: string;
  votesPerVoter: number;
  name: string;
};

export type JoinPollFields = {
  pollID: string;
  name: string;
};

export type RejoinPollFields = {
  pollID: string;
  userID: string;
  name: string;
};


//repo types 

export type CreatePollRepositoryData = {
  pollID: string;
  topic: string;
  votesPerVoter: number;
  userID: string;
}

export type AddParticipantRepositoryData = {
  pollID: string;
  userID: string;
  name: string;
}