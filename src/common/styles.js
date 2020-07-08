import {StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters';

export default StyleSheet.create({
  // A R Report

  arview1: {
    flex: 1,
  },

  arview2: {
    height: 50,
    alignSelf: 'center',
    backgroundColor: 'red',
  },

  //fm : filterModal

  fmview1: {
    flex: 1,
  },

  fmSview1: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  fmSview2: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(5),
  },

  fmview2: {
    backgroundColor: 'white',
    borderRadius: scale(5),
    width: scale(250),
  },

  fmview3: {
    height: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },

  fmtext1: {
    fontSize: scale(15),
    color: '#00B5FF',
    fontWeight: '500',
  },

  fmview4: {
    height: scale(2),
    backgroundColor: '#00B5FF',
  },
  fmview5: {
    padding: scale(5),
  },
  fmview6: {
    backgroundColor: '#00B5FF',
    height: scale(40),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(4),
  },
  fmtext2: {
    fontSize: scale(18),
    color: '#fff',
    fontWeight: 'bold',
  },

  // Bank Detail  or  Credit Note list

  btxt: {
    fontSize: scale(12),
    width: scale(150),
  },
  btxth: {
    fontSize: scale(12),
    fontWeight: 'bold',
  },
  buserInput: {
    height: scale(40),
    backgroundColor: 'white',
    marginBottom: scale(15),
    borderColor: 'grey',
    borderWidth: scale(1),
    width: scale(200),
    borderRadius: scale(5),
  },

  binput: {
    color: '#000',
    marginLeft: scale(5),
    width: '73%',
    fontSize: scale(12),
  },

  btxt_h: {
    fontSize: scale(12),
    color: '#000',
    fontWeight: 'bold',
    width: scale(200),
    textAlign: 'left',
  },

  bview1: {
    justifyContent: 'center',
    flex: 1,
  },

  bflatlist: {
    paddingBottom: scale(5),
    flexGrow: 1,
  },

  bview2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bview3: {
    backgroundColor: '#ddd',
    width: scale(80),
    height: scale(80),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(80) / 2,
    borderWidth: 2,
    borderColor: '#AED581',
  },

  bimg1: {
    resizeMode: 'contain',
    width: scale(50),
    height: scale(50),
  },
  btext1: {
    fontSize: scale(15),
    width: scale(150),
    textAlign: 'center',
    marginTop: scale(5),
  },

  // Bank Modal

  bmview1: {
    flex: 1,
  },

  bmsview1: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  bmsview2: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(5),
  },

  bmview2: {
    backgroundColor: 'white',
    width: '90%',
    padding: scale(10),
    borderRadius: scale(5),
    alignItems: 'center',
  },

  bmview3: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bmtouch1: {
    width: scale(100),
    height: scale(40),
    padding: scale(10),
    backgroundColor: '#3D8EE1',
    borderRadius: scale(8),
    margin: scale(5),
  },
  bmtext1: {
    color: '#fff',
    fontSize: scale(15),
    textAlign: 'center',
  },

  liview1: {
    flexDirection: 'row',
    padding: scale(10),
    justifyContent: 'space-between',
  },
  liview2: {
    width: '80%',
  },
  liview3: {
    flexDirection: 'row',
  },
  litouch1: {
    backgroundColor: '#335E61',
    width: scale(50),
    height: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(5),
    margin: scale(5),
  },
  litext1: {
    fontSize: scale(12),
    color: '#fff',
  },

  // Change Password

  chview1: {
    justifyContent: 'center',
    flex: 1,
  },

  chflatlist: {
    paddingBottom: scale(5),
    flexGrow: 1,
  },
  chtxt_log: {
    fontSize: scale(12),
    color: 'white',
    fontWeight: 'bold',
    width: scale(100),
    textAlign: 'center',
  },

  chview2: {
    paddingHorizontal: scale(10),
    marginHorizontal: scale(40),
  },
  chview3: {
    marginTop: scale(20),
  },
  chtext1: {
    fontSize: scale(12),
    fontWeight: 'bold',
  },
  chtxtinp: {
    marginTop: scale(5),
    fontSize: scale(12),
    padding: scale(7),
    borderWidth: scale(1),
    borderColor: '#808B96',
    borderRadius: scale(5),
  },
  chview4: {
    marginTop: scale(5),
  },

  chview5: {
    marginTop: scale(30),
    marginBottom: scale(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  chtouch: {
    width: scale(230),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: '#3498DB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  //Contact One TWo Three

  inputIOS: {
    fontSize: scale(12),
    paddingVertical: scale(12),
    paddingHorizontal: scale(10),
    color: 'black',
    paddingRight: scale(40),
  },
  inputAndroid: {
    fontSize: scale(12),
    paddingHorizontal: scale(10),
    paddingVertical: scale(8),
    color: 'black',
    paddingRight: scale(40),
  },

  ccontainer: {
    paddingHorizontal: scale(10),
    marginTop: scale(5),
    marginHorizontal: scale(10),
  },

  cuserInput: {
    borderWidth: 1,
    height: scale(45),
    borderRadius: scale(5),
    borderColor: '#0070c6',
    marginTop: scale(3),
  },
  cinput: {
    width: '70%',
    fontSize: scale(12),
    marginStart: scale(7),
    color: '#000',
  },
  ctxt: {
    fontSize: scale(12),
    fontWeight: 'bold',
  },
  ctxt_log: {
    fontSize: scale(15),
    color: 'white',
    fontWeight: 'bold',
    width: scale(100),
    textAlign: 'center',
  },

  cview1: {
    flex: 1,
  },

  ctext1: {
    textAlign: 'center',
    paddingBottom: scale(20),
    fontSize: scale(18),
    fontWeight: 'bold',
  },

  cview2: {
    flexDirection: 'row',
    width: scale(200),
  },

  star: {
    color: 'red',
    fontSize: scale(12),
  },

  cview3: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  cview4: {
    height: scale(45),
    borderColor: '#0070c6',
    borderWidth: scale(1),
    borderRadius: scale(5),
    marginTop: scale(3),
    width: '28%',
  },
  cview5: {
    height: scale(45),
    borderColor: '#0070c6',
    borderWidth: scale(1),
    borderRadius: scale(5),
    marginTop: scale(3),
    width: '32%',
  },
  cview6: {
    width: scale(200),
  },
  ctxtInp1: {
    fontSize: scale(12),
    marginStart: scale(5),
    color: '#000',
  },

  ctxtInp3: {
    width: '48%',
    fontSize: scale(12),
    color: '#000',
    borderWidth: 1,
    height: scale(45),
    borderRadius: scale(5),
    borderColor: '#0070c6',
    marginTop: scale(3),
  },

  cview7: {
    marginTop: scale(30),
    marginBottom: scale(100),
    justifyContent: 'center',
    alignItems: 'center',
  },

  ctouch: {
    width: scale(230),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: '#3498DB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  ctext2: {
    paddingBottom: scale(10),
    fontSize: scale(15),
    fontWeight: 'bold',
    color: '#239B56',
  },

  cview8: {
    height: scale(80),
    marginTop: scale(3),
    borderColor: '#0070c6',
    borderWidth: scale(1),
    borderRadius: scale(5),
  },

  ctxtInp2: {
    color: '#000',
    fontSize: scale(12),
  },

  cview9: {
    paddingTop: scale(30),
    paddingBottom: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },

  ctouch2: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  cimg1: {
    width: scale(30),
    height: scale(30),
  },

  ctext3: {
    fontSize: scale(12),
    color: '#000',
    fontWeight: 'bold',
  },

  ctext4: {
    paddingTop: scale(30),
    paddingBottom: scale(10),
    fontSize: scale(15),
    fontWeight: 'bold',
    color: '#239B56',
  },

  //Credit Note list

  crview1: {
    flex: 1,
  },

  crsview1: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  crsview2: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(5),
  },

  crview3: {
    backgroundColor: 'white',
    borderRadius: scale(5),
    width: scale(250),
  },

  crview4: {
    height: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },

  crtext1: {
    fontSize: scale(15),
    color: '#00B5FF',
    fontWeight: '500',
  },

  crview5: {
    height: scale(2),
    backgroundColor: '#00B5FF',
  },

  crview6: {
    padding: scale(5),
  },

  crview7: {
    backgroundColor: '#00B5FF',
    height: scale(40),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(4),
  },

  crtext2: {
    fontSize: scale(18),
    color: '#fff',
    fontWeight: 'bold',
  },

  crview8: {
    flexDirection: 'row',
    padding: scale(10),
    justifyContent: 'space-between',
  },

  crview9: {
    width: '80%',
  },
  crview10: {
    flexDirection: 'row',
  },

  crtouch1: {
    backgroundColor: '#335E61',
    width: scale(50),
    height: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(5),
    margin: scale(5),
  },

  crtext3: {
    fontSize: scale(12),
    color: '#fff',
  },

  // Credit Note one Two Three

  coview1: {
    flex: 1,
  },

  coview2: {
    height: scale(50),
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  coview3: {
    flexDirection: 'row',
    borderRadius: 5,
    height: scale(40),
    width: '90%',
    borderWidth: 1,
    justifyContent: 'space-around',
    borderColor: '#ddd',
    marginTop: scale(3),
  },

  coview4: {
    backgroundColor: true ? '#1C77BA' : '#fff',
    width: scale(100),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(5),
    margin: scale(2),
  },

  cotext1: {
    color: true ? '#fff' : '#000',
    fontSize: scale(15),
  },

  coview5: {
    backgroundColor: false ? '#1C77BA' : '#fff',
    width: scale(100),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(5),
    margin: scale(2),
  },

  cotext2: {
    color: false ? '#fff' : '#000',
    fontSize: scale(15),
  },

  coflatlist: {
    paddingBottom: scale(5),
    flexGrow: 1,
  },

  coview7: {
    marginHorizontal: scale(10),
    paddingHorizontal: scale(15),
  },

  coview8: {
    marginTop: scale(5),
  },

  cotext4: {
    fontSize: scale(12),
    fontWeight: 'bold',
  },

  copicker1: {
    height: scale(40),
    width: '90%',
    marginTop: scale(5),
    borderColor: 'grey',
    borderWidth: scale(1),
    borderRadius: scale(3),
  },

  coview9: {
    flexDirection: 'row',
    marginTop: scale(5),
    justifyContent: 'space-between',
  },

  cotxtinp: {
    width: '90%',
    fontSize: scale(12),
    padding: scale(7),
    borderWidth: scale(1),
    borderColor: '#808B96',
    borderRadius: scale(3),
  },

  coview10: {
    marginTop: scale(30),
    marginBottom: scale(100),
    justifyContent: 'center',
    alignItems: 'center',
  },

  cotouch1: {
    width: scale(230),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: '#3498DB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cotxt_log: {
    fontSize: scale(12),
    color: 'white',
    fontWeight: 'bold',
    width: scale(100),
    textAlign: 'center',
  },

  cotxt: {fontSize: scale(15), width: scale(150), color: '#5D6D7E'},
  cotxth: {fontSize: scale(15), fontWeight: 'bold'},

  corowFront: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    borderRadius: scale(12),
    margin: scale(10),
    shadowColor: '#000',
    shadowRadius: scale(5),
    elevation: scale(5),
    borderWidth: 1,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.9,
  },

  coflatlist2: {
    paddingBottom: scale(70),
    flexGrow: 1,
  },

  copanel1: {
    padding: scale(3),
    backgroundColor: '#F7F7F7',
  },

  copanel2: {
    flexDirection: 'row',
  },

  copanel3: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: scale(5),
    backgroundColor: '#fff',
  },

  copanel4: {
    width: scale(30),
    height: scale(30),
  },

  coview11: {
    paddingHorizontal: scale(10),
    marginHorizontal: scale(40),
  },

  cotxtinp2: {
    marginTop: scale(5),
    fontSize: scale(12),
    padding: scale(7),
    borderWidth: scale(1),
    borderColor: '#808B96',
    borderRadius: scale(3),
  },

  coview12: {
    height: scale(100),
    marginTop: scale(5),
    borderColor: 'grey',
    borderWidth: scale(1),
    borderRadius: scale(3),
  },

  cotxtinp3: {
    color: '#000',
    fontSize: scale(12),
  },

  coview13: {
    marginTop: scale(20),
    marginBottom: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },

  cotouch2: {
    width: scale(230),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: '#3498DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
