'use client'

import { GoogleOAuthProvider } from '@react-oauth/google'
import { MantineProvider, createTheme } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { ThemeProvider, createTheme as createMuiTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { AuthProvider } from '@/shared/context/auth.context'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/dropzone/styles.css'

const googleClientId = (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string) || ''

const mantineTheme = createTheme({
  primaryColor: 'blue',
  fontFamily: "'TildaSans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
})

const muiTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#5078DF',
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <ThemeProvider theme={muiTheme}>
          <MantineProvider theme={mantineTheme}>
            <CssBaseline />
            <Notifications position="top-right" />
            {children}
          </MantineProvider>
        </ThemeProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}


