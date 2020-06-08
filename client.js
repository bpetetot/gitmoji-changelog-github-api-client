const api =  require('./api')

const buildRepoClient =  async (owner, name) => {
  const tags = await api.findTags(owner, name)
  
  return {
    getTags: () => Promise.resolve(tags.map(n => n.tagName).reverse()),
    getCommits: async (from, to) => {
      const fromTag = tags.find(tag => tag.tagName === from)
      const fromDate = fromTag ? fromTag.createdAt : null
    
      const toTag = tags.find(tag => tag.tagName === to)
      const toDate = toTag ? toTag.createdAt : null
      
      const commits = await api.findCommits(owner, name, fromDate, toDate)
    
      return commits.map(commit => ({
        hash: commit.oid,
        subject: commit.message,
        body: commit.messageBody,
        date: commit.committedDate,
        author: commit.author.name,
      }))
    },
  }
}

module.exports = {
  buildRepoClient,
}