import { ApolloServer } from "apollo-server-micro"
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core"
import { Neo4jGraphQL } from "@neo4j/graphql"
import neo4j from "neo4j-driver"
import 'ts-tiny-invariant' // importing this module as a workaround for issue described here: https://github.com/vercel/vercel/discussions/5846

import { typeDefs } from "./loadschema"

import isTokenValid from "./auth0jwt"

const driver = neo4j.driver(
    process.env.NEO4J_URI || 'bolt://localhost:7687',
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
)

const neoSchema = new Neo4jGraphQL( { typeDefs, driver } )

const apolloServer = new ApolloServer(
  {
    schema: neoSchema.schema,
    playground: true,
    introspection: true,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    apollo: { key: process.env.APOLLO_KEY, graphRef: `${process.env.APOLLO_ID}@current`, graphId: process.env.APOLLO_GRAPH_ID }
  }
);

// BIZARRE: https://github.com/apollographql/apollo-server/issues/5065#issuecomment-974397993
const askApolloServerToStartItself = apolloServer.start()

const askApolloServerToHandleRequest = async (req,res) =>
{
  await askApolloServerToStartItself
  
  await apolloServer.createHandler(
    {
      path: "/api/graphql",
    }
  )(req, res)
}

export default async function handler (req, res) {
    try 
    {
      const decodedToken = await isTokenValid( req?.headers?.authorization )
    } 
    catch( error ) 
    {
      console.error( error )

      res
        .status( 401 )
        .end( error.message )

      return
    }

    askApolloServerToHandleRequest ( req, res )
  }

export const config = {
  api: {
    bodyParser: false,
  },
};
