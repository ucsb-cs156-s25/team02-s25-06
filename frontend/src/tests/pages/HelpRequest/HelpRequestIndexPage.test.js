import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import HelpRequestIndexPage from "main/pages/HelpRequests/HelpRequestIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";

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

describe("HelpRequestIndexPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  const testId = "HelpRequestTable";

  const setupUserOnly = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  const setupAdminUser = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.adminUser);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  const queryClient = new QueryClient();

  test("Renders with Create Button for admin user", async () => {
    setupAdminUser();
    axiosMock.onGet("/api/helprequests/all").reply(200, []);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Create Help Request/)).toBeInTheDocument();
    });
    const button = screen.getByText(/Create Help Request/);
    expect(button).toHaveAttribute("href", "/helprequests/create");
    expect(button).toHaveAttribute("style", "float: right;");
  });

  test("renders three help requests correctly for regular user", async () => {
    setupUserOnly();
    axiosMock
      .onGet("/api/helprequests/all")
      .reply(200, helpRequestFixtures.threeHelpRequests);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-id`),
      ).toHaveTextContent("1");
    });
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      "2",
    );
    expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent(
      "3",
    );

    const createButton = screen.queryByText("Create Help Request");
    expect(createButton).not.toBeInTheDocument();

    const requesterEmailInput = screen.getByText("Requester Email");
    expect(requesterEmailInput).toBeInTheDocument();

    const teamIdInput = screen.getByText("Team Id");
    expect(teamIdInput).toBeInTheDocument();

    const tableOrBreakoutRoomInput = screen.getByText("Table Or Breakout Room");
    expect(tableOrBreakoutRoomInput).toBeInTheDocument();

    const requestTimeInput = screen.getByText("Request Time (iso format)");
    expect(requestTimeInput).toBeInTheDocument();

    const explanationInput = screen.getByText("Explanation");
    expect(explanationInput).toBeInTheDocument();

    const solvedInput = screen.getByText("Solved?");
    expect(solvedInput).toBeInTheDocument();

    // for non-admin users, details button is visible, but the edit and delete buttons should not be visible
    expect(
      screen.queryByTestId("HelpRequestTable-cell-row-0-col-Delete-button"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("HelpRequestTable-cell-row-0-col-Edit-button"),
    ).not.toBeInTheDocument();
  });

  test("renders empty table when backend unavailable, user only", async () => {
    setupUserOnly();

    axiosMock.onGet("/api/helprequests/all").timeout();

    const restoreConsole = mockConsole();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
    });

    const errorMessage = console.error.mock.calls[0][0];
    expect(errorMessage).toMatch(
      "Error communicating with backend via GET on /api/helprequests/all",
    );
    restoreConsole();
  });

  test("what happens when you click delete, admin", async () => {
    setupAdminUser();

    axiosMock
      .onGet("/api/helprequests/all")
      .reply(200, helpRequestFixtures.threeHelpRequests);
    axiosMock
      .onDelete("/api/helprequests")
      .reply(200, "Help Request with id 1 was deleted");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-id`),
      ).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "1",
    );

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        "Help Request with id 1 was deleted",
      );
    });

    await waitFor(() => {
      expect(axiosMock.history.delete.length).toBe(1);
    });
    expect(axiosMock.history.delete[0].url).toBe("/api/helprequests");
    expect(axiosMock.history.delete[0].url).toBe("/api/helprequests");
    expect(axiosMock.history.delete[0].params).toEqual({ id: 1 });
  });
});
