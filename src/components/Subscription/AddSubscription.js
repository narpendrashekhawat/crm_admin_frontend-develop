import React, { useState } from "react";
import {
    Box, Input, Button, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Select, Text, Flex,
    HStack, VStack, useDisclosure, Modal, ModalOverlay, ModalContent,
    ModalBody, useToast, FormControl, FormLabel, FormErrorMessage, Heading,  IconButton, Textarea,
  Switch, Spinner,
} from "@chakra-ui/react";
import LeftSidebar from "../LeftSideBarLayout/LeftSideBar";
import HeaderBar from "../Header/HeaderBar";
import { GoHomeFill } from "react-icons/go";
import Footer from "../footer";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { Config } from "../Utils/Config";
import axios from "axios";
import { IoIosArrowDown } from "react-icons/io";

const AddSubscription = () => {

    const InputStl = {
        fontSize:"14px",
        color:"#333333",
        border:"1px solid",
        width:"300px",
        height:"48px",
        borderRadius:"none",
    }

    const platformOptions = [
    { label: "Retailer", value: "Retailer" },
    { label: "Manufacturer", value: "Manufacturer" },
    { label: "Distributor", value: "Distributor" }
  ];

const [name, setName] = useState("");
const [base_price, setBase_price] = useState("");
const [pricing_type, setPricing_type] = useState("");
const [plan_type, setPlan_type] = useState("");
const [min_users, setMin_users] = useState("");
const [status, setStatus] = useState(false);
const [userType, setUserType] = useState('');


const navigate = useNavigate();

   const toast = useToast();

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!name || !base_price || !pricing_type || !plan_type || !min_users || !status || !userType) {
    toast({
      title: "Missing Fields",
      description: "Please fill all required fields before submitting.",
      status: "warning",
      duration: 4000,
      isClosable: true,
      position: "top-right",
    });
    return; 
  }

  setSaving(true);

  const data = {
    name,
    base_price,
    pricing_type,
    plan_type,
    min_users,
    status,
    userType
  };

  try {
    const response = await axios.post(
      `${Config?.Add_Subscription_url}`,
      data, //  body data 
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
           "Content-Type": "application/json",
        },
      }
    );

    console.log(" API Response:", response.data);

    toast({
      title: "Success!",
      description: "Subscription Plan Added Successfully.",
      status: "success",
      duration: 4000,
      isClosable: true,
      position: "top-right",
    });

    navigate("/Subscriptions-status");
  } catch (error) {
    console.error(" Error:", error);
    toast({
      title: "Error!",
      description: "Something went wrong while saving.",
      status: "error",
      duration: 4000,
      isClosable: true,
      position: "top-right",
    });
  } finally {
    setSaving(false);
  }
};


  const handleCancel = () => {
    
      navigate("/Subscriptions-status");
  };
  const [saving, setSaving] = useState(false);
  return (
    <Box backgroundColor='#F0F4F9' height={"100%"}>
            <HStack justifyContent='space-between' px='20px' alignItems='flex-start'>
                <LeftSidebar />
                <Box width='80%'>
                    <HeaderBar />
                    <Box p={4} bg="white" mt='1rem' padding='12px 20px'>
                        <Breadcrumb color="#8B8D97" padding='10px 0px 2rem 0px'>
                            <BreadcrumbItem>
                                <BreadcrumbLink href='/overview'><GoHomeFill color="#5570F1" /></BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                                <BreadcrumbLink href='/Subscriptions-status' color='#8B8D97' fontSize='13px'>Subscription List </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                                <BreadcrumbLink href='/Subscriptions-status/add-Subscription' color='#8B8D97' fontSize='13px'>Add Subscription</BreadcrumbLink>
                            </BreadcrumbItem>
                        </Breadcrumb>
                    
                    
                    <Box maxW="800px" mx="auto" p={6}>
      <Heading as="h3" color='#45464E' fontSize='16px' fontWeight='500' mb={6} height='40px' display="flex" justifyContent="center">
        Add Subscription Plan
      </Heading>

      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
            <HStack display={"flex"}>
          <FormControl isRequired>
            <FormLabel fontSize="12px" color="#333333">Plan Name</FormLabel>
            <Input value={name} sx={InputStl} onChange={(e) => setName(e.target.value)} placeholder="Enter Plan Name" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontSize="12px" color="#333333">Price</FormLabel>
            <Input
            sx={InputStl}
              type="number"
              value={base_price}
              onChange={(e) => setBase_price(e.target.value)}
              placeholder="Enter Price (e.g. 499)"
            />
          </FormControl>
          </HStack>
           <HStack display={"flex"}>
          <FormControl position={"relative"} isRequired>
            <FormLabel fontSize="12px" color="#333333">Pricing Type</FormLabel>
            <Text position={"absolute"} top={"43px"} right={"90px"}>
            <IoIosArrowDown />
            </Text>
            <Select  icon={"none"} sx={InputStl} onChange={(e) => setPricing_type(e.target.value)} value={pricing_type} placeholder="Select Price">
              <option value="flat">Flat</option>
               <option  value="per_user">Per User</option>
             {/* <option value="6 Months">6 Months</option>
              <option value="1 Year">1 Year</option>
              <option value="Lifetime">Lifetime</option> */}
            </Select>
          </FormControl>

          <FormControl position={"relative"} isRequired >
            <FormLabel fontSize="12px" color="#333333">Plan Type</FormLabel>
            <Text position={"absolute"} top={"43px"} right={"90px"}>
            <IoIosArrowDown />
            </Text>
            <Select icon={"none"} sx={InputStl} onChange={(e) => setPlan_type(e.target.value)} value={plan_type} placeholder="Select Plan">
              <option value="Service Plan">Service Plan</option>
               <option value="Addons">Addons</option>
              {/*<option value="Lifetime">Lifetime</option> */}
              
            </Select>
          </FormControl>
            </HStack>
            <HStack spacing={4}>
              {/* Min Users */}
              <FormControl isRequired>
                <FormLabel fontSize="12px" color="#333333">
                  Min Users
                </FormLabel>
                <Input
                  sx={InputStl}
                  type="number"
                  value={min_users}
                  onChange={(e) => setMin_users(e.target.value)}
                  placeholder="Enter Users"
                />
              </FormControl>

              {/* Platform Type */}
              <FormControl position="relative" isRequired>
              <FormLabel fontSize="12px" color="#333333">
                Platform Type
              </FormLabel>

              <Text position={"absolute"} top={"43px"} right={"90px"}>
                <IoIosArrowDown />
              </Text>

              <Select
                icon={"none"}
                sx={InputStl}
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                placeholder="Select Platform"
              >
                {platformOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormControl>
          </HStack>
          <FormControl isRequired display="flex" alignItems="center">
            <FormLabel mb="0">Active Status</FormLabel>
            <Switch onChange={(e) => setStatus(e.target.checked)} isChecked={status} />
          </FormControl>
         <HStack justifyContent="flex-end" spacing={4} mt={6}>
          <Button onClick={handleCancel} variant="outline"  bg={'#D4D4D8'} cursor={"pointer"}  px="3rem"  py="0.5rem" color={'#fff'} borderRadius={"full"} minW={'fit-content'} _hover={{ bg: "#6b6b6dff" }}>
             Cancel
           </Button>
          <Button
                         onClick={handleSubmit}
                         isDisabled={saving} // disable while saving
                         px="3rem"
                         py="0.5rem"
                         color="#fff"
                         borderRadius="full"
                         minW="fit-content"
                         bg="#3e60aa"
                         type="submit"
                         _hover={{ bg: "#14204A" }}
                       >
                        
                         {saving ? <Spinner size="sm" mr={2} /> : "Save"}
                          </Button>
                          </HStack>
                       </VStack>
                     </form>
                   </Box>
                    </Box>
                    <Footer />
                </Box>
            </HStack>
                                    

        </Box>
  )
}

export default AddSubscription;