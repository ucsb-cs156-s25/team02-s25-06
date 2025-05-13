import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RecommendationRequestCreatePage from "main/pages/RecommendationRequest/RecommendationRequestCreatePage";
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

describe("RecommendationRequestCreatePage tests", () => {
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
          <RecommendationRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Done")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /recommendationrequest", async () => {
    const queryClient = new QueryClient();
    const recommendationrequest = {
      id: 1,
      requesterEmail: "blah",
      professorEmail: "blah2",
      explanation: "blah3",
      dateRequested: "2024-01-01",
      dateNeeded: "2025-01-01",
      done: true,
    };

    axiosMock
      .onPost("/api/recommendationrequest/post")
      .reply(202, recommendationrequest);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("RequesterEmail")).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText("RequesterEmail");
    expect(nameInput).toBeInTheDocument();

    const name2Input = screen.getByLabelText("ProfessorEmail");
    expect(name2Input).toBeInTheDocument();

    const name3Input = screen.getByLabelText("Explanation");
    expect(name3Input).toBeInTheDocument();

    const name4Input = screen.getByLabelText("Date Requested");
    expect(name4Input).toBeInTheDocument();

    const name5Input = screen.getByLabelText("Date Needed");
    expect(name5Input).toBeInTheDocument();

    const name6Input = screen.getByLabelText("Done");
    expect(name6Input).toBeInTheDocument();

    fireEvent.change(nameInput, { target: { value: "blah" } });
    fireEvent.change(name2Input, { target: { value: "blah2" } });
    fireEvent.change(name3Input, { target: { value: "blah3" } });
    fireEvent.change(name4Input, { target: { value: "2024-01-01" } });
    fireEvent.change(name5Input, { target: { value: "2025-01-01" } });
    fireEvent.click(name6Input);

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();
    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      requesterEmail: "blah",
      professorEmail: "blah2",
      explanation: "blah3",
      dateRequested: "2024-01-01",
      dateNeeded: "2025-01-01",
      done: true,
    });

    // assert - check that the toast was called with the expected message
    expect(mockToast).toHaveBeenCalledWith(
      "New recommendationrequest Created - id: 1 requesterEmail: blah",
    );
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/recommendationrequest" });
  });
});
