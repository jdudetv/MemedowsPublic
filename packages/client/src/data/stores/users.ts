import type { NewUserData, UserData, UserSubStatus } from "@memedows/types";
import { observable } from "mobx";
import {
  collection,
  doc,
  increment,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { persist } from "../../decorators";
import { BaseStore } from "./base";
import { db } from "../services/firebase";
import { FOLLOW_XP, SUBSCRIBE_XP } from "../handlers";
import { mainScene, obs } from "~/obs/Main";
import { localDB } from "../jsondb";
import { Scene } from "@sceneify/core";
import { GDIPlusTextSource, ImageSource } from "@sceneify/sources";
import { ColorCorrectionFilter } from "@sceneify/filters";
import { asset, wait } from "~/utils";
import { animate } from "@sceneify/animation";
import { GenericSound } from "~/obs/redemptions";

class UsersStore extends BaseStore {
  @observable
  @persist
  accounts = new Map<string, UserData>();

  @observable
  @persist
  lastUserFetch = 0;

  initialize() {
    super.initialize.call(this);

    onSnapshot(
      query(
        collection(db, "new_users"),
        where("createdAt", ">=", new Date(this.lastUserFetch))
      ),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added")
            this.handleNewUser(change.doc.data() as NewUserData);
        });
      }
    );

    return this;
  }

  async handleNewUser(data: NewUserData) {
    newUserAlert();
    console.log(data);
    let xp = 0;

    if (data.subscription !== 0) xp += (SUBSCRIBE_XP as any)[data.subscription];

    if (data.following) xp += FOLLOW_XP;

    const userData: UserData = {
      ...data,
      timeouts: 0,
      jailVisits: 0,
      votes: 0,
      xp,
    };

    this.accounts.set(data.displayName.toLowerCase(), userData);
    await setDoc(doc(db, "users", data.id), userData);

    this.lastUserFetch = Date.now();
  }

  async addTimeout(id: string) {
    let userData = this.accounts.get(id);
    if (!userData) return;

    userData.timeouts++;

    await updateDoc(doc(db, "users", id), {
      timeouts: increment(1),
    });
  }

  async addVote(id: string) {
    let userData = this.accounts.get(id);
    if (!userData) return;

    userData.votes++;

    await updateDoc(doc(db, "users", id), {
      votes: increment(1),
    });
  }

  async grantXp(id: string, amount: number) {
    try {
      await updateDoc(doc(db, "users", id), {
        xp: increment(amount),
      });
    } catch (err) {
      console.log(err);
      return;
    }

    let userData = this.accounts.get(id);
    if (!userData) return;

    if (!userData.xp) userData.xp = 0;
    userData.xp += amount;
  }
}

export const usersStore = new UsersStore().initialize();

export async function newUser(data: NewUserData) {
  let list = localDB.getData("store/newuseralert");
  if (list.length === 0) {
    list.push(data.displayName);
    localDB.push("store/newuseralert", list);
    newUserAlert();
  } else {
    list.push(data.displayName);
    localDB.push("store/newuseralert", list);
  }
}

async function UserDelete() {
  let list = localDB.getData("store/newuseralert");
  list.splice(0, 1);
  localDB.push("store/newuseralert", list);
  if (list.length === 0) return;
  newUserAlert();
}

export async function newUserAlert() {
  let list = localDB.getData("store/newuseralert");
  if (list.length === 0) return;
  GenericSound("Wow", asset`sounds/sound.mp3`);
  const newuserScene = await new Scene({
    name: "newuserScene",
    items: {
      BackgroundImage: {
        source: new ImageSource({
          name: "NewUserAlert",
          settings: {
            file: asset`images/NewuserPopup.png`,
          },
        }),
        positionX: 1523,
        positionY: 972,
      },
      TextLayer: {
        source: new GDIPlusTextSource({
          name: "userName",
          settings: {
            text: list[0],
            font: {
              size: 25,
              face: "Trebuchet MS",
            } as any,
            color: 0xff000000,
          },
        }),
        positionX: 1535,
        positionY: 1000,
      },
    },
  }).create(obs);

  let user = await mainScene.createItem("NewUserAlert", {
    source: newuserScene,
  });

  await user.source.addFilter(
    "OPACITY",
    new ColorCorrectionFilter({
      name: "OPACITY",
      settings: {
        opacity: 0,
      },
    })
  );

  animate({
    subjects: {
      opacity: user.source.filter("OPACITY")!,
    },
    keyframes: {
      opacity: {
        opacity: {
          0: 0,
          1000: 1,
          4000: 1,
          5000: 0,
        },
      },
    },
  });
  await wait(5500);
  user.remove();
  await newuserScene.remove();
  UserDelete();
}
