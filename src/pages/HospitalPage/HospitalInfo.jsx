import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, FormControl, FormLabel, Heading, HStack, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, useDisclosure, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import { GoHomeFill } from 'react-icons/go'
import HospitalList from './HospitalList';
import { Config } from '../../components/Utils/Config';
import { Axios } from 'axios';
import useAxios from '../../components/Context/axiosInstance';
import card1 from '../../assets/icons/card1.svg';
import card2 from '../../assets/icons/card2.svg';

export default function HospitalInfo() {
    const [statsData, setStatsData] = useState({

        totalHospitals: 0,
        activeHospitals: 0,
        inactiveHospitals: 0,
        newHospitals: 0,
        productsAdded: 0,
        withoutDistributors: 0
    });

    // State for loading indicators
    const [loading, setLoading] = useState(true);
    const axios = useAxios();

    // State for date filters
    const [startDate, setStartDate] = useState(new Date(1970, 0, 1).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [isFilterActive, setIsFilterActive] = useState(false);

    // Modal controls for date filter
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Function to fetch statistics from API

    const fetchHospitalStats = async () => {
        setLoading(true);
        try {
            // Construct query string for date parameters
            let queryParams = '';
            queryParams = `?startDate=${startDate}&endDate=${endDate}`;


            const response = await axios.get(
                `${Config.Get_Card_Data}${queryParams} `,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                }
            );

            if (response.status === 200) {
                const data = response?.data?.data;
                setStatsData({
                    totalHospitals: {
                        val: data?.totalHospitals?.count || 0,
                       // per: data?.totalHospitals?.percentage
                    },
                    activeHospitals: {
                        val: data?.activeHospitals?.count || 0,
                       // per: data?.activeHospitals?.percentage
                    },
                    inactiveHospitals: {
                        val: data?.inactiveHospitals?.count || 0,
                       // per: data?.inactiveHospitals?.percentage
                    },
                    newHospitals: {
                        val: data?.productStats?.newProductsAdded?.count || 0,
                       // per: data?.productStats?.newProductsAdded?.percentageChange
                    },
                    productsAdded: data?.productStats?.totalProducts || 0,
                    withoutDistributors: data?.productStats?.HospitalsWithoutDistributors || 0
                });
                console.log(data, 'Hospital Stats');
            }

        } catch (err) {
            console.error("Error fetching Hospital statistics:", err);
        } finally {
            setLoading(false);
        }
    };

    // Date filter handlers
    const applyDateFilter = () => {
        // setIsFilterActive(!!startDate && !!endDate);
        // fetchHospitalStats();
        // onClose();
    };

    const resetDateFilter = () => {
        // setStartDate("");
        // setEndDate("");
        // setIsFilterActive(false);
        // fetchHospitalStats();
        // onClose();
    };

    // Fetch stats on component mount
    useEffect(() => {
        fetchHospitalStats();
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
                    <BreadcrumbLink href='/hospitals' color='#8B8D97' fontSize='13px'>Hospital</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>

            <HStack justifyContent='space-between'>
                <HStack gap='20px'>
                    <Heading color='#45464E' fontSize='14px' fontWeight='600'>Hospital Summary</Heading>
                </HStack>
                <HStack>
                    {/* <Button
                        size="sm"
                        fontWeight={"400"}
                        border={"1px solid #53545C"}
                        fontSize={"11px"}
                        onClick={onOpen}
                        bg={isFilterActive ? "#E9F2FF" : "white"}
                        color={isFilterActive ? "#3182CE" : "inherit"}
                        borderColor={isFilterActive ? "#3182CE" : "#53545C"}
                        mr={2}
                    >
                        <img src={filterIcon} alt="filter" style={{ marginRight: "5px" }} />
                        {isFilterActive ? "Filtered" : "Filter"}
                    </Button> */}

                    <Button as={"a"} href="/hospitals/add-hospital" justifyContent={'space-between'} bg='#3E60AA' color='white' padding='0px 12px' fontWeight='400' borderRadius='12px' w='213px' h='36px' fontSize='14px'>
                        {/* <img src={FiPlus} width={"20px"} alt="" color='white' /> */}
                        <FiPlus fontSize={"20px"} alt="" color='white' />
                        Add New Hospital
                    </Button>
                </HStack>
            </HStack>

            {/* Date Filter Modal */}
            <Modal isOpen={isOpen} onClose={onClose}>
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
                        <Button onClick={resetDateFilter} variant="outline">Reset</Button>
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
                            <Text color='#8B8D97' fontSize='14px'>All Hospitals</Text>
                            <HStack>
                                {loading ? (
                                    <Spinner size="sm" />
                                ) : (
                                    <>
                                        <Text color='#45464E' fontSize='20px' fontWeight='500' lineHeight='26px'>{formatNumber(statsData.totalHospitals?.val)}</Text>
                                        <Text color='#45464E' fontSize='12px' fontWeight='500' lineHeight='26px' textColor={"#519C66"}>{statsData.totalHospitals?.per}</Text>
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
                                        <Text color='#45464E' fontSize='20px' fontWeight='500' lineHeight='26px'>{formatNumber(statsData.activeHospitals?.val)}</Text>
                                        <Text color='#45464E' fontSize='12px' fontWeight='500' lineHeight='26px' textColor={"#519C66"}>{statsData.activeHospitals?.per}</Text>
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
                                        <Text color='#45464E' fontSize='20px' fontWeight='500' lineHeight='26px'>{formatNumber(statsData.inactiveHospitals?.val)}</Text>
                                        <Text color='#45464E' fontSize='12px' fontWeight='500' lineHeight='26px' textColor={"#CC5F5F"}>{statsData.inactiveHospitals?.per}</Text>
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
                            <Text color='#8B8D97' fontSize='14px'>New</Text>
                            <HStack>
                                {loading ? (
                                    <Spinner size="sm" />
                                ) : (
                                    <>
                                        <Text color='#45464E' fontSize='20px' fontWeight='500' lineHeight='26px'>{formatNumber(statsData.newHospitals?.val)}</Text>
                                        <Text color='#45464E' fontSize='12px' fontWeight='500' lineHeight='26px' textColor={"#CC5F5F"}>{statsData?.newHospitals?.per}</Text>
                                    </>
                                )}
                            </HStack>
                        </VStack>

                        <VStack gap='1px' alignItems='flex-start'>
                            <Text color='#8B8D97' fontSize='14px'>Products Added</Text>
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
                                    // <Text color='#45464E' fontSize='20px' fontWeight='500' lineHeight='26px'>{formatNumber(statsData.withoutDistributors)}</Text>
                                    <Text>nothing</Text>
                                )}
                            </HStack>
                        </VStack>
                    </HStack>
                </Box>
            </HStack>

            {/* <DataList ListItems={HospitalData} /> */}
            <HospitalList />
        </Box>
    )
}

