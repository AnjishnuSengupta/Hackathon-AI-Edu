const Footer = () => {
    return (
      <footer className="bg-gray-100 py-4">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 AI-Powered Educational Platform. All rights reserved.</p>
          <nav className="mt-2">
            <ul className="flex justify-center space-x-4">
              <li><a href="/accessibility" className="hover:underline">Accessibility</a></li>
              <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:underline">Terms of Service</a></li>
            </ul>
          </nav>
        </div>
      </footer>
    )
  }
  
  export default Footer
  
  