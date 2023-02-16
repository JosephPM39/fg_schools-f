import { Tabs } from "../../containers/Tabs";
import { TableModel } from "./TableModel";

export const ProductsTabs = () => {

  const data = [
    {
      label: 'Productos',
      content: <>Put here Products Table</>
    },
    {
      label: 'Modelos',
      content: <TableModel/>
    },
    {
      label: 'Tipos',
      content: <>Put here Types Table</>
    },
    {
      label: 'Tamaños',
      content: <>Put here Sizes Table</>
    },
    {
      label: 'Colores',
      content: <>Put here Colors Table</>
    },
    {
      label: 'Bordes',
      content: <>Put here Borders Table</>
    }
  ]

  return (
    <Tabs data={data} height='75vh' orientation='vertical' contentPadding={1} idPrefix="settings" />
  );
}
