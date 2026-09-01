import React, { useEffect, useState } from 'react';
import {
    Box, Button, Flex, Heading, HStack, Input, Select, Table, Tbody, Td, Text, Th, Thead, Tr, IconButton, Breadcrumb, BreadcrumbItem, BreadcrumbLink,
    VStack, Image, Icon, Menu, MenuButton, MenuList, MenuItem, useToast,
    Center,
} from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight, } from "react-icons/fi";
import { GoHomeFill } from 'react-icons/go';
import HeaderBar from '../../components/Header/HeaderBar';
import LeftSidebar from '../../components/LeftSideBarLayout/LeftSideBar';
import sortIcon from "../../assets/icons/sort.svg";
import { ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import CheckIcon from '../../../src/assets/images/Check.svg';
import CloseIcon from '../../../src/assets/images/Close.svg';
import axios from 'axios';
import { Config } from '../Utils/Config';
import { useAuth } from '../Context/authContext';
import { useLocation, useParams } from 'react-router-dom';
import CSVDownload from './CSVdownload';
import Footer from '../footer';

const Mappingmap = () => {
    const [mappingDetails, setMappingDetails] = useState([]);
    const [options, setOptions] = useState([]);
    const [search, setSearch] = useState('');
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMfr, setSelectedMfr] = useState(null);
    const [selectedmanufacturerId, setSelectedManufacturerId] = useState(null);
    const [newManufacturer, setNewManufacturer] = useState('')
    const [manufacture, setManufacture] = useState([]);
    const [productList, setProductList] = useState([]);
    const [productOptions, setProductOption] = useState([]);
    const [selectedmedicineId, setSelectedMedicineId] = useState(null)
    const [selectedProductID, setSelectedProductId] = useState(null)
    const [newProduct, setNewProduct] = useState('')
    const [selectedMedicineName, setSelectedMedicineName] = useState(null)

    // Track success status per row
    const [manufacturerSuccess, setManufacturerSuccess] = useState({});
    const [productSuccess, setProductSuccess] = useState({});

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState('');
    const [totalPages, setTotalPages] = useState(1)

    const { id } = useParams();
    const toast = useToast();
    const { authToken, userId } = useAuth();
    const location = useLocation();
    const { userName, userType } = location.state || {};

    const GetMappingDetailsByManufaturer = async () => {
    try {
        const response = await axios.get(`${Config?.Get_Mapping_details}/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        });

        if (response?.status === 200) {
            setMappingDetails(response?.data?.manufacturers || []);
        }
    } catch (error) {
        if (error.response?.status === 404) {
            setMappingDetails([]);
        } else {
            console.error("Unexpected error:", error);
        }
    }
};


    useEffect(() => {
        GetMappingDetailsByManufaturer()
    }, [id])

    const fetchManufacturersList = async (e, mm) => {
        try {
            const response = await axios.get(`${Config?.Get_Manufaturers_List}?search=${mm}`, {
               headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
            });
            if (response?.status === 200) {
                setOptions(response?.data?.data?.apiData);
            }
        } catch (error) {
            console.log(error, "Error fetching manufacturers");
        }
    }

    const handleManufacturerMap = async (manufacturername,) => {
        // debugger;
        try {
            const response = await axios.post(`${Config?.Manufacturer_mapp}`, {
                headerId: id,
                manufacturerName: manufacturername,
                mid: selectedmanufacturerId,
                uploadedBy: userId
            }, {
                headers: {
                   Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            })
            if (response?.status === 200) {
                toast({
                    description: 'Manufacturer Mapped successfully.',
                    status: 'success',
                    duration: 1000,
                    isClosable: true
                })
                setManufacturerSuccess(prev => ({ ...prev, [id]: true }));
                setTimeout(() => {
                    GetMappingDetailsByManufaturer();
                    setMappingDetails(response?.data?.manufacturers);
                    setManufacturerSuccess(prev => ({ ...prev, [id]: false }));
                }, 1000);
            }
        } catch (error) {
            console.log(error, "Error in fetching api response.")
        }
    }

    const handleAddManufacturer = async (manufacturername) => {
        try {
            const response = await axios.post(`${Config?.Add_Manufacturer}`, {
                headerId: id || null,
                manufacturerName: manufacturername,
                newManufacturerName: newManufacturer,
                uploadedBy: userId
            }, {
                headers: {
                   Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            })
            if (response?.status === 200) {
                toast({
                    description: 'Manufacturer added successfully',
                    status: 'success',
                    duration: 1000,
                    isClosable: true
                })
                setManufacturerSuccess(prev => ({ ...prev, [id]: true }));
                setTimeout(() => {
                    GetMappingDetailsByManufaturer();
                    setMappingDetails(response?.data?.manufacturers);
                    setManufacturerSuccess(prev => ({ ...prev, [id]: false }));
                }, 1000);
            }
        } catch (error) {
            console.log(error, "Error in fetching API response.")
        }
    }

    const handleManufacturerClose = () => {
        setSelectedMfr(null);
        setNewManufacturer('')
    }

    const getProductMappingList = async () => {
        try {
            const response = await axios.get(`${Config?.Get_Product_Mapping_List}/${id}?page=${currentPage}&limit=${itemsPerPage}`, {
                headers: {
                   Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            })
            if (response?.status === 200) {
                // console.log(response?.data,';;;;;;;;;;;;')
                setProductList(response?.data?.data?.products || [])
                setTotalPages(response?.data?.totalPages);
                setTotalItems(response?.data?.totalProducts)
            }
        } catch (error) {
            console.log(error, "Error in fetching api response.")
        }
    }

    useEffect(() => {
        if (authToken) {
            getProductMappingList()
        }
    }, [authToken, currentPage, itemsPerPage])

    const getProductMapSearch = async (e, search) => {
        try {
            const response = await axios.get(`${Config?.Get_Product_Map_Search}?search=${search}`, {
                headers: {
                   Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            if (response?.status === 200) {
                setProductOption(response?.data?.data?.apiData);
            }
        } catch (error) {
            console.log(error, 'Error in fetching api response')
        }
    }

    const handleAddMapProduct = async (productId) => {
        try {
            const response = await axios.get(`${Config?.Add_New_Product}?id=${productId}`, {
                headers: {
                   Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            if (response?.status === 200) {
                toast({
                    description: 'Product added successfully',
                    status: 'success',
                    isClosable: true,
                    duration: 1000
                })
                setProductSuccess(prev => ({ ...prev, [productId]: true }));
                getProductMappingList()
                setProductList(response?.data?.products || [])
                setTimeout(() => {
                    setProductSuccess(prev => ({ ...prev, [productId]: false }));
                }, 1000);
            }
        } catch (error) {
            console.log(error, 'Error in fetching api response');
            const errorMessage = error?.response?.data?.message || "Something went wrong";
            toast({
                description: errorMessage,
                status: 'error',
                isClosable: true,
                duration: 3000
            });
        }
    }

    const handleExistingProductAdd = async (productId) => {
        try {
            const response = await axios.get(`${Config?.Add_Map_Product}?id=${selectedProductID}&PId=${selectedmedicineId}`, {
               headers: {
                   Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            })
            if (response?.status === 200) {
                toast({
                    description: 'Product Mapped Successfully',
                    isClosable: true,
                    duration: 1000,
                    status: 'success'
                });
                setProductSuccess(prev => ({ ...prev, [productId]: true }));
                getProductMappingList()
                setProductList(response?.data?.products || [])
                setTimeout(() => {
                    setProductSuccess(prev => ({ ...prev, [productId]: false }));
                }, 1000);
            }
        } catch (error) {
            console.log(error, 'Error in add product')
        }
    }

    const handleStopProductMapping = () => {
        setSelectedMedicineName('');
        setNewProduct('')
    }

    const handleStockMap = async () => {
        try {
            const response = await axios.get(`${Config?.Map_Stock}/${id}`, {
                headers: {
                   Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            })
            if (response?.status === 200) {
                toast({
                    description: response?.data?.message || 'Stock Mapped Successfully.',
                    status: 'success',
                    isClosable: true,
                    duration: 1000
                })
            }
        } catch (error) {
            console.log(error, "Error in fetching API response.")
            const errorMessage = error?.response?.data?.message || "Something went wrong";
            toast({
                description: errorMessage,
                status: 'error',
                isClosable: true,
                duration: 2000
            });
        }
    }

    // Purchased From mapping
    const [purchasedFromList, setPurchasedFromList] = useState([])
    const [purchasedName, setPurchasedName] = useState('')
    const [purchasedSuccess, setPurchasedSuccess] = useState({});
    const [rowSelections, setRowSelections] = useState({});

    const updateRowSelection = (rowId, company, mfgId) => {
        setRowSelections(prev => ({
            ...prev,
            [rowId]: { company, mfgId },
        }));
        setSelectedManufacturerId(mfgId);
    };

    const fetchPurchasedFromList = async () => {
        try {
            const response = await axios.get(`${Config?.Get_Purchased_From_List}/${id}`, {
                headers: {
                   Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            if (response?.status === 200) {
                setPurchasedFromList(response?.data?.apiData);
            }
        } catch (error) {
            console.log(error, "Error in fetching API response!")
        }
    }

    useEffect(() => {
        fetchPurchasedFromList();
    }, [])

    const handleMapPurchasedFrom = async (mapId) => {
        try {
            const response = await axios.get(`${Config?.Get_Map_Purchased_From}?headerId=${id}&id=${mapId}&mapId=${selectedmanufacturerId}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            if (response?.status === 200) {
                toast({
                    description: response?.data?.message || 'Mapped Successfully',
                    isClosable: true,
                    duration: 1500,
                    status: 'success'
                });
                setPurchasedSuccess(prev => ({ ...prev, [mapId]: true }));
                fetchPurchasedFromList();
                setSelectedMfr(null);
                setTimeout(() => {
                    setPurchasedSuccess(prev => ({ ...prev, [mapId]: false }));
                }, 1000);
            }
        } catch (error) {
            console.log(error, "Error in fetching APi response!")
        }
    }

    const handleAddNewPurchasedFrom = async (mapId) => {
        try {
            const response = await axios.post(`${Config?.Add_New_Purchased_From}`, {
                headerId: id,
                id: mapId,
                newName: purchasedName
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            if (response?.status === 200) {
                toast({
                    description: response?.data?.message || 'Added Successfully',
                    isClosable: true,
                    duration: 2000,
                    status: 'success'
                });
                setPurchasedSuccess(prev => ({ ...prev, [mapId]: true }));
                setPurchasedName('')
                fetchPurchasedFromList();
                setSelectedMfr(null)
                setTimeout(() => {
                    setPurchasedSuccess(prev => ({ ...prev, [mapId]: false }));
                }, 1000);
            } else {
                toast({
                    description: 'Something Went wrong please try again!',
                    isClosable: true,
                    duration: 2000,
                    status: 'warning'
                })
            }
        } catch (error) {
            console.log(error, "Error in fetching API response!")
        }
    }

    const handleStopMapPurchasedFrom = () => {
        setRowSelections({});
        setPurchasedName('')
    }

    return (
        <Box backgroundColor='#F0F4F9' >
            <HStack justifyContent='space-between' px='20px' alignItems='flex-start'>
                <LeftSidebar />
                <Box width='80%'>
                    <HeaderBar />
                    <Box backgroundColor='white' mt='1rem' padding='12px 20px 24px' borderRadius='15px 15px 0px 0px' mb='1rem'>

                        <Box>
                            <Breadcrumb color="#8B8D97" padding='10px 0px 2rem 0px' >
                                <BreadcrumbItem>
                                    <BreadcrumbLink href='/overview'><GoHomeFill color="#5570F1" /> </BreadcrumbLink>
                                </BreadcrumbItem>

                                <BreadcrumbItem>
                                    <BreadcrumbLink href='/mapping' color='#8B8D97' fontSize='13px'>Mapping</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href='' color='#8B8D97' fontSize='13px' isCurrentPage>Process</BreadcrumbLink>
                                </BreadcrumbItem>
                            </Breadcrumb>
                            {/* Manufacturer Mapping Section */}
                            <Box mt={19} >
                                <Box>
                                    <VStack mt={2} fontSize="14px" align="start" color="#2C2D33">
                                        <Text mb="7px">Bulk Upload Mapping Product Catalog</Text>
                                        <VStack alignItems='flex-start' gap='2px'>
                                            <Text >User Name: {userName}</Text>
                                            <Text>User Type: {userType}</Text>
                                        </VStack>
                                    </VStack>
                                </Box>
                                <Heading fontSize={19} color="#2C2D33" mt="19px">Manufacturer Mapping</Heading>
                                <Table variant="simple" size="sm" mb={4} borderWidth="1px" borderColor="gray.200" mt={5} >
                                    <Thead bg="gray.50">
                                        <Tr>
                                            <Th fontSize="14px" color="#2C2D33" textTransform={'capitalize'} fontWeight={'400'} height="52px" width='31%'>
                                                <HStack>
                                                    <Text> Mfr Name </Text> <Image src={sortIcon} alt="sort" width="16px" ml="2" />
                                                </HStack>
                                            </Th>
                                            <Th fontSize="14px" color="#2C2D33" textTransform={'capitalize'} fontWeight={'400'} width='44%'>
                                                <HStack>
                                                    <Text> Map Now </Text> <Image src={sortIcon} alt="sort" width="16px" ml="2" />
                                                </HStack>
                                            </Th>
                                            <Th fontSize="14px" color="#2C2D33" textTransform={'capitalize'} fontWeight={'400'} width='44%'>
                                                <HStack>
                                                    <Text> Action </Text> <Image src={sortIcon} alt="sort" width="16px" ml="2" />
                                                </HStack>
                                            </Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {
                                            mappingDetails?.length > 0 ?
                                                mappingDetails.map((mapping) => (
                                                    <Tr key={mapping.id}>
                                                        <Td> <Text fontSize={12} color="#6E7079">{mapping.manufacturername}</Text></Td>
                                                        <Td>
                                                            <VStack align="start" position='relative' gap='5px'>
                                                                <HStack width="396px">
                                                                    <Menu>
                                                                        <MenuButton
                                                                            as={Button}
                                                                            onClick={(e) => { fetchManufacturersList(e, mapping.manufacturername) }}
                                                                            width="100%"
                                                                            justifyContent="space-between"
                                                                            variant="outline"
                                                                            fontSize="15px"
                                                                            color="#737373"
                                                                            border="1px solid #E8E9EE"
                                                                            borderRadius="8px"
                                                                            fontWeight="400"
                                                                            rightIcon={<ChevronDownIcon />}
                                                                            textAlign='left'
                                                                        >
                                                                            {selectedMfr || "Enter Mfr Name to search and click to map"}
                                                                        </MenuButton>
                                                                        <MenuList maxH="200px" overflowY="auto" w='396px'>
                                                                            {options.length > 0 ? (
                                                                                options.map((item) => (
                                                                                    <MenuItem key={item.mid} onClick={() => { setSelectedMfr(item.companyName); setSelectedManufacturerId(item.mid) }}>
                                                                                        {item.companyName}
                                                                                    </MenuItem>
                                                                                ))
                                                                            ) : (
                                                                                <MenuItem isDisabled>No manufacturers found</MenuItem>
                                                                            )}
                                                                        </MenuList>
                                                                    </Menu>
                                                                </HStack>
                                                                <Flex height='52px' border='1px solid #E8E9EE' width='396px' borderRadius='8px' justifyContent='center' alignItems='center' padding='4px '>
                                                                    <Input
                                                                        placeholder="Search"
                                                                        onChange={(e) => setNewManufacturer(e.target.value)}
                                                                        height='36px'
                                                                        border='none'
                                                                        borderBottom='1px solid #E6E6E6'
                                                                        fontSize="14px" _focusVisible={{ outline: 'none' }}
                                                                    />
                                                                </Flex>
                                                            </VStack>
                                                        </Td>
                                                        <Td>
                                                            <HStack gap='1rem'>
                                                                <Image cursor='pointer' src={CheckIcon} onClick={() => { selectedMfr ? handleManufacturerMap(mapping.manufacturername, mapping.id) : handleAddManufacturer(mapping.manufacturername, mapping.id) }}></Image>
                                                                <Image src={CloseIcon} cursor='pointer' onClick={handleManufacturerClose}></Image>
                                                            </HStack>
                                                            {manufacturerSuccess[mapping.id] && (
                                                                <Text fontSize={14} color="#3EAA54" mt={70}> Success!!</Text>
                                                            )}
                                                        </Td>
                                                    </Tr>
                                                )) : (
                                                    <> <Text fontSize='15px' p='4'>No Manfacturers Found </Text></>
                                                )
                                        }
                                    </Tbody>
                                </Table>
                            </Box>

                            {/* Purchase From Mapping Section */}
                            <Box>
                                <Heading fontSize={19} color="#2C2D33" mt="19px">Purchased From Mapping</Heading>
                                <Table variant="simple" size="sm" mb={4} borderWidth="1px" borderColor="gray.200" mt={5} >
                                    <Thead bg="gray.50">
                                        <Tr>
                                            <Th fontSize="14px" color="#2C2D33" textTransform={'capitalize'} fontWeight={'400'} height="52px" width='31%'>
                                                <HStack><Text> Mfr Name </Text> <Image src={sortIcon} alt="sort" width="16px" ml="2" /></HStack>
                                            </Th>
                                            <Th fontSize="14px" color="#2C2D33" textTransform={'capitalize'} fontWeight={'400'} width='44%'>
                                                <HStack><Text> Map Now </Text> <Image src={sortIcon} alt="sort" width="16px" ml="2" /></HStack>
                                            </Th>
                                            <Th fontSize="14px" color="#2C2D33" textTransform={'capitalize'} fontWeight={'400'} width='44%'>
                                                <HStack><Text> Action </Text> <Image src={sortIcon} alt="sort" width="16px" ml="2" /></HStack>
                                            </Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {
                                            purchasedFromList?.length > 0 ?
                                                purchasedFromList.map((mapping) => {
                                                    const sel = rowSelections[mapping.id] ?? {
                                                        company: "",
                                                        mfgId: "",
                                                    };
                                                    return (
                                                        <Tr key={mapping.id}>
                                                            <Td> <Text fontSize={12} color="#6E7079">{mapping.purchasedFrom}</Text></Td>
                                                            <Td>
                                                                <VStack align="start" position='relative' gap='5px'>
                                                                    <HStack width="396px">
                                                                        <Menu>
                                                                            <MenuButton
                                                                                as={Button}
                                                                                onClick={(e) => { fetchManufacturersList(e, mapping.purchasedFrom) }}
                                                                                width="100%"
                                                                                justifyContent="space-between"
                                                                                variant="outline"
                                                                                fontSize="15px"
                                                                                color="#737373"
                                                                                border="1px solid #E8E9EE"
                                                                                borderRadius="8px"
                                                                                fontWeight="400"
                                                                                rightIcon={<ChevronDownIcon />}
                                                                                textAlign='left'
                                                                            >
                                                                                {sel.company || "Enter Mfr Name to search and click to map"}
                                                                            </MenuButton>
                                                                            <MenuList maxH="200px" overflowY="auto" w='396px'>
                                                                                {options.length > 0 ? (
                                                                                    options.map((item) => (
                                                                                        <MenuItem key={item.mid}
                                                                                            onClick={() =>
                                                                                                updateRowSelection(
                                                                                                    mapping.id,
                                                                                                    item.companyName,
                                                                                                    item.mid
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            {item.companyName}
                                                                                        </MenuItem>
                                                                                    ))
                                                                                ) : (
                                                                                    <MenuItem isDisabled>No manufacturers found</MenuItem>
                                                                                )}
                                                                            </MenuList>
                                                                        </Menu>
                                                                    </HStack>
                                                                    <Flex height='52px' border='1px solid #E8E9EE' width='396px' borderRadius='8px' justifyContent='center' alignItems='center' padding='4px '>
                                                                        <Input
                                                                            placeholder="Search"
                                                                            onChange={(e) => setPurchasedName(e.target.value)}
                                                                            height='36px'
                                                                            border='none'
                                                                            borderBottom='1px solid #E6E6E6'
                                                                            fontSize="14px" _focusVisible={{ outline: 'none' }}
                                                                        />
                                                                    </Flex>
                                                                </VStack>
                                                            </Td>
                                                            <Td>
                                                                <HStack gap='1rem'>
                                                                    <Image src={CheckIcon} cursor='pointer'
                                                                        onClick={() =>
                                                                            sel.mfgId
                                                                                ? handleMapPurchasedFrom(mapping.id)
                                                                                : handleAddNewPurchasedFrom(mapping.id)
                                                                        }
                                                                    ></Image>
                                                                    <Image src={CloseIcon} cursor='pointer' onClick={handleStopMapPurchasedFrom}></Image>
                                                                </HStack>
                                                                {purchasedSuccess[mapping.id] && (
                                                                    <Text fontSize={14} color="#3EAA54" mt={70}> Success!!</Text>
                                                                )}
                                                            </Td>
                                                        </Tr>)
                                                }) : (
                                                    <> <Text fontSize='15px' p='4'>No Data Found </Text></>
                                                )
                                        }
                                    </Tbody>
                                </Table>
                            </Box>

                            {/* Product Mapping Section */}
                            <Box mb={8} >
                                <Heading fontSize={19} color="#2C2D33" mt={124}>Product Mapping</Heading>

                                <Table variant="simple" size="sm" borderWidth="1px" borderColor="gray.200" mt='17px' >
                                    <Thead bg="gray.50" >
                                        <Tr>
                                            <Th fontSize="14px" color="#2C2D33" textTransform={'capitalize'} fontWeight={'400'} height="52px" width="31%">
                                                <HStack>
                                                    <Text> Product Name </Text> <Image src={sortIcon} alt="sort" width="16px" ml="2" />
                                                </HStack>
                                            </Th>
                                            <Th fontSize="14px" color="#2C2D33" textTransform={'capitalize'} fontWeight={'400'} >
                                                <HStack>
                                                    <Text> Map Now </Text> <Image src={sortIcon} alt="sort" width="16px" ml="2" />
                                                </HStack>
                                            </Th>

                                            <Th fontSize="14px" color="#2C2D33" textTransform={'capitalize'} fontWeight={'400'} >
                                                <HStack>
                                                    <Text> Action </Text> <Image src={sortIcon} alt="sort" width="16px" ml="2" />
                                                </HStack>
                                            </Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {
                                            productList.length > 0 ?
                                                productList.map((product) => (
                                                    <Tr key={product.id}>
                                                        <Td> <Text fontSize={12} color="#6E7079">{product.PName}</Text></Td>
                                                        <Td display='flex' flexDirection='column' gap='5px'>
                                                            <HStack w='396px'>
                                                                <Menu>
                                                                    <MenuButton
                                                                        as={Button}
                                                                        onClick={(e) => { getProductMapSearch(e, product.PName) }}
                                                                        width="100%"
                                                                        justifyContent="space-between"
                                                                        variant="outline"
                                                                        fontSize="15px"
                                                                        color="#737373"
                                                                        border="1px solid #E8E9EE"
                                                                        borderRadius="8px"
                                                                        fontWeight="400"
                                                                        rightIcon={<ChevronDownIcon />}
                                                                        textAlign='left'
                                                                    >
                                                                        {selectedMedicineName || "Enter Medicine Name to search and click to map"}
                                                                    </MenuButton>
                                                                    <MenuList maxH="200px" overflowY="auto" w='396px'>
                                                                        {productOptions.length > 0 ? (
                                                                            productOptions.map((item) => (
                                                                                <MenuItem key={item.PId} onClick={() => { setSelectedMedicineId(item.PId); setSelectedProductId(product.id); setSelectedMedicineName(item?.PName) }}>
                                                                                    <VStack alignItems='flex-start' gap='1px'>
                                                                                        <Text>{item.PName}</Text>
                                                                                        <Text color='#5e5e5e80'>{item.SaltComposition}</Text>
                                                                                    </VStack>
                                                                                </MenuItem>
                                                                            ))
                                                                        ) : (
                                                                            <MenuItem isDisabled>No Medicine's found</MenuItem>
                                                                        )}
                                                                    </MenuList>
                                                                </Menu>
                                                            </HStack>
                                                            <Flex height='52px' border='1px solid #E8E9EE' width='396px' borderRadius='8px' justifyContent='center' alignItems='center' padding='4px '>
                                                                <Input
                                                                    placeholder='Search'
                                                                    width="396px"
                                                                    height='36px'
                                                                    border='none'
                                                                    borderBottom='1px solid #E6E6E6'
                                                                    fontSize="14px" _focusVisible={{ outline: 'none' }}
                                                                    color="#737373"
                                                                    onChange={(e) => setNewProduct(e.target.value)}
                                                                />
                                                            </Flex>
                                                        </Td>
                                                        <Td>
                                                            <HStack gap='1rem'>
                                                                <Image src={CheckIcon} onClick={() => { selectedMedicineName ? handleExistingProductAdd(product.id) : handleAddMapProduct(product.id) }}></Image>
                                                                <Image src={CloseIcon} cursor='pointer' onClick={handleStopProductMapping}></Image>
                                                            </HStack>
                                                            {productSuccess[product.id] && (
                                                                <Text fontSize={14} color="#3EAA54" mt={70}> Success!!</Text>
                                                            )}
                                                        </Td>
                                                    </Tr>
                                                ))
                                                : (
                                                    <><Td colSpan={3} fontSize='15px' p='4'>No Products found</Td></>
                                                )}
                                    </Tbody>
                                </Table>
                            </Box>

                            {/* Pagination Section */}
                            {productList.length > 0 &&
                                <Box w="full" p={4}>
                                    <Flex justify="space-between" align="center">
                                        <Flex align="center" gap="4px">
                                            <Select
                                                w="69px"
                                                height="25px"
                                                size="sm"
                                                border="none"
                                                backgroundColor="#5e63661a"
                                                color="#8B8D97"
                                                borderRadius="10px"
                                                value={itemsPerPage}
                                                onChange={(e) => {
                                                    setItemsPerPage(Number(e.target.value));
                                                    setCurrentPage(1);
                                                }}
                                            >
                                                <option value="10">10</option>
                                                <option value="20">20</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                            </Select>
                                            <HStack gap="18px">
                                                <Text ml={2} fontSize="14px" color="#A6A8B1">
                                                    Items per page
                                                </Text>
                                                <Text fontSize="sm" color="#666666">
                                                    {totalItems} items
                                                </Text>
                                            </HStack>
                                        </Flex>

                                        <Flex align="center">
                                            <HStack>
                                                <Select
                                                    w="60px"
                                                    height="25px"
                                                    size="sm"
                                                    border="none"
                                                    backgroundColor="#5e63661a"
                                                    color="#8B8D97"
                                                    borderRadius="10px"
                                                    value={currentPage}
                                                    onChange={(e) => setCurrentPage(Number(e.target.value))}
                                                >
                                                    {Array.from({ length: totalPages }, (_, i) => (
                                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                    ))}
                                                </Select>
                                                <Text ml={2} fontSize="14px" color="#666666">
                                                    of {totalPages} pages
                                                </Text>
                                                <Flex ml={2}>
                                                    <IconButton
                                                        aria-label="Previous page"
                                                        icon={<ChevronLeftIcon color={currentPage > 1 ? "#666666" : "#dcdcdc"} fontSize="20px" />}
                                                        size="sm"
                                                        border="none"
                                                        background="transparent"
                                                        isDisabled={currentPage === 1}
                                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                                    />
                                                    <IconButton
                                                        aria-label="Next page"
                                                        icon={<ChevronRightIcon color={currentPage < totalPages ? "#666666" : "#dcdcdc"} fontSize="20px" />}
                                                        size="sm"
                                                        border="none"
                                                        background="transparent"
                                                        ml={2}
                                                        isDisabled={currentPage === totalPages}
                                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                                    />
                                                </Flex>
                                            </HStack>
                                        </Flex>
                                    </Flex>
                                </Box>
                            }

                            {/* Footer Buttons */}
                            <Flex justifyContent={'end'} w={'100%'} alignSelf="end" mt="32px" borderRadius="8px" gap='12px' paddingRight='15px'>
                                <CSVDownload headerId={id} />
                                <Button backgroundColor="#3E60AA" height='36px' rounded='6px' color="#ffffff" fontSize="14px" fontWeight='500' _hover={{ opacity: 0.9 }} onClick={handleStockMap}>
                                    Save and Update Product Mapping
                                </Button>
                            </Flex>
                        </Box>
                    </Box>
                </Box>
            </HStack>
            <Footer />
        </Box>
    );
};

export default Mappingmap;