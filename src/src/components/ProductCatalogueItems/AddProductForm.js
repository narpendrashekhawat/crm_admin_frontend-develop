import React, { useContext, useEffect, useState } from "react";
import {
  Box, Input, Select, Switch, Flex, Button, Heading, Text,
  HStack, VStack, Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  useToast,
} from "@chakra-ui/react";
import { GoHomeFill } from "react-icons/go";
import axios from "axios";
import LeftSidebar from "../../components/LeftSideBarLayout/LeftSideBar";
import HeaderBar from "../../components/Header/HeaderBar";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../src/components/Context/authContext";
import { Config } from "../../../src/components/Utils/Config";
import Footer from "../footer";


const AddProductForm = ({ productDetails, getProductDetailsbyId }) => {
  const { id } = useParams()
  console.log(id, 'productId')
  const MfgId = 'DEFAULT';
  const { authToken } = useAuth();
  const [formData, setFormData] = useState({
    PName: "",
    PackagingDetails: "",
    ProductForm: "",
    SaltComposition: "",
    // LOCKED: 0,
    PCode: "",
    manufacturerName: "",
    Generic: "",
    PCategory: "",
    DNick: "",
    DMfg: "",
    PNick: "",
    PMfg: "",
    BatchNo: "",
    ExpDate: "",
    Scheme: "",
    location: "",
    HSN: '',
    Package: '',
    manufacturerId: '',
    Quantity: '',
    DPCO: 0,
    BoxPack: 0,
    CasePack: 0,
    GSTPer: 0,
    MRP: 0,
    PTR: 0,
    PTS: 0,
    BoxQty: 0,
    Loose: 0,
    Stock: 0,
    LOCKED: false,

  });

  const toast = useToast();

  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('')
  const fetchManufacturer = async (companyName) => {
    setloading(true);
    try {
      const response = await axios.get(`${Config?.Get_Company_Name}?companyName=${search}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });


      if (response.data.status === 200) {
        setManufacturers(response.data.manufacturers);
      } else {

      }
    }
    catch (err) {
      setError("Error fetching data");

      console.error(err);
    }

    setloading(false);
  };

  useEffect(() => {
    fetchManufacturer()
  }, [])

  const manufacturesList = () => {

  }

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || ""
    }));
  };

  // Handle select changes
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || ""
    }));
  };

  const handleSwitchChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      LOCKED: e.target.checked ? 1 : 0
    }));
  };

  // Handle API request
  const handleAddProduct = async () => {
    try {
      const response = await axios.post(`${Config?.AddProductForm_url}`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      if (response?.status === 200 || response?.data?.status === 201) {
        toast({
          description: response?.data?.message || 'Product Added Successfully',
          duration: 2000,
          position: 'bottom-center',
          status: 'success',
          isClosable: true
        })
        setFormData({
          PName: "",
          PackagingDetails: "",
          ProductForm: "",
          SaltComposition: "",
          LOCKED: 0,
        });
      }
    } catch (error) {
      console.log(error, "Error in fetching API response!");
    }
  };

  useEffect(() => {
    if (productDetails && Object.keys(productDetails).length > 0) {
      setFormData({
        PName: productDetails?.PName || '',
        SaltComposition: productDetails?.SaltComposition || '',
        Quantity: productDetails?.Package || '',
        ProductForm: productDetails?.ProductForm        || '',
        LOCKED: productDetails?.LOCKED || 0,
      })
    }
  }, [productDetails])

  const handleEditProduct = async () => {
    try {
      const response = await axios.post(`${Config?.AddProductForm_url}`, {
        PId: id,
        LOCKED: formData?.LOCKED || 0,
        PName: formData?.PName,
        SaltComposition: formData?.SaltComposition,
        ProductForm: formData?.ProductForm,
        Quantity: formData?.Quantity

      }, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })
      if (response?.status === 200 ) {
        toast({
          description: response?.data?.message || 'Product Updated Successfully',
          duration: 2000,
          isClosable: true,
          status: 'success'
        })
        getProductDetailsbyId();
      } else {
        toast({
          description: response?.data?.message || 'Product not found',
          duration: 2000,
          isClosable: true,
          status: 'error'
        })
      }
    } catch (error) {
      console.log(error, "Error in fetching API response.")
      toast({
        description: 'Something went wrong, please try again.',
        duration: 2000,
        isClosable: true,
        status: 'error'
      })
    }
  }


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
                <BreadcrumbLink href='/products' color='#5570F1' fontSize='13px'>Product Management</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href='' color='#8B8D97' fontSize='13px'>New Product_Edit Product</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>

            <HStack alignItems='center'>
              <Box width='1238px' height="550px">
                <Heading as="h3" color='#45464E' fontSize='16px' fontWeight='500' mb={6} height='40px' display="flex" justifyContent="center">
                  {id ? "Edit Product" : "New Product / Edit Product"}
                </Heading>
                <HStack alignItems='flex-start' gap='18px' m="12px">

                  <VStack gap='20px' alignItems='baseline' width='100%' >


                    <HStack width='100%'>
                      <Select
                        name="manufacturerId"
                        value={formData.manufacturerId}
                        onChange={handleChange}
                        placeholder='Search Manufacturer Name'
                        bg='#eff1f999'
                        fontSize='15px'
                        height='48px'
                      >
                        {manufacturers?.map((data, index) => (
                          <option key={data?._id || index} value={data?.ManufacturerID}>
                            {data?.CompanyName}
                          </option>
                        ))}
                      </Select>


                      <Input name="PName" value={formData.PName} onChange={handleChange} placeholder="Product Name" bg='#eff1f999' fontSize='15px' height='48px' />
                      <Input name="SaltComposition" value={formData.SaltComposition} onChange={handleChange} placeholder="Salt Composition" bg='#eff1f999' fontSize='15px' height='48px' />

                      
                    </HStack>
                    <HStack width='100%'>
                    <Input name="Package" value={formData.Package} onChange={handleChange} placeholder="Package" bg='#eff1f999' fontSize='15px' height='48px' width={'1152px'} />
                    <Input name="Package form" value={formData.PackageForm} onChange={handleChange} placeholder="Package form" bg='#eff1f999' fontSize='15px' height='48px' />
                      <Input name="Quantity" value={formData.Quantity} onChange={handleChange} placeholder="Enter Quantity" bg='#eff1f999' fontSize='15px' height='48px' />
                    </HStack>

                    <VStack justify="space-between" align="baseline" width='100%'>
                      <Flex align="center" w='100%' justifyContent='space-between' width='33%' paddingLeft='5px'>
                        <Text mr="2" color='#8B8D97' fontWeight='500'>Status</Text>
                        <HStack >
                          <Text m="24px" fontSize='14px' color='#83898C'> {formData.LOCKED === 1 ? "Locked" : "Unlocked"}</Text>
                          <Switch isChecked={formData.LOCKED === 1} onChange={handleSwitchChange} sx={{
                            "& .chakra-switch__track": {
                              backgroundColor: formData.LOCKED === 1 ? "#9a9fb854" : "green.400",
                              // width: "32px",
                            },
                            // "& .chakra-switch__thumb": { bg: "#BBC5CB" },
                          }} />
                        </HStack>
                      </Flex>
                    </VStack>

                    <HStack width='100%' justifyContent='end' >
                      <Button p='17px 16px' backgroundColor='#CC5F5F' color='white' fontSize='14px' fontWeight='500' borderRadius='12px' w='15%' marginRight="33px">Remove Product</Button>
                      <Button
                        onClick={() => id ? handleEditProduct(formData) : handleAddProduct()}
                        p='17px 16px' backgroundColor='#3E60AA' color='white' fontSize='14px' fontWeight='500' borderRadius='12px' w='16%'>{id ? "Edit" : "Save"}</Button>
                    </HStack>
                  </VStack>
                </HStack>
              </Box>
            </HStack>
          </Box>
        </Box>
      </HStack>
      <Footer />

      
    </Box>
    
    
  );
  
};

export default AddProductForm;