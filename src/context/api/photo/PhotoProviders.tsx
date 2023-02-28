import { ReactNode } from "react";
import { useAlbum } from "../../../hooks/api/photo/useAlbum";
import { useGallery } from "../../../hooks/api/photo/useGallery";
import { useGalleryPerAlbum } from "../../../hooks/api/photo/useGalleryPerAlbum";
import { usePhotoPerProduct } from "../../../hooks/api/photo/usePhotoPerProduct";
import { useQr } from "../../../hooks/api/photo/useQr";
import { Provider } from "../../ContextHelper";
import {
  AlbumContext,
  GalleryContext,
  GalleryPerAlbumContext,
  PhotoPerProductContext,
  QrContext
} from "./PhotoContext";

export const QrProvider = ({children}: {children: ReactNode}) => Provider({
  hook: useQr(),
  context: QrContext,
  children
})

export const GalleryProvider = ({children}: {children: ReactNode}) => Provider({
  hook: useGallery(),
  context: GalleryContext,
  children
})

export const AlbumProvider = ({children}: {children: ReactNode}) => Provider({
  hook: useAlbum(),
  context: AlbumContext,
  children
})

export const GalleryPerAlbumProvider = ({children}: {children: ReactNode}) => Provider({
  hook: useGalleryPerAlbum(),
  context: GalleryPerAlbumContext,
  children
})

export const PhotoPerProductProvider = ({children}: {children: ReactNode}) => Provider({
  hook: usePhotoPerProduct(),
  context: PhotoPerProductContext,
  children
})
