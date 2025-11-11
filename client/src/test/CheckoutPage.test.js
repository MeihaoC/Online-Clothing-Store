// Unit Tests for Checkout Page (using Jest)

import CheckoutPage from "../pages/CheckoutPage";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ rates: { USD: 0.8, CAD: 1 } })
  })
);

describe("Checkout Page", () => {
  test("fetches exchange rate and converts total correctly", async () => {
    render(
      <BrowserRouter>
        <CheckoutPage />
      </BrowserRouter>
    );

    const currencySelect = screen.getByLabelText("Currency:");
    fireEvent.change(currencySelect, { target: { value: "USD" } });

    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("api.exchangeratesapi.io"));

    const convertedTotal = await screen.findByText(/Total: USD/);
    expect(convertedTotal).toBeInTheDocument();
  });

  test("displays shipping form and allows input", () => {
    render(
      <BrowserRouter>
        <CheckoutPage />
      </BrowserRouter>
    );

    const nameInput = screen.getByLabelText("Username:");
    const addressInput = screen.getByLabelText("Street Address:");

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(addressInput, { target: { value: "123 Main St" } });

    expect(nameInput.value).toBe("John Doe");
    expect(addressInput.value).toBe("123 Main St");
  });
});

