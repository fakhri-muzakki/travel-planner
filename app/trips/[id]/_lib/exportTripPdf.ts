import type { Trip } from "@/types";
import type { DocumentProps } from "@react-pdf/renderer";

export async function exportTripPdf(trip: Trip) {
  const React = await import("react");
  const { pdf } = await import("@react-pdf/renderer");
  const { default: TripPdfDocument } =
    await import("../components/TripPdfDocument");

  // Fix: cast ke React.ReactElement untuk satisfy type pdf()
  const element = React.createElement(TripPdfDocument, {
    trip,
  }) as React.ReactElement<DocumentProps>;

  const blob = await pdf(element).toBlob();

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${trip.destination
    .toLowerCase()
    .replace(/\s+/g, "-")}-trip.pdf`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}
