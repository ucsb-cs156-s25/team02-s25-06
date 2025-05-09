import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import RecommendationRequestEditPage from "main/pages/RecommendationRequest/RecommendationRequestEditPage";
import { recommendationrequestFixtures } from "fixtures/recommendationrequestFixtures";

export default {
  title: "pages/RecommendationRequest/RecommendationRequestEditPage",
  component: RecommendationRequestEditPage,
};

const Template = () => <RecommendationRequestEditPage storybook={true} />;

export const Default = Template.bind({});
Default.parameters = {
  msw: [
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.userOnly, {
        status: 200,
      });
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither, {
        status: 200,
      });
    }),
    http.get("/api/recommendationrequest", () => {
      return HttpResponse.json(
        recommendationrequestFixtures.threeRecommendationRequests[0],
        {
          status: 200,
        },
      );
    }),
    // http.put("/api/recommendationrequest", () => {
    //   return HttpResponse.json({}, { status: 200 });
    // }),
    http.put("/api/recommendationrequest", () => {
      return HttpResponse.json(
        {
          id: 17,
          requesterEmail: "test_requester_updated@test.com",
          professorEmail: "test_professor_updated@test.com",
          explanation: "test explanation updated*",
          dateRequested: "2000-01-01",
          dateNeeded: "2002-02-02",
          done: false,
        },
        { status: 200 },
      );
    }),
  ],
};
