import { useState } from 'react'
import { useMutation } from 'react-query'
import axios from 'axios'
import API_ROUTES from 'utils/apiRoutes'
import { Link } from 'react-router-dom'

const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const URLForm = () => {
  const [longUrl, setLongUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const { mutate, isLoading } = useMutation(
    async (original_url: string) => {
      const response = await axios.post(API_ROUTES.ENCODE_URL, { original_url })
      return response.data
    },
    {
      onSuccess: (data) => {
        setShortUrl(API_ROUTES.REDIRECT_URL(data.short_code))
        setErrorMsg('')
        setLongUrl('')
      },
      onError: (err: unknown) => {
        if (axios.isAxiosError(err)) {
          setErrorMsg(err.response?.data?.error || 'Something went wrong')
        } else {
          setErrorMsg('An unexpected error occurred')
        }
      }
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!longUrl.trim()) {
      setErrorMsg('URL cannot be empty')
      return
    }

    if (!isValidUrl(longUrl)) {
      setErrorMsg('Please enter a valid URL (e.g.https://example.com)')
      return
    }

    setErrorMsg('')
    mutate(longUrl)
  }

  return (
    <div>
      <h1 className="mb-4 text-center text-2xl font-bold">Shorten Your URL</h1>
      <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4">
        <input
          type="url"
          placeholder="e.g., https://example.com"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          className="w-full rounded border p-2"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded border border-blue-600 bg-transparent py-2 text-blue-600 transition-colors hover:bg-blue-600 hover:text-white disabled:opacity-50"
        >
          {isLoading ? 'Shortening...' : 'Shorten URL'}
        </button>
        {errorMsg && (
          <p className="text-center text-sm text-red-600">{errorMsg}</p>
        )}
      </form>

      {shortUrl && (
        <div className="mt-4 text-center">
          <p className="font-medium">Short URL:</p>
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="break-words text-blue-700 underline"
          >
            {shortUrl}
          </a>
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Want to see all your shortened links?
        </p>
        <Link
          to="/list"
          className="mt-1 inline-block text-blue-600 underline hover:text-blue-800"
        >
          View All URLs
        </Link>
      </div>
    </div>
  )
}

export default URLForm
