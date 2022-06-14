import { createRedemptionHandler, redemptionEnded } from "./base";
import { FilthyFrank } from "~/obs/redemptions/FF";
import { CreatePoll } from "~/data/services/twitchApi";
import { eventsStore } from "~/data/stores";
import { TMIClient } from "~/data/services/emotes";
import { wait } from "~/utils";
import { tts } from "~/obs/redemptions";

let pollID: string;
let prevdata;
let PollFinished = 0;
let Username = "";
let Victim = "";

createRedemptionHandler({
  event: "hcourt",
  handler: async (data) => {
    if (data.input.startsWith("@")) data.input = data.input.slice(1);
    console.log("horny court started.");
    pollID = await CreatePoll(
      `Should ${data.input} Be sent to H. jail?`,
      [{ title: "Yes" }, { title: "No" }],
      60
    );
    Username = data.userName.trim();
    Victim = data.input.trim();
  },
});

eventsStore.on("pollBegin", async (p) => {
  PollFinished = 2;
  let data = Date.parse(p.startedAt);
  let date = Date.parse(p.endsAt);
  setTimeout(() => {
    PollFinished = 1;
    console.log("poll true");
  }, date - data - 1000);
});

eventsStore.on("pollProgress", async (p) => {
  if (p.id === pollID) {
    if (PollFinished === 1) {
      PollFinished = 0;
      if (p.choices[0].votes === p.choices[1].votes) {
        redemptionEnded("hcourt");
        await TMIClient.say(
          "jdudetv",
          `ITS A DRAW BOTH ARE TOO HORNY GOODBYE.`
        );
        tts(
          `ITS A DRAW BOTH ARE TOO HORNY AND WILL BE SENT TO HORNY JAIL. GOODBYE.`
        );
        await wait(5000);
        await TMIClient.say("jdudetv", "/timeout " + Victim + " 69 HORNY JAIL");
        await TMIClient.say("ocefam", "/timeout " + Victim + " 69 HORNY JAIL");
        await wait(5000);
        await TMIClient.say(
          "jdudetv",
          "/timeout " + Username + " 69 HORNY JAIL"
        );
        await TMIClient.say(
          "ocefam",
          "/timeout " + Username + " 69 HORNY JAIL"
        );
      }
      if (p.choices[0].votes > p.choices[1].votes) {
        redemptionEnded("hcourt");
        await TMIClient.say(
          "ocefam",
          `${Victim} Has been found guilty of horny and sentenced to Horny jail. Goodbye.`
        );
        await TMIClient.say(
          "jdudetv",
          `${Victim} Has been found guilty of horny and sentenced to Horny jail. Goodbye.`
        );
        tts(
          `${Victim} Has been found guilty of horny and sentenced to Horny jail. Goodbye.`
        );
        await wait(5000);
        await TMIClient.say("jdudetv", "/timeout " + Victim + " 69 HORNY JAIL");
      } else if (p.choices[0].votes < p.choices[1].votes) {
        redemptionEnded("hcourt");
        await TMIClient.say(
          "jdudetv",
          `${Victim} Has been found NOT GUILTY of horny and ${Username} is sentenced to Horny jail for the false report. Goodbye.`
        );
        await TMIClient.say(
          "ocefam",
          `${Victim} Has been found NOT GUILTY of horny and ${Username} is sentenced to Horny jail for the false report. Goodbye.`
        );
        tts(
          `${Victim} Has been found NOT GUILTY of horny and ${Username} is sentenced to Horny jail for the false report. Goodbye.`
        );
        await wait(5000);
        await TMIClient.say(
          "jdudetv",
          "/timeout " + Username + " 69 HORNY JAIL"
        );
        TMIClient.timeout("ocefam", Username, 69, "horny jail");
      }
    }
  }
});
