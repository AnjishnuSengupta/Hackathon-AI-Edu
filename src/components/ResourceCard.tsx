import Link from 'next/link'

interface Resource {
  id: string;
  title: string;
  category: string;
  type: string;
}

const ResourceCard = ({ resource }: { resource: Resource }) => {
  return (
    <Link href={`/resources/${resource.id}`} className="block p-4 border rounded shadow hover:shadow-md transition">
      <h2 className="text-xl font-semibold mb-2">{resource.title}</h2>
      <p className="text-gray-600 mb-2">{resource.category}</p>
      <p className="text-sm text-gray-500">{resource.type}</p>
    </Link>
  )
}

export default ResourceCard

