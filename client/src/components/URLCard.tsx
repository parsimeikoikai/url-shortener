type URLCardProps = {
  shortCode: string
  originalUrl: string
  shortenedUrl?: string
  createdAt?: string
  clickCount?: number
  reused?: boolean
}

const URLCard = ({
  shortCode,
  originalUrl,
  shortenedUrl,
  createdAt,
  clickCount,
  reused
}: URLCardProps) => {
  const fallbackShortUrl = `${window.location.origin}/${shortCode}`

  return (
    <div className="mb-4 rounded-lg border bg-white p-4 shadow">
      <div className="mb-2">
        <span className="font-semibold">Original URL:</span>{' '}
        <a
          href={originalUrl}
          target="_blank"
          className="text-blue-600 underline"
          rel="noreferrer"
        >
          {originalUrl}
        </a>
      </div>

      <div className="mb-2">
        <span className="font-semibold">Short URL:</span>{' '}
        <a
          href={shortenedUrl || fallbackShortUrl}
          target="_blank"
          className="text-green-700 underline"
          rel="noreferrer"
        >
          {shortenedUrl || fallbackShortUrl}
        </a>
      </div>

      {createdAt && (
        <div className="mb-2">
          <span className="font-semibold">Created At:</span>{' '}
          {new Date(createdAt).toLocaleString()}
        </div>
      )}

      {typeof clickCount === 'number' && (
        <div className="mb-2">
          <span className="font-semibold">Clicks:</span> {clickCount}
        </div>
      )}

      {typeof reused === 'boolean' && (
        <div className="mb-2">
          <span className="font-semibold">Reused:</span>{' '}
          <span className={reused ? 'text-yellow-700' : 'text-gray-700'}>
            {reused ? 'Yes' : 'No'}
          </span>
        </div>
      )}
    </div>
  )
}

export default URLCard
