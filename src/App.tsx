import {Principal} from './pages/Principal'

import {
  SchoolComponentProviders,
} from './context/api/schools/'
import { SessionProvider } from './context/SessionContext';

function App() {
  return (<>
    <SessionProvider>
      <SchoolComponentProviders>
        <Principal/>
      </SchoolComponentProviders>
    </SessionProvider>
  </>)
}

export default App;
