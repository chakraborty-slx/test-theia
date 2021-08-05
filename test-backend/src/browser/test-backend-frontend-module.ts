import { CommandContribution } from "@theia/core";
import {
  bindViewContribution,
  FrontendApplicationContribution,
  WebSocketConnectionProvider,
  WidgetFactory,
} from "@theia/core/lib/browser";
import { ContainerModule, injectable } from "inversify";
import {
  BackendClient,
  HelloBackendWithClientService,
  HelloBackendService,
  HELLO_BACKEND_PATH,
  HELLO_BACKEND_WITH_CLIENT_PATH,
} from "../common/protocol";
import { TestBackendCommandContribution } from "./test-backend-contribution";
import "antd/dist/antd.css";
import { TestViewWidget } from "./test-view-widget";
import { TestViewContribution } from "./test-view.contribution";

export default new ContainerModule((bind) => {
  bind(CommandContribution)
    .to(TestBackendCommandContribution)
    .inSingletonScope();
  bind(BackendClient).to(BackendClientImpl).inSingletonScope();

  bind(HelloBackendService)
    .toDynamicValue((ctx) => {
      const connection = ctx.container.get(WebSocketConnectionProvider);
      return connection.createProxy<HelloBackendService>(HELLO_BACKEND_PATH);
    })
    .inSingletonScope();

  bind(HelloBackendWithClientService)
    .toDynamicValue((ctx) => {
      const connection = ctx.container.get(WebSocketConnectionProvider);
      const backendClient: BackendClient = ctx.container.get(BackendClient);
      return connection.createProxy<HelloBackendWithClientService>(
        HELLO_BACKEND_WITH_CLIENT_PATH,
        backendClient
      );
    })
    .inSingletonScope();

  //Test view
  bindViewContribution(bind, TestViewContribution);
  bind(FrontendApplicationContribution).toService(TestViewContribution);
  bind(TestViewWidget).toSelf();
  bind(WidgetFactory)
    .toDynamicValue((ctx) => ({
      id: TestViewWidget.ID,
      createWidget: () => ctx.container.get<TestViewWidget>(TestViewWidget),
    }))
    .inSingletonScope();
});

@injectable()
class BackendClientImpl implements BackendClient {
  getName(): Promise<string> {
    return new Promise((resolve) => resolve("Client"));
  }
}
