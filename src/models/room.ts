import mongoose, { Schema } from 'mongoose';

interface Room {
  roomName: string;
  roomUrl: string;
  startTime: Date;
}

const roomSchema = new Schema(
  {
    roomName: { type: String, required: true },
    roomUrl: { type: String, required: true },
    startTime: { type: Date, required: true },
    nimDosen: { type: String, required: true },
    nimMahasiswa: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<Room>('Room', roomSchema);
