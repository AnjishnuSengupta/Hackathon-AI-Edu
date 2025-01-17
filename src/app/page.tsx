import Link from 'next/link'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to AI-Edu Platform</h1>
      <p className="mb-4">Accessible education powered by AI</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/resources?category=Math" className="p-4 bg-blue-100 rounded">Math</Link>
        <Link href="/resources?category=Science" className="p-4 bg-green-100 rounded">Science</Link>
        <Link href="/resources?category=Literature" className="p-4 bg-yellow-100 rounded">Literature</Link>
      </div>
    </main>
  )
}

