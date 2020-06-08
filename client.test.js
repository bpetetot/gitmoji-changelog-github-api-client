const { buildRepoClient } = require('./client')
const api = require('./api')

describe('buildRepoClient', () => {
  beforeEach(() => {
    api.findTags.mockClear()
    api.findCommits.mockClear()
  })

  it('should return the reverse chronological order of tags', async () => {
    api.findTags.mockImplementation(() => Promise.resolve([
      { tagName: 'v1.0.0', createdAt: 'date1' },
      { tagName: 'v1.1.0', createdAt: 'date2' },
      { tagName: 'v2.0.0', createdAt: 'date3' },
    ]))
  
    const client = await buildRepoClient('owner', 'repo')
    const tags = await client.getTags()
    
    expect(tags).toStrictEqual(['v2.0.0', 'v1.1.0', 'v1.0.0'])
  })

  it('should return commits for the correct tags', async () => {
    api.findTags.mockImplementation(() => Promise.resolve([
      { tagName: 'v1.0.0', createdAt: 'date1' },
      { tagName: 'v1.1.0', createdAt: 'date2' },
      { tagName: 'v2.0.0', createdAt: 'date3' },
    ]))
    api.findCommits.mockImplementation(() => Promise.resolve([]))

    const client = await buildRepoClient('owner', 'repo')
  
    await client.getCommits('v1.1.0', 'v2.0.0')
    
    expect(api.findCommits.mock.calls[0][0]).toBe("owner")
    expect(api.findCommits.mock.calls[0][1]).toBe("repo")
    expect(api.findCommits.mock.calls[0][2]).toBe("date2")
    expect(api.findCommits.mock.calls[0][3]).toBe("date3")

    await client.getCommits('v2.0.0', '')

    expect(api.findCommits.mock.calls[1][0]).toBe("owner")
    expect(api.findCommits.mock.calls[1][1]).toBe("repo")
    expect(api.findCommits.mock.calls[1][2]).toBe("date3")
    expect(api.findCommits.mock.calls[1][3]).toBe(null)

    await client.getCommits('', 'v1.1.0')

    expect(api.findCommits.mock.calls[2][0]).toBe("owner")
    expect(api.findCommits.mock.calls[2][1]).toBe("repo")
    expect(api.findCommits.mock.calls[2][2]).toBe(null)
    expect(api.findCommits.mock.calls[2][3]).toBe("date2")
  })
})

jest.mock('./api', () => ({
  findTags: jest.fn(),
  findCommits: jest.fn(),
}))
