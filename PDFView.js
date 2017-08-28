import React from 'react';
import {
    StyleSheet,
    TouchableHighlight,
    View,
    Text
} from 'react-native';

import Pdf from 'react-native-pdf';

export default class PDFView extends React.Component {
    constructor(props) {
        super(props);

        this.pdf = null;
    }

    closeModel() {
        this.props.setModalVisible(false);
    }

    render() {
        let filePath = this.props.filePath,
            source = { uri: this.props.filePath, cache: true };

        // Adds file:///sdcard/ if not included
        if (!source.uri.includes('file:///sdcard/'))
            source.uri = 'file:///sdcard/' + this.props.filePath;

        return (
            <View style={styles.container}>
                <View style={styles.topBar}>
                    <TouchableHighlight onPress={() => this.props.setModalVisible(false)}>
                        <Text style={styles.topBarClose}>X</Text>
                    </TouchableHighlight>
                    <Text style={styles.topBarTitle}>קובץ: {filePath.substring(filePath.lastIndexOf('/') + 1)}</Text>
                </View>
                <Pdf ref={(pdf) => { this.pdf = pdf; }}
                    source={source}
                    page={1}
                    horizontal={false}
                    onError={(err) => {
                        this.props.webviewbridge.sendToBridge(encodeURIComponent(JSON.stringify({ type: 'error', payload: err })));
                    }}
                    style={styles.pdf} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    topBar: {
        flexDirection: 'row',
        backgroundColor: 'rgb(25, 118, 210)',
        width: '100%',
        justifyContent: 'space-between',
        paddingRight: 5,
        paddingLeft: 5,
        alignItems: 'center',
        height: 61,
    },
    topBarTitle: {
        color: "#FFF",
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'right'
    },
    topBarClose: {
        color: "#FFF",
        fontSize: 16,
        width: 30,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 40,
        textAlign: 'center',
    },
    pdf: {
        flex: 1,
        width: '100%',
    }
});
