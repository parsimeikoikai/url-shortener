import request from 'supertest'
import { describe, it, expect, beforeAll } from 'vitest'
import app from '../src/app' 

describe('ShortLink API', () => {
  let encodedShortCode: string
  const testUrl = 'https://indicina.co'

  it('should encode a long URL', async () => {
    const response = await request(app)
      .post('/api/encode')
      .send({ original_url: testUrl }) 
      .set('Content-Type', 'application/json')

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('short_code')
    expect(response.body).toHaveProperty('shortened_url')

    encodedShortCode = response.body.short_code
    expect(typeof encodedShortCode).toBe('string')
  })

  it('should decode the short code back to the original URL', async () => {
    const response = await request(app)
      .post('/api/decode')
      .send({ short_code: encodedShortCode })
      .set('Content-Type', 'application/json')

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('original_url')
    expect(response.body.original_url).toBe(testUrl)
  })

  it('should return stats for the encoded short code', async () => {
    const response = await request(app).get(`/api/statistic/${encodedShortCode}`)

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      short_code: encodedShortCode,
      original_url: testUrl,
    })
    expect(response.body.click_count).toBeGreaterThanOrEqual(0)
    expect(new Date(response.body.created_at).toString()).not.toBe('Invalid Date')
  })
})