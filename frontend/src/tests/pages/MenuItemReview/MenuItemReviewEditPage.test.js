import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import MenuItemReviewEditPage from "main/pages/MenuItemReview/MenuItemReviewEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    useParams: () => ({
      id: 17,
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("MenuItemReviewEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/menuItemReview", { params: { id: 17 } }).timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Menu Item Review");
      expect(
        screen.queryByTestId("MenuItemReview-name"),
      ).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock
        .onGet("/api/menuItemReview", { params: { id: 17 } })
        .reply(200, {
          id: 17,
          itemId: "1",
          reviewerEmail: "cg@gmail.com",
          stars: "4",
          comments: "Noon on January 2nd",
          dateReviewed: "2022-01-02T12:00",
        });
      axiosMock.onPut("/api/menuItemReview").reply(200, {
        id: "17",
        itemId: "2",
        reviewerEmail: "cg2@gmail.com",
        stars: "2",
        comments: "Noon on January 22nd",
        dateReviewed: "2222-03-03T12:00",
      });
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("MenuItemReviewForm-id");

      const idField = screen.getByTestId("MenuItemReviewForm-id");
      const itemidField = screen.getByTestId("MenuItemReviewForm-itemId");
      const reField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
      const starsField = screen.getByTestId("MenuItemReviewForm-stars");
      const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
      const dateReviewedField = screen.getByTestId(
        "MenuItemReviewForm-dateReviewed",
      );
      const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");
      expect(itemidField).toBeInTheDocument();
      expect(itemidField).toHaveValue(1);
      expect(reField).toBeInTheDocument();
      expect(reField).toHaveValue("cg@gmail.com");
      expect(starsField).toBeInTheDocument();
      expect(starsField).toHaveValue(4);
      expect(commentsField).toBeInTheDocument();
      expect(commentsField).toHaveValue("Noon on January 2nd");
      expect(dateReviewedField).toBeInTheDocument();
      expect(dateReviewedField).toHaveValue("2022-01-02T12:00");

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(itemidField, {
        target: { value: "2" },
      });
      fireEvent.change(reField, {
        target: { value: "cg2@gmail.com" },
      });
      fireEvent.change(starsField, {
        target: { value: "2" },
      });
      fireEvent.change(commentsField, {
        target: { value: "Noon on January 22nd" },
      });
      fireEvent.change(dateReviewedField, {
        target: { value: "2222-03-03T12:00" },
      });

      fireEvent.click(submitButton);

      //`New Menu Item Review Created - itemId: ${menuItemReview.itemId} reviewerEmail: ${menuItemReview.reviewerEmail} stars: ${menuItemReview.stars} comments: ${menuItemReview.comments} dateReviewed: ${menuItemReview.dateReviewed}`,

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "MenuItemReview Updated - id: 17 itemId: 2",
      );

      expect(mockNavigate).toBeCalledWith({ to: "/menuItemReview" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          itemId: "2",
          reviewerEmail: "cg2@gmail.com",
          stars: "2",
          comments: "Noon on January 22nd",
          dateReviewed: "2222-03-03T12:00",
        }),
      ); // posted object
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("MenuItemReviewForm-id");

      const idField = screen.getByTestId("MenuItemReviewForm-id");
      const itemidField = screen.getByTestId("MenuItemReviewForm-itemId");
      const reField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
      const starsField = screen.getByTestId("MenuItemReviewForm-stars");
      const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
      const dateReviewedField = screen.getByTestId(
        "MenuItemReviewForm-dateReviewed",
      );
      const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");
      expect(itemidField).toBeInTheDocument();
      expect(itemidField).toHaveValue(1);
      expect(reField).toBeInTheDocument();
      expect(reField).toHaveValue("cg@gmail.com");
      expect(starsField).toBeInTheDocument();
      expect(starsField).toHaveValue(4);
      expect(commentsField).toBeInTheDocument();
      expect(commentsField).toHaveValue("Noon on January 2nd");
      expect(dateReviewedField).toBeInTheDocument();
      expect(dateReviewedField).toHaveValue("2022-01-02T12:00");
      expect(submitButton).toBeInTheDocument();

      fireEvent.change(itemidField, {
        target: { value: "2" },
      });
      fireEvent.change(reField, {
        target: { value: "cg2@gmail.com" },
      });
      fireEvent.change(starsField, {
        target: { value: "2" },
      });
      fireEvent.change(commentsField, {
        target: { value: "Noon on January 22nd" },
      });
      fireEvent.change(dateReviewedField, {
        target: { value: "2222-03-03T12:00" },
      });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "MenuItemReview Updated - id: 17 itemId: 2",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/menuItemReview" });
    });
  });
});
