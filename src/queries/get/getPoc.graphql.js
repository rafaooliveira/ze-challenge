
import { request, gql } from 'graphql-request'

const query = gql`
    PocSearch($pocSearchLong: String!, $pocSearchLat: String!) {
      pocSearch(long: $pocSearchLong, lat: $pocSearchLat) {
        id
        status
        name
      }
    }`

try {
  const response = request('https://frontend-code-challenge-api.ze.delivery/graphql', query)
  console.log('response', response)
} catch (error) {
  console.log('error', error)
}
