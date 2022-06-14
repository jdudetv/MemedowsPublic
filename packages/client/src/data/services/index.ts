import { initializeEventSubAPI } from "./eventSubApi";
import { initializeFirebase } from "./firebase";
import { initalizeStreamlabs } from "./Kofi";
import { initializeTwitchAPI } from "./twitchApi";
import { initializeTwitchChat } from "./emotes";
import "./chat";
import "./streamdeck";
import { setupObs } from "~/obs/Main";
import { eventsStore } from "../stores";
// import { initalizeDiscord } from "./discord";

export async function initializeServices() {
  await Promise.all([
    initializeEventSubAPI(),
    initializeFirebase(),
    initalizeStreamlabs(),
    initializeTwitchAPI(),
    initializeTwitchChat(),
    // initalizeDiscord(),
  ]);
}
