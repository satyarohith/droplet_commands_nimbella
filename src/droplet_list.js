'use strict';

/**
 * Makes an https GET request.
 * @param {string} url - The request URL
 * @param {{}} headers - Headers that need to be set while making a request.
 * @returns {Promise} - The result wrapped in a promise object.
 * @see {@link https://www.tomas-dvorak.cz/posts/nodejs-request-without-dependencies/}
 */
const getContent = (url, headers) => {
  // Return new pending promise
  return new Promise((resolve, reject) => {
    const request = require('https').get(url, {headers}, response => {
      // Handle http errors
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(
          new Error('Failed to load page, status code: ' + response.statusCode)
        );
      }

      // Temporary data holder
      const body = [];
      // On every content chunk, push it to the data array
      response.on('data', chunk => body.push(chunk));
      // We are done, resolve promise with those joined chunks
      response.on('end', () => resolve(body.join('')));
    });
    // Handle connection errors of the request
    request.on('error', err => reject(err));
  });
};

/**
 * @description undefined
 * @param {ParamsType} params list of command parameters
 * @param {?string} commandText text message
 * @param {!object} [secrets = {}] list of secrets
 * @return {Promise<SlackBodyType>} Response body
 */
async function _command(params, commandText, secrets = {}) {
  const programStart = Date.now();
  const {digitaloceanApiKey} = secrets;
  if (!digitaloceanApiKey) {
    return {
      text:
        'You need `digitaloceanApiKey` secret to run this command. Create one by running `/nc secret_create`.'
    };
  }

  const result = [];
  const BASE_URL = 'https://api.digitalocean.com/v2';
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${digitaloceanApiKey}`
  };

  try {
    const {droplets} = JSON.parse(
      await getContent(BASE_URL + '/droplets?per_page=10', headers)
    );

    for (const droplet of droplets) {
      const IPv4 = droplet.networks.v4[0]
        ? droplet.networks.v4[0].ip_address
        : 'not available';

      result.push({
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `*${droplet.name}*`
          },
          {
            type: 'mrkdwn',
            text: `ID: ${droplet.id}`
          },
          {
            type: 'mrkdwn',
            text: `IPv4: ${IPv4}`
          },
          {
            type: 'mrkdwn',
            text: `Status: ${droplet.status}`
          }
        ]
      });
    }

    result.push({
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `Time taken: ~${Date.now() - programStart}ms`
        }
      ]
    });
  } catch (error) {
    result.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*ERROR:* ${error.message}`
      }
    });
  }

  return {
    response_type: 'in_channel', // or `ephemeral` for private response
    blocks: result
  };
}

/**
 * @typedef {object} SlackBodyType
 * @property {string} text
 * @property {'in_channel'|'ephemeral'} [response_type]
 */

const main = async ({__secrets = {}, commandText, ...params}) => ({
  body: await _command(params, commandText, __secrets)
});
module.exports = main;
