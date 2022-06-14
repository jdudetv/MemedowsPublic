import { observable } from "mobx";
// import { client } from "../services/discord";
import { usersStore } from "../stores/users";
import { createHandler } from "./base";
import fs from "fs";
import { getRandomInt } from "~/utils";
import { FakeEvent } from "../stores";

export const SUBSCRIBE_XP = {
  prime: 500,
  1: 500,
  2: 1000,
  3: 2500,
};

createHandler({
  event: "subscribe",
  handler: async (data) => {
    if (data.gifted === true) {
      console.log(data);
      if (data.tier == 1)
        FakeEvent("wheelofmemefortune", data.userName, "", data.userId);
      if (data.tier == 2) {
        FakeEvent("wheelofmemefortune", data.userName, "", data.userId);
        FakeEvent("wheelofmemefortune", data.userName, "", data.userId);
      }
      if (data.tier == 3) {
        FakeEvent("wheelofmemefortune", data.userName, "", data.userId);
        FakeEvent("wheelofmemefortune", data.userName, "", data.userId);
        FakeEvent("wheelofmemefortune", data.userName, "", data.userId);
        FakeEvent("wheelofmemefortune", data.userName, "", data.userId);
        FakeEvent("wheelofmemefortune", data.userName, "", data.userId);
      }
      await usersStore.grantXp(data.userId, SUBSCRIBE_XP[data.tier] / 2);
      GiveWaifu(data.userName);
    }
    console.log("subsribe triggered");
  },
});

const resubscribeState = observable({
  latestResub: "",
});

createHandler({
  event: "subscriptionMessage",
  handler: async (data) => {
    resubscribeState.latestResub = data.userName;
    console.log("resubscribe triggered");
    GiveWaifu(data.userName);
    if (data.tier == 1)
      FakeEvent("wheelofmemefortune", data.userName, "", data.userId);
    if (data.tier == 2) {
      FakeEvent("wheelofmemefortune", data.userName, "", data.userId);
      FakeEvent("wheelofmemefortune", data.userName, "", data.userId);
    }
    if (data.tier == 3) {
      FakeEvent("wheelofmemefortune", data.userName, "", data.userId);
      FakeEvent("wheelofmemefortune", data.userName, "", data.userId);
      FakeEvent("wheelofmemefortune", data.userName, "", data.userId);
      FakeEvent("wheelofmemefortune", data.userName, "", data.userId);
      FakeEvent("wheelofmemefortune", data.userName, "", data.userId);
    }
    await usersStore.grantXp(data.userId, SUBSCRIBE_XP[data.tier]);
  },
});

createHandler({
  event: "giftSubscribe",
  handler: async (data) => {
    console.log(data);
    resubscribeState.latestResub = data.userName;
    console.log("gifted sub triggered");
    await usersStore.grantXp(data.userId, SUBSCRIBE_XP[data.tier] / 2);
  },
});

async function GiveWaifu(name: string) {
  var files = fs.readdirSync("L:/Streaming/Waifus");
  var NumofWaifus = files.length;
  var WaifuID = getRandomInt(0, NumofWaifus);
  // const channel = await client.channels.fetch("757516786110431232");
  // await channel.send(name, { files: [`L:/Streaming/Waifus/${WaifuID}.jpg`] });
}
