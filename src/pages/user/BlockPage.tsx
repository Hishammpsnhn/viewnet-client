
const BlockedPage = () => {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="bg-black rounded-lg shadow-lg max-w-md w-full p-6">
        {/* Icon Header */}
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              className="h-12 w-12 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Alert Box */}
        <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6 rounded">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 text-red-600 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h1 className="text-lg font-semibold text-red-800">
              Account Blocked
            </h1>
          </div>
          <p className="mt-2 text-sm text-red-700">
            For your security, access to this account has been temporarily suspended.
          </p>
        </div>

        {/* Main Content */}
        <div className="text-center mb-6">
          <p className="text-gray-600 mb-6">
            We noticed some unusual activity on your account. Please contact our support team for assistance in resolving this issue.
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <button 
              onClick={() => window.location.href = "/support"}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150 flex items-center justify-center space-x-2"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>Contact Support</span>
            </button>

            <button 
              onClick={() => window.location.href = "/"}
              className="w-full bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-150 flex items-center justify-center space-x-2"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>Return to Homepage</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-500">
            Reference ID: {Math.random().toString(36).substring(7).toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlockedPage;