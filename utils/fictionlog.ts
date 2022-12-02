const checkFictionLog = async (jwt: string) => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `JWT ${jwt}`);
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    operationName: "QueryProductInLibrary",
    variables: {
      filter: {
        type: "book",
        contentType: "fiction",
        sortBy: "activity",
      },
    },
    query:
      "query QueryProductInLibrary($filter: LibrariesFilter) {\n  libraries(filter: $filter) {\n    pageInfo {\n      endCursor\n      hasNextPage\n      __typename\n    }\n    edges {\n      node {\n        _id\n        newChaptersCount\n        productType\n        book {\n          _id\n          title\n }\n }\n  }\n \n  }\n}\n",
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow" as RequestRedirect,
  };

  let hasNextPage = true;
  let endCursor = "";
  let notifyData = "";
  while(hasNextPage) {
    if(endCursor != "") {
        const newRaw = JSON.parse(requestOptions.body)
        newRaw.variables.filter.beforeCursor  = endCursor;
        requestOptions.body = JSON.stringify(newRaw);
    }
    const response = await fetch("https://api.k8s.fictionlog.co/graphql", requestOptions)
    const result = await response.text()
    const res = JSON.parse(result);
    const { libraries } = res.data;
    const { edges } = libraries;
    edges.forEach((edge: any) => {
        const title = edge.node.book.title;
        const newChaptersCount = edge.node.newChaptersCount;
        if(newChaptersCount > 0) {
            notifyData += `${title} has ${newChaptersCount} new chapters!`;
        }
    })
    hasNextPage = libraries.pageInfo.hasNextPage;
    endCursor = libraries.pageInfo.endCursor;
  }
  return notifyData;
};

export default checkFictionLog;
