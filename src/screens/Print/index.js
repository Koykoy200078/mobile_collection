import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CollectorList, collectorList} from '../../app/database/allSchema';
import styles from './styles';
import RNPrint from 'react-native-print';
import {Button} from '../../app/components';
import {Images} from '../../app/config';
import {imageUri} from './imageUri';

export default function ({navigation, route}) {
  const [data, setData] = useState(null);
  const [selectedPrinter, setSelectedPrinter] = useState(null);

  const logoUri = 'data:image/png;base64,' + imageUri.data;

  const currentDate = new Date();

  const day = currentDate.getDate();
  const monthIndex = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const hour = currentDate.getHours();
  const minute = currentDate.getMinutes();
  const ampm = hour >= 12 ? 'PM' : 'AM';

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const formattedHour = hour % 12 === 0 ? 12 : hour % 12; // Convert hour to 12-hour format
  const formattedMinute = minute.toString().padStart(2, '0'); // Ensure minute has two digits

  const formattedDate = `${day} ${monthNames[monthIndex]} ${year}, ${formattedHour}:${formattedMinute} ${ampm}`;

  // Function to generate a random number within a range
  const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  // Generate random Receipt No.
  const receiptNo = getRandomNumber(1000, 9999);

  // Generate random Reference ID
  const referenceID = getRandomNumber(100000000000, 999999999999);

  const accountNum = getRandomNumber(100000000, 999999999);
  const {
    name,
    regularLoans,
    emergencyLoans,
    savingDeposit,
    shareCapital,
    totalAmount,
    rP,
    rI,
    rPe,
    eP,
    eI,
    ePe,
  } = route.params;

  console.log('name ==> ', name);
  console.log('regularLoans ==> ', regularLoans);
  console.log('rP ==> ', rP);
  console.log('rI ==> ', rI);
  console.log('rPe ==> ', rPe);
  console.log('emergencyLoans ==> ', emergencyLoans);
  console.log('eP ==> ', eP);
  console.log('eI ==> ', eI);
  console.log('ePe ==> ', ePe);

  const printHTML = async () => {
    await RNPrint.print({
      html: `<!DOCTYPE html>
<html>
  <head>
    <title>Statement of Account</title>
    <style>
      * {
        box-sizing: border-box;
      }
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #fff;
      }
      .container {
        width: 58mm;
        height: 160mm;
        margin: 0 auto;
        background-color: #fff;
        box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
      }
      .text-center {
        text-align: center;
      }
      .font-bold {
        font-weight: bold;
      }
      .flex-row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 5px;
      }
      .receipt-header {
        display: flex;
        align-items: center;
        flex-direction: column;
        margin-bottom: 15px;
      }
      .receipt-header img {
        height: 60px;
        margin-right: 5px;
      }
      .company-details {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      .company-name {
        font-size: 16px;
        margin: 0;
        margin-left: 5px;
      }
      .company-address {
        font-size: 12px;
        margin: 0;
        margin-left: 5px;
      }
      .receipt-details {
        margin-bottom: 15px;
        background-color: #fff;
        border-radius: 3px;
      }
      .receipt-total {
        margin-top: 0;
        margin-bottom: 15px;
      }
      .section-title {
        font-size: 12px;
        font-weight: bold;
      }
      .section-value {
        font-size: 12px;
      }
      @page {
        size: 58mm 160mm;
        margin: 0;
      }
      @media print and (-webkit-min-device-pixel-ratio: 0) {
        /* Remove unnecessary page breaks for Chrome and Safari */
        .container {
          page-break-after: auto;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="receipt-header">
        <div class="company-details">
          <img src="${logoUri}" alt="Company Logo" width="65" height="100" />
          <div>
            <h1 class="company-name">Sacred Heart Coop</h1>
            <p class="company-address">
              Cruz na Daan 3008 San Rafael, Philippines
            </p>
          </div>
        </div>
      </div>

      <h1
        class="text-center"
        style="font-size: 18px; font-weight: bold; margin-top: 10px"
      >
        STATEMENT OF ACCOUNT
      </h1>

      <div class="receipt-details">
        <div class="flex-row">
          <div class="section-title">Account Number:</div>
          <div class="section-value">${accountNum}</div>
        </div>

        <div class="flex-row">
          <div class="section-title">Biller Name:</div>
          <div class="section-value">${name}</div>
        </div>

        <div class="flex-row">
          <div class="section-title">Regular Loans:</div>
          <div class="section-value">${regularLoans}</div>
        </div>

        <div
          class="flex-row"
          style="margin-left: 20px; justify-content: flex-start"
        >
          <div class="section-title" style="font-size: 12px">
            &bull; Principal:
          </div>
          <div class="section-value" style="margin-left: 10px; font-size: 12px">
            ${rP}
          </div>
        </div>

        <div
          class="flex-row"
          style="margin-left: 20px; justify-content: flex-start"
        >
          <div class="section-title" style="font-size: 12px">
            &bull; Interest:
          </div>
          <div class="section-value" style="margin-left: 15px; font-size: 12px">
            ${rI}
          </div>
        </div>

        <div
          class="flex-row"
          style="margin-left: 20px; justify-content: flex-start"
        >
          <div class="section-title" style="font-size: 12px">
            &bull; Penalty:
          </div>
          <div class="section-value" style="margin-left: 15px; font-size: 12px">
            ${rPe}
          </div>
        </div>

        <div class="flex-row">
          <div class="section-title">Emergency Loans:</div>
          <div class="section-value">${emergencyLoans}</div>
        </div>

        <div
          class="flex-row"
          style="margin-left: 20px; justify-content: flex-start"
        >
          <div class="section-title" style="font-size: 12px">
            &bull; Principal:
          </div>
          <div class="section-value" style="margin-left: 10px; font-size: 12px">
            ${eP}
          </div>
        </div>

        <div
          class="flex-row"
          style="margin-left: 20px; justify-content: flex-start"
        >
          <div class="section-title" style="font-size: 12px">
            &bull; Interest:
          </div>
          <div class="section-value" style="margin-left: 15px; font-size: 12px">
            ${eI}
          </div>
        </div>

        <div
          class="flex-row"
          style="margin-left: 20px; justify-content: flex-start"
        >
          <div class="section-title" style="font-size: 12px">
            &bull; Penalty:
          </div>
          <div class="section-value" style="margin-left: 15px; font-size: 12px">
            ${ePe}
          </div>
        </div>

        <div class="flex-row">
          <div class="section-title">Saving's Deposit:</div>
          <div class="section-value">${savingDeposit}</div>
        </div>

        <div class="flex-row">
          <div class="section-title">Share Capital:</div>
          <div class="section-value">${shareCapital}</div>
        </div>
      </div>

      <div class="receipt-total">
        <div class="flex-row">
          <div class="section-title">Total Paid Amount:</div>
          <div class="section-value">${totalAmount}</div>
        </div>
      </div>

      <div class="receipt-details">
        <div class="flex-row">
          <div class="section-title">Receipt No.:</div>
          <div class="section-value">${receiptNo}</div>
        </div>

        <div class="flex-row">
          <div class="section-title">Date:</div>
          <div class="section-value">${formattedDate}</div>
        </div>

         <div class="flex-row">
          <div class="section-title">Reference ID:</div>
          <div class="section-value">${referenceID}</div>
        </div>
      </div>

      <div class="receipt-footer">
        <div class="flex-row text-center" style="justify-content: center; margin-top: 10px">
          <div class="section-title">Thank you for using our service!</div>
        </div>
      </div>
    </div>
  </body>
</html>

`,
    });
  };

  return (
    <SafeAreaView className="flex-1 p-5">
      <View className="space-y-10">
        <View className="">
          <Text
            className="text-center text-2xl font-bold"
            style={{color: '#000'}}>
            SUMMARY REPORT
          </Text>
          <Text
            className="text-center text-xs font-bold"
            style={{color: '#000'}}>
            Amount has been sent to the biller.
          </Text>
        </View>

        <View className="space-y-4">
          <View className="items-start">
            <Text
              className="text-center text-base font-bold"
              style={{color: '#000'}}>
              BILLER
            </Text>
            <View style={{flexDirection: 'row', padding: 5}}>
              <View style={{width: '50%'}}>
                <Text
                  style={{flexShrink: 1, fontWeight: 'bold', color: '#000'}}>
                  Biller Name
                </Text>
              </View>
              <View>
                <Text style={{flexShrink: 1, color: '#000'}}>{name}</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', padding: 5}}>
              <View style={{width: '50%'}}>
                <Text
                  style={{flexShrink: 1, fontWeight: 'bold', color: '#000'}}>
                  Account Number
                </Text>
              </View>
              <View>
                <Text style={{flexShrink: 1, color: '#000'}}>
                  000-000-000-000
                </Text>
              </View>
            </View>
          </View>

          <View className="h-[1] w-full border" />

          <View className="items-start">
            <Text
              className="text-center text-base font-bold"
              style={{color: '#000'}}>
              TOTAL PAID
            </Text>
            <View style={{flexDirection: 'row', padding: 5}}>
              <View style={{width: '50%'}}>
                <Text
                  style={{flexShrink: 1, fontWeight: 'bold', color: '#000'}}>
                  Amount
                </Text>
              </View>
              <View>
                <Text style={{flexShrink: 1, color: '#000'}}>
                  {totalAmount}
                </Text>
              </View>
            </View>
          </View>

          <View className="h-[1] w-full border" />

          <View className="items-start">
            <Text
              className="text-center text-base font-bold"
              style={{color: '#000'}}>
              TRANSACTIONS DETAILS
            </Text>

            <View style={{flexDirection: 'row', padding: 5}}>
              <View style={{width: '50%'}}>
                <Text
                  style={{flexShrink: 1, fontWeight: 'bold', color: '#000'}}>
                  Receipt No.
                </Text>
              </View>
              <View>
                <Text style={{flexShrink: 1, color: '#000'}}>{receiptNo}</Text>
              </View>
            </View>

            <View style={{flexDirection: 'row', padding: 5}}>
              <View style={{width: '50%'}}>
                <Text
                  style={{flexShrink: 1, fontWeight: 'bold', color: '#000'}}>
                  Date
                </Text>
              </View>
              <View>
                <Text style={{flexShrink: 1, color: '#000'}}>
                  {formattedDate}
                </Text>
              </View>
            </View>

            <View style={{flexDirection: 'row', padding: 5}}>
              <View style={{width: '50%'}}>
                <Text
                  style={{flexShrink: 1, fontWeight: 'bold', color: '#000'}}>
                  Reference ID
                </Text>
              </View>
              <View>
                <Text style={{flexShrink: 1, color: '#000'}}>
                  {referenceID}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="p-[10]" style={styles.container}>
          <View style={styles.specifications}>
            <Button full onPress={() => printHTML()}>
              PRINT
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
