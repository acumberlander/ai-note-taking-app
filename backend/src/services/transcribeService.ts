/*import AWS from "aws-sdk";

AWS.config.update({ region: "us-east-1" });

const transcribe = new AWS.TranscribeService();

export const transcribeAudio = async (
  s3FilePath: string
): Promise<string | undefined> => {
  try {
    if (!s3FilePath.startsWith("s3://")) {
      throw new Error("Invalid S3 file path");
    }

    const format = s3FilePath.split(".").pop() || "mp3";

    const params = {
      TranscriptionJobName: `transcribe-${Date.now()}`,
      Media: { MediaFileUri: s3FilePath },
      MediaFormat: format,
      LanguageCode: "en-US",
    };

    const { TranscriptionJob } = await transcribe
      .startTranscriptionJob(params)
      .promise();

    if (!TranscriptionJob?.Transcript?.TranscriptFileUri) {
      throw new Error("Transcription job failed");
    }

    return TranscriptionJob.Transcript.TranscriptFileUri;
  } catch (error) {
    console.error("Error starting transcription:", error);
    throw new Error("Transcription service error");
  }
};
*/