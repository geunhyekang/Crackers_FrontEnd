import React from "react-native";
import styled from "styled-components/native";

import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Button,
  Keyboard,
  SafeAreaView,
  Pressable,
} from "react-native";
import { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { TextInput } from "react-native-gesture-handler";
import { Formik } from "formik";
import * as yup from "yup";
//import useKeyboardHeight from "react-native-use-keyboard-height";
import { getItemFromAsync, removeItemFromAsync, clearItemsFromAsync } from "../api/storage";

import { Request } from "../api/request";

const Stack = createStackNavigator();
const backIcon = require("../assets/tch_btnBack.png");

const signupSchema = yup.object().shape({
//   password: yup
//     .string()
//     .required("비밀번호를 입력해 주세요")
//     // .max(8, "8자 이내로 닉네임을 입력해주세요"),
//   //.matches(/\d/, "영문과 숫자를 입력해주세요"),
    password: yup
    .string()
    .oneOf([yup.ref("password")], "비밀번호가 일치하지 않습니다"),  
});

export default function WithdrawScreen({ navigation }) {
  const [under, setUnder] = useState("#CCCCCC");
  var password = ''
  const request = new Request();
  useEffect(() => {
    const getPassword = async () => {
      password = await getItemFromAsync('password')
    }
    getPassword();
  }, [])
  
  const withdraw = async () => {
    const response = await request.patch('/accounts/withdraw')
    if (response.status === 200) {
      Alert.alert(response.data)
      await clearItemsFromAsync();
      navigation.navigate('Home');
    } else {
      Alert.alert('회원 탈퇴에 실패하였습니다!')
    }
  }

  const withdrawConfirmAlert = async () => {
    Alert.alert(
        "알림",
        "정말로 탈퇴하시겠습니까?",
        [
            {
                text: "예",
                onPress: withdraw,
                style: 'destructive',
            },
            {
                text: "아니오",
                style: "cancel"
            },
        ],
        { cancelable: false }
    );
  }

  return (
    <Formik
      initialValues={{
        password: "",
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
        <Wrapper>
          <BackToHome>
            <BackIcon source={backIcon} />
          </BackToHome>
          <FormContainer>
            <Title>회원 탈퇴하기</Title>
            <View style={{ height: 200 }} />
            <SubTitle>계정 비밀번호</SubTitle>
            <View style={{ height: 18 }} />
            <InputWrapper>
              <InputTxt
                style={{
                  //position: "absolute",
                  borderBottomColor: values.nickname ? "#6100FF" : "#CCCCCC",
                  borderBottomWidth: values.nickname ? 2 : 1,
                }}
                placeholder="비밀번호 입력"
                autoCapitalize={false}
                value={values.password}
                onChangeText={
                  handleChange("password")

                  //setUnder("#6100FF")
                }
                onBlur={() => setFieldTouched("password")}
                secureTextEntry={true}
                textContentType="password"
              />
              {values.password != password && (
                <ErrorTxt>비밀번호가 일치하지 않습니다</ErrorTxt>
              )}
            </InputWrapper>
          </FormContainer>
          <SubmitBtn
            style={{
              backgroundColor:
                values.password && values.password == password
                  ? "#6100FF"
                  : "white",
              //flex: 1,
              //justifyContent: "flex-end",
            }}
            onPress={withdrawConfirmAlert}
            disabled={values.password != password}
          >
            <SubmitTxt>회원 탈퇴하기</SubmitTxt>
          </SubmitBtn>
        </Wrapper>
      )}
    </Formik>
  );
}

const Wrapper = styled.View`
  background: white;
  flex: 1;
  //paddingTop: 100,
  align-items: center;
  //paddingHorizontal: 15,
`;
const FormContainer = styled.View`
  padding: 20px;
  width: 100%;
`;
const BackToHome = styled.TouchableOpacity`
  position: absolute;
  width: 20;
  height: 40;
  left: 10;
`;
const BackIcon = styled.Image`
  position: absolute;
  width: 20;
  height: 40;
  left: 10;
  top: 50;
`;
const Title = styled.Text`
  position: absolute;
  left: 5.13%;
  //right: 78.72%;
  top: 140;
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 29px;
  display: flex;
  align-items: center;
  color: #202020;
`;

const SubTitle = styled.Text`
  //position: absolute;
  color: #606060;
  font-size: 14;
  font-weight: 400;
`;

const InputWrapper = styled.View`
  margin-bottom: 15px;
`;

const InputTxt = styled.TextInput`
  padding-bottom: 8px;
  /*
    borderBottomColor: values.email ? "#6100FF" : "#CCCCCC",
    borderBottomWidth: values.email ? 2 : 1,
    border-bottom-color: values.password
        ? #6100FF
        : #CCCCCC;
    border-bottom-width: values.password ? 2 : 1;*/
`;
const ErrorTxt = styled.Text`
  padding-top: 5px;
  font-size: 10;
  color: #ff2626;
  //right: "5.13%",
`;

const SubmitBtn = styled.TouchableOpacity`
  position: absolute;
  //top: keyboardHeight;
  //background-color: #395B64;
  width: 350;
  height: 44;
  bottom: 52;
  //padding: 10px;
  border-radius: 100;
  justify-content: center;
  align-items: center;
`;

const SubmitTxt = styled.Text`
  color: #fff;
  text-align: center;
  font-size: 16;
  font-weight: 600;
`;

const CheckBtn = styled.TouchableOpacity`
  position: absolute;
  left: 270;
  background-color: #cccccc;
  width: 81;
  height: 33;
  padding: 10px;
  border-radius: 100;
`;

const CheckTxt = styled.Text`
  text-align: center;
  font-size: 14;
  font-weight: 400;
`;
