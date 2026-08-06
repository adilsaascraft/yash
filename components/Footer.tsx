
type FooterProps = {
  companyName?: string;
  organization?: string;
};

export default function Footer({
  companyName = "Scanning Software",
  organization = "SaaScraft Studio India Pvt. Ltd.",
}: FooterProps) {
  return (
    <footer className="w-full border-t bg-background py-4">
      <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 text-center text-sm text-muted-foreground md:flex-row">
        <p>
          © {new Date().getFullYear()} {companyName}. All rights reserved.
        </p>
        <p>{organization}</p>
      </div>
    </footer>
  );
}
