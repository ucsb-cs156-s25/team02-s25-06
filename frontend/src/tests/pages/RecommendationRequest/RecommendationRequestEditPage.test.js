import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import RecommendationRequestEditPage from "main/pages/RecommendationRequest/RecommendationRequestEditPage";

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

describe("RecommendationRequestEditPage tests", () => {
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
      axiosMock
        .onGet("/api/recommendationrequest", { params: { id: 17 } })
        .timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but form is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit RecommendationRequest");
      expect(
        screen.queryByTestId("RecommendationRequest-requesterEmail"),
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
        .onGet("/api/recommendationrequest", { params: { id: 17 } })
        .reply(200, {
          id: 17,
          requesterEmail: "test_requester@test.com",
          professorEmail: "test_professor@test.com",
          explanation: "test explanation updated",
          dateRequested: "2020-01-01",
          dateNeeded: "2022-02-02",
          done: true,
        });
      axiosMock.onPut("/api/recommendationrequest").reply(200, {
        id: 17,
        requesterEmail: "test_requester_updated@test.com",
        professorEmail: "test_professor_updated@test.com",
        explanation: "test explanation updated*",
        dateRequested: "2000-01-01",
        dateNeeded: "2002-02-02",
        done: false,
      });
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("RecommendationRequestForm-id");

      const idField = screen.getByTestId("RecommendationRequestForm-id");
      const requesterEmailField = screen.getByTestId(
        "RecommendationRequestForm-requesterEmail",
      );
      const professorEmailField = screen.getByTestId(
        "RecommendationRequestForm-professorEmail",
      );
      const explanationField = screen.getByTestId(
        "RecommendationRequestForm-explanation",
      );
      const dateRequestedField = screen.getByTestId(
        "RecommendationRequestForm-dateRequested",
      );
      const dateNeededField = screen.getByTestId(
        "RecommendationRequestForm-dateNeeded",
      );
      const doneField = screen.getByTestId("RecommendationRequestForm-done");
      const submitButton = screen.getByTestId(
        "RecommendationRequestForm-submit",
      );

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");
      expect(requesterEmailField).toBeInTheDocument();
      expect(requesterEmailField).toHaveValue("test_requester@test.com");
      expect(professorEmailField).toBeInTheDocument();
      expect(professorEmailField).toHaveValue("test_professor@test.com");
      expect(explanationField).toBeInTheDocument();
      expect(explanationField).toHaveValue("test explanation updated");
      expect(dateRequestedField).toBeInTheDocument();
      expect(dateRequestedField).toHaveValue("2020-01-01");
      expect(dateNeededField).toBeInTheDocument();
      expect(dateNeededField).toHaveValue("2022-02-02");
      expect(doneField).toBeInTheDocument();
      expect(doneField).toBeChecked();

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(requesterEmailField, {
        target: { value: "test_requester_updated@test.com" },
      });
      fireEvent.change(professorEmailField, {
        target: { value: "test_professor_updated@test.com" },
      });
      fireEvent.change(explanationField, {
        target: { value: "test explanation updated*" },
      });
      fireEvent.change(dateRequestedField, {
        target: { value: "2000-01-01" },
      });
      fireEvent.change(dateNeededField, {
        target: { value: "2002-02-02" },
      });
      fireEvent.click(doneField); // toggles the checkbox

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "RecommendationRequest Updated - id: 17 requesterEmail: test_requester_updated@test.com",
      );

      expect(mockNavigate).toHaveBeenCalledWith({
        to: "/recommendationrequest",
      });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          requesterEmail: "test_requester_updated@test.com",
          professorEmail: "test_professor_updated@test.com",
          explanation: "test explanation updated*",
          dateRequested: "2000-01-01",
          dateNeeded: "2002-02-02",
          done: false,
        }),
      ); // posted object
      expect(mockNavigate).toHaveBeenCalledWith({
        to: "/recommendationrequest",
      });
    });

    // test("Changes when you click Update", async () => {
    //   render(
    //     <QueryClientProvider client={queryClient}>
    //       <MemoryRouter>
    //         <RecommendationRequestEditPage />
    //       </MemoryRouter>
    //     </QueryClientProvider>,
    //   );

    //   await screen.findByTestId("RecommendationRequestForm-id");

    //   const idField = screen.getByTestId("RecommendationRequestForm-id");
    //   const nameField = screen.getByTestId("RecommendationRequestForm-name");
    //   const descriptionField = screen.getByTestId("RecommendationRequestForm-description");
    //   const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

    //   expect(idField).toHaveValue("17");
    //   expect(nameField).toHaveValue("Freebirds");
    //   expect(descriptionField).toHaveValue("Burritos");
    //   expect(submitButton).toBeInTheDocument();

    //   fireEvent.change(nameField, {
    //     target: { value: "Freebirds World Burrito" },
    //   });
    //   fireEvent.change(descriptionField, { target: { value: "Big Burritos" } });

    //   fireEvent.click(submitButton);

    //   await waitFor(() => expect(mockToast).toBeCalled());
    //   expect(mockToast).toHaveBeenCalledWith(
    //     "RecommendationRequest Updated - id: 17 name: Freebirds World Burrito",
    //   );
    //   expect(mockNavigate).toHaveBeenCalledWith({ to: "/recommendationrequest" });
    // });
  });
});
