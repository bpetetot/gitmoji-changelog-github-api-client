const mockQuery = jest.fn();

module.exports = {
  default: jest.fn().mockImplementation(() => {
    return { query: mockQuery };
  }),
  gql: jest.fn(),
  mockQuery,
}