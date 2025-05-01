const helpRequestFixtures = {
  oneHelpRequest: {
    id: 1,
    requesterEmail: "riya@ucsb.edu",
    teamId: "s25-06",
    tableOrBreakoutRoom: "6",
    requestTime: "2025-05-01T00:30:57",
    explanation: "problem",
    solved: true,
  },
  threeHelpRequests: [
    {
      id: 1,
      requesterEmail: "riya@ucsb.edu",
      teamId: "s25-06",
      tableOrBreakoutRoom: "6",
      requestTime: "2025-05-01T00:30:57",
      explanation: "problem",
      solved: true,
    },
    {
      id: 2,
      requesterEmail: "riyagupta@ucsb.edu",
      teamId: "s25-04",
      tableOrBreakoutRoom: "4",
      requestTime: "2024-03-01T00:30:57",
      explanation: "swagger help",
      solved: false,
    },
    {
      id: 3,
      requesterEmail: "riyag@gmail.com",
      teamId: "s24-08",
      tableOrBreakoutRoom: "10",
      requestTime: "2024-03-01T12:30:57",
      explanation: "setup errors",
      solved: true,
    },
  ],
};

export { helpRequestFixtures };
