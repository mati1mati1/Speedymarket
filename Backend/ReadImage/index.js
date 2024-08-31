const { ImageAnalysisClient } = require('@azure-rest/ai-vision-image-analysis');
const createClient = require('@azure-rest/ai-vision-image-analysis').default;
const { AzureKeyCredential } = require('@azure/core-auth');

const endpoint = process.env.AZURE_COMPUTER_VISION_ENDPOINT;
const key = process.env.AZURE_COMPUTER_VISION_KEY;

const credential = new AzureKeyCredential(key);
const client = createClient(endpoint, credential);

const features = ['Read'];

module.exports = async function analyzeImage(context, req) {
  try {
    // Extract image data from the request
    const imageData = req.body; // assuming image is sent in the body as a base64 string or binary data

    // Check if image data is provided
    if (!imageData) {
      context.res = {
        status: 400,
        body: { message: 'Image data is required.' }
      };
      return;
    }

    // Check if the image is base64 encoded
    const isBase64 = typeof imageData === 'string' && imageData.startsWith('data:image');
    let imageBuffer;

    if (isBase64) {
      // Extract the base64 string without the data URI prefix
      const base64String = imageData.split(',')[1];
      // Convert base64 to buffer
      imageBuffer = Buffer.from(base64String, 'base64');
    } else {
      // If it's a binary buffer directly
      imageBuffer = Buffer.from(imageData, 'binary');
    }

    const result = await client.path('/imageanalysis:analyze').post({
      body: imageBuffer,
      queryParameters: { features: features },
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });

    const iaResult = result.body;

    if (iaResult.readResult) {
      const readResult = iaResult.readResult;
      context.res = {
        status: 200,
        body: { readResult },
      };
    } else {
      context.res = {
        status: 200,
        body: { message: 'No read result found.' },
      };
    }
  } catch (error) {
    context.res = {
      status: 500,
      body: { error: error.message },
    };
  }
};