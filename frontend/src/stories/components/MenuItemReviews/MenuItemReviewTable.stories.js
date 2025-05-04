import React from "react";
import MenuItemReviewTable from "main/components/MenuItemReviews/MenuItemReviewTable";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse } from "msw";

export default {
  title: "components/MenuItemReviews/MenuItemReviewTable",
  component: MenuItemReviewTable,
};

const Template = (args) => {
  return <MenuItemReviewTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  menuItemReview: [],
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
  menuItemReview: menuItemReviewFixtures.threeMIRs,
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
  menuItemReview: menuItemReviewFixtures.threeMIRs,
  currentUser: currentUserFixtures.adminUser,
};

ThreeItemsAdminUser.parameters = {
  msw: [
    http.delete("/api/menuItemReview", () => {
      return HttpResponse.json({}, { status: 200 });
    }),
  ],
};
