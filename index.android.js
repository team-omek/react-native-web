/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Modal,
  TouchableHighlight
} from 'react-native';
import WebViewBridge from 'react-native-webview-bridge';
const injectScript = `
  (function () {
                    if (WebViewBridge) {
 
                      WebViewBridge.onMessage = function (message) {
                        if (message === "hello from react-native") {
                          WebViewBridge.send("got the message inside webview");
                        }
                      };
                
                      WebViewBridge.send("hello from webview");
                      setTimeout(function () {
                          console.log('Timeout');
                          WebViewBridge.send("loadPDF|1.pdf");
                        }, 1000);
                    }
                  }());
`;

export default class DasabWebView extends Component {
  constructor(props) {
    super(props);
    this.state = { modalVisible: false }
  }
  onBridgeMessage(message) {
    const { webviewbridge } = this.refs;
    let type = message.split('|')[0],
      payload = message.split('|')[1];

    console.log(message)

    switch (type) {
      case "hello from webview":
        webviewbridge.sendToBridge("hello from react-native");
        break;
      case "got the message inside webview":
        console.log("we have got a message from webview! yeah1");
        break;
      case "loadPDF":
        console.log('aa');
        this.setModalVisible(true)
        break;
    }
  }
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="black"
          barStyle="light-content"
        />
        <WebViewBridge
          ref="webviewbridge"
          onBridgeMessage={this.onBridgeMessage.bind(this)}
          javaScriptEnabled={true}
          injectedJavaScript={injectScript}
          source={require('./web_app/main.html')} />
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => { this.setModalVisible(false) }}
        >
          <View style={{ marginTop: 22 }}>
            <View>
              <Text>Hello World!</Text>

              <TouchableHighlight onPress={() => {
                this.setModalVisible(false)
              }}>
                <Text>Hide Modal</Text>
              </TouchableHighlight>

            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('DasabWebView', () => DasabWebView);
