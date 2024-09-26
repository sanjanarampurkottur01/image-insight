import AWS from 'aws-sdk';

const requiredEnvVars = [
  'REACT_APP_REGION_NAME',
  'REACT_APP_AWS_ACCESS_KEY_ID',
  'REACT_APP_AWS_SECRET_ACCESS_KEY',
  'REACT_APP_AWS_SESSION_TOKEN'
];
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`Error: Missing environment variable ${envVar}`);
  }
});

AWS.config.update({
  region: process.env.REACT_APP_REGION_NAME,
  credentials: new AWS.Credentials(
    process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    process.env.REACT_APP_AWS_SESSION_TOKEN
  ),
});

const s3 = new AWS.S3();
const rekognition = new AWS.Rekognition();
const dynamoDB = new AWS.DynamoDB.DocumentClient();

export { s3, rekognition, dynamoDB };
