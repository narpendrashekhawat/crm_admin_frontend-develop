import React, { useState } from "react";
import {
  Box, Input, Button, Heading, Text,
  HStack, VStack, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Textarea,
  useToast,
} from "@chakra-ui/react";
import { GoHomeFill } from "react-icons/go";
import axios from "axios";
import LeftSidebar from "../LeftSideBarLayout/LeftSideBar";
import HeaderBar from "../Header/HeaderBar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/authContext";
import { Config } from "../Utils/Config";
import Footer from "../footer";

const AddHSNCode = () => {
  const navigate = useNavigate();
  const { authToken } = useAuth();
  
  const [hsnFormData, setHsnFormData] = useState({
    HSN_CD: "",
    HSN_Description: "",
    CGST: "",
    SGST: "",
    IGST: "",
    category: "",
  });

  const toast = useToast();
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHsnFormData((prev) => ({
      ...prev,
      [name]: value || ""
    }));
  };

  // Handle Cancel - redirect to previous page
  const handleCancel = () => {
    navigate(-1);
  };

  // Handle Add HSN Code
  const handleAddHSNCode = async () => {
    setLoading(true);
    try {
      // Validate required fields
      if (!hsnFormData.HSN_CD) {
        toast({
          description: 'Please fill in HSN Code field',
          duration: 2000,
          position: 'bottom-center',
          status: 'error',
          isClosable: true
        });
        setLoading(false);
        return;
      }

      // Prepare data for API
      const apiData = {
        HSN_CD: parseInt(hsnFormData.HSN_CD) || 0,
        HSN_Description: hsnFormData.HSN_Description || "",
        CGST: parseFloat(hsnFormData.CGST) || 0,
        SGST: parseFloat(hsnFormData.SGST) || 0,
        IGST: parseFloat(hsnFormData.IGST) || 0,
        category: hsnFormData.category || ""
      };

      const response = await axios.post(`${Config?.AddHSNCode_url}`, apiData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response?.status === 200 || response?.status === 201) {
        toast({
          description: response?.data?.message || 'HSN Code Added Successfully',
          duration: 2000,
          position: 'bottom-center',
          status: 'success',
          isClosable: true
        });
        
        // Reset form after successful submission
        setHsnFormData({
          HSN_CD: "",
          HSN_Description: "",
          CGST: "",
          SGST: "",
          IGST: "",
          category: "",
        });

        // Redirect to HSN listing page after successful save
        setTimeout(() => {
          navigate('/hsn');
        }, 1500);
      }
    } catch (error) {
      console.log(error, "Error in adding HSN Code!");
      toast({
        description: error?.response?.data?.message || 'Failed to add HSN Code',
        duration: 2000,
        position: 'bottom-center',
        status: 'error',
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box backgroundColor='#F0F4F9' height={"100%"}>
      <HStack justifyContent='space-between' px='20px' alignItems='flex-start'>
        <LeftSidebar />
        <Box width='80%'>
          <HeaderBar />
          <Box p={4} bg="white" mt='1rem' padding='12px 20px' borderRadius='15px 15px 0px 0px'>
            <Breadcrumb color="#8B8D97" padding='10px 0px 2rem 0px'>
              <BreadcrumbItem>
                <BreadcrumbLink href='/overview'><GoHomeFill color="#5570F1" /></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href='/hsn' color='#5570F1' fontSize='13px'>HSN</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href='' color='#8B8D97' fontSize='13px'>
                  Add HSN Code
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>

            <Box width='100%' maxWidth='1200px' mx="auto">
              <Heading 
                as="h3" 
                color='#45464E' 
                fontSize='18px' 
                fontWeight='600' 
                mb={8} 
                textAlign="center"
              >
                Add New HSN Code
              </Heading>
              
              <VStack gap='24px' alignItems='stretch' maxWidth='800px' mx="auto">
                <HStack width='100%' spacing={4}>
                {/* HSN Code */}
                <Box>
                  <Text fontSize='14px' color='#4A5568' mb={2}>HSN Code *</Text>
                  <Input 
                    name="HSN_CD" 
                    value={hsnFormData.HSN_CD} 
                    onChange={handleInputChange} 
                    placeholder="Enter HSN Code" 
                    bg='#eff1f999' 
                    fontSize='15px' 
                    height='48px'
                    type="number"
                    width="300px"
                  />
                </Box>

                {/* Category */}
                <Box>
                  <Text fontSize='14px' color='#4A5568' mb={2}>Category</Text>
                  <Input 
                    name="category" 
                    value={hsnFormData.category} 
                    onChange={handleInputChange} 
                    placeholder="Enter Category" 
                    bg='#eff1f999' 
                    fontSize='15px' 
                    height='48px'
                    width="300px"
                  />
                </Box>
                </HStack>

                {/* Tax Rates */}
                <HStack width='100%' spacing={4}>
                  <Box flex={1}>
                    <Text fontSize='14px' color='#4A5568' mb={2}>CGST (%)</Text>
                    <Input 
                      name="CGST" 
                      value={hsnFormData.CGST} 
                      onChange={handleInputChange} 
                      placeholder="CGST %" 
                      bg='#eff1f999' 
                      fontSize='15px' 
                      height='48px'
                      type="number"
                      step="0.01"
                    />
                  </Box>
                  <Box flex={1}>
                    <Text fontSize='14px' color='#4A5568' mb={2}>SGST (%)</Text>
                    <Input 
                      name="SGST" 
                      value={hsnFormData.SGST} 
                      onChange={handleInputChange} 
                      placeholder="SGST %" 
                      bg='#eff1f999' 
                      fontSize='15px' 
                      height='48px'
                      type="number"
                      step="0.01"
                    />
                  </Box>
                  <Box flex={1}>
                    <Text fontSize='14px' color='#4A5568' mb={2}>IGST (%)</Text>
                    <Input 
                      name="IGST" 
                      value={hsnFormData.IGST} 
                      onChange={handleInputChange} 
                      placeholder="IGST %" 
                      bg='#eff1f999' 
                      fontSize='15px' 
                      height='48px'
                      type="number"
                      step="0.01"
                    />
                  </Box>
                </HStack>

                

                {/* HSN Description */}
                <Box>
                  <Text fontSize='14px' color='#4A5568' mb={2}>HSN Description</Text>
                  <Textarea 
                    name="HSN_Description" 
                    value={hsnFormData.HSN_Description} 
                    onChange={handleInputChange} 
                    placeholder="Enter detailed HSN description..." 
                    bg='#eff1f999' 
                    fontSize='15px' 
                    minHeight='120px'
                    resize='vertical'
                    _placeholder={{
                      color: '#A0AEC0'
                    }}
                    _focus={{
                      borderColor: '#3E60AA',
                      boxShadow: '0 0 0 1px #3E60AA'
                    }}
                  />
                </Box>

                {/* Action Buttons */}
                <HStack justifyContent='center' mt={8} spacing={4}>
                  <Button 
                    onClick={handleCancel}
                    px={8}
                    py={6}
                    backgroundColor='#E2E8F0' 
                    color='#4A5568' 
                    fontSize='14px' 
                    fontWeight='500' 
                    borderRadius='8px'
                    _hover={{
                      backgroundColor: '#CBD5E0'
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddHSNCode}
                    px={8}
                    py={6}
                    backgroundColor='#3E60AA' 
                    color='white' 
                    fontSize='14px' 
                    fontWeight='500' 
                    borderRadius='8px'
                    isLoading={loading}
                    loadingText="Saving..."
                    _hover={{
                      backgroundColor: '#2C4A8A'
                    }}
                  >
                    Save
                  </Button>
                </HStack>
              </VStack>
            </Box>
          </Box>
        </Box>
      </HStack>
      <Footer />
    </Box>
  );
};

export default AddHSNCode;
