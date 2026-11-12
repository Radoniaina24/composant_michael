import { createBrowserRouter, Navigate } from 'react-router-dom'
import AppLayout from '@/components/app-layout'
import AboutPage from '@/pages/about'
import ButtonsPage from '@/pages/components/buttons'
import CardsPage from '@/pages/components/cards'
import CheckboxesPage from '@/pages/components/checkboxes'
import FormsPage from '@/pages/components/forms'
import HomePage from '@/pages/home'
import NotFoundPage from '@/pages/not-found'
import RadioGroupPage from '@/pages/components/radio-group'
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
          { path: 'boutons-radio', element: <RadioGroupPage /> },
          { path: 'cartes', element: <CardsPage /> },
          { path: 'cases-a-cocher', element: <CheckboxesPage /> },
          { path: 'formulaires', element: <FormsPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
