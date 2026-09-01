import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Image,
  Text,
  VStack,
  HStack,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import logoImg from "../../assets/icons/logo.jpg";
import clickIcon from "../../assets/icons//click.png";
import { Config } from "../../components/Utils/Config";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);

  const toast = useToast();

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Handle email input changes
  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    setIsEmailValid(validateEmail(inputEmail));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Additional validation before submission
    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    try {
      const response = await axios.post(`${Config.Login_url}`, {
        userName: email,
        password: password,
      });

      if (response.status === 200) {
        setTimeout(() => {
          toast({
            title: "OTP Sent",
            description: "OTP sent successfully. Please verify OTP.",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top",
            variant: "subtle",
          });
          navigate("/confirmation", { state: { userName: email } });
        }, 1000);
      }
    } catch (error) {
      setErrorMessage("Invalid credentials or something went wrong.");
      toast({
        title: "Login Failed.",
        description: "Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
        bg: "linear-gradient(45deg, #3e60aa, #6a8edb)",
        colorScheme: "blue",
        icon: "🔒"
      });
    }
  };

  return (
    <Flex
      boxShadow="md"
      borderRadius="lg"
      overflow="hidden"
      h="100vh"
      bg="#e9e9e9"
      align="center"
      justify="center"
      p={8}
    >
      {/* Logo Section */}
      <Box p={12} borderRight="2px solid #FFFCFC" display="flex" alignItems="center" justifyContent="center">
        <Image src={logoImg} alt="Logo" objectFit="contain" margin="100px" />
      </Box>

      {/* Login Form Section */}
      <Box p={12} width="400px" margin="150px">
        <VStack spacing={6} align="stretch">
          <Button
            backgroundColor="#3E60AA"
            border="10px solid white"
            borderRadius="24px"
            width="206px"
            h="55px"
            alignSelf="center"
            color="white"
            margin="56px"
          >
            Sign In
          </Button>

          <VStack align="start" width="100%">
            <FormControl>
              <FormLabel fontSize="14px" color="#8C8C91">
                Email address
              </FormLabel>
              <Flex
                bg="white"
                borderRadius="12px"
                width="474px"
                height="48px"
                align="center"
                px={3}
              >
                <Input
                  type="text"
                  value={email}
                  onChange={handleEmailChange}
                  flex="1"
                  outline="none !important"
                  border="none !important"
                  _focusVisible={{boxShadow: 'none'}}
                />
                {email && isEmailValid && (
                  <HStack color="green.500">
                    <Image src={clickIcon} boxSize="15px" alt="Verified" />
                    <Text fontSize="sm">Email Verified</Text>
                  </HStack>
                )}
              </Flex>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="14px" color="gray.500">
                Password
              </FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                borderRadius="12px"
                bg="#FFFFFF"
                width="474px"
                height="48px"
                border='none'
              />
            </FormControl>
            {errorMessage && (
              <Text color="red.500" fontSize="sm">{errorMessage}</Text>
            )}

            <HStack width={"160%"} align={"end"} justifyContent={"end"}>
             <FormControl>
               <Button
                backgroundColor="#3E60AA"
                borderRadius="25px"
                width="150px"
                height="48px"
                alignSelf="center"
                color="white"
                margin="48px"
                onClick={handleSubmit}
              >
                Sign In
              </Button>
             </FormControl>
            </HStack>
          </VStack>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Login;