import React from 'react'
import {
  QueryClient,
  QueryClientConfig,
  QueryClientProvider,
} from 'react-query'
import { ThemeProvider } from '../../theme/useTheme'
import { ThemeOptions } from '@mui/material'
import { SynapseContextProvider, SynapseContextType } from './SynapseContext'

export const defaultQueryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min
      cacheTime: 1000 * 60 * 30, // 30 min
      retry: false, // SynapseClient knows which queries to retry
      refetchOnWindowFocus: false,
    },
  },
}

const defaultQueryClient = new QueryClient(defaultQueryClientConfig)

export type FullContextProviderProps = React.PropsWithChildren<{
  synapseContext: Partial<SynapseContextType>
  queryClient?: QueryClient
  theme?: ThemeOptions
}>

/**
 * Provides all context necessary for components in SRC.
 * Contexts include
 * - SynapseContext
 * - QueryClientContext (react-query)
 * - ThemeContext (@mui)
 */
export function FullContextProvider(props: FullContextProviderProps) {
  const { children, synapseContext, queryClient, theme } = props

  return (
    <QueryClientProvider client={queryClient ?? defaultQueryClient}>
      <ThemeProvider theme={theme}>
        <SynapseContextProvider synapseContext={synapseContext}>
          {children}
        </SynapseContextProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default FullContextProvider
