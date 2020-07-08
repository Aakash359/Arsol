/** @format */
import React from 'react';
import {View, StyleSheet, Modal, ActivityIndicator} from 'react-native';
import {scale, moderateScale} from 'react-native-size-matters';

const LogoSpinner = props => {
  const {loading, ...attributes} = props;

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={loading}
      onRequestClose={() => {
        console.log('close modal');
      }}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <View
            style={{
              backgroundColor: 'white',
              padding: scale(10),
              borderRadius: scale(10),

              width: scale(60),
              height: scale(60),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ActivityIndicator size="small" color="#DDD" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  activityIndicatorWrapper: {
    height: scale(45),
    width: scale(45),
    borderRadius: moderateScale(10),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default LogoSpinner;
