import { Box, Breadcrumb, BreadcrumbItem, useDisclosure, BreadcrumbLink, Button, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { GoHomeFill } from "react-icons/go";
import { Image } from "@chakra-ui/react"
import card1 from "../../assets/icons/card1.svg";
import card2 from "../../assets/icons/card2.svg";
import FiPlus from "../../assets/icons/fi_plus.png"
import RetailerList from "./Retailerlist";
import axios from "axios";
import { Config } from "../Utils/Config";
import { useAuth } from "../../../src/components/Context/authContext";



const RetailerSummary = () => {

    // State for statistics data
    const [statsData, setStatsData] = useState({
        allRetailer: 0,
        activeRetailer: 0,
        inactiveRetailer: 0,
        newRetailer: 0,
        productsAdded: 0,
        withoutRetailer: 0
    });


    const { authToken } = useAuth();
    // state for loading indicators
    const [loading, setLoading] = useState(true);

    //State for date filter 
    const [startDate, setStartDate] = useState(new Date(1970, 0, 1).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [isFilterActive, setIsFilterActive] = useState(false);

    //modal controls for data filter
    const { isOpen, onOpen, onClose } = useDisclosure();

    // function to fetch data from API
    const fetchRetailerStats = async () => {
        setLoading(true);
        try {
            // Construct query string for date parameters
            let queryParams = '';
            queryParams = `?startDate=${startDate}&endDate=${endDate}`;


            const response = await axios.get(`${Config.RetailerCard_url}${queryParams}`,
                {
                    headers: {
                        Authorization: `Bearer ${authToken || localStorage.getItem('authToken')}`
                    }
                }
            );

            if (response.status === 200) {
                const data = response?.data?.data;
                setStatsData({
                    Retailer: {val:data?.retailerStats?.totalRetailers?.count || 0,
                        //per:data?.retailerStats?.totalRetailers?.percentageChange
                    },
                    activeRetailer: {val: data?.retailerStats?.activeRetailers?.count || 0,
                       // per:data?.retailerStats?.totalRetailers?.percentageChange
                    },
                    inactiveRetailer: {val: data?.retailerStats?.inactiveRetailers?.count || 0,
                        //per:data?.retailerStats?.totalRetailers?.percentageChange
                    },
                    newRetailer: {val: data?.retailerStatsStats?.newProductsAdded || 0,
                       // per:data?.retailerStats?.totalRetailer?.percentageChange
                    },
                    productsAdded: data?.productStats?.totalProducts || 0,
                    withoutDistributors: data?.productStats?.retailersWithoutDistributors || 0
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
        fetchRetailerStats();
        onClose();
    };

    const resetDateFilter = () => {
        setStartDate("");
        setEndDate("");
        setIsFilterActive(false);
        fetchRetailerStats();
        onClose();
    };

    // Fetch stats on component mount
    useEffect(() => {
        fetchRetailerStats();
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
                    <BreadcrumbLink href='/retailers' color='#8B8D97' fontSize='13px'>Retailer List</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>


            <HStack justifyContent='space-between' gap="20px">
                <HStack gap='20px'>
                    <Heading color='#45464E' fontSize='16px' fontWeight='600'>Retailer Summary</Heading>
                </HStack>
                <HStack>
                    <Button as={"a"} 
                    href="/retailers/AddRetailer"
                    // href={undefined} 
                    justifyContent={'space-between'} bg='#3E60AA' color='white' padding='0px 12px' fontWeight='400' borderRadius='12px' w='141px' h='36px' fontSize='14px'>
                        <img src={FiPlus} width={"20px"} alt="" />
                        Add Retailer</Button>
                </HStack>
            </HStack>

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
                    </HStack>

                    <HStack justifyContent='space-between' width='87%'>
                        <VStack gap='1px' alignItems='flex-start'>
                            <Text color='#8B8D97' fontSize='14px' gap="32px">Retailers</Text >
                            <HStack>
                                <Text color='#45464E' fontSize='20px' fontWeight='500' lineHeight='26px'>{formatNumber(statsData?.Retailer?.val)}</Text>
                                <Text color='#45464E' fontSize='12px' fontWeight='500' lineHeight='26px' textColor={"#519C66"}>{statsData?.Retailer?.per}</Text>
                            </HStack>
                        </VStack>

                        <VStack gap='1px' alignItems='flex-start'>
                            <Text color='#8B8D97' fontSize='14px'>Active</Text>
                            <HStack>
                                <Text color='#45464E' fontSize='20px' fontWeight='500' lineHeight='26px'>{formatNumber(statsData?.activeRetailer?.val)}</Text>
                                <Text color='#45464E' fontSize='12px' fontWeight='500' lineHeight='26px' textColor={"#519C66"}>{statsData?.activeRetailer?.per}</Text>
                            </HStack>
                        </VStack>
                        <VStack gap='1px' alignItems='flex-start'>
                            <Text color='#8B8D97' fontSize='14px'>In-Active</Text>
                            <HStack>
                                <Text color='#45464E' fontSize='20px' fontWeight='500' lineHeight='26px'>{formatNumber(statsData?.inactiveRetailer.val)}</Text>
                                <Text color='#45464E' fontSize='12px' fontWeight='500' lineHeight='26px' textColor={"#CC5F5F"}>{statsData?.inactiveRetailer?.per}</Text>
                            </HStack>
                        </VStack>
                    </HStack>
                </Box>

                {/* card 2 */}
                <Box backgroundColor='#F0F4F9' padding='10px 15px' display='flex' flexDirection='column' gap='60px' flex={1} borderRadius='12px'>
                    <HStack position={"relative"} justifyContent='space-between' height='90px' alignItems='center'>
                        <HStack>
                            <Image
                                background="#fcf2e0"
                                padding="8px"
                                width="35px"
                                borderRadius="5px"
                                src={card2}
                                position={"absolute"}
                                top={"0"}

                            />
                        </HStack>
                    </HStack>


                    <HStack justifyContent='space-between' width='100%'>
                        <VStack gap='1px' alignItems='flex-start'>
                            {/* <Text color='#8B8D97' fontSize='14px'>New</Text> */}
                            <HStack>
                                {/* <Text color='#45464E' fontSize='20px' fontWeight='500' lineHeight='26px'>30</Text>
                                <Text color='#45464E' fontSize='12px' fontWeight='500' lineHeight='26px' textColor={"#CC5F5F"}>-20%</Text> */}
                            </HStack>
                        </VStack>

                        <VStack gap='1px' alignItems='flex-start'>
                            {/* <Text color='#8B8D97' fontSize='14px'> Self Products Added</Text> */}
                            <HStack>
                                {/* <Text color='#45464E' fontSize='20px' fontWeight='500' lineHeight='26px'>657,124,12,123</Text> */}
                            </HStack>
                        </VStack>
                        <VStack gap='1px' alignItems='flex-start'>
                            {/* <Text color='#8B8D97' fontSize='14px'>In-Active</Text> */}
                            <HStack>
                                {/* <Text color='#45464E' fontSize='20px' fontWeight='500' lineHeight='26px'>5</Text> */}
                            </HStack>
                        </VStack>
                    </HStack>
                </Box>


            </HStack>



            {/* <DataList ListItems={ManufacturerData} /> */}
            <RetailerList />
        </Box>

    )
}

export default RetailerSummary;