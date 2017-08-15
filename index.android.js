import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Modal,
  TouchableHighlight,
  BackHandler
} from 'react-native';
import WebViewBridge from 'react-native-webview-bridge';
import PDFView from './PDFView';
const RNFS = require('react-native-fs');
// TODO remove
const injectScript = `
  (function () {
    if (WebViewBridge) {

        setTimeout(function () {
            console.log('Timeout');
            WebViewBridge.send(JSON.stringify({ type: "showPDF", payload: "file.pdf" }));
        }, 1000);
    }
}());
`;

export default class DasabWebView extends Component {
  constructor(props) {
    super(props);
    this.state = { modalVisible: false, source: null, PDFfilePath: null }
  }
  componentDidMount() {
    // Adds Event Listener to back button press
    BackHandler.addEventListener('hardwareBackPress', this.backHandler.bind(this));

    // Loads new web app
    this.updateWebApp();
  }
  componentWillUnmount() {
    // Remove listener
    BackHandler.removeEventListener('hardwareBackPress');
  }
  backHandler() {
    // Go back a page in the WebView
    this.refs['webviewbridge'].goBack();

    return true;
  }
  onBridgeMessage(message) {
    console.log(message) // TODO remove
    message = JSON.parse(message);
    const { webviewbridge } = this.refs;
    let { type, payload } = message;

    switch (type) {
      case "showPDF":
        this.setState({ PDFfilePath: payload }, () => this.setModalVisible(true));
        break;
      case "loadData":
        this.loadDataFile(webviewbridge);
        break;
    }
  }
  loadDataFile(webviewbridge) {
    // Tries to load data.json from SD card, if fails, sent error data to WebView
    RNFS.exists('/sdcard/DasabData/data.json').then((result) => {
      if (result) // file exists
        RNFS.readFile(statResult[1], 'utf8').then((contents) => {
          // successfuly read the file
          webviewbridge.sendToBridge(JSON.stringify({ type: "getData", payload: contents }));
        }).catch((err) => {
          // can't read the file
          webviewbridge.sendToBridge(JSON.stringify({ type: 'error', payload: err }));
        });
      else // file don't exists
        webviewbridge.sendToBridge(JSON.stringify({ type: 'error', payload: "File was not found" }));
    }).catch((err) => {
      webviewbridge.sendToBridge(JSON.stringify({ type: 'error', payload: err }));
    });
  }
  setModalVisible(modalVisible) {
    this.setState({ modalVisible }); // set modal visibility
  }
  updateWebApp() {
    // If there is diffrent web app, loads the new web app into WebView.
    RNFS.exists('/sdcard/DasabWeb/main.html').then((result) => {
      if (result)
        this.setState({ source: { uri: 'file:///sdcard/DasabWeb/main.html' } })
    });
  }
  render() {
    return (
      <View style={styles.container}>
        {/* Set the status bar to black */}
        <StatusBar
          backgroundColor="black"
          barStyle="light-content"
        />
        <WebViewBridge
          ref="webviewbridge"
          onBridgeMessage={this.onBridgeMessage.bind(this)}
          javaScriptEnabled={true}

          allowFileAccessFromFileURLs={true}
          allowUniversalAccessFromFileURLs={true}
          source={this.state.source || require('./web_app/main.html')} />
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => { this.setModalVisible(false) }}>
          <PDFView webviewbridge={this.refs['webviewbridge']} setModalVisible={this.setModalVisible.bind(this)} filePath={this.state.PDFfilePath} />
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

AppRegistry.registerComponent('DasabWebView', () => DasabWebView);
