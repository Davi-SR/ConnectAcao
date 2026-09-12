import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);

