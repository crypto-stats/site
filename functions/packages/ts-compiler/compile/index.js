require('ts-node/register')

exports.main = async (args) => {
  return {
    headers:  { 'content-type': 'application/json' },
    body: JSON.stringify({ hello: 'world' }),
  };
};
