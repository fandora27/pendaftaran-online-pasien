import { PatientHeader } from '@/components/patient/header';
import { PatientFooter } from '@/components/patient/footer';

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <PatientHeader />
      <main className="flex-1">{children}</main>
      <PatientFooter />
    </div>
  );
}
