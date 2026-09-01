import React, { useState } from "react";
import { Box, Button, HStack, Text, VStack, Image, PinInput, PinInputField, Center, Divider, useToast } from "@chakra-ui/react";
import logoicon from "../../assets/icons/logo.jpg";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Config } from "../../components/Utils/Config";
import { useAuth } from "../../components/Context/authContext";

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [userName, setUserName] = useState(location.state?.userName || "");
  // eslint-disable-next-line no-unused-vars
  const [authToken, setAuthToken] = useState("");
  const toast = useToast(); // Initialize toast
  const { saveAuthData } = useAuth();


  const handleOTPChange = (value) => {
    setOtp(value);
  };

  const verifyOTP = async () => {
    try {
      const response = await axios.post(`${Config.OTPVerification_url}`, {
        userName: userName,
        otp: otp,
      });

      if (response.status === 200) {
        const token = response.data.token;
        setAuthToken(token);
        saveAuthData(token, response.data.user);
        localStorage.setItem("authToken", token);
        localStorage.setItem('userId', response?.data?.user?.id)

        // Show success toast
        toast({
          title: "OTP Verified Successfully",
          description: "You are now authenticated.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top", // This positions the toast at the top of the screen
          variant: "subtle",
        });

        navigate("/overview");
      } else {
        // Show error toast for failed verification
        toast({
          title: "OTP Verification Failed",
          description: "Invalid or expired OTP.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top", // This positions the toast at the top of the screen
          variant: "subtle",
        });
      }
    } catch (error) {
      // Show error toast for server error
      toast({
        title: "OTP Verification Error",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top", // This positions the toast at the top of the screen
        variant: "subtle",
      });
    }
  };

  const handleSignIn = () => {
    verifyOTP();
  };

  return (
    <Box bg={"#efeaea"} display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Box flex={1} display="flex" justifyContent="center">
        <Image src={logoicon} alt="Jee1 Logo" width="510px" h="264px" />
      </Box>

      <Center height="550px" bg="#ffffff" w="4px">
        <Divider orientation="vertical" />
      </Center>

      <VStack flex={1} spacing={5} align="center">
        <Button
          bg="#3E60AA"
          border="10px solid "
          color="white"
          fontSize="16px"
          px
          boxShadow="md"
          w="206px"
          h="60px"
          borderRadius="24px"
          fontWeight="regular"
        >
          OTP
        </Button>

        <HStack>
          <PinInput margin="30px" value={otp} onChange={handleOTPChange} otp>
            <PinInputField border="1px solid gray" m="10px" bg="#F2F2F2" h="49px" w="50px" borderRadius="10px" />
            <PinInputField border="1px solid gray" m="10px" bg="#F2F2F2" h="49px" w="50px" borderRadius="10px" />
            <PinInputField border="1px solid gray" m="10px" bg="#F2F2F2" h="49px" w="50px" borderRadius="10px" />
            <PinInputField border="1px solid gray" m="10px" bg="#F2F2F2" h="49px" w="50px" borderRadius="10px" />
            <PinInputField border="1px solid gray" m="10px" bg="#F2F2F2" h="49px" w="50px" borderRadius="10px" />
          </PinInput>
        </HStack>

        <Text fontSize="16px" fontFamily="regular" color="#3E60AA">
          Please check your mail for OTP. <Text as="span" fontWeight="bold">2:00 mins</Text> left, to Resend{" "}
          <Text as="span" fontWeight="bold" color="blue.600" fontSize="16px">
            OTP
          </Text>
        </Text>

        <Button
          onClick={handleSignIn}
          height="47px"
          width="206px"
          borderRadius="25px"
          fontWeight="bold"
          fontSize="20px"
          bg="#3E60AA"
          color="#ffffff"
        >
          Verify OTP
        </Button>
      </VStack>
    </Box>
  );
};

export default OTPVerification;
