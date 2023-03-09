import { ReactNode } from 'react'
import {
  AlbumProvider,
  GalleryPerAlbumProvider,
  GalleryProvider,
  PhotoPerProductProvider,
  QrProvider
} from './PhotoProviders'

export {
  AlbumProvider,
  GalleryPerAlbumProvider,
  GalleryProvider,
  PhotoPerProductProvider,
  QrProvider
} from './PhotoProviders'

export {
  AlbumContext,
  GalleryPerAlbumContext,
  GalleryContext,
  PhotoPerProductContext,
  QrContext
} from './PhotoContext'

export const PhotoProviders = ({ children }: { children: ReactNode }) => {
  return <QrProvider>
    <GalleryProvider>
      <AlbumProvider>
        <GalleryPerAlbumProvider>
          <PhotoPerProductProvider>
            {children}
          </PhotoPerProductProvider>
        </GalleryPerAlbumProvider>
      </AlbumProvider>
    </GalleryProvider>
  </QrProvider>
}
