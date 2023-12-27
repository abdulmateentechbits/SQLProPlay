import React, { useEffect, useState } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View, Linking } from 'react-native';

export const UpdateAppModal = ({ isVisible = false, onCloseModal, appUrl }) => {
    const [modalVisible, setModalVisible] = useState(isVisible);
    useEffect(() => {
        setModalVisible(isVisible);
    }, [isVisible]);

    let updateApp = () => {
        Linking.openURL(appUrl);
        setModalVisible(false);
    }
    let updateLater = () => {
        onCloseModal(false);
        setModalVisible(false)
    }

    return (

        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>New version available</Text>
                    <View style={{ flexDirection: 'row', gap: 20, marginTop: 10 }}>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={updateLater}>
                            <Text style={styles.textStyle}>Update later</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button, styles.buttonClose, { backgroundColor: '#787276' }]}
                            onPress={updateApp}>
                            <Text style={styles.textStyle}>Update now</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>

    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});
