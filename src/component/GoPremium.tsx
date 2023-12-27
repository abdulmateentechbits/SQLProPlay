import React, {FC, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  EmitterSubscription,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  ToastAndroid,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {darkYellow} from '../data/colors.json';

import RNIap, {
  purchaseErrorListener,
  purchaseUpdatedListener,
  finishTransaction,
  Product,
  initConnection,
  getProducts,
  requestPurchase,
  endConnection,
} from 'react-native-iap';

import {itemSkus, restorePremium, savePremium} from '../utils/utils';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors } from '../themes/colors';

let purchaseUpdate: EmitterSubscription, purchaseError: EmitterSubscription;

interface Props {
  modalState: boolean;
  setModalState: (val: boolean) => void;
  setIsPremium: (isPrem: boolean) => void;
  isPremium: boolean;
}
const {width, height} = Dimensions.get('window');

/** Ui component here */
const GoPremium: FC<Props> = ({
  modalState,
  setModalState,
  setIsPremium,
  isPremium,
}) => {
  const [purchaseProcessing, setPurchaseProcessing] = useState(false);
  const [localizedPrice, setlocalizedPrice] = useState('');
  console.log("🚀 ~ file: GoPremium.tsx:53 ~ localizedPrice:", localizedPrice)

  const getItems = async (): Promise<void> => {
    try {
      const result: boolean = await initConnection();
      console.log("🚀 ~ file: GoPremium.tsx:56 ~ getItems ~ result:", result)
      /** If there is no skus return here */
      if (!itemSkus) {
        return;
      }
      const products: Product[] = await getProducts({skus:itemSkus});
      console.log("🚀 ~ file: GoPremium.tsx:60 ~ getItems ~ products:", products)
      setlocalizedPrice(products[0]?.localizedPrice || "200");

      purchaseUpdate = purchaseUpdatedListener(async purchase => {
        const receipt: string = purchase.transactionReceipt;
        if (receipt) {
          try {
            await finishTransaction({purchase:purchase,isConsumable:false});
            Alert.alert(
              'Purchase complete',
              'Thanks for purchasing, Now you can enjoy the premium benefits ',
            );
            /** make it affect on all app  */
            savePremium();
            setIsPremium(true);
            setPurchaseProcessing(false);
          } catch (ackErr) {
            showToast(`Error while purchasing: ${ackErr?.message}`)
            console.log('ackErr', ackErr);
          }
        }
      });

      purchaseError = purchaseErrorListener(error => {
        // console.log('purchaseErrorListener', error);
        setPurchaseProcessing(false);
        // Alert.alert('purchase error', JSON.stringify(error.message));
      });
      // const consumed = await RNIap.consumeAllItemsAndroid();
      // console.log('consumed all items?', consumed);
    } catch (err) {
      showToast(`Error: ${err?.message}`)
      console.log(err);
      setPurchaseProcessing(false);
    }
  };

  useEffect(() => {
    getItems();
    () => {
      //remove the listerners on component unmount
      return () => {
        if (purchaseUpdate) {
          purchaseUpdate.remove();
        }
        if (purchaseError) {
          purchaseError.remove();
        }
        endConnection();
      };
    };

    setIsPremium(true);
  }, []);

  const buyPremium = async (): Promise<void> => {
    console.log("🚀 ~ file: GoPremium.tsx:115 ~ buyPremium ~ itemSkus:", itemSkus)
    
    if (!itemSkus) {
      return;
    }
    try {
      
      setPurchaseProcessing(true);
      await requestPurchase({skus:itemSkus});
      console.log('Purchase success');
    } catch (err) {
      setPurchaseProcessing(false);
      showToast(`Error: ${err?.message}`)
      console.log(err);
    }
  };

  const handleRestore = async (): Promise<void> => {
    try {
      setPurchaseProcessing(true);
      const success = await restorePremium();
      if (success) {
        Alert.alert(
          'Purchase complete',
          'Thanks for purchasing, Now you can enjoy the premium benefits ',
        );

        setIsPremium(true);
      } else {
        Alert.alert('Failed to restore your purchase');
      }
      setPurchaseProcessing(false);
    } catch (error) {
      setPurchaseProcessing(false);
      console.log(error);
      Alert.alert('Failed to restore your purchase', error);
    }
  };

  const showToast = (message: string) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };
  return (
    <Modal
      visible={modalState}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={() => setModalState(false)}>
      <ScrollView contentContainerStyle={{height: height}}>
        <SafeAreaView style={styles.container}>
          <View>
            <View style={styles.closeBtnContainer}>
              <Icon
                name="close"
                size={30}
                onPress={() => setModalState(false)}
              />
            </View>
            <View style={styles.header}>
              <Image
                style={styles.logo}
                accessibilityLabel="SQL Play premium logo"
                source={require('../images/sqlpro.png')}
              />
              <Text style={styles.title}>
                Go Premium to {'\n'}unlock all features
              </Text>
            </View>
            <Image
              style={styles.image}
              source={require('../images/autocomplete.png')}
              accessibilityLabel="Image of showing autocomplete"
              resizeMode="contain"
            />
            <View style={styles.featureTxtContainer}>
              <Icon name="check-decagram" color={darkYellow} size={24} />
              <Text style={styles.featureTxt}> Ads Free</Text>
            </View>
            <View style={styles.featureTxtContainer}>
              <Icon name="check-decagram" color={darkYellow} size={24} />
              <Text style={styles.featureTxt}> Export Tables</Text>
            </View>
            <View style={styles.featureTxtContainer}>
              <Icon name="check-decagram" color={darkYellow} size={24} />
              <Text style={styles.featureTxt}> Query History</Text>
            </View>
            <View style={styles.featureTxtContainer}>
              <Icon name="check-decagram" color={darkYellow} size={24} />
              <Text style={styles.featureTxt}> Autocomplete</Text>
            </View>
            <View style={styles.featureTxtContainer}>
              <Icon name="check-decagram" color={darkYellow} size={24} />
              <Text style={styles.featureTxt}> Swipe Gestures</Text>
            </View>
          </View>
          <View>
            <TouchableOpacity
              style={styles.buyBtn}
              onPress={buyPremium}
              disabled={isPremium}>
              {!purchaseProcessing ? (
                <Text style={styles.buyBtnTxt}>
                  {isPremium
                    ? 'Nice! You have Premium'
                    : `Buy Now for ${localizedPrice}`}
                </Text>
              ) : (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator color="#fcfcfc" />
                </View>
              )}
            </TouchableOpacity>
            {!isPremium && (
              <TouchableOpacity onPress={handleRestore}>
                <Text style={styles.restoreBtn}>Restore Purchase</Text>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </ScrollView>
    </Modal>
  );
};

export default GoPremium;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // backgroundColor: 'pink',
    justifyContent: 'space-between',
  },
  closeBtnContainer: {
    alignItems: 'flex-end',
    padding: 5,
  },
  title: {
    fontSize: RFValue(24),
    textAlign: 'center',
    padding: 2,
  },
  logo: {
    width: 150,
    height: 180,
    marginHorizontal: 'auto',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'column',
    margin: 10,
  },
  featureTxt: {
    fontSize: RFValue(20),
    justifyContent: 'center',
    textAlign: 'center',
  },
  featureTxtContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 5,
  },
  image: {
    width: width,
    height: width / 2.7,
  },
  buyBtn: {
    // position: 'absolute',
    // bottom: 20,
    marginVertical: 5,
    alignItems: 'center',
    width: width,
  },
  buyBtnTxt: {
    fontSize: RFValue(20),
    textAlign: 'center',
    backgroundColor: colors.primary,
    padding: 8,
    maxWidth: 350,
    width: width - 20,
    borderRadius: 5,
    color:'#FFFFFF'
  },
  restoreBtn: {
    textAlign: 'center',
    padding: 5,
    color: '#0984e3',
    fontSize: RFValue(16),
  },
  loaderContainer: {
    backgroundColor: darkYellow,
    padding: 12,
    maxWidth: 350,
    width: width - 20,
    borderRadius: 5,
  },
});
