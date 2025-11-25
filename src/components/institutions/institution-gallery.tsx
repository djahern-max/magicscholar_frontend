// src/components/institutions/institution-gallery.tsx
'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { EntityImage } from '@/types/gallery';

interface InstitutionGalleryProps {
    images: EntityImage[];
    institutionName: string;
}

export default function InstitutionGallery({ images, institutionName }: InstitutionGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    if (!images || images.length === 0) {
        return null;
    }

    const openLightbox = (index: number) => {
        setSelectedIndex(index);
    };

    const closeLightbox = () => {
        setSelectedIndex(null);
    };

    const goToPrevious = () => {
        if (selectedIndex !== null && selectedIndex > 0) {
            setSelectedIndex(selectedIndex - 1);
        }
    };

    const goToNext = () => {
        if (selectedIndex !== null && selectedIndex < images.length - 1) {
            setSelectedIndex(selectedIndex + 1);
        }
    };

    return (
        <>
            {/* Gallery Grid */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Campus Gallery</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                        <button
                            key={image.id}
                            onClick={() => openLightbox(index)}
                            className="relative group overflow-hidden rounded-lg aspect-video bg-gray-100 hover:scale-105 transition-transform duration-200"
                        >
                            <img
                                src={image.cdn_url}
                                alt={image.caption || `${institutionName} campus photo ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            {image.caption && (
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                                    <p className="text-white text-sm font-medium">{image.caption}</p>
                                </div>
                            )}
                            {image.is_featured && (
                                <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-semibold">
                                    Featured
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Lightbox Modal */}
            {selectedIndex !== null && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                    {/* Close Button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    {/* Previous Button */}
                    {selectedIndex > 0 && (
                        <button
                            onClick={goToPrevious}
                            className="absolute left-4 text-white hover:text-gray-300 transition-colors"
                        >
                            <ChevronLeft className="w-12 h-12" />
                        </button>
                    )}

                    {/* Image */}
                    <div className="max-w-5xl max-h-[90vh] w-full">
                        <img
                            src={images[selectedIndex].cdn_url}
                            alt={images[selectedIndex].caption || `${institutionName} campus photo`}
                            className="w-full h-full object-contain"
                        />
                        {images[selectedIndex].caption && (
                            <div className="text-center mt-4">
                                <p className="text-white text-lg font-medium">
                                    {images[selectedIndex].caption}
                                </p>
                                {images[selectedIndex].image_type && (
                                    <p className="text-gray-400 text-sm mt-1 capitalize">
                                        {images[selectedIndex].image_type.replace('_', ' ')}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Next Button */}
                    {selectedIndex < images.length - 1 && (
                        <button
                            onClick={goToNext}
                            className="absolute right-4 text-white hover:text-gray-300 transition-colors"
                        >
                            <ChevronRight className="w-12 h-12" />
                        </button>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
                        {selectedIndex + 1} / {images.length}
                    </div>
                </div>
            )}
        </>
    );
}
