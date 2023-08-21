import { Button, Divider, Grid } from '@mui/material'
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import { ErrorCatched, InvalidDataError, promiseHandleError } from '../../../../../api/handlers/errors'
import { ImageList } from '../../../../ImageList'
import { Photo } from '@mui/icons-material'
import { CardBox } from './../CardBox'
import { Data as ProductsData, Products } from './product'
import { Payments, Data as PaymentsData } from './payments'
import { Student, Data as StudentData } from './student'
import { IComboOrder, IOrder, IPayment, IProductOrder, ISectionProm, IStudent } from '../../../../../api/models_school'
import { OrderType } from '../../../../../api/models_school/store/order.model'
import { v4 as uuidV4 } from 'uuid'
import { useStudent } from '../../../../../hooks/api/store/useStudent'
import { useOrder } from '../../../../../hooks/api/store/useOrder'
import { usePayment } from '../../../../../hooks/api/store/usePayment'
import { useProductPerOrder } from '../../../../../hooks/api/store/useProductPerOrder'
import { useComboPerOrder } from '../../../../../hooks/api/store/useComboPerOrder'

export interface FormParams {
  onSuccess?: () => void
  onFail?: (error: ErrorCatched) => void
  sectionPromId: NonNullable<ISectionProm['id']>
}

export const Photos = ({ onChange, photos }: { photos: File[], onChange: (e: ChangeEvent<HTMLInputElement>) => void }) => {
  const images = photos.map((photo) => ({
    imgUrl: URL.createObjectURL(photo),
    title: photo.name,
    imgName: photo.name
  }))
  return <CardBox title='Fotos' actions={<>
    <Button
      onClick={() => {
        document.getElementById('photos_chooser')?.click()
      }}
      endIcon={<Photo />}
    >
      Buscar
    </Button>
  </>}>
    <input
      hidden
      id='photos_chooser'
      accept="image/*"
      type="file"
      name="photos"
      multiple
      onChange={onChange}
    />
    <ImageList
      images={images}
      height={300}
    />
  </CardBox>
}

interface InputsParams {
  onChange: (d: InputsData) => void
}

interface InputsData {
  products: ProductsData
  student: StudentData
  payment: PaymentsData
}

export const Inputs = ({ onChange }: InputsParams) => {
  const [products, setProducts] = useState<ProductsData>()
  const [student, setStudent] = useState<StudentData>()
  const [payment, setPayment] = useState<PaymentsData>()

  useEffect(() => {
    if (!products || !student || !payment) return
    onChange({
      products,
      student,
      payment
    })
  }, [products, student, payment])

  return <>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12}>
        <Products onChange={(data) => setProducts(data)} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Student onChange={(data) => setStudent(data)} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Payments total={products?.total ?? 0} onChange={(data) => setPayment(data)} />
      </Grid>
    </Grid>
  </>
}

interface WithCustom {
  isCustom: true
  productsOrder: IProductOrder[]
}

interface WithoutCustom {
  isCustom: false
  comboOrder: IComboOrder
}

type FormData = {
  student: IStudent
  order: IOrder
  payment: IPayment
  products: WithCustom | WithoutCustom
}

export const Form = (params: FormParams) => {
  const {
    onSuccess = () => { },
    onFail = () => { },
    sectionPromId
  } = params

  const form = useRef<HTMLFormElement | null>(null)
  const [isSending, setSending] = useState(false)
  const [data, setData] = useState<FormData | undefined>()
  const [inputsData, setInputsData] = useState<InputsData | undefined>()
  const useStudents = useStudent({ initFetch: false })
  const useOrders = useOrder({ initFetch: false })
  const usePayments = usePayment({ initFetch: false })
  const useProductsOrder = useProductPerOrder({ initFetch: false })
  const useComboOrders = useComboPerOrder({ initFetch: false })

  useEffect(() => {
    if (!inputsData) return
    const student: IStudent = {
      id: uuidV4(),
      ...inputsData.student
    }
    const order: IOrder = {
      id: uuidV4(),
      studentId: student.id,
      sectionPromId,
      total: inputsData.payment.totalCount,
      remaining: inputsData.payment.totalCount - (inputsData.payment.payment.total ?? 0),
      details: inputsData.products.extraInfo || 'Ninguno',
      type: OrderType.SCHOOL
    }
    const getProducts = (): FormData['products'] => {
      const { isCustom } = inputsData.products
      if (isCustom) {
        const { list } = inputsData.products
        return {
          isCustom,
          productsOrder: list.map((item): IProductOrder => ({
            ...item,
            orderId: order.id,
            productId: item.productId,
            inOffer: item.inOffer,
            amount: item.amount
          }))
        }
      }
      return {
        isCustom,
        comboOrder: {
          orderId: order.id,
          comboId: inputsData.products.combo.id
        }
      }
    }
    const products = getProducts()
    const payment: IPayment = {
      orderId: order.id,
      ...inputsData.payment.payment
    }

    setData({
      student,
      order,
      products,
      payment
    })
  }, [inputsData])

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    void promiseHandleError((error) => {
      const e = error as InvalidDataError
      console.log(e, 'e')
      console.log(e.getErrors())
      return onFail(error)
    }, async () => {
      await validate()
      await submit()
      onSuccess()
    })
  }

  const validate = async () => {
    if (!data) return
    await useStudents.validate({ data: data.student })
    await useOrders.validate({ data: data.order })
    if (data.payment.total > 0) {
      await usePayments.validate({ data: data.payment })
    }
    if (data.products.isCustom) {
      await useProductsOrder.validate({ data: data.products.productsOrder })
    }
    if (!data.products.isCustom) {
      await useComboOrders.validate({ data: data.products.comboOrder })
    }
  }

  const submit = async () => {
    if (!data) return
    setSending(true)
    await useStudents.create(data.student)
    await useOrders.create(data.order)
    if (data.payment.total > 0) {
      await usePayments.create(data.payment)
    }
    if (data.products.isCustom) {
      await useProductsOrder.create(data.products.productsOrder)
    }
    if (!data.products.isCustom) {
      await useComboOrders.create(data.products.comboOrder)
    }
    setSending(false)
  }

  return (
    <form ref={form} onSubmit={onSubmit}>
      <Inputs
        onChange={(data) => setInputsData(data)}
      />
      <br />
      <Divider />
      <br />
      <Button type='submit' variant='contained' disabled={isSending}>
        {isSending ? 'Guardando...' : 'Guardar'}
      </Button>
    </form>
  )
}
