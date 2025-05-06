import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import ArticleEditPage from "main/pages/Article/ArticleEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";
import { articleFixtures } from "fixtures/articleFixtures";

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
      id: 1,
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("ArticleEditPage tests", () => {
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
      axiosMock.onGet("/api/articles", { params: { id: 1 } }).timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticleEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Article");
      expect(screen.queryByTestId("Article-title")).not.toBeInTheDocument();
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
      axiosMock.onGet("/api/articles", { params: { id: 1 } }).reply(200, {
        id: 1,
        title: "Team 02 Frontend Fixtures ",
        url: "https://www.youtube.com/watch?v=u-jJ-ZWFpeE",
        explanation: "This explains step 3 of team02. ",
        email: "sjilla@gmail.com",
        dateAdded: "2025-05-04T19:46:01",
      });
      axiosMock.onPut("/api/articles").reply(200, {
        id: 1,
        title: "Team 02 Frontend Fixtures 2 ",
        url: "https://www.youtube.com/watch?v=u-jJ-ZWFpeE/new",
        explanation: "This explains step 3 of team02.  2",
        email: "sjilla913@gmail.com",
        dateAdded: "2025-05-04T19:46:01",
      });
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticleEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("ArticleForm-id");

      const idField = screen.getByTestId("ArticleForm-id");
      const titleField = screen.getByTestId("ArticleForm-title");
      const urlField = screen.getByTestId("ArticleForm-url");
      const explanationField = screen.getByTestId("ArticleForm-explanation");
      const emailField = screen.getByTestId("ArticleForm-email");
      const dateAddedField = screen.getByTestId("ArticleForm-dateAdded");
      const submitButton = screen.getByTestId("ArticleForm-submit");

      expect(idField).toBeInTheDocument();
      expect(titleField).toBeInTheDocument();
      expect(urlField).toBeInTheDocument();
      expect(explanationField).toBeInTheDocument();
      expect(emailField).toBeInTheDocument();
      expect(dateAddedField).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();

      expect(idField).toHaveValue("1");
      expect(titleField).toHaveValue(articleFixtures.oneArticle.title);
      expect(urlField).toHaveValue(articleFixtures.oneArticle.url);
      expect(explanationField).toHaveValue(
        articleFixtures.oneArticle.explanation,
      );
      expect(emailField).toHaveValue(articleFixtures.oneArticle.email);
      // expect(dateAddedField).toHaveValue("2025-05-04T19:46:01");
      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(titleField, {
        target: { value: "Team 02 Frontend Fixtures 2 " },
      });
      fireEvent.change(urlField, {
        target: { value: "https://www.youtube.com/watch?v=u-jJ-ZWFpeE/new" },
      });
      fireEvent.change(emailField, {
        target: { value: "sjilla913@gmail.com" },
      });
      fireEvent.change(explanationField, {
        target: { value: "This explains step 3 of team02.  2" },
      });
      fireEvent.change(dateAddedField, {
        target: { value: "2025-05-04T19:46:01" },
      });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "Article Updated - id: 1 title: Team 02 Frontend Fixtures 2 ",
      );

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/articles" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 1 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          title: "Team 02 Frontend Fixtures 2 ",
          url: "https://www.youtube.com/watch?v=u-jJ-ZWFpeE/new",
          explanation: "This explains step 3 of team02.  2",
          email: "sjilla913@gmail.com",
          dateAdded: "2025-05-04T19:46:01",
        }),
      ); // posted object
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticleEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("ArticleForm-id");

      const idField = screen.getByTestId("ArticleForm-id");
      const titleField = screen.getByTestId("ArticleForm-title");
      const urlField = screen.getByTestId("ArticleForm-url");
      const explanationField = screen.getByTestId("ArticleForm-explanation");
      const emailField = screen.getByTestId("ArticleForm-email");
      const dateAddedField = screen.getByTestId("ArticleForm-dateAdded");
      const submitButton = screen.getByTestId("ArticleForm-submit");

      expect(idField).toBeInTheDocument();
      expect(titleField).toBeInTheDocument();
      expect(urlField).toBeInTheDocument();
      expect(explanationField).toBeInTheDocument();
      expect(emailField).toBeInTheDocument();
      expect(dateAddedField).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();

      expect(idField).toHaveValue("1");
      expect(titleField).toHaveValue(articleFixtures.oneArticle.title);
      expect(urlField).toHaveValue(articleFixtures.oneArticle.url);
      expect(explanationField).toHaveValue(
        articleFixtures.oneArticle.explanation,
      );
      expect(emailField).toHaveValue(articleFixtures.oneArticle.email);
      // expect(dateAddedField).toHaveValue("2025-05-04T19:46:01");
      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(titleField, {
        target: { value: "Team 02 Frontend Fixtures 2 " },
      });
      fireEvent.change(urlField, {
        target: { value: "https://www.youtube.com/watch?v=u-jJ-ZWFpeE/new" },
      });
      fireEvent.change(emailField, {
        target: { value: "sjilla913@gmail.com" },
      });
      fireEvent.change(explanationField, {
        target: { value: "This explains step 3 of team02.  2" },
      });
      fireEvent.change(dateAddedField, {
        target: { value: "2025-05-04T19:46:01" },
      });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "Article Updated - id: 1 title: Team 02 Frontend Fixtures 2 ",
      );
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/articles" });
    });
  });
});
