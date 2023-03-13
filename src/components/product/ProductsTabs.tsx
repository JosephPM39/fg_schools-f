import { Tabs } from '../../containers/Tabs'
import { TableBorder } from './tables/TableBorder'
import { TableColor } from './tables/TableColor'
import { TableModel } from './tables/TableModel'
import { TableProduct } from './tables/TableProduct'
import { TableSize } from './tables/TableSize'
import { TableType } from './tables/TableType'

export const ProductsTabs = () => {
  const data = [
    {
      label: 'Productos',
      content: <TableProduct/>
    },
    {
      label: 'Modelos',
      content: <TableModel/>
    },
    {
      label: 'Tipos',
      content: <TableType/>
    },
    {
      label: 'Tamaños',
      content: <TableSize/>
    },
    {
      label: 'Colores',
      content: <TableColor/>
    },
    {
      label: 'Bordes',
      content: <TableBorder/>
    }
  ]

  return (
    <Tabs data={data} height='75vh' orientation='vertical' contentPadding={1} idPrefix="settings" />
  )
}
