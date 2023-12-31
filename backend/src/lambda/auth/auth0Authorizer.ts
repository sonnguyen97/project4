import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
import { verify } from 'jsonwebtoken'
import Axios from 'axios';

import { createLogger } from '../../utils/logger'
import { JwtToken } from '../../auth/JwtToken'

const logger = createLogger('auth')

const jwksUrl = 'https://dev-qmrim5kf7hbj1mxn.us.auth0.com/.well-known/jwks.json';

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtToken> {

  const token = getToken(authHeader);

  let certInfo: string;
  // try {
    const res = await Axios.get(jwksUrl);
    const data = res['data']['keys'][0]['x5c'][0];
    certInfo = `-----BEGIN CERTIFICATE-----\n${data}\n-----END CERTIFICATE-----`;
  // } catch (err) {
  //   logger.error('Can\'t fetch Auth certificate. Error: ', err);
  // }

  return verify(token, certInfo, { algorithms: ['RS256']}) as JwtToken;
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
