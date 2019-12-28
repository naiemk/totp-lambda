import {LambdaGlobalContext} from "aws-lambda-helper";
import {ServerModule} from "./src/server/ServerModule";
import {Container} from "ferrum-plumbing";
import mongoose from "mongoose";

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

class ContainerProvider {
    static _container: Container|undefined = undefined;

    static async container(){
        if (!ContainerProvider._container) {
            ContainerProvider._container = await LambdaGlobalContext.container();
            await ContainerProvider._container.registerModule(new ServerModule());
        }
        return ContainerProvider._container;
    }
}

export async function handler(event: any, context: any) {
    const container = await ContainerProvider.container();
    const lgc = container.get<LambdaGlobalContext>(LambdaGlobalContext);
    return await lgc.handleAsync(event, context);
}
