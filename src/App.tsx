import {Principal} from './pages/Principal'
import {ReactNode, useContext} from 'react'

import {
  SchoolComponentProviders,
} from './context/api/schools/'
import { SessionContext, SessionProvider } from './context/SessionContext';
import { Unauthorized } from './pages/Unauthorized';
import { StorageFileProvider } from './context/files/StorageFilesContext';
import { ProductsProviders } from './context/api/products';
import { StoreProviders } from './context/api/store';

function App() {

  const Root = ({children}:{children: ReactNode}) => {
    const useSession = useContext(SessionContext)

    if (!useSession?.user.token) {
      return <Unauthorized/>
    }

    return <SchoolComponentProviders>
      <ProductsProviders>
        <StoreProviders>
          {children}
        </StoreProviders>
      </ProductsProviders>
    </SchoolComponentProviders>
  }

  return <SessionProvider>
    <Root>
      <StorageFileProvider>
        <Principal/>
      </StorageFileProvider>
    </Root>
  </SessionProvider>
}

export default App;
