import mongoose, { Schema } from 'mongoose';

interface Logbook {
  date: Date;
  semester: string;
  status: string;
  notes: Note[];
  action: Action[];
  attachments: Attachment[];
  supervisorComment: string;
  verifiedBy: string;
  dateVerified: Date;
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
    date: { type: Date, required: true },
    semester: { type: String, required: true },
    status: { type: String, required: true },
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
    supervisorComment: String,
    veridifiedBy: String,
    dateVerified: Date,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<Logbook>('Logbook', logbookSchema);
