import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: 'zbetaw4v',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});
