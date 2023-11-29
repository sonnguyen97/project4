import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as middy from 'middy';
import { cors, httpErrorHandler } from 'middy/middlewares';

import { createAttachmentDownloadedUrl } from '../helpers/attachmentUtil';
import { createLogger } from '../../utils/logger';

const logger = createLogger('Download File');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Event: ', event);
    const payload = JSON.parse(event.body);
    const s3Key = payload.s3Key;
    const downloadUrl = createAttachmentDownloadedUrl(s3Key);
    logger.info('Download url: %s', downloadUrl);

    return {
      statusCode: 202,
      body: JSON.stringify({
        downloadUrl
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(cors(
    {
      origin: "*",
      credentials: true,
    }
  ))