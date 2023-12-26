import { Interaction } from "@djs";

export class Router {
    public routes: {
        name: string,
        description: string
    }[] = []

    private handlerRouter: {
        name: string,
        handler: <T = void>(interaction: Interaction) => T
    }[] = []

    private add(name: string, description: string) {
        this.routes.push({
            name,
            description
        })
    }

    private addHandler(name: string, handler: <T = void>(interaction: Interaction) => T) {
        this.handlerRouter.push({
            name,
            handler
        })
    }

    public router(name: string, interaction: Interaction) {
        for (const route of this.handlerRouter) {
            if (route.name === name) {
                return route.handler(interaction)
            }
        }
    } 

    constructor(
        routes: {
            title: string,
            description: string,
            handler: <T = void>(interaction: Interaction) => T
        }[]
    ) {
        for (const route of routes) {
            this.add(route.title, route.description)
            this.addHandler(route.title, route.handler)
        }
    }
}