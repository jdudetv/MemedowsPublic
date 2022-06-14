import { redemptionEmitter } from "~/data/handlers/redemptions/base";
import { mainScene, obs } from "~/obs/Main";
import { streamdeckEmitter } from "~/data/services/streamdeck";
import {
  hypeTrainBegin,
  hypeTrainEnd,
  hypeTrainProgress,
} from "~/obs/hypeTrain";
import { world } from "~/obs/physics";
import { eventsStore, FakeEvent, newUser } from "../stores";
import { createVideoWindow } from "~/obs/redemptions";
import Window, { WindowItem } from "~/obs/Window";
import { Alignment, Scene } from "@sceneify/core";
import { cameraVideoIcon } from "~/obs/sprites";
import { localDB } from "../jsondb";
import { animate, Easing, keyframe } from "@sceneify/animation";
import { getRandomInt, wait } from "~/utils";
import { startup } from "~/obs/startup";
import { toggleStartMenu } from "~/obs/startMenu";
import { Shutdown } from "~/obs/shutdown";
import { CreatePoll } from "../services/twitchApi";
import { amountAlerts, DonationRefundHandling, HypeTrain, SecretBit } from ".";
import { World } from "p2";
import { raidFunc } from "./raid";

streamdeckEmitter.removeAllListeners();

let HTProgress = 1;

streamdeckEmitter.on("keyDown:yeet", async () => {
  FakeEvent("yeet");
  // redemptionEmitter.emitAsync("yeet", {});
});

const directory = import.meta.env.VITE_VIDEOS_DIRECTORY;

streamdeckEmitter.on("keyDown:ohthese", async () => {
  createVideoWindow(mainScene, "CAT");
});

streamdeckEmitter.on("keyDown:togglechat", async () => {
  // @ts-ignore
  mainScene.item("chatWindow").toggleMinimised();
});

streamdeckEmitter.on("keyDown:testing", async () => {
  raidFunc({ viewers: 10, fromId: "169", fromName: "jdude" });
});

streamdeckEmitter.on("keyDown:hypeTrainEvent:begin", async () => {
  hypeTrainBegin();
});

streamdeckEmitter.on("keyDown:hypeTrainEvent:progress", async () => {
  hypeTrainProgress(HTProgress, 0.5, 1);
  if (HTProgress !== 5) HTProgress++;
});

streamdeckEmitter.on("keyDown:hypeTrainEvent:end", async () => {
  hypeTrainEnd();
  HypeTrain(6);
  // hypeTrainProgress(5, 1.2, 1);
});

streamdeckEmitter.on("keyDown:start", async () => {
  if (localDB.getData("store/started") === 1) return;
  localDB.push("store/started", 1);
  startup();
});

streamdeckEmitter.on("keyDown:shutdown", async () => {
  Shutdown();
});

streamdeckEmitter.on("keyDown:poll", async () => {});

streamdeckEmitter.on("keyDown:display", async () => {
  if (mainScene.item("desktopCapture").enabled === false) {
    mainScene.item("desktopCapture").setEnabled(true);
  } else {
    mainScene.item("desktopCapture").setEnabled(false);
  }
});

streamdeckEmitter.on("keyDown:startReset", async () => {
  localDB.push("store/started", 0);
  console.log("resetting");
  localDB.push("/store/chatters/", []);
  let data = {
    subscriptionAmount: 0,
    subscriptionThreshold: 10,
    subscriptionMultiplier: 1,
    cheerAmount: 0,
    cheerThreshold: 5000,
    cheerMultiplier: 1,
    donationAmount: 0,
    donationThreshold: 5000,
    donationMultiplier: 1,
    timer: 0,
    subBuffer: 0,
    RefundEvent: 0,
    RefundCountdown: 0,
    FreeTier: "yeet",
    RefundsHit: 0,
    FreeTierTimer: 0,
  };
  localDB.push("store/refund/variables", data);
});

streamdeckEmitter.on("keyDown:world", async () => {
  // toggleStartMenu();
  // console.log(
  //   await obs.call("GetInputSettings", {
  //     inputName: "Slice2",
  //   })
  // );
  animate({
    subjects: {
      window: mainScene.item("bitsWindow"),
    },
    keyframes: {
      window: {
        rotation: {
          0: 0,
          10000: keyframe(360, Easing.Linear),
        },
      },
    },
  });
  // console.log(
  //   await obs.call("GetSourceFilterList", {
  //     sourceName: "yes",
  //   })
  // );
});

streamdeckEmitter.on("keyDown:startmenu", async () => {
  toggleStartMenu();
});
