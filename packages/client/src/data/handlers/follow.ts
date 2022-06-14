import { TMIClient } from "../services/emotes";
import { usersStore } from "../stores";
import { createHandler } from "./base";

export const FOLLOW_XP = 100;

export const follow = createHandler({
  event: "follow",
  handler: async (data) => {
    if (
      data.userName.includes("hoss00312") ||
      data.userName.includes("gunz0")
    ) {
      TMIClient.ban("jdudetv", data.userName);
    }

    await usersStore.grantXp(data.userId, FOLLOW_XP);
  },
});
