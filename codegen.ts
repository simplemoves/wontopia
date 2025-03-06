import {CodegenConfig} from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "https://internal.wontopia.win:9443/query",
  ignoreNoDocuments: true,
  generates: {
    "src/gql/": {
      preset: 'client',
      plugins: ["typescript", "typescript-operations"]
    }
  }
}

export default config;