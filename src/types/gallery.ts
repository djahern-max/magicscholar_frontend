// src/types/gallery.ts
export interface EntityImage {
    id: number;
    entity_type: string;
    entity_id: number;
    image_url: string;
    cdn_url: string;
    filename: string;
    caption: string | null;
    display_order: number;
    is_featured: boolean;
    image_type: string | null;
    created_at: string;
    updated_at: string | null;
}

export interface GalleryData {
    images: EntityImage[];
    featuredImage: EntityImage | null;
}
