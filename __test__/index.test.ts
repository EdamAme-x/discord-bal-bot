import { assertEquals } from "https://deno.land/std@0.191.0/testing/asserts.ts";
import { Router } from "./../router/router.ts";
import { CommandInteraction } from "@djs";

Deno.test("Router test", async () => {
  const router = new Router([
    {
      title: "test",
      description: "test",
      handler: () => {},
    },
  ]);

  await router.router("test", {} as CommandInteraction);

  assertEquals({
    name: "test",
    description: "test",
    type: undefined,
    options: undefined,
  }, router.routes[0]);
});
