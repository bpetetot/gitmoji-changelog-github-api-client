const api = require('./api')
const { mockQuery } = require('apollo-boost')

describe('findTags', () => {
  beforeEach(() => {
    mockQuery.mockClear()
  })

  it('should return empty array if no response', async () => {
    mockQuery.mockImplementationOnce(() => Promise.resolve(null))

    const result = await api.findTags('owner', 'repo')

    expect(result).toStrictEqual([])
  })

  it('should return empty array if no tags', async () => {
    mockQuery.mockImplementationOnce(() => Promise.resolve({
      data: { repository: { releases: { nodes: [], pageInfo: { hasNextPage: false } } }}
    }))

    const result = await api.findTags('owner', 'repo')

    expect(result).toStrictEqual([])
  })

  it('should return tags with one page of tags', async () => {
    const tags = [{ tagName: 'v1', createdAt: 'date' }]
    mockQuery.mockImplementationOnce(() => Promise.resolve({
      data: { repository: { releases: { nodes: tags, pageInfo: { hasNextPage: false } } }}
    }))

    const result = await api.findTags('owner', 'repo')

    expect(result).toStrictEqual(tags)
  })

  it('should return tags with multiple pages of tags', async () => {
    const tags1 = [{ tagName: 'v1', createdAt: 'date' }]
    const tags2 = [{ tagName: 'v2', createdAt: 'date' }]
    mockQuery.mockImplementationOnce(() => Promise.resolve({
      data: { repository: { releases: { nodes: tags1, pageInfo: { hasNextPage: true } } }}
    }))
    mockQuery.mockImplementationOnce(() => Promise.resolve({
      data: { repository: { releases: { nodes: tags2, pageInfo: { hasNextPage: false } } }}
    }))

    const result = await api.findTags('owner', 'repo')

    expect(result).toStrictEqual([...tags1, ...tags2])
  })
})

describe('findCommits', () => {
  beforeEach(() => {
    mockQuery.mockClear()
  })

  it('should return empty array if no response', async () => {
    mockQuery.mockImplementationOnce(() => Promise.resolve(null))

    const result = await api.findCommits('owner', 'repo', 'from', 'to')

    expect(result).toStrictEqual([])
  })

  it('should return empty array if no tags', async () => {
    mockQuery.mockImplementationOnce(() => Promise.resolve({
      data: { repository: { object: { history: { nodes: [], pageInfo: { hasNextPage: false } } } } }
    }))

    const result = await api.findCommits('owner', 'repo', 'from', 'to')

    expect(result).toStrictEqual([])
  })

  it('should return tags with one page of tags', async () => {
    const commits = [{ oid: '1', message: 'message' }]
    mockQuery.mockImplementationOnce(() => Promise.resolve({
      data: { repository: { object: { history: { nodes: commits, pageInfo: { hasNextPage: false } } } } }
    }))

    const result = await api.findCommits('owner', 'repo', 'from', 'to')

    expect(result).toStrictEqual(commits)
  })

  it('should return tags with multiple pages of tags', async () => {
    const commits1 = [{ oid: '1', message: 'message' }]
    const commits2 = [{ oid: '2', message: 'message' }]
    mockQuery.mockImplementationOnce(() => Promise.resolve({
      data: { repository: { object: { history: { nodes: commits1, pageInfo: { hasNextPage: true } } } } }
    }))
    mockQuery.mockImplementationOnce(() => Promise.resolve({
      data: { repository: { object: { history: { nodes: commits2, pageInfo: { hasNextPage: false } } } } }
    }))

    const result = await api.findCommits('owner', 'repo', 'from', 'to')

    expect(result).toStrictEqual([...commits1, ...commits2])
  })
})