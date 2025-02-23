import AWS from "aws-sdk";
import fs from "fs";

AWS.config.update({ region: "us-east-1" });

const transcribe = new AWS.TranscribeService();

export const transcribeAudio = async (filePath: string): Promise<string> => {
  const params = {
    TranscriptionJobName: `transcribe-${Date.now()}`,
    Media: { MediaFileUri: `s3://your-bucket/${filePath}` },
    MediaFormat: "mp3",
    LanguageCode: "en-US",
  };

  const { TranscriptionJob } = await transcribe
    .startTranscriptionJob(params)
    .promise();
  return TranscriptionJob?.TranscriptionJobStatus || "Processing";
};
