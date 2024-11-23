/**
 * Tests that something is a valid guid
 * @param input
 * @returns
 */
function isValidGuid(input: string): boolean {
  if (
    !/^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/.test(
      input
    )
  ) {
    return false;
  }
  return true;
}

const cacheStrategy = "no-cache"; // 'force-cache' or 'no-store' https://nextjs.org/docs/app/api-reference/functions/fetch#optionscache
const UMBRACO_URL = process.env.NEXT_PUBLIC_UMBRACO_URL;
const UMBRACO_API_KEY = process.env.NEXT_PUBLIC_UMBRACO_API_KEY;
const UMBRACO_CONTENT_LANGUAGE =
  process.env.NEXT_PUBLIC_UMBRACO_CONTENT_LANGUAGE;

/**
 * Gets all site content in pages
 *
 * @param take The number of items to select from the content tree. Defaults to 10
 * @param skip The number of items to skip from the content tree. Defaults to 0
 * @param previewMode Set to `true` to see the pages in preview mode. Defaults to false
 * @returns A collection of content items
 */

const getAllContentPagedAsync = async (
  take: number = 10,
  skip: number = 0,
  previewMode: boolean = false
) => {
  const data = await fetch(
    `${UMBRACO_URL}/umbraco/delivery/api/v2/content?skip=${skip}&take=${take}&fields=properties[contentBlocks,metaTitle,metaKeywords,metaDescription,relatedBlogPosts]`,
    {
      cache: cacheStrategy,
      method: "GET",
      headers: {
        "Api-Key": `${UMBRACO_API_KEY}`,
        "Accept-Language": `${UMBRACO_CONTENT_LANGUAGE}`,
        Preview: `${previewMode}`,
      },
    }
  );
  const siteContent = await data.json();
  return siteContent;
};

/**
 * Gets a single page by its pagepath
 * @param pagePath the page path (for example "/home")
 * @param previewMode set to `true` to view the content in preview mode. Defaults to `false`
 * @returns A single content item
 */
const getPageAsync = async (pagePath: string, previewMode: boolean = false) => {
  if (pagePath == "/" || pagePath == "") {
    pagePath = "/";
  }
  try {
    const url: string = `${UMBRACO_URL}/umbraco/delivery/api/v2/content/item${pagePath}/?fields=properties%5B%24all%5D`;

    const data = await fetch(`${url}`, {
      cache: cacheStrategy,
      method: "GET",
      headers: {
        "Accept-Language": `${UMBRACO_CONTENT_LANGUAGE}`,
        Preview: `${previewMode}`,
        "Content-Type": "application/json",
        "Api-Key": `${UMBRACO_API_KEY}`,
      },
    });
    if (!data.ok) {
      throw new Error(`Failed to fetch data: ${data.statusText}`);
    }
    const pageContent = await data.json();

    return pageContent;
  } catch (error) {
    console.error("Error fetching page content:", error);
    return null;
  }
};

/**
 * Gets the ancestors of a document by the document's Umbraco ID
 * @param documentId the Umbraco ID (Guid) of the queried document
 * @param skip Used for paging, configures the number of entities to skip over
 * @param take Used for paging, configures the max number of entities to return
 * @returns a collection of Umbraco documents, each of which is the ancestor of the Content item
 * @throws Error when the documentId is not a valid Guid
 */
const getAncestorsOfDocument = async (
  documentId: string,
  skip: number = 0,
  take: number = 10,
  previewMode: boolean = false
) => {
  return getChildrenAncestorsOrDescendants(
    documentId,
    "ancestors",
    skip,
    take,
    previewMode
  );
};

/**
 * Gets the Descendants of a document by the document's Umbraco ID
 * @param documentId the Umbraco ID (Guid) of the queried document
 * @param skip Used for paging, configures the number of entities to skip over
 * @param take Used for paging, configures the max number of entities to return
 * @returns a collection of Umbraco documents, each of which is the descendant of the Content item
 * @throws Error when the documentId is not a valid Guid
 */
const getDescendantsOfDocument = async (
  documentId: string,
  skip: number = 0,
  take: number = 10,
  previewMode: boolean = false
) => {
  return getChildrenAncestorsOrDescendants(
    documentId,
    "descendants",
    skip,
    take,
    previewMode
  );
};

/**
 * Gets the Children of a document by the document's Umbraco ID
 * @param documentId the Umbraco ID (Guid) of the queried document
 * @param skip Used for paging, configures the number of entities to skip over
 * @param take Used for paging, configures the max number of entities to return
 * @returns a collection of Umbraco documents, each of which is the child of the Content item
 * @throws Error when the documentId is not a valid Guid
 */
const getChildrenOfDocument = async (
  documentId: string,
  skip: number = 0,
  take: number = 10,
  previewMode: boolean = false
) => {
  return getChildrenAncestorsOrDescendants(
    documentId,
    "children",
    skip,
    take,
    previewMode
  );
};

const getChildrenAncestorsOrDescendants = async (
  documentId: string,
  childrenAncestorOrDescendantsSpecifier: string = "children",
  skip: number = 0,
  take: number = 10,
  previewMode: boolean = false
) => {
  if (
    childrenAncestorOrDescendantsSpecifier != "ancestors" &&
    childrenAncestorOrDescendantsSpecifier != "descendants" &&
    childrenAncestorOrDescendantsSpecifier != "children"
  ) {
    throw Error(
      `param 'childrenAncestorOrDescendantsSpecifier' must be either ancestor or descendant. Received ${childrenAncestorOrDescendantsSpecifier}`
    );
  }
  if (!isValidGuid(documentId)) {
    throw Error(
      `param documentId must be a valid guid, received '${documentId}'`
    );
  }

  const url = `${UMBRACO_URL}/umbraco/delivery/api/v2/content/?fields=properties[contentBlocks,metaTitle,metaKeywords,metaDescription]&fetch=${childrenAncestorOrDescendantsSpecifier}:${documentId}&skip=${skip}&take=${take}`;

  // console.log('making request to ' + url)

  const data = await fetch(`${url}`, {
    cache: cacheStrategy,
    method: "GET",
    headers: {
      "Api-Key": `${UMBRACO_API_KEY}`,
      "Accept-Language": `${UMBRACO_CONTENT_LANGUAGE}`,
      Preview: `${previewMode}`,
    },
  });
  const umbracoDocuments = await data.json();
  return umbracoDocuments;
};

export {
  getAllContentPagedAsync as GetAllContentPagedAsync,
  getPageAsync as GetPageAsync,
  getAncestorsOfDocument as GetAncestorsOfDocumentAsync,
  getDescendantsOfDocument as GetDescendantsOfDocumentAsync,
  getChildrenOfDocument as GetChildrenOfDocumentAsync,
};
