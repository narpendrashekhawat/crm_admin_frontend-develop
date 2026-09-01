import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Heading, HStack, Text, useDisclosure, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { GoHomeFill } from "react-icons/go";
import { Image } from "@chakra-ui/react"
import card1 from "../../assets/icons/card1.svg";
import card2 from "../../assets/icons/card2.svg";
import FiPlus from "../../assets/icons/fi_plus.png"
import DataList from "../DataList/DataList"
import Distributorlist from "./Distributorlist";
import Footer from "../footer";
import axios from 'axios';
import { Config } from "../Utils/Config";
import { useAuth } from "../../../src/components/Context/authContext";


const DistributorCNF = () => {
    //  State for statistics data

    const [statsData, setStatsData] = useState({
        allDistributor: 0,
        Active: 0,
        inactiveDistributor: 0,
        newDistributor: 0,
        active: 0,
        inactive: 0
    });

    //State For Loading Indicator
    const [loading, setLoading] = useState(true);

    // state for date filter
    const [startDate, setStartDate] = useState(new Date(1970, 0, 1).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [isFilterActive, setIsFilterActive] = useState(false);
    const { authToken } = useAuth();
    //Model controls for data filter
    const { isOpen, onOpen, onClose } = useDisclosure();
    

    //Function to fetch Statistics from Api
    const fetchDistributorStats = async () => {
        setLoading(true);
        try {
            // Construct query string for date parameters
            let queryParams = '';
            queryParams = `?startDate=${startDate}&endDate=${endDate}`;

            const response = await axios.get(`${Config.DistributorCards_url}${queryParams}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                }
            );

            if (response.status === 200) {
    const data = response?.data?.data;
    setStatsData({
        Distributor: {
            val: data?.distributorStats?.Distributors?.totalDistributors || 0,
           // per: data?.distributorStats?.Distributors?.percentageChange
        },
        activeDistributors: {
            val: data?.distributorStats?.active || 0,
           // per: data?.distributorStats?.activeDistributors?.percentageChange // If not present, set `per: null` or remove
        },
        inactiveDistributor: {
            val: data?.distributorStats?.inactive || 0,
           // per: data?.distributorStats?.inactiveDistributors?.percentageChange // If not present, set `per: null` or remove
        },
        CNF: {
            val: data?.CnfStats?.cnf?.totalCNF || 0,
           // per: data?.CnfStats?.cnf?.percentageChange
        },
        active: data?.CnfStats?.active || 0,
        inactive: data?.CnfStats?.inactive || 0
    });
    console.log(data, 'Distributor Stats');
}
        } catch (err) {
            console.error("Error fetching manufacture statistics:", err);
        } finally {
            setLoading(false);
        }
    };

    // Date filter handlers
    const applyDateFilter = () => {
        setIsFilterActive(!!startDate && !!endDate);
        fetchDistributorStats();
        onClose();
    };

    const resetDateFilter = () => {
        setStartDate("");
        setEndDate("");
        setIsFilterActive(false);
        fetchDistributorStats();
        onClose();
    };

    // Fetch stats on component mount
    useEffect(() => {
        fetchDistributorStats();
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
                    <BreadcrumbLink href='/distributors' color='#8B8D97' fontSize='13px'>Distributor / CNF List</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>


            <HStack justifyContent='space-between' gap="20px">
                <HStack gap='20px'>
                    <Heading color='#45464E' fontSize='16px' fontWeight='600'>Distributor/ CNF Summary</Heading>
                </HStack>
                <HStack>
                    <Button as={"a"} href="/distributors/AddDistributor" justifyContent={'space-between'} bg='#3E60AA' color='white' padding='0px 12px' fontWeight='400' borderRadius='12px' w='213px' h='36px' fontSize='14px'>
                        <img src={FiPlus} width={"20px"} alt="" />
                        Add Distributor / CNF</Button>
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
                            <Text color='#8B8D97' fontSize='14px' gap="32px">Distributor</Text >
                            <HStack>
                                <Text color='#45464E' fontSize='20px' fontWeight='500' lineHeight='26px'>{formatNumber(statsData?.Distributor?.val)}</Text>
                                <Text color='#45464E' fontSize='12px' fontWeight='500' lineHeight='26px' textColor={"#519C66"}>{statsData?.Distributor?.per}</Text>
                            </HStack>
                        </VStack>

                        <VStack gap='1px' alignItems='flex-start'>
                            <Text color='#8B8D97' fontSize='14px'>active</Text>
                            <HStack>
                                <Text color='#45464E' fontSize='20px' fontWeight='500' lineHeight='26px'>{formatNumber(statsData?.activeDistributors?.val)}</Text>
                                <Text color='#45464E' fontSize='12px' fontWeight='500' lineHeight='26px' textColor={"#519C66"}>{statsData?.activeDistributors?.per}</Text>
                            </HStack>
                        </VStack>
                        <VStack gap='1px' alignItems='flex-start'>
                            <Text color='#8B8D97' fontSize='14px'>In-Active</Text>
                            <HStack>
                                <Text color='#45464E' fontSize='20px' fontWeight='500' lineHeight='26px'>{formatNumber(statsData?.inactiveDistributor?.val)}</Text>
                                <Text color='#45464E' fontSize='12px' fontWeight='500' lineHeight='26px' textColor={"#CC5F5F"}>{statsData?.inactive?.per}</Text>
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
                            <Text color='#8B8D97' fontSize='14px'>CNF'S</Text>
                            <HStack>
                                <Text color='#45464E' fontSize='20px' fontWeight='500' lineHeight='26px'>{formatNumber(statsData?.CNF?.val)}</Text>
                                <Text color='#45464E' fontSize='12px' fontWeight='500' lineHeight='26px' textColor={"#CC5F5F"}>{statsData?.CNF?.per}</Text>
                            </HStack>
                        </VStack>

                        <VStack gap='1px' alignItems='flex-start'>
                            <Text color='#8B8D97' fontSize='14px'>active</Text>
                            <HStack>
                                <Text color='#45464E' fontSize='20px' fontWeight='500' lineHeight='26px'>{formatNumber(statsData?.active)}</Text>
                            </HStack>
                        </VStack>
                        <VStack gap='1px' alignItems='flex-start'>
                            <Text color='#8B8D97' fontSize='14px'>In-Active</Text>
                            <HStack>
                                <Text color='#45464E' fontSize='20px' fontWeight='500' lineHeight='26px'>{formatNumber(statsData?.inactive)}</Text>
                            </HStack>
                        </VStack>
                    </HStack>

                </Box>

            </HStack>



            {/* <DataList navigateTo={'/DistributorCNFdetails'} ListItems={ManufacturerData} /> */}
            <Distributorlist />


        </Box>





    )

}

export default DistributorCNF