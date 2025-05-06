const recommendationrequestFixtures = {
  oneRecommendationRequest: {
    id: 1,
    requesterEmail: "blah",
    professorEmail: "blah",
    explanation: "blah",
    dateRequested: "2024-01-01",
    dateNeeded: "2025-01-01",
    done: true,
  },
  threeRecommendationRequests: [
    {
      id: 1,
      requesterEmail: "blah",
      professorEmail: "blah",
      explanation: "blah",
      dateRequested: "2024-01-01",
      dateNeeded: "2025-01-01",
      done: true,
    },
    {
      id: 2,
      requesterEmail: "test_requester@test.com",
      professorEmail: "test_professor@test.com",
      explanation: "test explanation updated",
      dateRequested: "2020-01-01",
      dateNeeded: "2022-02-02",
      done: true,
    },
    {
      id: 3,
      requesterEmail: "test2_requester@test.com",
      professorEmail: "test2_professor@test.com",
      explanation: "test2 explanation",
      dateRequested: "2000-01-01",
      dateNeeded: "2002-02-02",
      done: true,
    },
  ],
};

export { recommendationrequestFixtures };
