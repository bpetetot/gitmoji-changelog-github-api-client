require('dotenv').config()
const fetch = require('node-fetch')
const { default: ApolloClient, gql } = require('apollo-boost')

const { GITHUB_TOKEN } = process.env

const client = new ApolloClient({
  uri: `https://api.github.com/graphql`,
  headers: {
    'Authorization': `bearer ${GITHUB_TOKEN}`,
  },
  fetch,
})

async function findTags(owner, name) {
  let cursor = null
  let hasNextPage = true
  let tags = []
  while (hasNextPage) {
    const response = await client.query({
      query: gql`
        query getTagsPaginated($name: String!, $owner: String!, $cursor: String) {
          repository(name: $name, owner: $owner) {
            releases(first: 50, after: $cursor) {
              nodes {
                tagName
                createdAt
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        }
      `,
      variables: { owner, name, cursor },
    })
  
    if (!response || !response.data) {
      return tags
    }
  
    const { nodes, pageInfo } = response.data.repository.releases
    tags.push(...nodes)
    hasNextPage = pageInfo.hasNextPage
    cursor = pageInfo.endCursor
  }
  return tags
}

async function findCommits(owner, name, fromDate, toDate) {
  let cursor = null
  let hasNextPage = true
  let commits = []

  while (hasNextPage) {
    const response = await client.query({
      query: gql`
        query getCommits($name: String!, $owner: String!, $fromDate: GitTimestamp, $toDate: GitTimestamp, $cursor: String) {
          repository(name: $name, owner: $owner) {
            object(expression: "master") {
              ... on Commit {
                history(since: $fromDate, until: $toDate, after: $cursor) {
                  pageInfo {
                    endCursor
                    hasNextPage
                  }
                  nodes {
                    oid
                    message
                    messageBody
                    committedDate
                    author {
                      name
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables: { name, owner, fromDate, toDate, cursor },
    })
  
    if (!response || !response.data) {
      return commits
    }
  
    const { nodes, pageInfo } = response.data.repository.object.history
    commits.push(...nodes)
    hasNextPage = pageInfo.hasNextPage
    cursor = pageInfo.endCursor
  }

  return commits
}

module.exports = {
  findTags,
  findCommits,
}