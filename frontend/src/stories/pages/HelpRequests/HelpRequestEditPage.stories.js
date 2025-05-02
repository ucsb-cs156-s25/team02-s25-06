import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import HelpRequestEditPage from "main/pages/HelpRequests/HelpRequestEditPage";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";

export default {
  title: "pages/HelpRequests/HelpRequestEditPage",
  component: HelpRequestEditPage,
};

const Template = () => <HelpRequestEditPage storybook={true} />;

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
    http.get("/api/helprequests", () => {
      return HttpResponse.json(helpRequestFixtures.threeHelpRequests[0], {
        status: 200,
      });
    }),
    // http.put("/api/helprequests", () => {
    //   return HttpResponse.json({}, { status: 200 });
    // }),
    http.put("/api/helprequests", () => {
      // window.alert("PUT: " + req.url + " and body: " + req.body);
      return HttpResponse.json(
        {
          id: 1,
          requesterEmail: "riya@ucsb.edu",
        },
        { status: 200 },
      );
    }),
  ],
};
