/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/App` | `/_sitemap` | `/modals/player` | `/tabs` | `/tabs/` | `/tabs/profile`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
