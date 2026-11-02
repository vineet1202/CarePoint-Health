import { Badge } from "@/components/ui/badge";

interface Props {
  status: string;
}

export function AppointmentStatusBadge({ status }: Props) {
  switch (status) {
    case "BOOKED":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          Booked
        </Badge>
      );

    case "CANCELLED":
      return <Badge variant="destructive">Cancelled</Badge>;

    case "COMPLETED":
      return <Badge variant="secondary">Completed</Badge>;

    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
