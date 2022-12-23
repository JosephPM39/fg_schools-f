import React from 'react';
import './App.css';
import { ApiContext } from './context/ApiContext';
import { SessionContext } from './context/SessionContext';
import { useApi } from './hooks/useApi';
import { useAuth } from './hooks/useAuth';
import {Principal} from './pages/Principal'
import {Unauthorized} from './pages/Unauthorized'

function App() {

  const session = useAuth()
  const api = useApi()

  if (!session.user.token) return <Unauthorized/>

  console.log('token', session.user.token)

  return (<>
    <SessionContext.Provider value={session}>
      <ApiContext.Provider value={api}>
        <Principal/>
      </ApiContext.Provider>
    </SessionContext.Provider>
  </>)
}

export default App;
