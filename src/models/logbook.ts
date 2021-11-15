import { Schema, model } from "mongoose";

interface Logbook {
    date: Date,
    periode: string,
    periodeId: number,
    status: string,
    notes: Note[],
    attachments: Attachment[]
}

interface Note {
    title: string,
    content: string
}

interface Attachment {
    title: string,
    file: string
    
}

const logbookSchema = new Schema<Logbook>({
    date: {type: Date, required: true},
},{
    timestamps: true
})

const LogbookModel = model<Logbook>("Logbook", logbookSchema)
export {LogbookModel}