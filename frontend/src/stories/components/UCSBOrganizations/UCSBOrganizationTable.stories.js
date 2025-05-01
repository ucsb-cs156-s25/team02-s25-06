import React from "react";
import UCSBOrganizationsTable from "main/components/UCSBOrganizations/UCSBOrganizationsTable";
import { ucsbOrganizationsFixtures } from "fixtures/ucsbOrganizationsFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse } from "msw";

export default {
  title: "components/UCSBOrganizations/UCSBOrganizationsTable",
  component: UCSBOrganizationsTable,
};

const Template = (args) => {
  return <UCSBOrganizationsTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  UCSBOrganizations: [],
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
  UCSBOrganizations: ucsbOrganizationsFixtures.threeUCSBOrganizations,
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
  UCSBOrganizations: ucsbOrganizationsFixtures.threeUCSBOrganizations,
  currentUser: currentUserFixtures.adminUser,
};

ThreeItemsAdminUser.parameters = {
  msw: [
    http.delete("/api/ucsborganizations", () => {
      return HttpResponse.json(
        { message: "UCSBOrganizations deleted successfully" },
        { status: 200 },
      );
    }),
  ],
};
