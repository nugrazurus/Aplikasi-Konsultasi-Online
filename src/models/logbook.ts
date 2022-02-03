import mongoose, { Schema } from 'mongoose';

interface Logbook {
  date: Date;
  notes: Note;
  action: Action;
  attachments: Attachment;
  supervisorComment: string;
  roomName: string;
  startTime: Date;
  nipDosen: string;
  nimMahasiswa: string;
  verified: boolean;
}

interface Note {
  title: string;
  content: string;
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
    roomName: { type: String, required: true },
    namaDosen: { type: String, required: true },
    nipDosen: { type: String, required: true },
    namaMahasiswa: { type: String, required: true },
    nimMahasiswa: { type: String, required: true },
    date: { type: Date, required: true },
    notes: {
      title: { type: String, default: null },
      content: { type: String, default: null },
    },
    actions: {
      content: { type: String, default: null },
    },
    attachments: {
      file: { type: String, default: null },
      originalName: { type: String, default: null },
      originalExt: { type: String, default: null },
    },
    verified: { type: Boolean, default: false },
    dateVerified: { type: Date, default: null },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<Logbook>('Logbook', logbookSchema);
