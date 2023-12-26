/* eslint-disable react-native/no-inline-styles */
import React, {FC, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Alert,
  Linking,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';

import ExportData from './ExportData';
import {colors} from '../themes/colors';
import { RFValue } from 'react-native-responsive-fontsize';

export interface Props {
  setInputValue: (query: string) => void;
  isPremium: boolean;
  setIsPremium: (isPrem: boolean) => void;
  setPremiumModalOpen: (isOpen: boolean) => void;
  premiumModalOpen: boolean;
}

const MenuOptions: FC<Props> = ({
  setInputValue,
  isPremium,
  setPremiumModalOpen,
}) => {
  const [exportModal, setExportModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const showAllTables = (): void => {
    const query: string =
      "SELECT name FROM sqlite_master \nWHERE type='table';";
    setMenuOpen(false);
    setInputValue(query);
  };
  const showSupportedQuery = (): void => {
    setMenuOpen(false);
    Alert.alert(
      'Supported Queries',

      `
This app has been built on top of SQLite, so most of the SQL queries are supported.

You can create, delete, modify and join the tables.

The select query works mostly the same as SQL.

There are no user roles or authentication here.

All your queries are run for a single database, so all your tables are in a single database.

For now you will play with single database
      `,
      [{text: 'OK', style: 'cancel'}],
      {cancelable: true},
    );
  };

  // In future, this app may allow you to create and select different databases.

  const sendMailFeedback = (): void => {
    try {
      Linking.openURL(
        'mailto:hi@creativeshi.com?subject=SQL%20Playground%20Feedback',
      );
    } catch (e) {
      console.error(e);
    }
  };

  const openPrivacy = (): void => {
    try {
      Linking.openURL('https://sqlplay.net/privacy');
    } catch (e) {
      console.error(e);
    }
  };
  const openPremiumModal = async () => {
    console.log("Hello world!");
    setMenuOpen(false);
    setPremiumModalOpen(true);
  };
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <ExportData modalState={exportModal} setModalState={setExportModal} />
      <Menu
        visible={menuOpen}
        animationDuration={menuOpen ? 300 : 0}
        onRequestClose={() => setMenuOpen(false)}
        style={{maxWidth: 'auto', backgroundColor: colors.primary}}
        anchor={
          <TouchableWithoutFeedback
            hitSlop={15}
            onPress={() => {
              setMenuOpen(true);
              Keyboard.dismiss();
            }}>
            <Icon
              accessibilityLabel="Menu Options"
              accessibilityHint="Shows additional options like export, list table & premium"
              name="more-vert"
              color="#FFFFFF"
              size={25}
            />
          </TouchableWithoutFeedback>
        }>
        <MenuItem
          disabled={!isPremium}
          textStyle={{color: '#FFFFFF', fontSize:RFValue(14)}}
          onPress={() => {
            setMenuOpen(false);
            setExportModal(true);
          }}>
          Export Data
        </MenuItem>
        <MenuItem textStyle={{color: '#FFFFFF', fontSize:RFValue(14)}} onPress={showAllTables}>
          List all tables
        </MenuItem>
        <MenuItem textStyle={{color: '#FFFFFF', fontSize:RFValue(14)}} onPress={showSupportedQuery}>
          Query Support
        </MenuItem>
        <MenuItem textStyle={{color: '#FFFFFF', fontSize:RFValue(14)}} onPress={sendMailFeedback}>
          Send Feedback
        </MenuItem>
        <MenuItem textStyle={{color: '#FFFFFF', fontSize:RFValue(14)}} onPress={openPrivacy}>
          Privacy Policy
        </MenuItem>
        <MenuDivider color="#FFFFFF" />
        <MenuItem textStyle={{color: '#FFFFFF', fontSize:RFValue(14)}} onPress={openPremiumModal}>
          <MCIcon name="crown" color="yellow" size={16} />
          <Text> {!isPremium && 'Go '}Premium</Text>
        </MenuItem>
      </Menu>
    </View>
  );
};

export default MenuOptions;
