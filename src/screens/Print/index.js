import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CollectorList, collectorList} from '../../app/database/allSchema';
import styles from './styles';
import RNPrint from 'react-native-print';
import {Button} from '../../app/components';

export default function ({navigation, route}) {
  const [data, setData] = useState(null);
  const [selectedPrinter, setSelectedPrinter] = useState(null);

  const {
    name,
    regularLoans,
    emergencyLoans,
    savingDeposit,
    shareCapital,
    totalAmount,
  } = route.params;

  const printHTML = async () => {
    await RNPrint.print({
      html: `<html>
  <head>
    <title>Summary Report</title>
    <style>
      * {
        box-sizing: border-box;
      }
      body {
        font-family: Arial, sans-serif;
        margin: 10;
        padding: 0;
        background-color: #fff;
      }
      .container {
        max-width: 420px;
        margin: 0 auto;
        padding: 20px;
        background-color: #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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
        align-items: center; /* Add this line to vertically align the items */
        padding: 5px;
      }
      .receipt-header {
        margin-bottom: 10px;
      }
      .receipt-details {
        margin-bottom: 10px;
        background-color: #fff;
        padding: 10px;
        border-radius: 5px;
      }
      .receipt-total {
        margin-top: 10px;
      }
      .receipt-footer {
        margin-top: 20px;
        text-align: center;
        font-size: 12px;
      }
      @media print {
        body {
          background-color: #f9f9f9;
        }
        .container {
          margin: 0;
          box-shadow: none;
        }
        .receipt-footer {
          display: none;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="receipt-header">
        <h1 class="text-center font-bold" style="margin-bottom: 10px">
          SUMMARY REPORT
        </h1>
        <p class="text-center" style="margin-bottom: 10px">
          Amount has been sent to the biller.
        </p>
      </div>

      <div class="receipt-details">
        <div class="flex-row">
          <div>
            <p class="font-bold">Biller Name:</p>
          </div>
          <div>
            <p>${name}</p>
          </div>
        </div>

        <div class="flex-row">
          <div>
            <p class="font-bold">Account Number:</p>
          </div>
          <div>
            <p>{accountNum}</p>
          </div>
        </div>
      </div>

      <div class="receipt-total">
        <div class="flex-row">
          <div>
            <p class="font-bold">Total Paid:</p>
          </div>
          <div>
            <p>${totalAmount}</p>
          </div>
        </div>
      </div>

      <div class="receipt-details">
        <div class="flex-row">
          <div>
            <p class="font-bold">Receipt No.:</p>
          </div>
          <div>
            <p>{receiptNo}</p>
          </div>
        </div>

        <div class="flex-row">
          <div>
            <p class="font-bold">Date:</p>
          </div>
          <div>
            <p>{date}</p>
          </div>
        </div>

        <div class="flex-row">
          <div>
            <p class="font-bold">Reference ID:</p>
          </div>
          <div>
            <p>{refId}</p>
          </div>
        </div>
      </div>

      <div class="receipt-footer">
        <p>Thank you for using our service!</p>
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
                <Text style={{flexShrink: 1, color: '#000'}}>123</Text>
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
                  1 June 2023, 08:00AM
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
                <Text style={{flexShrink: 1, color: '#000'}}>1231231313</Text>
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
