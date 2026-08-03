import { Heart, MapPin, Phone, Clock } from 'lucide-react';

export function PatientFooter() {
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Info Klinik */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-6 w-6" />
              <h3 className="text-lg font-bold">PMB Griya Bunda</h3>
            </div>
            <p className="text-sm opacity-80">
              Praktik Mandiri Bidan dengan layanan profesional dan terpercaya untuk kesehatan ibu dan anak.
            </p>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-lg font-bold mb-4">Kontak</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Jl. Letjend Panjaitan No.106 Krajan Satu, Gondanglegi Kulon, Kec. Gondanglegi, Kab. Malang</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span>085755554774</span>
              </div>
            </div>
          </div>

          {/* Jam Operasional */}
          <div>
            <h3 className="text-lg font-bold mb-4">Jam Operasional</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0" />
                <div>
                  <p>Senin - Minggu : 07.00 - 21.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-4 text-center text-sm opacity-80">
          <p>&copy; {new Date().getFullYear()} PMB Griya Bunda Gondanglegi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
