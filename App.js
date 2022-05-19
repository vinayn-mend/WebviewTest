import {
  NavigationContainer,
  useNavigation,
  useIsFocused,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Pressable,
  Text,
  BackHandler,
  Platform,
  StyleSheet,
  Button,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {SafeAreaView} from 'react-native-safe-area-context';

const MEND_LOGOUT_URL = 'https://portal.mendfamily.com/logout';
const MEND_PORTAL_DASHBOARD_URL = 'https://portal.mendfamily.com/dashboard';

function HomeScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.homescreenContainer}>
      <Text>Home Screen</Text>
      <Pressable
        style={{
          paddingVertical: 10,
          height: 60,
          width: '50%',
          backgroundColor: 'skyblue',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          navigation.navigate('Visit', {
            // Url with auth token attached
            url: 'https://portal.mendfamily.com/saml/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJhdWQiOiJQcm92aWRlciBBZG1pbiIsIm9yZyI6IjIxOTkiLCJzdWIiOiI0NzI1ODgzIiwianRpIjoiMmJkMjQ4M2UxMTc4M2RiZWVkMmMxN2EwMmNlYzIyZjVjMDc2ODA3NTQyZjgiLCJpYXQiOjE2NTI5MzU4ODUsIm5iZiI6MTY1MjkzNTg3NSwiZXhwIjoxNjUyOTQzMDg1LCJpc3MiOiJhcGkubWVuZGZhbWlseS5jb20ifQ.LpwAsSDuOcHnlh9dWitl_yjj7eeaVXYqx2nzDUTysVY7KX0EqDP-6ir-sWZT01ysOr_OnrqXNpZbHj7aP3hl1A?postLoginUrl=/video/VW53SB&orgIncluded=true&slim=true',
          });
        }}>
        <Text>Go to Visit</Text>
      </Pressable>
    </View>
  );
}

function VisitScreen(props) {
  const navigation = useNavigation();
  const [loaded, setLoaded] = useState(false);
  const webViewRef = useRef();
  const isFocused = useIsFocused();
  const [url, setUrl] = useState(props.route.params.url);
  const [reloadCount, setCount] = useState(0);

  useEffect(() => {
    if (!isFocused) {
      setUrl(MEND_LOGOUT_URL); //ToDo: Remove if not needed
    } else {
      setUrl(props.route.params.url);
      setCount(0);
    }
  }, [isFocused]);

  useEffect(() => {
    const backAction = () => {
      showLoading(false);
      navigation.navigate('Visit');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const handleWebViewNavigationStateChange = (url = '') => {
    if (
      (url && url.includes(MEND_PORTAL_DASHBOARD_URL)) ||
      url === MEND_PORTAL_DASHBOARD_URL
    ) {
      setUrl(MEND_LOGOUT_URL); //ToDo: Remove if not needed
      navigation.navigate('Home');
    }
    if (url.includes('https://portal-dev1.mendvip.com/video/')) {
      setUrl(url);
    }
  };

  const injectJavascript = () => {
    // webViewRef.current?.injectJavaScript(
    //   `window.postMessage("openChat", '*');`,
    // );
    console.log('reload');
    webViewRef.current?.reload();
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.headerView}>
        <Pressable
          onPress={() => {
            navigation.navigate('Home');
          }}
          style={styles.btnContainer}>
          <Text style={styles.helpText}>Go Back</Text>
        </Pressable>
        <Pressable onPress={injectJavascript} style={styles.btnContainer}>
          <Text style={styles.helpText}>Reload</Text>
        </Pressable>
      </View>

      {isFocused && (
        <WebView
          ref={webViewRef}
          // originWhitelist={['*']}
          source={{uri: url}}
          javaScriptEnabled={true}
          onLoadEnd={async syntheticEvent => {
            const {nativeEvent} = syntheticEvent;
            console.log('hitt', reloadCount, nativeEvent.loading, url, '\n');
            if (
              Platform.OS === 'ios' &&
              url.includes('https://portal.mendfamily.com/video/')
            ) {
              if (nativeEvent.loading == false && reloadCount <= 1) {
                webViewRef.current?.reload();
                setCount(reloadCount + 1);
              }
            }
            setLoaded(!nativeEvent.loading);
          }}
          onNavigationStateChange={navigationState => {
            handleWebViewNavigationStateChange(navigationState?.url);
          }}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          userAgent={
            Platform.OS === 'android'
              ? 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 5 Build/LMY48B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/43.0.2357.65 Mobile Safari/537.36'
              : ''
          }
          onError={e => console.log('error: ', e)}
        />
      )}
    </SafeAreaView>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Visit" component={VisitScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  homescreenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'black',
  },

  headerView: {
    height: 50,
    display: 'flex',
    paddingHorizontal: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
  },

  btnContainer: {
    height: 50,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },

  helpText: {
    color: 'blue',
    fontSize: 20,
    marginLeft: -10,
  },
});
