/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/navigator/AppNavigator`; params?: Router.UnknownInputParams; } | { pathname: `/screens/ProductDetail`; params?: Router.UnknownInputParams; } | { pathname: `/screens/ProductList`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `/navigator/AppNavigator`; params?: Router.UnknownOutputParams; } | { pathname: `/screens/ProductDetail`; params?: Router.UnknownOutputParams; } | { pathname: `/screens/ProductList`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/_sitemap${`?${string}` | `#${string}` | ''}` | `/navigator/AppNavigator${`?${string}` | `#${string}` | ''}` | `/screens/ProductDetail${`?${string}` | `#${string}` | ''}` | `/screens/ProductList${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/navigator/AppNavigator`; params?: Router.UnknownInputParams; } | { pathname: `/screens/ProductDetail`; params?: Router.UnknownInputParams; } | { pathname: `/screens/ProductList`; params?: Router.UnknownInputParams; };
    }
  }
}
