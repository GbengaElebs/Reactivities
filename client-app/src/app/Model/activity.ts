export interface IActivity {

    id: string;
    title: string;
    description: string;
    category : string;
    dateTime: Date | null;
    city: string;
    venue: string;
}

export interface IActivityFormValues extends Partial<IActivity>{
    time?: Date;
}

export class ActivityFormValues implements IActivityFormValues {
    id?:string = undefined;
    title:string = "";
    category:string = "";
    description: string = "";
    dateTime?:Date = undefined;
    time?:Date = undefined;
    city: string =  "";
    venue:string = "";

    constructor(init?: IActivityFormValues) {
        if (init && init.dateTime) {
            init.time = init.dateTime
        }
        Object.assign(this, init);
    }

}