import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, VStack, Text, HStack, Input, Select, FormControl, FormLabel, Switch, Button, useToast } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { GoHomeFill } from "react-icons/go";
import LeftSidebar from "../LeftSideBarLayout/LeftSideBar";
import HeaderBar from "../Header/HeaderBar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Config } from "../Utils/Config";
import Footer from "../footer";
import { useAuth } from "../Context/authContext";
import { ProductDropdown } from "./AddProductForm";

const Editproduct = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const { id } = useParams(); // Get product ID from URL if available
    const productId = id || "428"; // Use ID from params or default to 428
    const [manufacturers, setManufacturers] = useState([]);
    const { authToken } = useAuth();

    // State to manage form data
    // const [FormData, setFormData] = useState({
    //     PCode: "",
    //     manufacturerName: "",
    //     PName: "",
    //     Package: "",
    //     ProductForm: "",
    //     Quantity: "",
    //     SaltComposition: "",
    //     PCategory: "",
    //     BoxPack: "",
    //     CasePack: "",
    //     GSTPer: "",
    //     DNick: "",
    //     DMfg: "",
    //     PNick: "",
    //     pMfg: "",
    //     isGeneric: false,
    //     isDPCO: false,
    //     isLocked: false
    // });

    const toBoolean = (val) => {
        if (typeof val === 'string') {
            return val.toLowerCase() === 'true';
        }
        return Boolean(val);
    };

    // Set form data with API response
    const [FormData, setFormData] = useState({
        PId: id.PId || "",
        PCode: productId.PCode || "",
        PName: productId.PName || "",
        PackagingDetails: productId.PackagingDetails || "",
        Package: productId.Package || "",
        ProductForm: productId.ProductForm || "",
        Quantity: productId.Quantity || "",
        SaltComposition: productId.SaltComposition || "",
        // Generic: productId.Generic || "",
        PCategory: productId.PCategory || "",
        // DPCO: productId.DPCO || "",
        BoxPack: productId.BoxPack || "",
        CasePack: productId.CasePack || "",
        GSTPer: productId.GSTPer || "",
        MRP: productId.MRP || "",
        PTR: productId.PTR || "",
        DNick: productId.DNick || "",
        DMfg: productId.DMfg || "",
        PNick: productId.PNick || "",
        PMfg: productId.PMfg || "",
        // LOCKED: productId.LOCKED === 1,  // convert 0/1 to boolean
        manufacturerId: productId.manufacturerId || "",
        ManufacturerID: productId.ManufacturerID || "",
        uploadedBy: productId.uploadedBy || "",
        HSN: productId.HSN || "",
        UQC: productId.UQC || "",
        Generic: toBoolean(productId.Generic),
        DPCO: toBoolean(productId.DPCO),
        LOCKED: toBoolean(productId.LOCKED),
    });

    // State to track loading state
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false); // Changed to false since we don't fetch initially

    // Component mounting info message
    useEffect(() => {
        toast({
            title: "Product editor ready",
            description: "Please fill in the product details",
            status: "info",
            duration: 2000,
            isClosable: true,
        });
    }, [toast]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle switch changes
    const handleSwitchChange = (field) => {
        setFormData(prev => ({
            ...prev,
            [field]: !toBoolean(prev[field])  // ensure toggling boolean
        }));
    };


    // Handle select change specifically for PCategory
    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setFetchLoading(true);
                const res = await axios.get(`${Config?.Fetch_Product}/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                });
                if (res.data && res.data.product) {
                    const product = res.data.product;
                    // console.log("Fetched Product:", product); // SHOW IN CONSOLE
                    setFormData(product); // assuming formData fields match product keys
                } else {
                    console.warn("No product found in API response:", res.data);
                }


            } catch (err) {
                console.error("Failed to fetch product:", err);
            }
        };

        fetchData();
    }, [id]); // `id` is the product ID you’re editing

    useEffect(() => {
        const fetchManufacturers = async () => {
            try {
                const res = await axios.get(`${Config?.Get_Company_Name}?limit=10000`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                });

                if (res.data?.data?.manufacturers) {
                    setManufacturers(res.data.data.manufacturers);
                }
            } catch (err) {
                console.error("Error fetching manufacturers", err);
                toast({
                    title: "Failed to load manufacturers",
                    status: "error",
                    isClosable: true,
                });
            }
        };

        fetchManufacturers();
    }, []);


    // useEffect(() => {
    // async function fetchProduct() {
    //     try {
    //     setFetchLoading(true);
    //     const res = await axios.get(`${Config?.Fetch_Product}/${id}`, {
    //         headers: {
    //         Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    //         },
    //     });
    //     if (res.data) {
    //         setFormData(res.data);
    //     }
    //     } catch (err) {
    //     toast({
    //         title: "Failed to fetch product",
    //         status: "error",
    //         isClosable: true,
    //     });
    //     } finally {
    //     setFetchLoading(false);
    //     }
    // }

    // fetchProduct();
    // }, [productId]);

    // console.log("product:", FormData);


    // Handle submit action - directly update the product without fetching first 
    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Using the specified API endpoint directly from your requirement
            const response = await axios.put(`${Config?.Edit_product_url}/${id}`, FormData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });


            if (response.data) {
                toast({
                    title: "Product updated successfully",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                // Navigate back to product list after successful update
                navigate('/product-catalogue');
            }
        } catch (error) {
            console.error("Error updating product:", error);
            toast({
                title: "Failed to update product",
                description: error.response?.data?.message || "An error occurred",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        console.log("FormData updated:", FormData);
    }, [FormData]);



    // if (fetchLoading) {
    //     return (
    //         <Box backgroundColor='#F0F4F9' height={"100vh"} display="flex" justifyContent="center" alignItems="center">
    //             <Text fontSize="xl">Loading product data...</Text>
    //         </Box>
    //     );
    // }  

    const [dropdowns, setDropdowns] = useState([]);

    useEffect(() => {
        const fetchDropdowns = async () => {
            const res = await axios.get(`${Config.product_dropdowns}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (res.data?.status == 200) {
                setDropdowns(res.data?.apiData);
            }
        }

        fetchDropdowns();
    }, []);

    return (
        <Box backgroundColor='#F0F4F9' height={"100%"}>
            <HStack justifyContent='space-between' px='20px' alignItems='flex-start'>
                <LeftSidebar />
                <Box width='100%'>
                    <HeaderBar />
                    <>
                        <Box p={4} bg="white" mt='1rem' padding='12px 20px' borderRadius='15px 15px 0px 0px'>
                            <Breadcrumb color="#8B8D97" padding='10px 0px 2rem 0px' >
                                <BreadcrumbItem>
                                    <BreadcrumbLink href='/overview'><GoHomeFill color="#5570F1" /></BreadcrumbLink>
                                </BreadcrumbItem>

                                <BreadcrumbItem>
                                    <BreadcrumbLink href='/product-catalogue' color='#5570F1' fontSize='13px'>Product Management</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href='/product-catalogue/Editproduct/:id' color='#8B8D97' fontSize={'13px'} fontWeight={'400'}> Add Edit Product</BreadcrumbLink>
                                </BreadcrumbItem>
                            </Breadcrumb>

                            <Box >
                                <VStack>
                                    <Text> Edit Product</Text>
                                </VStack>


                                <HStack>
                                    <VStack w={'375px'} h={'50px'} mt={'25px'} ml={'30px'} >

                                        <Text
                                            alignSelf="start"
                                            color="#000007ff"
                                            fontSize="18px"
                                            fontWeight="400"
                                        >
                                            Pcode:&nbsp;
                                            <span style={{ color: '#4A4A4A', fontWeight: 500 }}>
                                                {FormData?.PCode || 'N/A'}
                                            </span>
                                        </Text>
                                    </VStack>
                                </HStack>


                                <HStack>

                                    <VStack w={'375px'} h={'75px'} mt={'20px'} ml={'30px'} >
                                        <Text alignSelf={'start'} color={'#8C8C91'} size={'14'} fontWeight={'400'}>HSN Code</Text>
                                        <Input
                                            name="HSN"
                                            value={FormData.HSN || ""}
                                            onChange={handleChange}
                                            bg={'#eff1f9'}
                                            color={'#000'}
                                            fontSize={'16px'}
                                            fontWeight={'400'}
                                            placeholder="HSN Code"
                                        />
                                    </VStack>

                                    <VStack w={'375px'} h={'75px'} mt={'20px'} ml={'30px'}>
                                        {/* <Text alignSelf={'start'} color={'#8C8C91'} size={'14'} fontWeight={'400'}>Manufacturer Name</Text>
                                        <Input
                                            name="manufacturerId"   //manufacturerName
                                            value={FormData.manufacturerId || ""} //ManufacturerName
                                            onChange={handleChange}
                                            bg={'#eff1f9'}
                                            color={'#000'}
                                            fontSize={'16px'}
                                            fontWeight={'400'}
                                            placeholder="Enter ManufacturerName"
                                        /> */}
                                        <FormControl isRequired>
                                            <FormLabel>Manufacturer</FormLabel>
                                            <Select
                                                name="manufacturerId"
                                                value={FormData.manufacturerId || ""}
                                                onChange={handleChange}
                                                bg="#eff1f9"
                                                color="#000"
                                                fontSize="16px"
                                                fontWeight="400"
                                            >
                                                {/* Placeholder option */}
                                                <option value="" disabled>
                                                    Select Manufacturer
                                                </option>
                                                {manufacturers.map((mfg) => (
                                                    <option key={mfg.ManufacturerID} value={mfg.ManufacturerID}>
                                                        {mfg.CompanyName}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </VStack>

                                    <VStack w={'375px'} h={'75px'} mt={'20px'} ml={'30px'}>
                                        <Text alignSelf={'start'} color={'#8C8C91'} size={'14'} fontWeight={'400'}>PName</Text>
                                        <Input
                                            name="PName"
                                            // value={FormData.PName}
                                            value={FormData.PName || ""}
                                            onChange={handleChange}
                                            bg={'#eff1f9'}
                                            color={'#000'}
                                            fontSize={'16px'}
                                            fontWeight={'400'}
                                            placeholder="Enter PName"
                                        />
                                    </VStack>
                                </HStack>

                                <HStack >
                                    <VStack w={'375px'} h={'75px'} mt={'20px'} ml={'30px'}>
                                        <Text alignSelf={'start'} color={'#8C8C91'} size={'14'} fontWeight={'400'}>Package</Text>
                                        {/* <Input
                                            name="Package"
                                            value={FormData.Package || ""}
                                            onChange={handleChange}
                                            bg={'#eff1f9'}
                                            color={'#000'}
                                            fontSize={'16px'}
                                            fontWeight={'400'}
                                            placeholder="Packaging"
                                        /> */}
                                        <ProductDropdown
                                            name={"Package"}
                                            value={FormData.Package || ""}
                                            onChange={handleChange}
                                            options={dropdowns?.PRODUCT_PACKAGE || []}
                                            placeholder="Package"
                                            isRequired
                                            bg={'#eff1f9'}
                                            fontSize={'16px'}
                                            fontWeight={'400'}
                                            height="40px"
                                            width="375px"
                                        />
                                    </VStack>

                                    <VStack w={'375px'} h={'75px'} mt={'20px'} ml={'30px'}>
                                        <Text alignSelf={'start'} color={'#8C8C91'} size={'14'} fontWeight={'400'}>ProductForm</Text>
                                        {/* <Input
                                            name="ProductForm"
                                            value={FormData.ProductForm || ""}
                                            onChange={handleChange}
                                            bg={'#eff1f9'}
                                            color={'#000'}
                                            fontSize={'16px'}
                                            fontWeight={'400'}
                                            placeholder="Enter ProductForm"
                                        /> */}
                                        <ProductDropdown
                                            name={"ProductForm"}
                                            value={FormData.ProductForm || ""}
                                            onChange={handleChange}
                                            options={dropdowns?.PRODUCT_FORM || []}
                                            placeholder="Product Form"
                                            isRequired
                                            bg={'#eff1f9'}
                                            fontSize={'16px'}
                                            fontWeight={'400'}
                                            height="40px"
                                            width="375px"
                                        />
                                    </VStack>

                                    <VStack w={'375px'} h={'75px'} mt={'20px'} ml={'30px'}>
                                        <Text alignSelf={'start'} color={'#8C8C91'} size={'14'} fontWeight={'400'}>Quantity</Text>
                                        <Input
                                            name="Quantity"
                                            value={FormData.Quantity || ""}
                                            onChange={handleChange}
                                            bg={'#eff1f9'}
                                            color={'#000'}
                                            fontSize={'16px'}
                                            fontWeight={'400'}
                                            placeholder="Enter Quantity"
                                        />
                                    </VStack>
                                </HStack>

                                <HStack>
                                    <VStack w={'375px'} h={'75px'} mt={'20px'} ml={'30px'}>
                                        <Text alignSelf={'start'} color={'#8C8C91'} size={'14'} fontWeight={'400'}>SaltComposition </Text>
                                        <Input
                                            name="SaltComposition"
                                            value={FormData.SaltComposition || ""}
                                            onChange={handleChange}
                                            bg={'#eff1f9'}
                                            color={'#000'}
                                            fontSize={'16px'}
                                            fontWeight={'400'}
                                            placeholder="Enter SaltComposition"
                                        />
                                    </VStack>

                                    <VStack w={'375px'} h={'75px'} mt={'20px'} ml={'30px'}>
                                        <Text alignSelf={'start'} fontWeight={'400'} >PCategory</Text>
                                        {/* <Select
                                            name="PCategory"
                                            value={FormData.PCategory || ""}
                                            onChange={handleSelectChange}
                                            placeholder="Select PCategory"
                                            color={'#8C8C91'}
                                            bg={'#eff1f9'}
                                        >
                                            <option value="H">H</option>
                                            <option value="H1">H1</option>
                                            <option value="General">General</option>
                                            <option value="Narcotics">Narcotics</option>
                                        </Select> */}
                                        <ProductDropdown
                                            name={"PCategory"}
                                            value={FormData.PCategory || ""}
                                            onChange={handleChange}
                                            options={dropdowns?.PRODUCT_CATEGORY || []}
                                            placeholder="Category"
                                            isRequired
                                            bg={'#eff1f9'}
                                            fontSize={'16px'}
                                            fontWeight={'400'}
                                            height="40px"
                                            width="375px"
                                        />
                                    </VStack>

                                    <VStack w={'375px'} h={'75px'} mt={'20px'} ml={'30px'}>
                                        <Text alignSelf={'start'} color={'#8C8C91'} size={'14'} fontWeight={'400'}>BoxPack</Text>
                                        <Input
                                            name="BoxPack"
                                            value={FormData.BoxPack || ""}
                                            onChange={handleChange}
                                            bg={'#eff1f9'}
                                            color={'#000'}
                                            fontSize={'16px'}
                                            fontWeight={'400'}
                                            placeholder="Enter BoxPack"
                                        />
                                    </VStack>
                                </HStack>

                                <HStack>
                                    <VStack w={'375px'} h={'75px'} mt={'20px'} ml={'30px'}>
                                        <Text alignSelf={'start'} color={'#8C8C91'} size={'14'} fontWeight={'400'}>Enter Case</Text>
                                        <Input
                                            name="CasePack"
                                            value={FormData.CasePack || ""}
                                            onChange={handleChange}
                                            bg={'#eff1f9'}
                                            color={'#000'}
                                            fontSize={'16px'}
                                            fontWeight={'400'}
                                            placeholder="Enter CasePack"
                                        />
                                    </VStack>

                                    <VStack w={'375px'} h={'75px'} mt={'20px'} ml={'30px'}>
                                        <Text alignSelf={'start'} color={'#8C8C91'} size={'14'} fontWeight={'400'}>GSTPer</Text>
                                        <Input
                                            name="GSTPer"
                                            value={FormData.GSTPer || ""}
                                            onChange={handleChange}
                                            bg={'#eff1f9'}
                                            color={'#000'}
                                            fontSize={'16px'}
                                            fontWeight={'400'}
                                            placeholder="Enter GSTPer"
                                        />
                                    </VStack>

                                    <VStack w={'375px'} h={'75px'} mt={'20px'} ml={'30px'}>
                                        <Text alignSelf={'start'} color={'#8C8C91'} size={'14'} fontWeight={'400'}>DNick</Text>
                                        <Input
                                            name="DNick"
                                            value={FormData.DNick || ""}
                                            onChange={handleChange}
                                            bg={'#eff1f9'}
                                            color={'#000'}
                                            fontSize={'16px'}
                                            fontWeight={'400'}
                                            placeholder="Enter DNick"
                                        />
                                    </VStack>
                                </HStack>

                                <HStack>
                                    <VStack w={'375px'} h={'75px'} mt={'20px'} ml={'30px'}>
                                        <Text alignSelf={'start'} color={'#8C8C91'} size={'14'} fontWeight={'400'}>DMfg</Text>
                                        <Input
                                            name="DMfg"
                                            value={FormData.DMfg || ""}
                                            onChange={handleChange}
                                            bg={'#eff1f9'}
                                            color={'#000'}
                                            fontSize={'16px'}
                                            fontWeight={'400'}
                                            placeholder="Enter DMfg"
                                        />
                                    </VStack>

                                    <VStack w={'375px'} h={'75px'} mt={'20px'} ml={'30px'}>
                                        <Text alignSelf={'start'} color={'#8C8C91'} size={'14'} fontWeight={'400'}>PNick</Text>
                                        <Input
                                            name="PNick"
                                            value={FormData.PNick || ""}
                                            onChange={handleChange}
                                            bg={'#eff1f9'}
                                            color={'#000'}
                                            fontSize={'16px'}
                                            fontWeight={'400'}
                                            placeholder="Enter PNick"
                                        />
                                    </VStack>

                                    <VStack w={'375px'} h={'75px'} mt={'20px'} ml={'30px'}>
                                        <Text alignSelf={'start'} color={'#8C8C91'} size={'14'} fontWeight={'400'} >PMfg</Text>
                                        <Input
                                            name="PMfg"
                                            value={FormData.PMfg || ""}
                                            onChange={handleChange}
                                            bg={'#eff1f9'}
                                            color={'#000'}
                                            fontSize={'16px'}
                                            fontWeight={'400'}
                                            placeholder="Enter PMfg"
                                        />
                                    </VStack>
                                </HStack>

                                <HStack>
                                    <VStack w={'375px'} h={'75px'} mt={'20px'} ml={'30px'}>
                                        <Text alignSelf={'start'} color={'#8C8C91'} size={'14'} fontWeight={'400'}>UQC Code</Text>
                                        <Input
                                            name="UQC"
                                            value={FormData.UQC || ""}
                                            onChange={handleChange}
                                            bg={'#eff1f9'}
                                            color={'#000'}
                                            fontSize={'16px'}
                                            fontWeight={'400'}
                                            placeholder="UQC Code"
                                        />
                                    </VStack>
                                </HStack>

                            </Box>
                            <Box mt={'50'} ml={'30px'}>
                                <HStack>
                                    <Text> Generic </Text>
                                    <FormControl display="flex" alignItems="center">
                                        <FormLabel htmlFor="generic-switch" mb="0" onClick={() => handleSwitchChange('Generic')}>
                                            {FormData.Generic ? 'Yes' : 'No'}
                                        </FormLabel>
                                        <Switch
                                            id="generic-switch"
                                            isChecked={FormData.Generic}
                                            onChange={() => handleSwitchChange('Generic')}
                                            cursor="pointer"
                                        />
                                    </FormControl>

                                </HStack>
                                <HStack mt={'41'}>
                                    <Text> DPCO </Text>
                                    <FormControl display='flex' alignItems='center'>
                                        <FormLabel htmlFor='dpco-switch' mb='0' onClick={() => handleSwitchChange('DPCO')}>
                                            {FormData.DPCO ? 'Yes' : 'No'}
                                        </FormLabel>
                                        <Switch
                                            id='dpco-switch'
                                            isChecked={FormData.DPCO}
                                            onChange={() => handleSwitchChange('DPCO')}
                                            cursor="pointer"
                                        />
                                    </FormControl>
                                </HStack>
                                <HStack mt={'41'}>
                                    <Text>
                                        Status
                                    </Text>
                                    <FormControl display='flex' alignItems='center'>
                                        <FormLabel htmlFor='lock-switch' mb='0' onClick={() => handleSwitchChange('LOCKED')}>
                                            {FormData.LOCKED ? 'Locked' : 'Unlocked'}
                                        </FormLabel>
                                        <Switch
                                            id='lock-switch'
                                            isChecked={FormData.LOCKED}
                                            onChange={() => handleSwitchChange('LOCKED')}
                                            cursor="pointer"
                                        />
                                    </FormControl>
                                </HStack>
                            </Box>
                            <HStack justifyContent='flex-end' mt={8} mr={8} spacing={4}>
                                <Button
                                    variant="outline"
                                    width='120px'
                                    height='36px'
                                    borderRadius='12px'
                                    onClick={() => navigate('/product-catalogue')}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    bg={'#3E60AA'}
                                    width={'171px'}
                                    height={'36px'}
                                    borderRadius={'12px'}
                                    color={'white'}
                                    onClick={handleSubmit}
                                    isLoading={loading}
                                    loadingText="Saving..."
                                >
                                    Save
                                </Button>
                            </HStack>
                        </Box>
                    </>
                    <Footer />
                </Box>
            </HStack>
        </Box>
    );
};

export default Editproduct;