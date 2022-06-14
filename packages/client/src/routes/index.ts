import EventSubSubscriptions from "./eventSubSubscriptions";
import Redemptions from "./redemptions";
import InteractiveAnimation from "./interactiveAnimation";
import alertSettings from "./alertSettings";
import PhysicsWorld from "./PhysicsWorld";
import stats from "./stats";
import { typeString } from "robotjs";

export const routes = {
  eventSubSubscriptions: {
    component: EventSubSubscriptions,
    title: "EventSub Subscriptions",
  },
  redemptions: {
    component: Redemptions,
    title: "Redemptions",
  },
  interactiveAnimation: {
    component: InteractiveAnimation,
    title: "InteractiveAnimation",
  },
  alertSettings: {
    component: alertSettings,
    title: "Alert Settings",
  },
  physics: {
    component: PhysicsWorld,
    title: "Physics World",
  },
  Stats: {
    component: stats,
    title: "Stats",
  },
};
