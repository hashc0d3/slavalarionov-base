'use client'

import { MantineProvider, createTheme } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { ThemeProvider, createTheme as createMuiTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/dropzone/styles.css'

const mantineTheme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'Inter, sans-serif',
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
    <ThemeProvider theme={muiTheme}>
      <MantineProvider theme={mantineTheme}>
        <CssBaseline />
        <Notifications position="top-right" />
        {children}
      </MantineProvider>
    </ThemeProvider>
  )
}


