import {
  onDeleteSuccess,
  cellToAxiosParamsDelete,
} from "main/utils/articleUtils";

jest.mock("react-toastify", () => ({
  __esModule: true,
  toast: (msg) => {
    global.__lastToast = msg;
  },
}));

describe("articleUtils", () => {
  describe("onDeleteSuccess", () => {
    test("logs to console and calls toast", () => {
      const originalLog = console.log;
      console.log = jest.fn();

      const message = "abc";
      onDeleteSuccess(message);

      expect(global.__lastToast).toBe(message);
      expect(console.log).toHaveBeenCalledWith(message);

      console.log = originalLog;
    });
  });

  describe("cellToAxiosParamsDelete", () => {
    test("returns correct params", () => {
      const cell = { row: { values: { id: 17 } } };

      const result = cellToAxiosParamsDelete(cell);

      expect(result).toEqual({
        url: "/api/articles",
        method: "DELETE",
        params: { id: 17 },
      });
    });
  });
});
