import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ArticleCreatePage from "main/pages/Article/ArticleCreatePage";
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

describe("ArticleCreatePage tests", () => {
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
          <ArticleCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /articles", async () => {
    const queryClient = new QueryClient();
    const article = {
      id: 1,
      title: "Team 02 Frontend Fixtures ",
      url: "https://www.youtube.com/watch?v=u-jJ-ZWFpeE",
      explanation: "This explains step 3 of team02. ",
      email: "sjilla@gmail.com",
      dateAdded: "2025-05-04T19:46:01",
    };

    axiosMock.onPost("/api/articles/post").reply(202, article);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticleCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });

    const titleInput = screen.getByLabelText("Title");
    expect(titleInput).toBeInTheDocument();

    const urlInput = screen.getByLabelText("URL");
    expect(urlInput).toBeInTheDocument();

    const emailInput = screen.getByLabelText("Email");
    expect(emailInput).toBeInTheDocument();

    const explanationInput = screen.getByLabelText("Explanation");
    expect(explanationInput).toBeInTheDocument();

    const dateAddedInput = screen.getByLabelText("Date Added");
    expect(dateAddedInput).toBeInTheDocument();

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();

    fireEvent.change(titleInput, {
      target: { value: "Team 02 Frontend Fixtures " },
    });
    fireEvent.change(urlInput, {
      target: { value: "https://www.youtube.com/watch?v=u-jJ-ZWFpeE" },
    });
    fireEvent.change(explanationInput, {
      target: { value: "This explains step 3 of team02. " },
    });
    fireEvent.change(emailInput, { target: { value: "sjilla@gmail.com" } });
    fireEvent.change(dateAddedInput, {
      target: { value: "2025-05-04T19:46:01" },
    });
    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      title: "Team 02 Frontend Fixtures ",
      url: "https://www.youtube.com/watch?v=u-jJ-ZWFpeE",
      explanation: "This explains step 3 of team02. ",
      email: "sjilla@gmail.com",
      dateAdded: "2025-05-04T19:46:01.000",
    });

    // assert - check that the toast was called with the expected message
    expect(mockToast).toHaveBeenCalledWith(
      "New Article Created - id: 1 title: Team 02 Frontend Fixtures ",
    );
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/article" });
  });
});
