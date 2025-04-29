import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import UCSBOrganizationsForm from "main/components/UCSBOrganizations/UCSBOrganizationsForm";
import { ucsbOrganizationsFixtures } from "fixtures/ucsbOrganizationsFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("UCSBOrganizationsForms tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = [
    "Org Code",
    "Org Translation Short",
    "Org Translation",
  ];
  const testId = "UCSBOrganizationsForm";

  test("renders correctly with no initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationsForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });
  });

  test("renders correctly when passing in initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationsForm
            initialContents={ucsbOrganizationsFixtures.oneUCSBOrganization}
          />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
    expect(screen.getByText(`Id`)).toBeInTheDocument();

    expect(screen.getByLabelText("Id")).toHaveValue(
      String(ucsbOrganizationsFixtures.oneUCSBOrganization.id),
    );
    expect(screen.getByLabelText("Org Code")).toHaveValue(
      ucsbOrganizationsFixtures.oneUCSBOrganization.orgCode,
    );
    expect(screen.getByLabelText("Org Translation Short")).toHaveValue(
      ucsbOrganizationsFixtures.oneUCSBOrganization.orgTranslationShort,
    );
    expect(screen.getByLabelText("Org Translation")).toHaveValue(
      ucsbOrganizationsFixtures.oneUCSBOrganization.orgTranslation,
    );
    if (ucsbOrganizationsFixtures.oneUCSBOrganization.inactive) {
      expect(screen.getByLabelText("Inactive")).toBeChecked();
    } else {
      expect(screen.getByLabelText("Inactive")).not.toBeChecked();
    }
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationsForm />
        </Router>
      </QueryClientProvider>,
    );
    expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
    const cancelButton = screen.getByTestId(`${testId}-cancel`);

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("that the correct validations are performed", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationsForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    const submitButton = screen.getByText(/Create/);
    fireEvent.click(submitButton);

    await screen.findByText(/Org Code is required/);
    expect(
      screen.getByText(/Org Translation Short is required/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Org Translation is required/)).toBeInTheDocument();

    const orgCode = screen.getByTestId(`${testId}-orgCode`);
    fireEvent.change(orgCode, { target: { value: "a".repeat(256) } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Max length 255 characters/)).toBeInTheDocument();
    });
  });
});
