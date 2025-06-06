import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import UCSBDiningCommonsMenuItemEditPage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemEditPage";
import { ucsbDiningCommonsMenuItemFixtures } from "fixtures/ucsbDiningCommonsMenuItemFixtures";

export default {
  title: "pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemEditPage",
  component: UCSBDiningCommonsMenuItemEditPage,
};

const Template = () => <UCSBDiningCommonsMenuItemEditPage storybook={true} />;

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
    http.get("/api/ucsbdiningcommonsmenuitem", () => {
      return HttpResponse.json(
        ucsbDiningCommonsMenuItemFixtures.oneucsbDiningCommonsMenuItem[0],
        {
          status: 200,
        },
      );
    }),
    http.put("/api/ucsbdiningcommonsmenuitem", () => {
      return HttpResponse.json(
        {
          id: 8,
          diningCommonsCode: "ortega",
          name: "Updated Baked Pesto Pasta with Chicken",
          station: "Updated Entree Specials",
        },
        { status: 200 },
      );
    }),
  ],
};
