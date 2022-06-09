import mongoose, { Schema } from 'mongoose';

interface Logbook {
  date: Date;
  notes: Array<Note>;
  action: Action;
  attachments: Attachment;
  supervisorComment: string;
  roomName: string;
  startTime: Date;
  nipDosen: string;
  nimMahasiswa: string;
  verified: boolean;
  meetLink: string;
  platform: string;
}

interface Note {
  title: string;
  content: string;
  actions: Action;
  attachments: Attachment;
}

interface Action {
  title: string;
  content: string;
}

interface Attachment {
  file: string;
  originalName: string;
  originalExt: string;
}

const logbookSchema: Schema = new Schema(
  {
    namaDosen: { type: String, required: true },
    nipDosen: { type: String, required: true },
    namaMahasiswa: { type: String, required: true },
    nimMahasiswa: { type: String, required: true },
    emailMahasiswa: { type: String, required: true },
    emailDosen: { type: String, required: true },
    platform: { type: String, required: true },
    meetLink: { type: String, required: true },
    date: { type: Date, required: true },
    notes: [
      {
        title: { type: String, default: null },
        content: { type: String, default: null },
        actions: {
          content: { type: String, default: null },
        },
        attachments: {
          file: { type: String, default: null },
          originalName: { type: String, default: null },
          originalExt: { type: String, default: null },
        },
      },
    ],
    verified: { type: Boolean, default: false },
    dateVerified: { type: Date, default: null },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<Logbook>('Logbook', logbookSchema);
