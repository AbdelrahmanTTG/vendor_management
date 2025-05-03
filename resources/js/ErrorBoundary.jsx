import React, { Suspense } from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, isOnline: navigator.onLine };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Lazy load error caught by ErrorBoundary:", error);
  }

  componentDidMount() {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  handleOnline = () => {
    this.setState({ isOnline: true, hasError: false });
    window.location.reload();  
  };

  handleOffline = () => {
    this.setState({ isOnline: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>An error occurred while loading the page</h2>
          {!this.state.isOnline ? (
            <p>Check your Internet connection, then try again.</p>
          ) : (
            <p>Something went wrong, please try reloading.</p>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
