import { Schema, model } from "mongoose";

interface Room {
    roomName: string;
    roomUrl: string;
    startTime: Date;
}

const roomSchema = new Schema<Room>({
    roomName: {type: String, required: true},
    roomUrl: {type: String, required: true},
    startTime: {type: Date, required: true},
},{
    timestamps: true
})

const RoomModel = model<Room>("Room", roomSchema)
export {RoomModel}