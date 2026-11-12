import { createBrowserRouter, Navigate } from 'react-router-dom'
import AppLayout from '@/components/app-layout'
import AboutPage from '@/pages/about'
import ButtonsPage from '@/pages/components/buttons'
import CardsPage from '@/pages/components/cards'
import FormsPage from '@/pages/components/forms'
import HomePage from '@/pages/home'
import NotFoundPage from '@/pages/not-found'
import SettingsPage from '@/pages/settings'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'a-propos', element: <AboutPage /> },
      { path: 'parametres', element: <SettingsPage /> },
      {
        path: 'composants',
        children: [
          { index: true, element: <Navigate to="/composants/boutons" replace /> },
          { path: 'boutons', element: <ButtonsPage /> },
          { path: 'cartes', element: <CardsPage /> },
          { path: 'formulaires', element: <FormsPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
