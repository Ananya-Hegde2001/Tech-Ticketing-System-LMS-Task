import { extendTheme, withDefaultColorScheme } from '@chakra-ui/react'

const theme = extendTheme(
  {
    config: {
      initialColorMode: 'system',
      useSystemColorMode: true,
    },
    colors: {
      brand: {
        50: '#e6fff7',
        100: '#c0f7e5',
        200: '#97efd2',
        300: '#6ee7bf',
        400: '#45dfac',
        500: '#2db695',
        600: '#1f8f74',
        700: '#156a56',
        800: '#0c4639',
        900: '#05241d',
      }
    },
    fonts: {
      heading: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
      body: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    },
    styles: {
      global: {
        'html, body, #root': { height: '100%' },
        body: { bg: 'gray.50', _dark: { bg: 'gray.900' } },
      }
    },
    components: {
      Button: {
        baseStyle: { borderRadius: '12px' },
        variants: {
          ghost: { color: 'gray.700', _dark: { color: 'gray.300' } },
        }
      },
      Card: {
        baseStyle: {
          container: { borderRadius: '16px', boxShadow: 'md', _dark: { boxShadow: 'none', borderColor: 'whiteAlpha.200', borderWidth: '1px' } }
        }
      },
      Input: { baseStyle: { field: { borderRadius: '12px' } } },
      Select: { baseStyle: { field: { borderRadius: '12px' } } },
      Textarea: { baseStyle: { borderRadius: '12px' } },
    }
  },
  withDefaultColorScheme({ colorScheme: 'teal' })
)

export default theme
