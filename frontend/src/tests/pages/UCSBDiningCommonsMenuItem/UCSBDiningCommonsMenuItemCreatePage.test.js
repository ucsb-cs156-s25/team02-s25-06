import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UCSBDiningCommonsMenuItemCreatePage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
//import UCSBDiningCommonsMenuItemCreatePage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemCreatePage";
//import UCSBDiningCommonsMenuItemTable from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemTable";

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

describe("UCSBDiningCommonsMenuItemCreatePage tests", () => {
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
          <UCSBDiningCommonsMenuItemCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("name")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /ucsbdiningcommonsmenuitem", async () => {
    const queryClient = new QueryClient();
    const UCSBDiningCommonsMenuItem = {
      id: 8,
      diningCommonsCode: "ortega",
      name: "Baked Pesto Pasta with Chicken",
      station: "Entree Specials",
    };

    axiosMock
      .onPost("/api/ucsbdiningcommonsmenuitem/post")
      .reply(202, UCSBDiningCommonsMenuItem);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("diningCommonsCode")).toBeInTheDocument();
    });

    const diningcommonscodeInput = screen.getByLabelText("diningCommonsCode");
    expect(diningcommonscodeInput).toBeInTheDocument();

    const nameInput = screen.getByLabelText("name");
    expect(nameInput).toBeInTheDocument();

    const stationInput = screen.getByLabelText("station");
    expect(stationInput).toBeInTheDocument();

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();

    fireEvent.change(diningcommonscodeInput, { target: { value: "ortega" } });
    fireEvent.change(nameInput, {
      target: { value: "Baked Pesto Pasta with Chicken" },
    });
    fireEvent.change(stationInput, { target: { value: "Entree Specials" } });

    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      diningCommonsCode: "ortega",
      name: "Baked Pesto Pasta with Chicken",
      station: "Entree Specials",
    });

    // assert - check that the toast was called with the expected message
    expect(mockToast).toBeCalledWith(
      "New ucsbdiningcommonsmenuitem Created - id: 8 name: Baked Pesto Pasta with Chicken",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/ucsbdiningcommonsmenuitem" });
  });
});
