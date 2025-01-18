const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-600 mb-4">
          © 2023 AI-Powered Educational Platform. All rights reserved.
        </p>
        <nav className="flex justify-center space-x-6">
          <a href="/accessibility" className="text-gray-600 hover:text-blue-600 transition-colors">
            Accessibility
          </a>
          <a href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">
            Privacy Policy
          </a>
          <a href="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">
            Terms of Service
          </a>
        </nav>
      </div>
    </footer>
  )
}

export default Footer

