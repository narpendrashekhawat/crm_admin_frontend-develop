import {
    Box, Button, Flex, Text, Input, Table, Thead, Tbody, Tr, Th, Td, Checkbox, Select, Badge, InputGroup, InputLeftElement,
    IconButton, Menu, MenuButton, MenuList, MenuItem, Icon, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
    ModalCloseButton, ModalFooter, useDisclosure, Switch, FormControl, FormLabel, Image, Link,
    HStack, useToast, Spinner,
    VStack
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { FiUploadCloud, FiDownload, FiPlus, FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaEdit, FaLock, FaUnlock } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { useState, useEffect } from 'react';
import sortIcon from "../../assets/icons/sort.svg";
import AddProductForm from "./AddProductForm";
import { useNavigate } from "react-router-dom";
import BulkUploadData from "./BulkUploadData";
import useAxios from "../Context/axiosInstance";
import { useAuth } from "../Context/authContext";
import { Config } from "../Utils/Config";
import axios from "axios";

const ProductCatalog = () => {
    const [TotalItems, setTotalItems] = useState(0);
    const axiosInstance = useAxios();
    const { authToken } = useAuth();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [products, setProducts] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [lockedProducts, setLockedProducts] = useState(0);
    const [unlockedProducts, setUnlockedProducts] = useState(0);
    const [date, setDate] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [statsLoading, setStatsLoading] = useState(false);
    const [productStats, setProductStats] = useState({
        totalProducts: 0,
        unlockedProducts: 0,
        lockedProducts: 0,
        last_Updated: 0
    });

    const navigate = useNavigate();

    const handleNav = () => {
        navigate('/product-catalogue/AddProductForm');
    };

    const [totalRespItems, setTotalRespItems] = useState(10);

    useEffect(() => {
        // Only fetch if authToken exists and is not empty
        if (authToken && authToken.trim() !== '') {
            fetchProducts();
            // fetchProductStats();
        } else {
            console.warn("Auth token is missing or empty");
            setError("Authentication error. Please login again.");
        }
    }, [currentPage, itemsPerPage, searchTerm, authToken]);

    useEffect(() => {
        fetchProductStats()
    }, [])

    const fetchProductStats = async () => {
        try {
            setStatsLoading(true);

            const response = await axios.get(`${Config.ProductCard_url}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                }
            );

            console.log("Stats API Response:", response.data);

            if (response?.data?.data && response?.data.status) {
                setProductStats({
                    totalProducts: response?.data?.data?.All_Products || 0,
                    unlockedProducts: response?.data?.data?.unlocked_Products || 0,
                    lockedProducts: response?.data?.data?.locked_Products || 0,
                    last_Updated: response.data?.data?.last_Updated || 0
                });
            } else {
                console.warn("Stats API returned unexpected format", response.data);
            }
        } catch (error) {
            console.error("Error fetching product stats:", error);
            console.error("Error details:", error.response?.data || error.message);

            toast({
                title: "Error fetching product statistics",
                description: error.response?.data?.message || error.message || "An error occurred",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setStatsLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            setError(null);

            console.log("Fetching products with:", {
                page: currentPage,
                limit: itemsPerPage,
                search: searchTerm,
                authToken: authToken ? "Token exists" : "Token missing"
            });
            // /api/products/keyword?search=man&page=1&limit=10

            // Using the new API endpoint with pagination
            const response = await axios.get(`${Config.ProductSummary_url}/keyword?search=${searchTerm}&page=${currentPage}&limit=${itemsPerPage}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });

            console.log("API Response:", response.data);

            // Check if response contains data
            if (!response.data) {
                throw new Error("API returned empty response");
            }

            // Extract products with proper error handling
            const fetchedProducts = response.data.products || [];
            console.log("Fetched products:", fetchedProducts);

            // Update products state with the fetched data
            setProducts(fetchedProducts);
            console.log(fetchedProducts, 'fetchedProducts1234')

            // Update pagination information with fallbacks
            setTotalProducts(response?.data?.data?.pagination?.currentPage || 0);
            setTotalRespItems(response?.data?.pagination?.totalProducts)
            setTotalItems(response?.data?.data?.totalItems);
            setTotalPages(response?.data?.pagination?.totalPages);

        } catch (error) {
            console.error("Error fetching products:", error);
            console.error("Error details:", error.response?.data || error.message);
            setError(error.response?.data?.message || error.message || "Failed to fetch products");

            // Show toast notification
            toast({
                title: "Error fetching products",
                description: error.response?.data?.data?.message || error.message || "An error occurred",
                status: "error",
                duration: 5000,
                isClosable: true,
            });

            // Set empty products to avoid rendering errors
            // setProducts([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const formatDate = (dateString) => {
        if (!dateString) return;
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

    const currentDate = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'

    });

    const handleChange = (e) => {
        setCurrentPage(e.target.value);
        setCurrentPage(1);
    }

    const handleClickNav = (id) => {
        navigate("/product-catalogue/Editproduct/" + id); // local route
    };
    console.log("last_Updated value: ", productStats.last_Updated);
    console.log("last_Updated value: ", productStats.unlocked_Products);


    //  Checkbox state
const [selectedRows, setSelectedRows] = useState([]);

//  Row select (toggle single checkbox)
const handleCheckboxChange = (id) => {
  setSelectedRows((prev) =>
    prev.includes(id)
      ? prev.filter((rowId) => rowId !== id)
      : [...prev, id]
  );
};

//  Select All (toggle all checkboxes at once)
const handleSelectAll = (checked) => {
  if (checked) {
    setSelectedRows(products.map((product) => product.PId)); // use product IDs
  } else {
    setSelectedRows([]);
  }
};


    return (


        <Box py={5} >
            <BulkUploadData isOpen={isOpen} onClose={onClose} />
            {/* Product Summary */}
            <Text fontSize="md" fontWeight="medium" mb={4}>Product Summary</Text>
            <Flex justifyContent={'space-between'} gap={2} wrap="wrap" mb={6} w={'100%'}>
                <HStack flex={2} >
                    <Flex flex={1} bg="#AEAFB7" borderRadius="12px" h="93px" py={5} px={4} justify="space-between" marginRight="20px">
                        <Box>
                            <Text fontSize="14px" color="white">All Products</Text>
                            <Text fontSize="20px" fontWeight="medium" color="white" pt={2}></Text>
                            <Text fontSize={20} color="#FFFFFF">
                                {statsLoading ? <Spinner size="sm" color="white" /> : productStats.totalProducts}
                            </Text>
                        </Box>
                        <Box>
                            <Text fontSize="14px" color="white">Unlocked</Text>
                            <Text fontSize="20px" fontWeight="medium" color="white" pt={2}></Text>
                            <Text fontSize={20} color="#FFFFFF">
                                {statsLoading ? <Spinner size="sm" color="white" /> : productStats.unlockedProducts}
                            </Text>
                        </Box>
                    </Flex>

                    <Flex flex={1} bg="#F0F4F9" borderRadius="12px" h="93px" py={5} px={4} justify="space-between" marginRight="20px">
                        <Box marginRight="19px">
                            <Text fontSize="14px" color="#CC5F5F">Locked</Text>
                            <Text fontSize="20px" fontWeight="semibold" color="#45464E" pt={2}></Text>
                            <Text fontSize={20} color="45464E">
                                {statsLoading ? <Spinner size="sm" /> : productStats.lockedProducts}
                            </Text>
                        </Box>
                        <Box>
                            <Text fontSize="14px" color="#8B8D97">Last Updated</Text>
                            <Text fontSize="16px" fontWeight="medium" color="#45464E" pt={2}>{new Date(productStats.last_Updated).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                            }</Text>
                        </Box>
                    </Flex>
                </HStack>

                <HStack flex={1}>
                    {/* <Link href="https://bucket-cms-new.s3.ap-south-1.amazonaws.com/sample_files/sample_product_sheet.csv" is External>
                        <Button leftIcon={<FiDownload size="24px" />} bg="#4C526F" color="white" marginRight="20px" fontSize="14px" borderRadius="12px" h="93px" w="205px" _hover={{ bg: "#2d3a54" }}>Download Data Sheet</Button> </Link> */}
                    <Button
                        leftIcon={<FiUploadCloud size="24px" />}
                        bg="#5570F1"
                        color="white"
                        marginRight="19px"
                        fontSize="14px"
                        borderRadius="12px"
                        h="93px"
                        w="205px"
                        _hover={{ bg: "#3d62e7" }}
                        onClick={onOpen}
                    >
                        Bulk Upload
                    </Button>


                    <Button
                        leftIcon={<FiPlus size="24px" />}
                        bg="#3E60AA"
                        color="white"
                        borderRadius="12px"
                        fontSize="14px"
                        marginRight="19px"
                        h="93px"
                        w="205px"
                        _hover={{ bg: "#2d4d7b" }}
                        onClick={handleNav}
                    >
                        Add a New Product
                    </Button>
                </HStack>
            </Flex>

            {/* Product Master Table - Adjusted positioning */}
            <Box>
                {/* Search and Bulk Action in a single line */}
                <Flex justify="end" align="end" mb={10} w={'100%'}>
                    <HStack w={'100%'} justifyContent="space-between">
                        <Text fontSize="16px" fontWeight="bold" padding={"20px"} color="#6E7079" display="flex" justifyContent="start">Product Master</Text>
                        <HStack>
                            <InputGroup maxW="400px" marginRight="15px">
                                <InputLeftElement pointerEvents="none">
                                    <FiSearch color="gray.400" />
                                </InputLeftElement>
                                <Input
                                    placeholder="Search by Product Name/Code or Salt"
                                    borderRadius="4"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </InputGroup>

                            <Link href="https://bucket-cms-new.s3.ap-south-1.amazonaws.com/sample_files/ProductBlankSheeet.csv" is External>
                        <Button leftIcon={<FiDownload size="24px" />} bg="#4C526F" color="white" marginRight="20px" fontSize="14px" borderRadius="12px" h="43px" w="205px" _hover={{ bg: "#2d3a54" }}>Download Data Sheet</Button> </Link>

                        </HStack>
                    </HStack>
                </Flex>

                {/* Error Display */}
                {error && (
                    <Box bg="red.50" p={4} borderRadius="md" mb={4}>
                        <Text color="red.500">{error}</Text>
                    </Box>
                )}

                <Table variant="simple" size="xl">
                    <Thead>
                        <Tr borderTop="1px solid #E1E2E9" height="58px">
                            <Th w="40px"><Checkbox
                                 isChecked={selectedRows.length === products.length && products.length > 0}
                                 isIndeterminate={
                                   selectedRows.length > 0 && selectedRows.length < products.length
                                 }
                                 onChange={(e) => handleSelectAll(e.target.checked)}
                               />

                                </Th>
                            <Th fontSize="14px" color="#2C2D33" textTransform={'capitalize'} fontWeight={'400'}>
                                <HStack>
                                    <Text> Medicine Name</Text> <Image src={sortIcon} alt="sort" width="16px" ml="2" />
                                </HStack>
                            </Th>
                            <Th fontSize="14px" color="#2C2D33" textTransform={'capitalize'} fontWeight={'400'}>
                                <HStack>
                                    <Text> Salt Composition</Text> <Image src={sortIcon} alt="sort" width="16px" ml="2" />
                                </HStack>
                            </Th>
                            <Th fontSize="14px" color="#2C2D33" textTransform={'capitalize'} fontWeight={'400'}>
                                <HStack>
                                    <Text> Packaging Details</Text> <Image src={sortIcon} alt="sort" width="16px" ml="2" />
                                </HStack>
                            </Th>
                            <Th fontSize="14px" color="#2C2D33" textTransform={'capitalize'} fontWeight={'400'}>
                                <HStack>
                                    <Text> Added Date</Text> <Image src={sortIcon} alt="sort" width="16px" ml="2" />
                                </HStack>
                            </Th>
                            <Th fontSize="14px" color="#2C2D33" textTransform={'capitalize'} fontWeight={'400'}>
                                <HStack>
                                    <Text> Status</Text> <Image src={sortIcon} alt="sort" width="16px" ml="2" />
                                </HStack>
                            </Th>
                            <Th fontSize="14px" color="#2C2D33" textTransform={'capitalize'} fontWeight={'400'}>
                                <HStack>
                                    <Text> Action</Text> <Image src={sortIcon} alt="sort" width="16px" ml="2" onClick={handleNav} />
                                </HStack>
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {isLoading ? (
                            <Tr>
                                <Td colSpan={7} textAlign="center">
                                    <Flex justify="center" align="center" py={4}>
                                        <Spinner size="md" mr={2} />
                                        <Text>Loading products...</Text>
                                    </Flex>
                                </Td>
                            </Tr>
                        ) : products && products?.length > 0 ? (
                            products?.map((product, index) => (
                                <Tr key={index} height={'48px'}>
                                    <Td><Checkbox
                                     isChecked={selectedRows.includes(product.PId)}  
                                     onChange={() => handleCheckboxChange(product.PId)}

                                   /></Td>
                                    <Td fontSize="14px" color="#6E7079">{product?.PName}</Td>
                                    <Td fontSize="14px" color="#6E7079">{product?.SaltComposition}</Td>
                                    <Td fontSize="14px" color="#6E7079">{product?.PackagingDetails}</Td>
                                    <Td fontSize="14px" color="#6E7079">{formatDate(product?.createdAt)}</Td>

                                    <Td>
                                        <Badge
                                            fontSize={12}
                                            p="4px,8px,4px,8px"

                                            borderRadius="10px"
                                            bg={product.lockStatus === "Locked" ? "#E6EAF8" : "#FEF7E6"}

                                            color={product.lockStatus === "Locked" ? "#4880FF" : "#5570F1"}
                                        >
                                            <Td>{product?.lockStatus}</Td>
                                        </Badge>
                                    </Td>
                                    <Td>
                                        <IconButton
                                            icon={<FontAwesomeIcon icon={faEdit} />}
                                            variant="ghost"
                                            size="sm"
                                            aria-label="Edit product"
                                            onClick={() => handleClickNav(product?.PId)}
                                        />
                                    </Td>
                                </Tr>
                            ))
                        ) : (
                            <Tr>
                                <Td colSpan={7} textAlign="center" py={4}>
                                    <Text>No products found</Text>
                                </Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>

                {/* Pagination Controls */}
                {!isLoading && products && products.length > 0 && (
                    <Flex justify="space-between" align="center" mt={4}>
                        <Flex align="center">
                            <Select
                                size="sm"
                                w="70px"
                                height="23px"
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
                                {Math.min(1 + (currentPage - 1) * itemsPerPage, totalRespItems)}-
                                {Math.min(currentPage * itemsPerPage, totalRespItems)} of {totalRespItems} items
                            </Text>
                        </Flex>

                        <Flex align="center">
                            <Select
                                size="sm"
                                w="70px"
                                height="23px"
                                borderRadius="8px"
                                backgroundColor="#f0f4f9"
                                mr={1}
                                value={currentPage}
                                onChange={(e) => handlePageChange(Number(e.target.value))}
                            >
                                {[...Array(totalPages).keys()]?.map(totalPages => (
                                    <option key={totalPages + 1} value={totalPages + 1}>{totalPages + 1}</option>
                                ))}
                            </Select>
                            <Text fontSize="14px" color="#666666" marginLeft="8px">of {totalPages} pages</Text>
                            <IconButton
                                icon={<FiChevronLeft />}
                                variant="ghost"
                                size="sm"
                                aria-label="Previous page"
                                mr={1}
                                onClick={() => totalPages > 1 && handlePageChange(currentPage - 1)}
                                isDisabled={currentPage === 1}
                            />

                            <IconButton
                                icon={<FiChevronRight />}
                                variant="ghost"
                                size="sm"
                                aria-label="Next page"
                                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                                isDisabled={currentPage === totalPages}
                            />
                        </Flex>
                    </Flex>
                )}
            </Box>

        </Box>

    );
};

export default ProductCatalog;