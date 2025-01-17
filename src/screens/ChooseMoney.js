import React, {
  Image,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useState } from "react";
import styled from "styled-components/native";
import { Caption1, Display2 } from "../static/text.js";

import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Formik } from "formik";
import * as yup from "yup";

import { Request } from "../api/request.js";
import { getItemFromAsync, removeItemFromAsync } from "../api/storage.js";
import axios from "axios";

import { updateAdditionalInfo } from "../api/auth";

const Stack = createStackNavigator();
const checked = require("../assets/tch_icnTxtCheck.png");

const signupSchema = yup.object().shape({
  money: yup
    .number("금액을 입력해주세요")
    .required("시급을 입력해주세요")
    .max(500000, "500,000원 미만으로 입력해주세요"),
  //.matches(/\d/, "영문과 숫자를 입력해주세요"),
});

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

export default function ChooseMoney({ navigation }) {
  const [money, setMoney] = useState("");
  const request = new Request();

  const handleJobInfo = async (values) => {
    const name = await getItemFromAsync('name')
    const categoryId = await getItemFromAsync('categoryId')
    const scheduleList = await getItemFromAsync('scheduleList')
    const accessToken = await getItemFromAsync('accessToken')

    const response = await request.post('/workspaces', 
    {
      name: name,
      wage: values.money,
      scheduleList: scheduleList,
      categoryId: categoryId
    }, 
    )
    if(response.status == 200){
      navigation.navigate('Main')
    }
  }

  return (
    <Formik
      initialValues={{
        money: "",
      }}
      validationSchema={signupSchema}
      onSubmit={(values) => Alert.alert(JSON.stringify(values))}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        setFieldTouched,
        handleSubmit,
        isValid,
        isSubmitting,
      }) => (
        <DismissKeyboard>
          <Container>
            <HeaderWrapper>
              <Image style={{ height: 24, width: 223 }} source={Headerimg} />
            </HeaderWrapper>

            <MainContainer>
              <Display2>시급 입력하기</Display2>
              <View style={{ height: 40 }} />
              <Caption1>시급</Caption1>
            </MainContainer>
            <MoneyInputContainer>
              <MoneyInput
                placeholder="9,620"
                placeholderTextColor="#CCCCCC"
                keyboardType="number-pad"
                value={values.money}
                onChangeText={(text) => {
                  handleChange("money")(text);
                  setMoney(text); // formik 외부의 email 변수 갱신
                }}
                onBlur={() => setFieldTouched("money")}
                style={{
                  //position: "absolute",
                  borderBottomColor: values.money
                    ? !errors.money
                      ? "#6100FF"
                      : "#FF2626"
                    : "#CCCCCC",
                  borderBottomWidth: values.money ? 2 : 1,
                }}
              />
              {errors.money && <ErrorTxt>{errors.money}</ErrorTxt>}
              {values.money && !errors.money && (
                <EraseAll
                  disabled={!values.money}
                  //onPress={}
                >
                  <Image
                    source={checked}
                    disabled={!values.money}
                    style={{ width: 24, height: 24 }}
                  />
                </EraseAll>
              )}
            </MoneyInputContainer>
            <NextBtnContainer
              onPress={() => handleJobInfo(values)}
            >
              <Image
                style={{ height: 40, width: 40 }}
                source={values.money ? NextBtn : NextBtnGray}
              />
            </NextBtnContainer>
            <BackBtnContainer onPress={() => navigation.navigate("ChooseTime")}>
              <Image style={{ height: 40, width: 40 }} source={BackBtn} />
            </BackBtnContainer>
          </Container>
        </DismissKeyboard>
      )}
    </Formik>
  );
}

const Container = styled.SafeAreaView`
  display: flex;
  justify-content: center;
  //padding-left: 20px;
  //padding-right: 20px;
`;

const Headerimg = require("../assets/onBoarding/Header4.png");
const HeaderWrapper = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  //margin-top: 5%;
  margin-top: 24px;
  margin-bottom: 48px;
`;

const MainContainer = styled.View`
  margin: 20px;
`;

const MoneyInputContainer = styled.View`
  margin: 18px 20px;
`;

const MoneyInput = styled.TextInput`
  font-size: 16;
  line-height: 19;
  /*border-bottom: 5px;
  :focus {
    border-left-width: 0;
    border-right-width: 0;
    border-top-width: 0;
    border-bottom-width: 2px;
  }*/
  //border-bottom-width: 2px;
  padding-bottom: 8px;
`;

const NextBtn = require("../assets/onBoarding/Nextbtn.png");
const NextBtnGray = require("../assets/onBoarding/NextbtnGray.png");

const NextBtnContainer = styled.TouchableOpacity`
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  left: 85%;
  top: 752px;
  width: 40px;
  height: 40px;
`;

const BackBtn = require("../assets/onBoarding/BackbtnGray.png");
const BackBtnContainer = styled.TouchableOpacity`
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  left: 72%;
  top: 752px;
  width: 40px;
  height: 40px;
`;

const ErrorTxt = styled.Text`
  position: absolute;
  padding-top: 35px;
  font-size: 10;
  color: #ff2626;
  //right: "5.13%",
`;

const EraseAll = styled.TouchableOpacity`
  position: absolute;
  left: 93.72%;
  right: 28.97%;
  //top: 26.55%;
  bottom: 10.6%;
`;
