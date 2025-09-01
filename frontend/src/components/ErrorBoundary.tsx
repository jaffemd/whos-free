import { Component, type ReactNode } from 'react';
import { Container, Alert, Button, Stack } from '@mantine/core';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container size="sm" mt="xl">
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Something went wrong"
            color="red"
            variant="light"
          >
            <Stack gap="sm">
              <div>
                The application encountered an unexpected error. Please try refreshing the page.
              </div>
              <Button
                variant="light"
                leftSection={<IconRefresh size="1rem" />}
                onClick={() => window.location.reload()}
                size="sm"
              >
                Refresh Page
              </Button>
            </Stack>
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;