import React from "react";
import Card3D from "@/components/ui/Card3D";
import MetricsCard from "@/components/dashboard/MetricsCard";

export default function PhotosPage() {
  // sample placeholder gallery entries
  const images = [
    "/images/photo.jpg",
    "/images/photo.jpg",
    "/images/photo.jpg",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricsCard title="Photos total" value="4 120" icon="Camera" />
        <MetricsCard title="Véhicules photographiés" value="1 020" icon="Image" />
        <MetricsCard title="Albums" value="320" icon="Layers" />
      </div>

      <div className="mt-8">
        <Card3D>
          <h3 className="text-lg font-semibold mb-4">Galerie récente</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((src, i) => (
              <div key={i} className="rounded-xl overflow-hidden bg-gray-50">
                <img src={src} alt={`photo-${i}`} className="w-full h-36 object-cover" />
              </div>
            ))}
          </div>
        </Card3D>
      </div>
    </div>
  );
}
