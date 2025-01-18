import Link from 'next/link'

const categories = [
  {
    title: 'Math',
    description: 'Explore our math resources and enhance your knowledge.',
    href: '/resources?category=Math'
  },
  {
    title: 'Science',
    description: 'Explore our science resources and enhance your knowledge.',
    href: '/resources?category=Science'
  },
  {
    title: 'Literature',
    description: 'Explore our literature resources and enhance your knowledge.',
    href: '/resources?category=Literature'
  }
]

export default function Home() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
            Welcome to AI-Edu Platform
          </h1>
          <p className="text-xl text-gray-600">
            Accessible education powered by AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {category.title}
              </h2>
              <p className="text-gray-600">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

