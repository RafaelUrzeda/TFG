import { getSeatMap } from "../../src/externals/seatMap.external";
import { getSeatMapService } from "../../src/service/seatMap.service";

jest.mock("../../src/externals/seatMap.external", () => ({
    getSeatMap: jest.fn()
}));

describe("getSeatMapService", () => {
    const mockFlight = { flightNumber: 123, date: 20250204, departure: "JFK", arrival: "LAX", departureDate: "2025-02-04", selectSeat: false };
    const mockToken = "mocked-token";

    it("should return seat map when API call is successful", async () => {
        const mockResponse = { seats: [{ seat: "1A", available: true }] };
        (getSeatMap as jest.Mock).mockResolvedValue(mockResponse);

        const result = await getSeatMapService(mockFlight, mockToken);
        
        expect(getSeatMap).toHaveBeenCalledWith(undefined, mockToken, mockFlight);
        expect(result).toEqual(mockResponse);
    });

    it("should throw an error when API call fails", async () => {
        (getSeatMap as jest.Mock).mockRejectedValue(new Error("API Error"));

        await expect(getSeatMapService(mockFlight, mockToken)).rejects.toThrow("API Error");
    });
});
