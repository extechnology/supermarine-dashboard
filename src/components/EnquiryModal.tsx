import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function EnquiryModal({
  open,
  setOpen,
  enquiries,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  enquiries: any[];
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl bg-card text-foreground">
        <DialogHeader>
          <DialogTitle>All Inquiries</DialogTitle>
        </DialogHeader>

        <div className="max-h-[400px] overflow-y-auto space-y-4">
          {enquiries.map((enquiry) => (
            <div
              key={enquiry.id}
              className="rounded-lg border border-border bg-muted/20 p-4"
            >
              <p className="font-semibold">{enquiry.title}</p>
              <p className="text-sm text-muted-foreground">
                {enquiry.date} at {enquiry.time}
              </p>
              <div className="mt-2 space-y-1 text-sm">
                <p>
                  <span className="font-medium">Name:</span> {enquiry.name}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {enquiry.email}
                </p>
                <p>
                  <span className="font-medium">Phone:</span> {enquiry.phone}
                </p>
                <p>
                  <span className="font-medium">Duration:</span>{" "}
                  {enquiry.duration} min
                </p>
                <p>
                  <span className="font-medium">Persons:</span>{" "}
                  {enquiry.number_of_persons}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}


export default EnquiryModal