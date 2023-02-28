import { IGallery, Gallery } from '../../../api/models_school'
import { useBase } from '../useBase'

export const useGallery = () => {
  const hook = useBase<IGallery>({
    path: 'photo/gallery',
    model: Gallery
  })

  return hook
}
