import {
    Box, Button, Flex, Text, Input, Table, Thead, Tbody, Tr, Th, Td, Checkbox, Select, Badge, InputGroup, InputLeftElement,
    IconButton, Menu, MenuButton, MenuList, MenuItem, Icon, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
    ModalCloseButton, ModalFooter, useDisclosure, Switch, FormControl, FormLabel, Image, Link,
    HStack, useToast, Spinner,
    VStack
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { FiUploadCloud, FiDownload, FiPlus, FiSearch, FiChevronLeft, FiChevronRight, FiEdit, FiTrash2 } from "react-icons/fi";
import { useState, useEffect } from 'react';
import sortIcon from "../../assets/icons/sort.svg";
import { useNavigate } from "react-router-dom";
import UploadData from "./UploadData";
import useAxios from "../Context/axiosInstance";
import { useAuth } from "../Context/authContext";
import { Config } from "../Utils/Config";
import axios from "axios";

const HSN_List = () => {
    const axiosInstance = useAxios();
    const { authToken } = useAuth();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [hsnCodes, setHsnCodes] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleNav = () => {
        navigate('/hsn/Add_HSN_Code');
    };
    

    useEffect(() => {
        if (authToken && authToken.trim() !== '') {
            fetchHSNCodes();
        } else {
            console.warn("Auth token is missing or empty");
            setError("Authentication error. Please login again.");
        }
    }, [currentPage, itemsPerPage, searchTerm, authToken]);

    const fetchHSNCodes = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // console.log("Fetching HSN codes with:", {
            //     page: currentPage,
            //     limit: itemsPerPage,
            //     search: searchTerm,
            //     authToken: authToken ? "Token exists" : "Token missing"
            // });

            const response = await axios.get(`${Config.Search_HSN_url}/search?search=${searchTerm}&page=${currentPage}&limit=${itemsPerPage}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });

            const apiData = response.data.apiData || {};

            // console.log("API Response:", response.data.apiData);

            if (!response.data) {
                throw new Error("API returned empty response");
            }

            // Extract HSN codes from the API response
            const fetchedHSNCodes = apiData.data || [];
        
            // console.log("Fetched HSN codes:", fetchedHSNCodes);

            setHsnCodes(fetchedHSNCodes);
            setTotalItems(apiData.totalItems || 0);
            setTotalPages(apiData.totalPages || 1);

        } catch (error) {
            console.error("Error fetching HSN codes:", error);
            setError(error.response?.apiData?.message || error.message || "Failed to fetch HSN codes");

            toast({
                title: "Error fetching HSN codes",
                description: error.response?.apiData?.message || error.message || "An error occurred",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };
    

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            return new Date(dateString).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    };

    const handleEdit = (id) => {
        navigate(`/hsn/edit_hsn_code/${id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this HSN code?')) {
            try {
                await axios.delete(`${Config.Delete_HSN_url}/${id}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
                
                toast({
                    title: "HSN Code deleted successfully",
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                });
                
                fetchHSNCodes(); // Refresh the list
            } catch (error) {
                toast({
                    title: "Error deleting HSN code",
                    description: error.response?.apiData?.message || "Failed to delete HSN code",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    };

    return (
        <Box py={5} bg="white" mt='1rem' padding='12px 20px' borderRadius='15px 15px 0px 0px'>
            <UploadData isOpen={isOpen} onClose={onClose} />
            
            {/* Header */}
            <Text fontSize="md" fontWeight="medium" mb={4}>HSN Code List</Text>
            
            {/* Action Buttons */}
            <Flex justifyContent={'flex-start'} gap={2} wrap="wrap" mb={6} w={'100%'}>
                <HStack>
                    <Link href="https://bucket-cms-new.s3.ap-south-1.amazonaws.com/sample_files/sample_hsn_sheet.csv" isExternal>
                        <Button 
                            leftIcon={<FiDownload size="24px" />} 
                            bg="#4C526F" 
                            color="white" 
                            fontSize="14px" 
                            borderRadius="12px" 
                            h="93px" 
                            w="205px" 
                            _hover={{ bg: "#2d3a54" }}
                        >
                            Download Data Sheet
                        </Button>
                    </Link>
                    
                    <Button
                        leftIcon={<FiUploadCloud size="24px" />}
                        bg="#5570F1"
                        color="white"
                        fontSize="14px"
                        borderRadius="12px"
                        h="93px"
                        w="205px"
                        _hover={{ bg: "#3d62e7" }}
                        onClick={onOpen}
                    >
                        Upload Data
                    </Button>

                    <Button
                        leftIcon={<FiPlus size="24px" />}
                        bg="#3E60AA"
                        color="white"
                        borderRadius="12px"
                        fontSize="14px"
                        h="93px"
                        w="205px"
                        _hover={{ bg: "#2d4d7b" }}
                        onClick={handleNav}
                    >
                        Add New HSN Code
                    </Button>
                </HStack>
            </Flex>

            {/* Table Section */}
            <Box>
                {/* Search Bar */}
                <Flex justify="space-between" align="center" mb={4}>
                    <Text fontSize="16px" fontWeight="bold" color="#6E7079">
                        HSN Codes ({totalItems})
                    </Text>
                    <InputGroup maxW="400px">
                        <InputLeftElement pointerEvents="none">
                            <FiSearch color="gray.400" />
                        </InputLeftElement>
                        <Input
                            placeholder="Search HSN codes..."
                            borderRadius="4"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </InputGroup>
                </Flex>

                {/* Error Display */}
                {error && (
                    <Box bg="red.50" p={4} borderRadius="md" mb={4}>
                        <Text color="red.500">{error}</Text>
                    </Box>
                )}

                {/* HSN Codes Table */}
                <Table variant="simple" size="md">
                    <Thead>
                        <Tr borderTop="1px solid #E1E2E9" height="58px">
                            {/* <Th w="40px"><Checkbox colorScheme="blue" /></Th> */}
                            <Th fontSize="14px" color="#2C2D33" textTransform={'capitalize'} fontWeight={'400'}>
                                <HStack>
                                    <Text>HSN Code</Text>
                                    <Image src={sortIcon} alt="sort" width="16px" ml="2" />
                                </HStack>
                            </Th>
                            <Th fontSize="14px" color="#2C2D33" textTransform={'capitalize'} fontWeight={'400'}>
                                <HStack>
                                    <Text>Description</Text>
                                    <Image src={sortIcon} alt="sort" width="16px" ml="2" />
                                </HStack>
                            </Th>
                            <Th fontSize="14px" color="#2C2D33" textTransform={'capitalize'} fontWeight={'400'}>
                                <HStack>
                                    <Text>CGST (%)</Text>
                                    <Image src={sortIcon} alt="sort" width="16px" ml="2" />
                                </HStack>
                            </Th>
                            <Th fontSize="14px" color="#2C2D33" textTransform={'capitalize'} fontWeight={'400'}>
                                <HStack>
                                    <Text>SGST (%)</Text>
                                    <Image src={sortIcon} alt="sort" width="16px" ml="2" />
                                </HStack>
                            </Th>
                            <Th fontSize="14px" color="#2C2D33" textTransform={'capitalize'} fontWeight={'400'}>
                                <HStack>
                                    <Text>IGST (%)</Text>
                                    <Image src={sortIcon} alt="sort" width="16px" ml="2" />
                                </HStack>
                            </Th>
                            <Th fontSize="14px" color="#2C2D33" textTransform={'capitalize'} fontWeight={'400'}>
                                <HStack>
                                    <Text>Category</Text>
                                    <Image src={sortIcon} alt="sort" width="16px" ml="2" />
                                </HStack>
                            </Th>
                            <Th fontSize="14px" color="#2C2D33" textTransform={'capitalize'} fontWeight={'400'}>
                                <HStack>
                                    <Text>Added Date</Text>
                                    <Image src={sortIcon} alt="sort" width="16px" ml="2" />
                                </HStack>
                            </Th>
                            <Th fontSize="14px" color="#2C2D33" textTransform={'capitalize'} fontWeight={'400'}>
                                <HStack>
                                    <Text>Actions</Text>
                                </HStack>
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {isLoading ? (
                            <Tr>
                                <Td colSpan={9} textAlign="center">
                                    <Flex justify="center" align="center" py={4}>
                                        <Spinner size="md" mr={2} />
                                        <Text>Loading HSN codes...</Text>
                                    </Flex>
                                </Td>
                            </Tr>
                        ) : hsnCodes && hsnCodes.length > 0 ? (
                            hsnCodes.map((hsn, index) => (
                                <Tr key={hsn.id} height={'48px'}>
                                    {/* <Td><Checkbox /></Td> */}
                                    <Td fontSize="14px" color="#6E7079" fontWeight="500">
                                        {hsn.HSN_CD}
                                    </Td>
                                    <Td fontSize="14px" color="#6E7079">
                                        {hsn.HSN_Description || '-'}
                                    </Td>
                                    <Td fontSize="14px" color="#6E7079">
                                        {hsn.CGST}%
                                    </Td>
                                    <Td fontSize="14px" color="#6E7079">
                                        {hsn.SGST}%
                                    </Td>
                                    <Td fontSize="14px" color="#6E7079">
                                        {hsn.IGST}%
                                    </Td>
                                    <Td fontSize="14px" color="#6E7079">
                                        {hsn.category || '-'}
                                    </Td>
                                    <Td fontSize="14px" color="#6E7079">
                                        {formatDate(hsn.createdAt)}
                                    </Td>
                                    <Td>
                                        <HStack spacing={2}>
                                            <IconButton
                                                icon={<FiEdit />}
                                                variant="ghost"
                                                size="sm"
                                                colorScheme="blue"
                                                aria-label="Edit HSN code"
                                                onClick={() => handleEdit(hsn.id)}
                                                _hover={{ bg: "blue.50" }}
                                            />
                                            <IconButton
                                                icon={<FiTrash2 />}
                                                variant="ghost"
                                                size="sm"
                                                colorScheme="red"
                                                aria-label="Delete HSN code"
                                                onClick={() => handleDelete(hsn.id)}
                                                _hover={{ bg: "red.50" }}
                                            />
                                        </HStack>
                                    </Td>
                                </Tr>
                            ))
                        ) : (
                            <Tr>
                                <Td colSpan={9} textAlign="center" py={4}>
                                    <Text>No HSN codes found</Text>
                                </Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>

                {/* Pagination Controls */}
                {!isLoading && hsnCodes && hsnCodes.length > 0 && (
                    <Flex justify="space-between" align="center" mt={4}>
                        <Flex align="center">
                            <Select
                                size="sm"
                                w="70px"
                                height="32px"
                                borderRadius="8px"
                                backgroundColor="#f0f4f9"
                                mr={2}
                                value={itemsPerPage}
                                onChange={handleItemsPerPageChange}
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </Select>
                            <Text fontSize="sm" color="#666666">Items per page</Text>
                            <Text fontSize="14px" color="#666666" marginLeft="12px">
                                {Math.min(1 + (currentPage - 1) * itemsPerPage, totalItems)}-
                                {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
                            </Text>
                        </Flex>

                        <Flex align="center">
                            <Select
                                size="sm"
                                w="70px"
                                height="32px"
                                borderRadius="8px"
                                backgroundColor="#f0f4f9"
                                mr={1}
                                value={currentPage}
                                onChange={(e) => handlePageChange(Number(e.target.value))}
                            >
                                {[...Array(totalPages).keys()].map(pageNum => (
                                    <option key={pageNum + 1} value={pageNum + 1}>
                                        {pageNum + 1}
                                    </option>
                                ))}
                            </Select>
                            <Text fontSize="14px" color="#666666" marginLeft="8px">
                                of {totalPages} pages
                            </Text>
                            <IconButton
                                icon={<FiChevronLeft />}
                                variant="ghost"
                                size="sm"
                                aria-label="Previous page"
                                mr={1}
                                onClick={() => handlePageChange(currentPage - 1)}
                                isDisabled={currentPage === 1}
                            />
                            <IconButton
                                icon={<FiChevronRight />}
                                variant="ghost"
                                size="sm"
                                aria-label="Next page"
                                onClick={() => handlePageChange(currentPage + 1)}
                                isDisabled={currentPage === totalPages}
                            />
                        </Flex>
                    </Flex>
                )}
            </Box>
        </Box>
    );
};

export default HSN_List;
