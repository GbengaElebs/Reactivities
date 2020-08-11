export interface IProfile {
    displayName: string ,
    username?: string,
    bio: string,
    image?: string,
    following: boolean,
    followingCount: number,
    followersCount: number,
    photos?: IPhoto[]
}

export interface IPhoto {
    id: string,
    url : string,
    isMain: boolean
}

export interface IProfileFormValues extends Partial<IProfile>{
}

export class EditProfileValues implements IProfileFormValues  {
    displayName:string = "";
    bio:string = "";

    constructor(init?: IProfileFormValues) {
        Object.assign(this, init);
    }
}