import mongoose, { Schema } from 'mongoose';

interface Logbook {
  date: Date;
  notes: Note[];
  action: Action[];
  attachments: Attachment[];
  supervisorComment: string;
  roomName: string;
  startTime: Date;
  nipDosen: string;
  nimMahasiswa: string;
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
      title: String,
      content: String,
    },
    actions: {
      title: String,
      content: String,
    },
    attachments: {
      file: String,
      originalName: String,
      originalExt: String,
    },
    dateVerified: Date,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<Logbook>('Logbook', logbookSchema);
