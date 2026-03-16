import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import NewClaim from './pages/NewClaim'
import EditClaim from './pages/EditClaim'

function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="bg-gradient-to-l from-blue-950 to-blue-900 text-white shadow-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4">
            <img src="/logo.jpg" alt="שאגת הארי" className="h-12 rounded-lg bg-white p-1" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">מערכת תביעות נזקי מלחמה</h1>
              <p className="text-blue-300 text-xs">מדינת ישראל — רשות המיסים</p>
            </div>
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === '/' ? 'bg-white/15 text-white' : 'text-blue-200 hover:text-white hover:bg-white/10'}`}
            >
              לוח בקרה
            </Link>
            <Link
              to="/new"
              className="bg-white text-blue-900 px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-50 transition-all shadow-lg shadow-black/10"
            >
              + תביעה חדשה
            </Link>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new" element={<NewClaim />} />
          <Route path="/edit/:id" element={<EditClaim />} />
        </Routes>
      </main>
      <footer className="text-center py-4 text-xs text-slate-400 border-t border-slate-200">
        פיתוח בעת מלחמה — הדגמת MongoDB Atlas
      </footer>
    </div>
  )
}

export default App
