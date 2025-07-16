import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "zbetaw4v",
  dataset: "production",
  apiVersion: "2024-07-15",
  useCdn: true,
});
