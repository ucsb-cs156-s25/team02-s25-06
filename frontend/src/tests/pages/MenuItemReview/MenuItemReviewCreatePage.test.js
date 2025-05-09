
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MenuItemReviewCreatePage from "main/pages/MenuItemReview/MenuItemReviewCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

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
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("MenuItemReviewCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  const queryClient = new QueryClient();
  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("ItemId")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /menuItemReview", async () => {
    const queryClient = new QueryClient();
    const menuItemReview = {
      id: 1,
      itemId: "1",
      reviewerEmail: "cg@gmail.com",
      stars: "4",
      comments: "Noon on January 2nd",
      dateReviewed: "2022-01-02T12:00",
    };

    axiosMock.onPost("/api/menuItemReview/post").reply(202, menuItemReview);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("ItemId")).toBeInTheDocument();
    });

    const itemIdInput = screen.getByLabelText("ItemId");
    expect(itemIdInput).toBeInTheDocument();

    const emailInput = screen.getByLabelText("ReviewerEmail");
    expect(emailInput).toBeInTheDocument();

    const starsInput = screen.getByLabelText("Stars");
    expect(starsInput).toBeInTheDocument();

    const commentInput = screen.getByLabelText("Comments");
    expect(commentInput).toBeInTheDocument();

    const dateReviewedInput = screen.getByLabelText("DateReviewed");
    expect(dateReviewedInput).toBeInTheDocument();

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();

    fireEvent.change(itemIdInput, { target: { value: "1" } });
    fireEvent.change(emailInput, { target: { value: "cg@gmail.com" } });
    fireEvent.change(starsInput, { target: { value: "4" } });
    fireEvent.change(commentInput, {
      target: { value: "Noon on January 2nd" },
    });
    fireEvent.change(dateReviewedInput, {
      target: { value: "2022-01-02T12:00" },
    });

    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      itemId: "1",
      reviewerEmail: "cg@gmail.com",
      stars: "4",
      comments: "Noon on January 2nd",
      dateReviewed: "2022-01-02T12:00",
    });

    // assert - check that the toast was called with the expected message
    expect(mockToast).toBeCalledWith(
      //message: `New Menu Item Review Created - itemId: ${menuItemReview.itemId} reviewerEmail: ${menuItemReview.reviewerEmail} stars: ${menuItemReview.stars} comments: ${menuItemReview.comments} dateReviewed: ${menuItemReview.dateReviewed}`,

      "New Menu Item Review Created - itemId: 1 reviewerEmail: cg@gmail.com stars: 4 comments: Noon on January 2nd dateReviewed: 2022-01-02T12:00",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/menuItemReview" });
  });
});
