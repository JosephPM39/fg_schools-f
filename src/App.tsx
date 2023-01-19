import {Principal} from './pages/Principal'
import {ReactNode, useContext} from 'react'

import { SessionContext, SessionProvider } from './context/SessionContext';
import { Unauthorized } from './pages/Unauthorized';
import { ApiProvider } from './context/ApiContext';

function App() {

  const Root = ({children}:{children: ReactNode}) => {
    const useSession = useContext(SessionContext)

    if (!useSession?.user.token) {
      return <Unauthorized/>
    }

    return <ApiProvider>
      {children}
    </ApiProvider>
  }

  return <SessionProvider>
    <Root>
      <Principal/>
    </Root>
  </SessionProvider>
}

export default App;
