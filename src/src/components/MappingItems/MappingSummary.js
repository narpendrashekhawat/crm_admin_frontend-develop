import React, { useEffect, useState } from 'react';
import {
    Box, Table, Thead, Tbody, Tr, Th, Td, Button, Input, InputGroup, InputLeftElement, Flex, Text, Badge, IconButton, Select, HStack, Breadcrumb, BreadcrumbItem,
    BreadcrumbLink, Image, useDisclosure,
    TableContainer,
    Center,
} from '@chakra-ui/react';
import { SearchIcon, ChevronLeftIcon, ChevronRightIcon, DownloadIcon } from '@chakra-ui/icons';
import { GoHomeFill } from 'react-icons/go';
import sortIcon from "../../assets/icons/sort.svg";
import CopyIcon from '../../assets/icons/Copy.svg';
import filterIcon from "../../assets/icons/calendar.svg";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/authContext';
import axios from 'axios';
import { Config } from '../Utils/Config';

import { FiSearch } from 'react-icons/fi';
import moment from 'moment/moment';
import dayjs from 'dayjs';
import FilterbyDate from './FilterByDate';

const BulkUploadMappingCatalog = () => {
    const [mappingList, setMappingList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { authToken } = useAuth();
    const [isDatepickerOpen, setIsDatepickerOpen] = useState(false);
    console.log(authToken, 'authtoken')

    const [fileUrl, setFileUrl] = useState("");
    const toggleDatePopup = () => {
        setIsDatepickerOpen(!isDatepickerOpen);
 
    };


    const GetMfgMappingListData = async () => {
        const formattedStartDate = startDate ? dayjs(startDate).format("DD-MM-YYYY") : '';
        const formattedEndDate = endDate ? dayjs(endDate).format("DD-MM-YYYY") : '';
        try {
            const response = await axios.get(`${Config?.Get_Manufaturers_Mapping_List}?page=${currentPage}&limit=${itemsPerPage}&companyName=${search}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            })
            if (response?.status === 200) {
                setMappingList(response?.data?.headers);
                setTotalItems(response?.data?.totalHeaders);
                setTotalPages(response?.data?.totalPages)
                console.log(response?.data?.headers, 'headersList')
            }

        } catch (error) {
            console.log(error, "Error in fetching api response")
            if (error?.response?.status === 404) {
                setMappingList([]); // Set to empty list to refresh UI
                setTotalItems(0);
                setTotalPages(1);
            }
        }
    }

    useEffect(() => {
        if (authToken) {
            GetMfgMappingListData()
        }
    }, [authToken, currentPage, itemsPerPage, search])
    // Sample data for the table
    const tableData = [
        {
            "id": 1,
            "userName": "Janet Adebayo",
            "userType": "Manufacturer",
            "phone": "+2348065650633",
            "fileName": "#1013245655t",
            "uploadedDate": "12 Aug 2022 - 12:25 am",
            "status": "2 Mfr, 8 Prod Pending"
        },
        {
            "id": 2,
            "userName": "Janet Adebayo",
            "userType": "Distributor",
            "phone": "+2348012345678",
            "fileName": "#2014356789d",
            "uploadedDate": "14 Sep 2022 - 10:30 am",
            "status": "2 Mfr, 8 Prod Pending"
        },
        {
            "id": 3,
            "userName": "Janet Adebayo",
            "userType": "Maharashtra",
            "phone": "+2348098765432",
            "fileName": "#3015467891m",
            "uploadedDate": "15 Oct 2022 - 03:15 pm",
            "status": "2 Mfr, 8 Prod Pending"
        },
        {
            "id": 4,
            "userName": "Janet Adebayo",
            "userType": "Manufacturer",
            "phone": "+2348023456789",
            "fileName": "#4016578912t",
            "uploadedDate": "10 Nov 2022 - 07:45 am",
            "status": "2 Mfr, 8 Prod Pending"
        },
        {
            "id": 5,
            "userName": "Janet Adebayo",
            "userType": "Distributor",
            "phone": "+2348076543210",
            "fileName": "#5017689123d",
            "uploadedDate": "20 Dec 2022 - 05:20 pm",
            "status": "2 Mfr, 8 Prod Pending"
        },
        {
            "id": 6,
            "userName": "Janet Adebayo",
            "userType": "Maharashtra",
            "phone": "+2348045678901",
            "fileName": "#6018791234m",
            "uploadedDate": "22 Jan 2023 - 09:00 am",
            "status": "2 Mfr, 8 Prod Pending"
        },
        {
            "id": 7,
            "userName": "Janet Adebayo",
            "userType": "Distributor",
            "phone": "+2348045678901",
            "fileName": "#6018791234m",
            "uploadedDate": "22 Jan 2023 - 09:00 am",
            "status": "2 Mfr, 8 Prod Pending"
        },
        {
            "id": 8,
            "userName": "Janet Adebayo",
            "userType": "Maharashtra",
            "phone": "+2348045678901",
            "fileName": "#6018791234m",
            "uploadedDate": "22 Jan 2023 - 09:00 am",
            "status": "2 Mfr, 8 Prod Pending"
        },
        {
            "id": 9,
            "userName": "Janet Adebayo",
            "userType": "Manufacture",
            "phone": "+2348045678901",
            "fileName": "#6018791234m",
            "uploadedDate": "22 Jan 2023 - 09:00 am",
            "status": "2 Mfr, 8 Prod Pending"
        },
        {
            "id": 10,
            "userName": "Janet Adebayo",
            "userType": "Maharashtra",
            "phone": "+2348045678901",
            "fileName": "#6018791234m",
            "uploadedDate": "22 Jan 2023 - 09:00 am",
            "status": "2 Mfr, 8 Prod Pending"
        }
    ]

    const nav = useNavigate();
    function handleNav(id, userName, userType) {

        nav(`/Mappingmap/${id}`, { state: { userName, userType } });
    };

    const handleExportCSV = async (headerId) => {
        try {
            const response = await axios.get(`${Config?.CSV_download}/${headerId}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            })
            if (response?.status === 200) {
                setFileUrl(response?.data?.header?.[0]?.fileName || "");
            }
        } catch (error) {
            console.log(error, 'Error in fetching api response')
        }
    }

    const downloadHeaderFile = () => {
        if (!fileUrl) return;
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = 'Uploaded Stock.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    useEffect(() => {
        if (fileUrl) {
            downloadHeaderFile();
        }
    }, [fileUrl]);

    const handleDownloadCSV = async (headerId) => {
        await handleExportCSV(headerId);
    };
    return (
        <>
         <FilterbyDate isDatepickerOpen={isDatepickerOpen} setIsDatepickerOpen={setIsDatepickerOpen} startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} GetMfgMappingListData={GetMfgMappingListData}/>
            <Box backgroundColor='white' mt='1rem' padding='12px 20px 24px' borderRadius='15px 15px 0px 0px' mb='1rem'>
                <Breadcrumb color="#8B8D97" padding='10px 0px 2rem 0px' >
                    <BreadcrumbItem>
                        <BreadcrumbLink href='/mapping'><GoHomeFill color="#5570F1" /> </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <BreadcrumbLink href='' color='#8B8D97' fontSize='13px' isCurrentPage>Mapping</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
                <Flex justify="space-between" align="center" mb={4} position='relative'>
                    <Text fontSize="14px" color="#2C2D33" fontWeight="medium">Bulk Upload Mapping Product Catalog</Text>
                    <Flex>
                        <InputGroup>
                            <Input placeholder="Search" width="190px" height="29px" value={search} onChange={(e) => setSearch(e.target.value)} _placeholder={{fontSize: '12px',color: '#ABAFB1'}} />
                            <InputLeftElement>
                                {/* <SearchIcon color="gray.800" justifyContent="start" marginBottom="8px" /> */}
                                <FiSearch marginBottom="8px" style={{ position: 'absolute', top: '6px' }} />
                            </InputLeftElement>
                        </InputGroup>
                        <Button
                            size="sm"
                            fontWeight={"400"}
                            border={"1px solid #53545C"}
                            fontSize={"11px"}
                            alignSelf={"end"}
                            w="80px"
                            height="29px"
                            margin="0px 5px 7px 0px"
                            onClick={toggleDatePopup}
                        >
                            <img src={filterIcon} alt="filter" size="16px" style={{ marginRight: "8px" }} padding="7px 8px 7px 8px" />
                            <Text fontSize="11px">Filter</Text>
                        </Button>
                    </Flex>
                </Flex>

                <TableContainer>
                    <Box overflowX="auto" px={4} maxW="100vw">
                        <Box overflowX="auto" whiteSpace="nowrap" sx={{
                            "&::-webkit-scrollbar": { width: "8px", height: '8px' },
                            "&::-webkit-scrollbar-thumb": {
                                width: "8px",
                                backgroundColor: "#7A7A7A",
                                borderRadius: "4px",
                            },
                            "&::-webkit-scrollbar-track": {
                                background: "#E8E8E8",
                                borderRadius: "4px",
                            },
                        }}>
                            <Table variant="simple" size={"sm"}>
                                <Thead height="52px" borderTop={"1px solid #E1E2E9"}>
                                    <Tr >
                                        <Th fontSize="14px" color="#2C2D33" textTransform={'capitalize'} fontWeight={'400'}>
                                            <HStack>
                                                <Text> User Name</Text> <Image src={sortIcon} alt="sort" width="16px" />
                                            </HStack>
                                        </Th>
                                        <Th fontSize="14px" color="#2C2D33" textTransform={'capitalize'} fontWeight={'400'}>
                                            <HStack>
                                                <Text> User Type </Text> <Image src={sortIcon} alt="sort" width="16px" />
                                            </HStack>
                                        </Th>
                                        <Th fontSize="14px" color="#2C2D33" textTransform={'capitalize'} fontWeight={'400'}>
                                            <HStack>
                                                <Text>Phone</Text> <Image src={sortIcon} alt="sort" width="16px" />
                                            </HStack>
                                        </Th>
                                        <Th fontSize="14px" color="#2C2D33" textTransform={'capitalize'} fontWeight={'400'}>
                                            <HStack>
                                                <Text>File Name</Text> <Image src={sortIcon} alt="sort" width="16px" />
                                            </HStack>
                                        </Th>
                                        <Th fontSize="14px" color="#2C2D33" textTransform={'capitalize'} fontWeight={'400'}>
                                            <HStack>
                                                <Text> Uploaded Date</Text> <Image src={sortIcon} alt="sort" width="16px" />
                                            </HStack>
                                        </Th>
                                        <Th fontSize="14px" color="#2C2D33" textTransform={'capitalize'} fontWeight={'400'}>
                                            <HStack>
                                                <Text>Status</Text>  <Image src={sortIcon} alt="sort" width="16px" />
                                            </HStack>
                                        </Th>
                                        <Th fontSize="14px" color="#2C2D33" textTransform={'capitalize'} fontWeight={'400'}>
                                            <HStack>
                                                <Text>Download</Text> <Image src={sortIcon} alt="sort" width="16px" />
                                            </HStack>
                                        </Th>
                                        <Th fontSize="14px" color="#2C2D33" textTransform={'capitalize'} fontWeight={'400'}>
                                            <HStack>
                                                <Text>Action</Text> <Image src={sortIcon} alt="sort" width="16px" />
                                            </HStack>
                                        </Th>
                                    </Tr>

                                </Thead>
                                <Tbody>

                                    {mappingList?.length > 0 ?
                                        mappingList.map((row) => (
                                            <Tr key={row.id}>
                                                <Td fontSize="14px" color="#6E7079">{row.userName}</Td>
                                                <Td fontSize="14px" color="#6E7079">{row.userType}</Td>
                                                <Td>
                                                    <Flex align="center">
                                                        <Text fontSize="14px" color="#6E7079">{row.phoneNumber}</Text>
                                                        <Image src={CopyIcon} ml={5} />
                                                    </Flex>
                                                </Td>
                                                <Td fontSize="14px" color="#6E7079">{row.fileName.split('-')[0]}</Td>
                                                <Td fontSize="14px" color="#6E7079" fontWeight="400">{moment(row.createdAt).format('DD MMM YYYY-hh:mm A')}</Td>

                                                <Td>
                                                    <Badge backgroundColor="#ed353542" color="#6E7079" padding="10px 18px 8px 20px" w="164px" h="33px" borderRadius="8px" textTransform={'capitalize'} fontWeight='500'>
                                                        {/* {row.notMapped === 0 ? 'Not Mapped Yet' : 'Mapped'} */}
                                                        {row.notMapped} Mfr
                                                    </Badge>
                                                </Td>
                                                <Td>
                                                    <IconButton
                                                        aria-label="Download"
                                                        icon={<DownloadIcon />}
                                                        variant="ghost"
                                                        colorScheme="gray"
                                                        onClick={() => handleDownloadCSV(row?.id)}
                                                    />
                                                </Td>
                                                <Td>

                                                    <Button onClick={() => handleNav(row?.id, row.userName, row.userType)} backgroundColor="#3E60AA" size="sm">
                                                        <Text color="#ffffff" fontSize="14px" fontWeight='500'>Map Now</Text>
                                                    </Button>
                                                </Td>
                                            </Tr>
                                        )) :
                                        (<>
                                            <Td colSpan='8' textAlign='center'>No data found.</Td>
                                        </>)
                                    }
                                </Tbody>
                            </Table>
                        </Box></Box>
                </TableContainer>

                <Box w="full" p={4}>
                    <Flex justify="space-between" align="center">
                        {/* Items per page dropdown */}
                        <Flex align="center" gap="4px">
                            <Select
                                w="69px"
                                height="25px"
                                size="sm"
                                value={itemsPerPage}
                                border="none"
                                backgroundColor="#5e63661a"
                                color="#8B8D97"
                                borderRadius="10px"
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(1); // Reset to first page
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
                                    {(currentPage - 1) * itemsPerPage + 1}-
                                    {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
                                </Text>
                            </HStack>
                        </Flex>

                        {/* Pagination controls */}
                        <Flex align="center">
                            <HStack>
                                <Select
                                    w="60px"
                                    height="25px"
                                    size="sm"
                                    value={currentPage}
                                    border="none"
                                    backgroundColor="#5e63661a"
                                    color="#8B8D97"
                                    borderRadius="10px"
                                    onChange={(e) => setCurrentPage(Number(e.target.value))}
                                >
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            {i + 1}
                                        </option>
                                    ))}
                                </Select>
                                <Text ml={2} fontSize="14px" color="#666666">
                                    of {totalPages} pages
                                </Text>
                                <Flex ml={2}>
                                    <IconButton
                                        aria-label="Previous page"
                                        icon={<ChevronLeftIcon color="#666666" fontSize="20px" />}
                                        size="sm"
                                        border="none"
                                        background="transparent"
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        isDisabled={currentPage === 1}
                                    />
                                    <IconButton
                                        aria-label="Next page"
                                        icon={<ChevronRightIcon color="#666666" fontSize="20px" />}
                                        size="sm"
                                        border="none"
                                        background="transparent"
                                        ml={2}
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                        isDisabled={currentPage === totalPages}
                                    />
                                </Flex>
                            </HStack>
                        </Flex>
                    </Flex>
                </Box>
            </Box>
        </>
    );
};

export default BulkUploadMappingCatalog;