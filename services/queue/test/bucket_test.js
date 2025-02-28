const slugid = require('slugid');
const assert = require('assert');
const Bucket = require('../src/bucket');
const debug = require('debug')('test:bucket_test');
const request = require('superagent');
const helper = require('./helper');
const testing = require('taskcluster-lib-testing');

helper.secrets.mockSuite(testing.suiteName(), ['aws'], function(mock, skipping) {
  helper.withS3(mock, skipping);

  if (mock) {
    // aws-mock-s3 is not sufficient to test this class, and there's really no
    // way to mock the signed URL generation, anyway, which is most of what
    // this class does..
    return;
  }

  let bucket;
  setup('load bucket', async function() {
    if (!skipping()) {
      bucket = await helper.load('publicArtifactBucket');
    }
  });

  // Test that put to signed url works
  test('createPutUrl', async function() {
    const key = slugid.v4();
    const url = await bucket.createPutUrl(key, {
      contentType: 'application/json',
      expires: 60 * 10,
    });
    await request.put(url).send({ message: 'Hello' });
  });

  const uploadTestFile = async () => {
    const key = slugid.v4();
    const url = await bucket.createPutUrl(key, {
      contentType: 'application/json',
      expires: 60 * 10,
    });
    await request.put(url).send({ message: 'Hello' });
    return { key, url };
  };

  // Test we can delete an object
  test('deleteObject', async function() {
    const { key } = await uploadTestFile();
    await bucket.deleteObject(key);
  });

  // Test we can delete an object a non-existing object
  test('deleteObject (non-existing object)', async function() {
    const key = slugid.v4();
    await bucket.deleteObject(key);
  });

  // Test we can delete multiple objects
  test('deleteObjects', async function () {
    const { key: key1 } = await uploadTestFile();
    const { key: key2 } = await uploadTestFile();

    await bucket.deleteObjects([key1, key2]);
  });
  test('deleteObjects quiet', async function () {
    const { key: key1 } = await uploadTestFile();
    const { key: key2 } = await uploadTestFile();

    await bucket.deleteObjects([key1, key2], true);
  });

  test('createGetUrl', async function() {
    const key = slugid.v4();
    const putUrl = await bucket.createPutUrl(key, {
      contentType: 'application/json',
      expires: 60 * 10,
    });

    let res = await request.put(putUrl).send({ message: 'Hello' });
    assert(res.ok, 'put request failed');

    const getUrl = bucket.createGetUrl(key);
    debug('createGetUrl -> %s', getUrl);

    res = await request.get(getUrl);
    assert(res.ok, 'get request failed');
    assert(res.body.message === 'Hello', 'wrong message');
  });

  test('uses bucketCDN', async function() {
    const cfg = await helper.load('cfg');

    // Create bucket instance
    const bucket = new Bucket({
      bucket: cfg.app.publicArtifactBucket,
      awsOptions: cfg.aws,
      bucketCDN: 'https://example.com',
      monitor: await helper.load('monitor'),
    });
    const url = bucket.createGetUrl('test');
    assert(url === 'https://example.com/test');
  });
});
