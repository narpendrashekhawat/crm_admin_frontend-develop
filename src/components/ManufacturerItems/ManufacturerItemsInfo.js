import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Heading, HStack, Text, VStack, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, FormControl, FormLabel, Input, Spinner, Link } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { GoHomeFill } from "react-icons/go";
import {FiUploadCloud, FiDownload} from "react-icons/fi"
import { Image } from "@chakra-ui/react"
import card1 from "../../assets/icons/card1.svg";
import card2 from "../../assets/icons/card2.svg";
import FiPlus from "../../assets/icons/fi_plus.png"
// import filterIcon from "../../assets/icons/calendar.svg";
import DataList from "../DataList/DataList";
import axios from "axios";
import { Config } from "../Utils/Config";
import ManufacturerData from "../DataList/data.json"
import { useAuth } from "../../../src/components/Context/authContext";
import BulkUpload from "../ProfileItems/BulkUploadData/BulkUpload";

const ManufacturerInfo = () => {
    // State for statistics data
    const [statsData, setStatsData] = useState({
        
        totalManufacturers: 0,
        activeManufacturers: 0,
        inactiveManufacturers: 0,
        newManufacturers: 0,
        productsAdded: 0,
        withoutDistributors: 0
    });
    
     const { authToken } = useAuth();
    // State for loading indicators
    const [loading, setLoading] = useState(true);
    // Separate disclosure hooks
const {
  isOpen: isBulkOpen,
  onOpen: onBulkOpen,
  onClose: onBulkClose
} = useDisclosure();

const {
  isOpen: isFilterOpen,
  onOpen: onFilterOpen,
  onClose: onFilterClose
} = useDisclosure();


    // State for date filters
    const today = new Date();

    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
    
    const [startDate, setStartDate] = useState(startOfDay);
    const [endDate, setEndDate] = useState(endOfDay);
    const [isFilterActive, setIsFilterActive] = useState(false);

    // // Modal controls for date filter
    // const { isOpen, onOpen, onClose } = useDisclosure();

    // Function to fetch statistics from API
    const fetchManufacturerStats = async () => {
        setLoading(true);
        try {
            // Construct query string for date parameters
            let queryParams = '';
            queryParams = `?startDate=${startDate}&endDate=${endDate}`;


        //  console.log("AuthToken from Context:", authToken);
        //  console.log("AuthToken from LocalStorage:", localStorage.getItem("authToken"));


            const response = await axios.get(
                `${Config.ManufactureCards_url}${queryParams}`,
                {
                    headers: {
                        Authorization: `Bearer ${authToken || localStorage.getItem('authToken')}`
                    }
                }
            );

           if (response.status === 200) {
    const data = response?.data?.data;
    setStatsData({
        allManufacturers: {
            val: data?.manufacturerStats?.totalManufacturers?.count || 0,
        // per: data?.manufacturerStats?.totalManufacturers?.percentageChange
        },
        activeManufacturers: {
            val: data?.manufacturerStats?.activeManufacturers?.count || 0,
           // per: data?.manufacturerStats?.activeManufacturers?.percentageChange
        },
        inactiveManufacturers: {
            val: data?.manufacturerStats?.inactiveManufacturers?.count || 0,
           // per: data?.manufacturerStats?.inactiveManufacturers?.percentageChange
        },
        newManufacturers: {
            val: data?.productStats?.newProductsAdded?.count || 0,
            per: data?.productStats?.newProductsAdded?.percentageChange
        },
        productsAdded: data?.productStats?.totalProducts || 0,
        withoutDistributors: data?.productStats?.manufacturersWithoutDistributors || 0
    });
    console.log(data, 'Manufacturer Stats');
}

        } catch (err) {
            console.error("Error fetching manufacturer statistics:", err);
        } finally {
            setLoading(false);
        }
    };

   // Date filter handlers
const applyDateFilter = () => {
    setIsFilterActive(!!startDate && !!endDate);
    fetchManufacturerStats();
    onFilterClose();   //  use the correct modal close
};

const resetDateFilter = () => {
    setStartDate("");
    setEndDate("");
    setIsFilterActive(false);
    fetchManufacturerStats();
    onFilterClose();   //  use the correct modal close
};


    // Fetch stats on component mount
    useEffect(() => {
        fetchManufacturerStats();
    }, []);

    // Helper function to format large numbers
    const formatNumber = (num) => {
        if (!num) return 0;
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1) + 'B';
        } else if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num;
    };

    return (
        
        <Box p={4} bg="white" mt='1rem' padding='12px 20px' borderRadius='15px 15px 0px 0px'>
            <Breadcrumb color="#8B8D97" padding='10px 0px 2rem 0px' >
                <BreadcrumbItem>
                    <BreadcrumbLink href='/overview'><GoHomeFill color="#5570F1" /> </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink href='/manufacturers' color='#8B8D97' fontSize='13px'>Manufacturer</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>

            <HStack justifyContent='space-between' wrap={"wrap"}>
                <HStack gap='20px'>
                    <Heading color='#45464E' fontSize='14px' fontWeight='600'>Manufacturer Summary</Heading>
                </HStack>
                <HStack gap={0}>
                    <BulkUpload isOpen={isBulkOpen} onClose={onBulkClose} />
                        <Button
                          leftIcon={<FiUploadCloud size="24px" />}
                          bg="#5570F1"
                          color="white"
                          marginRight="19px"
                          fontSize="14px"
                          borderRadius="12px"
                          h="36px"
                          w="155px"
                          _hover={{ bg: "#3d62e7" }}
                          onClick={onBulkOpen}
                        >
                          Bulk Upload
                        </Button>

                        <Link href="https://bucket-cms-new.s3.ap-south-1.amazonaws.com/sample_files/sampleManufacturerSheet.csv" is External>
                    <Button leftIcon={<FiDownload size="22px" />} bg="#4C526F" color="white" marginRight="20px" fontSize="14px" borderRadius="12px" h="36px" w="213px" _hover={{ bg: "#2d3a54" }}>Download Data Sheet</Button> </Link>

                    <Button as={"a"} href="/manufacturers/add-manufacturer" justifyContent={'space-between'} bg='#3E60AA' color='white' padding='0px 12px' fontWeight='400' borderRadius='12px' w='213px' h='36px' fontSize='14px'>
                        <img src={FiPlus} width={"20px"} alt="" />
                        Add New Manufacturer
                    </Button>
                </HStack>
            </HStack>

            {/* Date Filter Modal */}
            <Modal isOpen={isFilterOpen} onClose={onFilterClose}>
                   <ModalOverlay />
                   <ModalContent>
                     <ModalHeader>Date Filter</ModalHeader>
                     <ModalCloseButton />
                     <ModalBody pb={6}>
                       <FormControl>
                         <FormLabel>Start Date</FormLabel>
                         <Input
                           type="date"
                           value={startDate}
                           onChange={(e) => setStartDate(e.target.value)}
                           max={endDate || undefined}
                         />
                       </FormControl>
                 
                       <FormControl mt={4}>
                         <FormLabel>End Date</FormLabel>
                         <Input
                           type="date"
                           value={endDate}
                           onChange={(e) => setEndDate(e.target.value)}
                           min={startDate || undefined}
                         />
                       </FormControl>
                     </ModalBody>
                 
                     <ModalFooter>
                       <Button colorScheme="blue" mr={3} onClick={applyDateFilter}>
                         Apply
                       </Button>
                       <Button onClick={resetDateFilter} variant="outline">
                         Reset
                       </Button>
                     </ModalFooter>
                   </ModalContent>
                 </Modal>


            <HStack flexWrap='wrap' width='100%' gap='19px' mt='1rem'>
                {/* card 1 */}
                <Box backgroundColor='#F0F4F9' padding='10px 15px' display='flex' flexDirection='column' gap='60px' flex={1} borderRadius='12px'>
                    <HStack justifyContent='space-between' height='41px' alignItems='center'>
                        <HStack>
                            <Image
                                background="#fcf2e0"
                                padding="8px"
                                width="35px"
                                borderRadius="5px"
                                src={card1}
                            />
                        </HStack>
                        {isFilterActive && (
                            <Text fontSize="xs" color="gray.500">
                                {`${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`}
                            </Text>
                        )}
                    </HStack>

                    <HStack justifyContent='space-between' width='87%'>
                        <VStack gap='1px' alignItems='flex-start'>
                            <Text color='#8B8D97' fontSize='14px'>All Manufacturers</Text>
                            <HStack>
                                {loading ? (
                                    <Spinner size="sm" />
                                ) : (
                                    <>
                                        <Text color='#45464E' fontSize='20px' fontWeight='500' lineHeight='26px'>{formatNumber(statsData.allManufacturers?.val)}</Text>
                                        <Text color='#45464E' fontSize='12px' fontWeight='500' lineHeight='26px' textColor={"#519C66"}>{statsData.allManufacturers?.per}</Text>
                                    </>
                                )}
                            </HStack>
                        </VStack>

                        <VStack gap='1px' alignItems='flex-start'>
                            <Text color='#8B8D97' fontSize='14px'>Active</Text>
                            <HStack>
                                {loading ? (
                                    <Spinner size="sm" />
                                ) : (
                                    <>
                                        <Text color='#45464E' fontSize='20px' fontWeight='500' lineHeight='26px'>{formatNumber(statsData.activeManufacturers?.val)}</Text>
                                        <Text color='#45464E' fontSize='12px' fontWeight='500' lineHeight='26px' textColor={"#519C66"}>{statsData.activeManufacturers?.per}</Text>
                                    </>
                                )}
                            </HStack>
                        </VStack>
                        <VStack gap='1px' alignItems='flex-start'>
                            <Text color='#8B8D97' fontSize='14px'>In-Active</Text>
                            <HStack>
                                {loading ? (
                                    <Spinner size="sm" />
                                ) : (
                                    <>
                                        <Text color='#45464E' fontSize='20px' fontWeight='500' lineHeight='26px'>{formatNumber(statsData.inactiveManufacturers?.val)}</Text>
                                        <Text color='#45464E' fontSize='12px' fontWeight='500' lineHeight='26px' textColor={"#CC5F5F"}>{statsData.inactiveManufacturers?.per}</Text>
                                    </>
                                )}
                            </HStack>
                        </VStack>
                    </HStack>
                </Box>

                {/* card 2 */}
                <Box backgroundColor='#F0F4F9' padding='10px 15px' display='flex' flexDirection='column' gap='60px' flex={1} borderRadius='12px'>
                    <HStack justifyContent='space-between' height='41px' alignItems='center'>
                        <HStack>
                            <Image
                                background="#fcf2e0"
                                padding="8px"
                                width="35px"
                                borderRadius="5px"
                                src={card2}
                            />
                        </HStack>
                    </HStack>

                    <HStack justifyContent='space-between' width='100%'>
                        <VStack gap='1px' alignItems='flex-start'>
                            <Text color='#8B8D97' fontSize='14px'>Products Added Today</Text>
                            <HStack>
                                {loading ? (
                                    <Spinner size="sm" />
                                ) : (
                                    <>
                                        <Text color='#45464E' fontSize='20px' fontWeight='500' lineHeight='26px'>{formatNumber(statsData.newManufacturers?.val)}</Text>
                                        <Text fontSize='12px' fontWeight='500' lineHeight='26px' color={
                                        Number(statsData?.newManufacturers?.per) > 0
                                          ? "#27a50a"   
                                          : Number(statsData?.newManufacturers?.per) < 0
                                            ? "#ff0000" 
                                            : "#45464E" 
                                      }>{statsData?.newManufacturers?.per}</Text>
                                    </>
                                )}
                            </HStack>
                        </VStack>

                        <VStack gap='1px' alignItems='flex-start'>
                            <Text color='#8B8D97' fontSize='14px'>All Products</Text>
                            <HStack>
                                {loading ? (
                                    <Spinner size="sm" />
                                ) : (
                                    <Text color='#45464E' fontSize='20px' fontWeight='500' lineHeight='26px'>{formatNumber(statsData.productsAdded)}</Text>
                                )}
                            </HStack>
                        </VStack>
                        <VStack gap='1px' alignItems='flex-start'>
                            <Text color='#8B8D97' fontSize='14px'>Without CNF/ Distributors</Text>
                            <HStack>
                                {loading ? (
                                    <Spinner size="sm" />
                                ) : (
                                    <Text color='#45464E' fontSize='20px' fontWeight='500' lineHeight='26px'>{formatNumber(statsData.withoutDistributors)}</Text>
                                )}
                            </HStack>
                        </VStack>
                    </HStack>
                </Box>
            </HStack>

            <DataList ListItems={ManufacturerData} />
        </Box>
    )
}

export default ManufacturerInfo