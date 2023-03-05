import { createClient } from 'urql'

const APIURL = 'https://api.studio.thegraph.com/query/42645/els_graph/v0.0.1';

export const getCategoryNodes = `
  query {
    categoryNodes {
        id
        name
        parent {
          id
          name
        }
        isRoot
        isLeaf
    }
  }
`;

export const getItemsById = `
  query getItems($id: String) {
    postingItems(where: {category_: {id: $id}}) {
      id
      title
      description
      createdAt
      owner
      category {
        id
        name
      }
    }
  }
`

export const graphqlClient = createClient({
  url: APIURL,
  requestPolicy: 'network-only'
})
