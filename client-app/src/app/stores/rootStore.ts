import ActivityStore from './activityStore';
import UserStore from './userStore';
import { createContext } from 'react';
import { configure } from 'mobx';
import CommonStore from './commonStore';
import ModalStore from './modalStore';
import ProfileStore from './profileStore';


configure({ enforceActions: "always" });


export class RootStore {
    activityStore: ActivityStore;
    userStore: UserStore;
    commonStore: CommonStore;
    modalSrore: ModalStore;
    profileStore: ProfileStore;

    constructor() {
        this.activityStore = new ActivityStore(this);
        ///we can access rootstore in activity store because we are passing
        ////an instance of the rootstore in the constructor of our activity store.
        this.userStore = new UserStore(this);
        this.commonStore = new CommonStore(this);
        this.modalSrore= new ModalStore(this);
        this.profileStore = new ProfileStore(this);
    }
}


export const RootStoreContext = createContext(new RootStore());