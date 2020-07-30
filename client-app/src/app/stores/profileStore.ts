import { RootStore } from "./rootStore";
import { observable, action, runInAction, computed } from "mobx";
import { IProfile, IPhoto } from "../Model/profile";
import agent from "../api/agent";
import { toast } from "react-toastify";

export default class ProfileStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable profile: IProfile | null = null;
  @observable loadingProfile = true;
  @observable uploadingPhoto = false;
  @observable loading = false;
  @computed get isCurrentUser() {
    if (this.rootStore.userStore.user && this.profile) {
      return this.rootStore.userStore.user.userName === this.profile.username;
    } else {
      return false;
    }
  }

  @action loadProfile = async (username: string) => {
    this.loadingProfile = true;

    try {
      const profile = await agent.Profiles.get(username);
      runInAction(() => {
        this.profile = profile;
        this.loadingProfile = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingProfile = false;
      });
      console.log(error);
    }
  };

  @action uploadPhoto = async (file: Blob) => {
    this.uploadingPhoto = true;

    try {
      const photo = await agent.Profiles.uploadPhoto(file);
      runInAction(() => {
        if (this.profile) {
          this.profile.photos.push(photo);
          if (photo.isMain && this.rootStore.userStore.user) {
            this.rootStore.userStore.user.image = photo.url;
            this.profile.image = photo.url;
          }
        }
        this.uploadingPhoto = false;
      });
    } catch (error) {
      console.log(error);
      toast.error("Problem Uploading Photo");
      runInAction(() => {
        this.uploadingPhoto = false;
      });
    }
  };

  @action setMainPhoto = async (id: string) => {
    this.loading = true;
    try {
      await agent.Profiles.setMain(id);
      const photoUrl = this.profile?.photos.filter((x) => x.id === id)[0];

      runInAction(() => {
        if (this.profile) {
          if (photoUrl && this.rootStore.userStore.user) {
            this.rootStore.userStore.user.image = photoUrl.url;
            this.profile!.photos.find((x) => x.isMain)!.isMain = false;
            this.profile!.photos.find((p) => p.id === id)!.isMain = true;
            this.profile!.image = photoUrl.url;
          }
        }
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      toast.error("Problem Setting Photo");
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action deletePhoto = async (photo: IPhoto | undefined) => {
      this.loading = true;
      try {
          await agent.Profiles.deletePhoto(photo!.id)
          runInAction(() => {
              if(this.profile)
              this.profile!.photos = this.profile?.photos.filter(a => a.id !== photo!.id);
              this.loading = false;
          })
      } catch (error) {
          toast.error('Problem deleting the photo')
          runInAction(() => {
              this.loading = false;
          })
      }
  }
}
