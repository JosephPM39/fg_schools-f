import { createContext } from "react"
import { useAlbum } from "../../../hooks/api/photo/useAlbum"
import { useGallery } from "../../../hooks/api/photo/useGallery"
import { useGalleryPerAlbum } from "../../../hooks/api/photo/useGalleryPerAlbum"
import { usePhotoPerProduct } from "../../../hooks/api/photo/usePhotoPerProduct"
import { useQr } from "../../../hooks/api/photo/useQr"

type Ct<T extends () => object> = ReturnType<T> | undefined

export const QrContext = createContext<Ct<typeof useQr>>(undefined)
export const GalleryContext = createContext<Ct<typeof useGallery>>(undefined)
export const AlbumContext = createContext<Ct<typeof useAlbum>>(undefined)
export const GalleryPerAlbumContext = createContext<Ct<typeof useGalleryPerAlbum>>(undefined)
export const PhotoPerProductContext = createContext<Ct<typeof usePhotoPerProduct>>(undefined)
