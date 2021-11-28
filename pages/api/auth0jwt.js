import { verify } from "jsonwebtoken"
import jwksClient from "jwks-rsa"

function getKey( header, callback )
{
    jwksClient(
        {
            jwksUri: `${process.env.AUTH0_ISSUER_BASE_URL}/.well-known/jwks.json`
        }
    )
    .getSigningKey( header.kid,
        (error, key) => { callback( null, key.getPublicKey() ) }
    )
}

export default function isTokenValid( token )
{
    if (!Boolean(token))
    {
        return Promise.reject( { error: "No token provided", message: "No Authorization Header with a Bearer JWT was provided" } )
    }

    const bearerToken = token.split(" ");

    return new Promise( (resolve, reject) => {
            verify(
                bearerToken[1],

                getKey,

                {
                    audience: `${process.env.AUTH0_BASE_URL}/api/graphql`,
                    issuer: `${process.env.AUTH0_ISSUER_BASE_URL}/`,
                    algorithms: ["RS256"]
                },
                
                (error, decoded) => {
                    if (error)
                    {
                        reject( {error} )
                    }

                    if (decoded)
                    {
                        resolve( {decoded} )
                    }
                }
            )
        }
    )
}