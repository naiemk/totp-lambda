import {LambdaGlobalContext} from "aws-lambda-helper";
import {ServerModule} from "./src/server/ServerModule";

export async function handler(event: any, context: any) {
    const container = await LambdaGlobalContext.container();

    await container.registerModule(new ServerModule()); // Change this to your defined module

    const lgc = container.get<LambdaGlobalContext>(LambdaGlobalContext);
    return await lgc.handleAsync(event, context);
}
