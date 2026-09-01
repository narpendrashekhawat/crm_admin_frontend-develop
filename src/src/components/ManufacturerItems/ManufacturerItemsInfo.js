import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Heading, HStack, Text, VStack, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, FormControl, FormLabel, Input, Spinner } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { GoHomeFill } from "react-icons/go";
import { Image } from "@chakra-ui/react"
import card1 from "../../assets/icons/card1.svg";
import card2 from "../../assets/icons/card2.svg";
import FiPlus from "../../assets/icons/fi_plus.png"
// import filterIcon from "../../assets/icons/calendar.svg";
import DataList from "../DataList/DataList";
import axios from "axios";
import { Config } from "../Utils/Config";
import ManufacturerData from "../DataList/data.json"

const ManufacturerInfo = () => {
    // State for statistics data
    const [statsData, setStatsData] = useState({
        allManufacturers: 0,
        activeManufacturers: 0,
        inactiveManufacturers: 0,
        newManufacturers: 0,
        productsAdded: 0,
        withoutDistributors: 0
    });

    // State for loading indicators
    const [loading, setLoading] = useState(true);

    // State for date filters
    const [startDate, setStartDate] = useState(new Date(1970, 0, 1).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [isFilterActive, setIsFilterActive] = useState(false);

    // Modal controls for date filter
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Function to fetch statistics from API
    const fetchManufacturerStats = async () => {
        setLoading(true);
        try {
            // Construct query string for date parameters
            let queryParams = '';
            queryParams = `?startDate=${startDate}&endDate=${endDate}`;


            const response = await axios.get(
                `${Config.ManufactureCards_url}${queryParams} `,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                }
            );

            if (response.status === 200) {
                const data = response?.data?.data;
                setStatsData({
                    allManufacturers: {val:data?.manufacturerStats?.totalManufacturers?.count || 0,per:data?.manufacturerStats?.totalManufacturers?.percentageChange},
                    activeManufacturers: {val: data?.manufacturerStats?.activeManufacturers?.count || 0,per:data?.manufacturerStats?.totalManufacturers?.percentageChange},
                    inactiveManufacturers: {val: data?.manufacturerStats?.inactiveManufacturers?.count || 0,per:data?.manufacturerStats?.totalManufacturers?.percentageChange},
                    newManufacturers: {val: data?.productStats?.newProductsAdded || 0,per:data?.manufacturerStats?.totalManufacturers?.percentageChange},
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
        onClose();
    };

    const resetDateFilter = () => {
        setStartDate("");
        setEndDate("");
        setIsFilterActive(false);
        fetchManufacturerStats();
        onClose();
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

            <HStack justifyContent='space-between'>
                <HStack gap='20px'>
                    <Heading color='#45464E' fontSize='14px' fontWeight='600'>Manufacturer Summary</Heading>
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

                    <Button as={"a"} href="/manufacturers/add-manufacturer" justifyContent={'space-between'} bg='#3E60AA' color='white' padding='0px 12px' fontWeight='400' borderRadius='12px' w='213px' h='36px' fontSize='14px'>
                        <img src={FiPlus} width={"20px"} alt="" />
                        Add New Manufacturer
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
                            <Text color='#8B8D97' fontSize='14px'>New</Text>
                            <HStack>
                                {loading ? (
                                    <Spinner size="sm" />
                                ) : (
                                    <>
                                        <Text color='#45464E' fontSize='20px' fontWeight='500' lineHeight='26px'>{formatNumber(statsData.newManufacturers?.val)}</Text>
                                        <Text color='#45464E' fontSize='12px' fontWeight='500' lineHeight='26px' textColor={"#CC5F5F"}>{startDate?.newManufacturers?.per}</Text>
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