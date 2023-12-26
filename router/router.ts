import { CommandInteraction } from "@djs";

export class Router {
  public routes: {
    name: string;
    type?: number;
    options?: {
      name: string;
      type: number;
      required: boolean;
      description: string;
    }[];
    description: string;
  }[] = [];

  private handlerRouter: {
    name: string;
    handler: (interaction: CommandInteraction) => void | Promise<void>;
  }[] = [];

  private add(
    name: string,
    description: string,
    type?: number,
    options?: {
      name: string;
      type: number;
      required: boolean;
      description: string;
    }[],
  ) {
    this.routes.push({
      name,
      description,
      type,
      options,
    });
  }

  private addHandler(
    name: string,
    handler: (interaction: CommandInteraction) => void | Promise<void>,
  ) {
    this.handlerRouter.push({
      name,
      handler,
    });
  }

  public async router(name: string, interaction: CommandInteraction) {
    for (const route of this.handlerRouter) {
      if (route.name === name) {
        if (route.handler.constructor.name === "AsyncFunction") {
          await route.handler(interaction);
        } else {
          route.handler(interaction);
        }
      }
    }
  }

  constructor(
    routes: {
      title: string;
      description: string;
      type?: number;
      options?: {
        name: string;
        type: number;
        required: boolean;
        description: string;
      }[];
      handler: (interaction: CommandInteraction) => void | Promise<void>;
    }[],
  ) {
    for (const route of routes) {
      this.add(
        route.title,
        route.description,
        "type" in route ? route.type : undefined,
        "options" in route ? route.options : undefined,
      );
      this.addHandler(route.title, route.handler);
    }
  }
}
