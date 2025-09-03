
import { Routes, Route, NavLink } from 'react-router-dom'
import DashboardPage from './modules/dashboard/DashboardPage'
import CockpitPage from './modules/cockpit/CockpitPage'
import { useTranslation } from 'react-i18next'

export default function App() {
  const { t, i18n } = useTranslation()
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow px-4 py-3 flex gap-4 items-center">
        <span className="font-bold text-lg">Porto Climate</span>
        <NavLink to="/dashboard" className={({isActive}) => (isActive ? 'text-blue-600' : 'text-gray-700')}>{t('dashboard')}</NavLink>
        <NavLink to="/cockpit" className={({isActive}) => (isActive ? 'text-blue-600' : 'text-gray-700')}>{t('cockpit')}</NavLink>
        <div className="ml-auto flex items-center gap-2">
          <button className="px-2 py-1 rounded border" onClick={() => i18n.changeLanguage('en')}>EN</button>
          <button className="px-2 py-1 rounded border" onClick={() => i18n.changeLanguage('pt')}>PT</button>
        </div>
      </nav>
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/cockpit" element={<CockpitPage />} />
        </Routes>
      </main>
    </div>
  )
}
