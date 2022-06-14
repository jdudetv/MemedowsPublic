import { RaidPayload } from "@memedows/types/lib/twitch/events";
import { Alignment, MonitoringType } from "@sceneify/core";
import { ColorSource, GDIPlusTextSource, MediaSource } from "@sceneify/sources";
import {
  ChromaKeyFilter,
  ColorCorrectionFilter,
  CompressorFilter,
} from "@sceneify/filters";
import { animate } from "@sceneify/animation";
import { mainScene, MainWrapper } from "~/obs/Main";
import { GenericSound, GenericVideo } from "~/obs/redemptions";
import { asset, getRandomInt, wait } from "~/utils";
import { RaidTog } from "../services/chat";
import { TMIClient } from "../services/emotes";
import { redemptionsStore, usersStore } from "../stores";
import { createHandler } from "./base";

export const Raid = createHandler({
  event: "raid",
  handler: async (data) => {
    console.log(data);
    raidFunc(data);
  },
});

let raidVideo: any;
let raidHealth = 0;
let ClippyDead = 0;
let HealthBarFront: any;
let HealthBarBack: any;
let Fullhealth = 0;
let healthbarwidth = 700;
let healthText: any;

export async function raidFunc(data: RaidPayload) {
  if (data.viewers < 10) return;
  redemptionsStore.toggleRedemptions(
    [...redemptionsStore.redemptions.values()].map((r) => r.title),
    true,
    false
  );
  setTimeout(() => {
    mainScene.filter("BLURFORRAID")?.setEnabled(true);
  }, 1500);
  setTimeout(() => {
    RaidTog(1);
    TMIClient.say(
      "jdudetv",
      "Type BOP in chat to deal damage to clippy!!!! YOU HAVE 2 MINUTES!!!!!!!!!!!!!!!"
    );
  }, 20000);
  setTimeout(() => {
    TMIClient.say(
      "jdudetv",
      "Type BOP in chat to deal damage to clippy!!!! YOU HAVE 2 MINUTES!!!!!!!!!!!!!!!"
    );
  }, 25000);
  ClippyDead = 0;
  raidHealth = data.viewers * 10;
  Fullhealth = raidHealth;
  // HealthBarBack = await MainWrapper.createItem("HealthBarBack", {
  //   source: new ColorSource({
  //     name: "HealthBarBack",
  //     settings: {
  //       color: 0xFFFFFFFF,
  //       width: healthbarwidth,
  //       height: 50,
  //     }
  //   }),
  //   position: {
  //     x: 960,
  //     y: 50,
  //     alignment: Alignment.Center,
  //   }
  // });
  HealthBarFront = await MainWrapper.createItem("HealthBarFront", {
    source: new ColorSource({
      name: "HealthBarFront",
      settings: {
        color: 0xff0000ff,
        width: healthbarwidth,
        height: 50,
      },
    }),
    positionX: 960,
    positionY: 50,
    alignment: Alignment.Center,
  });
  healthText = await MainWrapper.createItem("RaidHealthText", {
    source: new GDIPlusTextSource({
      name: "HealthText",
      settings: {
        text: Fullhealth.toString(),
        font: {
          face: "Comic Sans MS",
          size: 40,
        },
        align: "left",
        color: 0xff000000,
      } as any,
    }),
    positionX: 960,
    positionY: 50,
    alignment: Alignment.Center,
  });
  raidVideo = await MainWrapper.createItem("RaidVideo", {
    source: new MediaSource({
      name: "RaidVideo",
      settings: {
        local_file: asset`clippy/SATANIC CLIPPY.mp4`,
        hw_decode: true,
      },
      filters: {
        limiter: new CompressorFilter({
          name: "AudioLimiter",
          settings: {
            ratio: 20,
            threshold: -30,
            output_gain: 5,
          },
        }),
        Chroma: new ChromaKeyFilter({
          name: "ChromaKeyRaid",
          settings: {
            similarity: 330,
          },
        }),
      },
    }),
  });
  await raidVideo.source.addFilter(
    "OOF",
    new ColorCorrectionFilter({
      name: "OOF",
      settings: {
        color_multiply: 0x7373ff,
      },
    })
  );

  await raidVideo.source.filters.OOF.setVisible(false);
  console.log(raidVideo);

  await raidVideo.source.setAudioMonitorType(MonitoringType.MonitorAndOutput);
}

export async function wiggle() {
  raidHealth -= getRandomInt(1, 10);
  if (raidHealth <= 0) {
    await HealthBarFront.source.setSettings({
      width: 0,
    });
    await healthText.source.setSettings({
      text: "",
    });
    ClippyDead = 1;
    RaidTog(0);
  } else {
    await HealthBarFront.source.setSettings({
      width: healthbarwidth * (raidHealth / Fullhealth),
    });
    await healthText.source.setSettings({
      text: raidHealth.toString(),
    });
  }
  if (ClippyDead == 1) {
    TMIClient.slow("jdudetv", 30);
    TMIClient.say(
      "jdudetv",
      "Congratulations you have killed clippy. Everything is now 5% cheaper POGGERS"
    );
    GenericVideo(
      "MSExplosion",
      MainWrapper,
      asset`Mine/Explode.mp4`,
      false,
      960,
      500,
      1.4,
      true
    );
    redemptionsStore.RAIDDISCOUNT();
    redemptionsStore.redemptions.forEach((data) => {
      redemptionsStore.updateRedemption(data);
    });
    setTimeout(() => {
      TMIClient.slowoff("jdudetv");
    }, 5000);
  }
  console.log(raidHealth);
  GenericSound(Math.random().toString(), asset`clippy/OOF.mp3`);
  await raidVideo.source.filters.OOF.setVisible(true);

  await animate({
    subjects: {
      Clippy: raidVideo,
    },
    keyframes: {
      Clippy: {
        positionX: {
          0: 0,
          75: 35,
          150: -35,
          225: 0,
        },
      },
    },
  });
  await raidVideo.source.filters.OOF.setVisible(false);
  if (ClippyDead == 1) {
    await wait(1500);
    raidVideo.delete();
    mainScene.filter("BLURFORRAID")?.setEnabled(false);
    // HealthBarBack.delete();
    HealthBarFront.delete();
    redemptionsStore.toggleRedemptions(
      [...redemptionsStore.redemptions.values()].map((r) => r.title),
      false,
      false
    );
  }
}
