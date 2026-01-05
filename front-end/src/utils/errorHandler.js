export const handleApiError = (error) => {
  if (error instanceof Error) {
    if (error.status) {
      // API Error with status
      return error.message || 'An error occurred';
    }
    return error.message || 'An unexpected error occurred';
  }
  return 'An unexpected error occurred';
};

export const showError = (error, setError) => {
  const message = handleApiError(error);
  setError(message);
  setTimeout(() => setError(null), 5000);
};

