const { TextractClient, DetectDocumentTextCommand } = require("@aws-sdk/client-textract");

const extractName = (text) => {
  const patterns = [
    /Name of Deceased[:\s]+([A-Z\s]+)/i,
    /Deceased Name[:\s]+([A-Z\s]+)/i,
    /This is to certify that\s+([A-Z\s]+)/i,
    /Late\s+([A-Z\s]+)/i,
    /Mr\.?\s+([A-Z\s]+)/i,
    /Mrs\.?\s+([A-Z\s]+)/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }

  return null;
};

const client = new TextractClient({
  region: process.env.AWS_REGION
});

const runOCR = async (bucket, key) => {
  const command = new DetectDocumentTextCommand({
    Document: {
      S3Object: {
        Bucket: bucket,
        Name: key
      }
    }
  });

  const response = await client.send(command);

  const text = response.Blocks
    .filter(b => b.BlockType === "LINE")
    .map(b => b.Text)
    .join("\n");

  return text;
};

module.exports = { runOCR, extractName };