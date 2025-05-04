import { useQuery } from 'react-query'
import axios from 'axios'
import { useState } from 'react'
import API_ROUTES from '../utils/apiRoutes'
import { Link } from 'react-router-dom'
import { Rings } from 'react-loader-spinner'

type UrlEntry = {
  short_code: string
  original_url: string
  created_at: string
  visit_count: number
}

const URLList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4200'

  const { data, isLoading, isError } = useQuery<UrlEntry[]>(
    'urlList',
    async () => {
      const res = await axios.get(API_ROUTES.LIST_URLS)
      return res.data
    }
  )

  const filteredData =
    searchTerm.length >= 3
      ? data?.filter((entry) =>
          entry.original_url.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : data

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Rings
          height={80}
          width={80}
          color="#2563eb"
          radius={6}
          visible={true}
          ariaLabel="rings-loading"
        />
      </div>
    )
  }
  if (isError) return <div className="text-red-600">Error fetching URLs</div>

  return (
    <div className="px-4 py-8">
      <div className="mb-6 text-left">
        <Link
          to="/"
          className="inline-block rounded border border-blue-600 bg-transparent px-4 py-2 text-blue-600 transition-colors hover:bg-blue-600 hover:text-white"
        >
          ← Back to URL Shortener
        </Link>
      </div>

      <h2 className="mb-6 text-center text-2xl font-bold">
        All Shortened URLs
      </h2>

      <div className="mb-6 text-left">
        <input
          type="text"
          placeholder="Search by long URL (min 3 chars)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-xl rounded border p-2 shadow-sm"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="w-2/5 p-3 text-left">Long URL</th>
              <th className="w-1/4 p-3 text-left">Short URL</th>
              <th className="w-1/5 p-3 text-left">Created At</th>
              <th className="w-1/5 p-3 text-center">Visits</th>
            </tr>
          </thead>
          <tbody>
            {filteredData?.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No results found.
                </td>
              </tr>
            ) : (
              filteredData?.map((entry) => (
                <tr
                  key={entry.short_code}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="break-words p-3 text-blue-600 underline">
                    <a
                      href={entry.original_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {entry.original_url}
                    </a>
                  </td>
                  <td className="p-3 text-blue-700 underline">
                    <a
                      href={`${backendUrl}/${entry.short_code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {`${backendUrl}/${entry.short_code}`}
                    </a>
                  </td>
                  <td className="p-3 text-gray-700">
                    {new Date(entry.created_at).toLocaleString()}
                  </td>
                  <td className="p-3 text-center font-semibold text-gray-800">
                    {entry.visit_count ?? 0}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default URLList
