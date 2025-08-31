import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MantineProvider, createTheme } from '@mantine/core';
import { useColorScheme, useLocalStorage } from '@mantine/hooks';
import { Notifications } from '@mantine/notifications';
import HomePage from './pages/HomePage';
import GroupViewPage from './pages/GroupViewPage';
import ErrorBoundary from './components/ErrorBoundary';

const theme = createTheme({
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  primaryColor: 'blue',
  defaultRadius: 'sm',
  colors: {
    // You can add custom colors here if needed
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    Paper: {
      defaultProps: {
        radius: 'md',
      },
    },
    Modal: {
      defaultProps: {
        radius: 'md',
      },
    },
  },
});

function App() {
  const systemColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useLocalStorage<'light' | 'dark' | 'auto'>({
    key: 'whos-free-color-scheme',
    defaultValue: 'auto',
  });

  const effectiveColorScheme = colorScheme === 'auto' ? systemColorScheme : colorScheme;

  const toggleColorScheme = () => {
    if (colorScheme === 'auto' || colorScheme === systemColorScheme) {
      setColorScheme(systemColorScheme === 'dark' ? 'light' : 'dark');
    } else {
      setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
    }
  };

  return (
    <MantineProvider theme={theme} forceColorScheme={effectiveColorScheme}>
      <Notifications position="top-right" />
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage toggleColorScheme={toggleColorScheme} colorScheme={effectiveColorScheme} />} />
            <Route path="/group/:id" element={<GroupViewPage toggleColorScheme={toggleColorScheme} colorScheme={effectiveColorScheme} />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </MantineProvider>
  );
}

export default App
