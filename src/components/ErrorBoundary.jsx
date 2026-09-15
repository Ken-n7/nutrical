import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-bg">
          <div className="card max-w-md w-full p-6 text-center space-y-3">
            <h1 className="text-lg font-bold m-0">Something went wrong</h1>
            <p className="text-sm text-muted m-0">
              An unexpected error occurred. Please reload the page to continue.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                this.setState({ error: null });
                window.location.reload();
              }}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}