import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'

import URLForm from './URLForm'
import URLList from './URLList'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 px-4 py-8">
          <div className="mx-auto mt-20 w-full max-w-7xl rounded-2xl bg-white p-8 shadow-lg">
            <Routes>
              <Route path="/" element={<URLForm />} />
              <Route path="/list" element={<URLList />} />
            </Routes>
          </div>
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App
