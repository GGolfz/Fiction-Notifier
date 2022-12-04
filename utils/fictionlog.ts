import { NotifyData } from "../type/NotifyData";
import { GraphQLClient, gql } from "graphql-request";
import { FilterOption } from "../type/filterOption";
export const checkFictionLog = async (jwt: string) => {
  const client = new GraphQLClient("https://api.k8s.fictionlog.co/graphql", {
    headers: {
      authorization: `JWT ${jwt}`,
    },
  });
  const query = gql`
    query QueryProductInLibrary($filter: LibrariesFilter) {
      libraries(filter: $filter) {
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          node {
            _id
            newChaptersCount
            book {
              _id
              title
            }
          }
        }
      }
    }
  `;

  let hasNextPage = true;
  let endCursor = "";
  let notifyData: Array<NotifyData> = [];
  let filter: FilterOption = {
    type: "book",
    contentType: "fiction",
    sortBy: "activity",
  };
  while (hasNextPage) {
    if (endCursor != "") {
      filter.beforeCursor = endCursor;
    }
    const response = await client.request(query, {
      filter,
    });
    const { libraries } = response;
    const { edges } = libraries;
    edges.forEach((edge: any) => {
      const title = edge.node.book.title;
      const newChaptersCount = edge.node.newChaptersCount;
      if (newChaptersCount > 0) {
        notifyData.push({ title, newChaptersCount });
      }
    });
    hasNextPage = libraries.pageInfo.hasNextPage;
    endCursor = libraries.pageInfo.endCursor;
  }
  return notifyData;
};
