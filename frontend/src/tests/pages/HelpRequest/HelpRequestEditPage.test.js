import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import HelpRequestEditPage from "main/pages/HelpRequests/HelpRequestEditPage";

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
      id: 1,
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("HelpRequestEditPage tests", () => {
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
      axiosMock.onGet("/api/restaurants", { params: { id: 1 } }).timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but form is not present", async () => {
      const restoreConsole = mockConsole();

      // act
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Help Request");
      expect(
        screen.queryByTestId("HelpRequest-requesterEmail"),
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
      axiosMock.onGet("/api/helprequests", { params: { id: 1 } }).reply(200, {
        id: 1,
        requesterEmail: "riya@ucsb.edu",
        teamId: "s25-06",
        tableOrBreakoutRoom: "6",
        requestTime: "2025-05-01T00:30:57.000",
        explanation: "problem",
        solved: true,
      });
      axiosMock.onPut("/api/helprequests").reply(200, {
        id: 1,
        requesterEmail: "riyaNEWNEW@ucsb.edu",
        teamId: "s25-07",
        tableOrBreakoutRoom: "7",
        requestTime: "2026-05-01T00:30:57.000",
        explanation: "problem2",
        solved: false,
      });
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("HelpRequestForm-id");

      const idField = screen.getByTestId("HelpRequestForm-id");
      const requesterEmailField = screen.getByLabelText("Requester Email");
      const teamIdField = screen.getByLabelText("Team ID");
      const tableOrBreakoutRoomField = screen.getByLabelText(
        "Table Or Breakout Room",
      );
      const requestTimeField = screen.getByLabelText(
        "Request Time (iso format)",
      );
      const explanationField = screen.getByLabelText("Explanation");
      const solvedField = screen.getByLabelText("Solved?");
      const submitButton = screen.getByText("Update");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("1");
      expect(requesterEmailField).toBeInTheDocument();
      expect(requesterEmailField).toHaveValue("riya@ucsb.edu");
      expect(teamIdField).toBeInTheDocument();
      expect(teamIdField).toHaveValue("s25-06");
      expect(tableOrBreakoutRoomField).toBeInTheDocument();
      expect(tableOrBreakoutRoomField).toHaveValue("6");
      expect(requestTimeField).toBeInTheDocument();
      expect(requestTimeField).toHaveValue("2025-05-01T00:30:57.000");
      expect(explanationField).toBeInTheDocument();
      expect(explanationField).toHaveValue("problem");
      expect(solvedField).toBeInTheDocument();
      expect(solvedField).toBeChecked();

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(requesterEmailField, {
        target: { value: "riyaNEWNEW@ucsb.edu" },
      });
      fireEvent.change(teamIdField, {
        target: { value: "s25-07" },
      });
      fireEvent.change(tableOrBreakoutRoomField, {
        target: { value: "7" },
      });
      fireEvent.change(requestTimeField, {
        target: { value: "2026-05-01T00:30:57.000" },
      });
      fireEvent.change(explanationField, {
        target: { value: "problem2" },
      });
      fireEvent.click(solvedField);

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toHaveBeenCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "Help Request Updated - id: 1 requesterEmail: riyaNEWNEW@ucsb.edu",
      );

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/helprequests" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 1 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          requesterEmail: "riyaNEWNEW@ucsb.edu",
          teamId: "s25-07",
          tableOrBreakoutRoom: "7",
          requestTime: "2026-05-01T00:30:57.000",
          explanation: "problem2",
          solved: false,
        }),
      ); // posted object
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("HelpRequestForm-id");

      const idField = screen.getByTestId("HelpRequestForm-id");
      const requesterEmailField = screen.getByLabelText("Requester Email");
      const teamIdField = screen.getByLabelText("Team ID");
      const tableOrBreakoutRoomField = screen.getByLabelText(
        "Table Or Breakout Room",
      );
      const requestTimeField = screen.getByLabelText(
        "Request Time (iso format)",
      );
      const explanationField = screen.getByLabelText("Explanation");
      const solvedField = screen.getByLabelText("Solved?");
      const submitButton = screen.getByText("Update");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("1");
      expect(requesterEmailField).toBeInTheDocument();
      expect(requesterEmailField).toHaveValue("riya@ucsb.edu");
      expect(teamIdField).toBeInTheDocument();
      expect(teamIdField).toHaveValue("s25-06");
      expect(tableOrBreakoutRoomField).toBeInTheDocument();
      expect(tableOrBreakoutRoomField).toHaveValue("6");
      expect(requestTimeField).toBeInTheDocument();
      expect(requestTimeField).toHaveValue("2025-05-01T00:30:57.000");
      expect(explanationField).toBeInTheDocument();
      expect(explanationField).toHaveValue("problem");
      expect(solvedField).toBeInTheDocument();
      expect(solvedField).toBeChecked();

      fireEvent.change(requesterEmailField, {
        target: { value: "riyaNEWNEW@ucsb.edu" },
      });
      fireEvent.change(tableOrBreakoutRoomField, { target: { value: "7" } });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "Help Request Updated - id: 1 requesterEmail: riyaNEWNEW@ucsb.edu",
      );
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/helprequests" });
    });
  });
});
