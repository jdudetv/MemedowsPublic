import { tts } from "~/obs/redemptions/TTS";
import { createRedemptionHandler, redemptionEnded } from "./base";

createRedemptionHandler({
  event: "tts",
  handler: async (data) => {
    redemptionEnded("tts");
    tts(data.input);
  },
});
