import { useState, useEffect } from "react";
import {
    Table, Thead, Tbody, Tr, Th, Td, Image, Button, Select,
    Flex, Box, Text, IconButton, Checkbox, HStack, Input,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton,
    useDisclosure, FormControl, FormLabel, Divider, Badge, Grid, GridItem
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import searchIcon from "../../assets/icons/search.svg";
import sortIcon from "../../assets/icons/sort.svg";
import eyeIcon from "../../assets/icons/eye.svg";
import copyIcon from "../../assets/icons/Copy.svg";
import useAxios from "../Context/axiosInstance";
import { useAuth } from "../Context/authContext";
import filterIcon from "../../assets/icons/calendar.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Config } from "../Utils/Config";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const tableHeadings = [
    "Retailers Name", "Email", "Phone", "Party Code", "Location", "Last Active", "User Since", "Status", "Action"
];

const RetailerList = () => {
    // Single set of pagination state variables
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // Filter state variables
    const [status, setStatus] = useState("");
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isFilterActive, setIsFilterActive] = useState(false);

    // Data and UI state
    const [menu, setMenu] = useState([]);
    const [selectedManufacturer, setSelectedManufacturer] = useState(null);
    const [loading, setLoading] = useState(true);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isDetailsOpen,
        onOpen: onDetailsOpen,
        onClose: onDetailsClose
    } = useDisclosure();

    const axiosInstance = useAxios();
    const { authToken } = useAuth();

    // Search Handler
    const searchHandler = (e) => {
        setSearch(e.target.value);
        // Change search
        setCurrentPage(1);
    };

    // Status filter handler
    const statusHandler = (newStatus) => {
        // Status
        if (status === newStatus) {
            setStatus("");
        } else {
            setStatus(newStatus);
        }
        // Current page
        setCurrentPage(1);
    };

    // Handle pagination
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // Handle items per page change
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    // Date filter product
    const applyDateFilter = () => {
        setCurrentPage(1);
        setIsFilterActive(!!startDate && !!endDate);
        onClose();
    };

    const resetDateFilter = () => {
        setStartDate("");
        setEndDate("");
        setIsFilterActive(false);
        setCurrentPage(1);
        onClose();
    };

    // View manufacturer details
    const retailerDetails = (id) => {
        const retailer = menu.find(item => item.id === id);
        if (retailer) {
            // Convert to the format expected by the modal
            const formattedRetailer = {
                RetailerID: retailer.id,
                CompanyName: retailer.firmName,
                Email: retailer.Email,
                Phone: retailer.Phone,
                PartyCode: retailer.retailerID,
                Location: retailer.Address,
                UpdatedAt: retailer.UpdatedAt,
                CreatedAt: retailer.CreatedAt,
                Status: retailer.Status ? "Active" : "Inactive",
                // Add any additional fields needed
                ContactPerson: "Contact Person",
                ContactPhone: "+1234567890",
                Address: retailer.Address || "123 Main Street, City, Country",
                Description: "Brief description about the manufacturer."
            };

            setSelectedManufacturer(formattedRetailer);
            onDetailsOpen();
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {

                const response = await axios.get(`${Config.Retailerlist_url}?page=${currentPage}&limit=${itemsPerPage}&status=${status}&companyName=${search}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                });

                if (response.status === 200) {
                    setMenu(response?.data?.retailers || []);
                    setTotalItems(response?.data?.totalItems || 0);
                    setTotalPages(response?.data?.totalPages || Math.ceil((response?.data?.retailers?.length || 0) / itemsPerPage));
                    console.log(response?.data?.retailers, 'retailersData');
                }
            } catch (err) {
                console.log(err, 'error here');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage, itemsPerPage, status, search, isFilterActive, startDate, endDate]);

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return dateString; // Already in readable format
    };

    const nav = useNavigate();

    function handleNav(item) {
        console.log(item)
        nav(`/RetailerProfile/${item?.retailerID}`);
    }

    return (
        <Box p={4} bg="white" borderRadius="15px" boxShadow="sm">
            <HStack justify="space-between" alignItems="center" mb="20px">
                <Text fontSize="14px">Retailers</Text>
                <HStack alignSelf={"end"}>
                    <Flex gap="10px" alignItems="center">
                        <Button
                            onClick={() => statusHandler("Active")}
                            size="sm"
                            color="white"
                            bg={status === "Active" ? "#1D9C2A" : "#2EB33B"}
                            borderRadius="15px"
                            boxShadow={status === "Active" ? "0 0 0 2px #1D9C2A inset" : "none"}
                        >
                            Active
                        </Button>
                        <Button
                            onClick={() => statusHandler("Inactive")}
                            size="sm"
                            color="white"
                            bg={status === "Inactive" ? "#B84F4F" : "#CC5F5F"}
                            borderRadius="15px"
                            boxShadow={status === "Inactive" ? "0 0 0 2px #B84F4F inset" : "none"}
                        >
                            Blocked
                        </Button>
                        <Flex align="center" border="1px solid #ccc" borderRadius="10px" p="5px" height="32px">
                            <Image src={searchIcon} alt="search" width="16px" />
                            <Input
                                value={search}
                                onChange={searchHandler}
                                placeholder="Search"
                                border="none"
                                ml="5px"
                                fontSize="14px"
                                height="22px"
                            />
                        </Flex>
                    </Flex>

                    <Button
                        size="sm"
                        fontWeight={"400"}
                        border={"1px solid #53545C"}
                        fontSize={"11px"}
                        alignSelf={"end"}
                        onClick={onOpen}
                        bg={isFilterActive ? "#E9F2FF" : "white"}
                        color={isFilterActive ? "#3182CE" : "inherit"}
                        borderColor={isFilterActive ? "#3182CE" : "#53545C"}
                    >
                        <img src={filterIcon} alt="filter" style={{ marginRight: "5px" }} />
                        {isFilterActive ? "Filtered" : "Filter"}
                    </Button>
                </HStack>
            </HStack>

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

            {/* Manufacturer Details Modal */}
            <Modal isOpen={isDetailsOpen} onClose={onDetailsClose} size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Manufacturer Details</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        {loading ? (
                            <Text>Loading details...</Text>
                        ) : selectedManufacturer ? (
                            <Box>
                                <HStack justifyContent="space-between" mb={4}>
                                    <Text fontSize="xl" fontWeight="bold">{selectedManufacturer.CompanyName}</Text>
                                    <Badge
                                        px={3}
                                        py={1}
                                        borderRadius="8px"
                                        colorScheme={selectedManufacturer.Status === "Active" ? "green" : "red"}
                                    >
                                        {selectedManufacturer.Status}
                                    </Badge>
                                </HStack>

                                <Divider mb={4} />

                                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                                    <GridItem>
                                        <Text fontSize="sm" color="gray.500">Email</Text>
                                        <Text>{selectedManufacturer.Email}</Text>
                                    </GridItem>
                                    <GridItem>
                                        <Text fontSize="sm" color="gray.500">Phone</Text>
                                        <Text>{selectedManufacturer.Phone}</Text>
                                    </GridItem>
                                    <GridItem>
                                        <Text fontSize="sm" color="gray.500">Party Code</Text>
                                        <Text>{selectedManufacturer.PartyCode}</Text>
                                    </GridItem>
                                    <GridItem>
                                        <Text fontSize="sm" color="gray.500">Location</Text>
                                        <Text>{selectedManufacturer.Location}</Text>
                                    </GridItem>
                                    <GridItem>
                                        <Text fontSize="sm" color="gray.500">User Since</Text>
                                        <Text>{formatDate(selectedManufacturer.CreatedAt)}</Text>
                                    </GridItem>
                                    <GridItem>
                                        <Text fontSize="sm" color="gray.500">Last Active</Text>
                                        <Text>{formatDate(selectedManufacturer.UpdatedAt)}</Text>
                                    </GridItem>
                                </Grid>

                                {selectedManufacturer.Address && (
                                    <Box mt={4}>
                                        <Text fontSize="sm" color="gray.500">Address</Text>
                                        <Text>{selectedManufacturer.Address}</Text>
                                    </Box>
                                )}

                                {selectedManufacturer.Description && (
                                    <Box mt={4}>
                                        <Text fontSize="sm" color="gray.500">Description</Text>
                                        <Text>{selectedManufacturer.Description}</Text>
                                    </Box>
                                )}

                                <Divider my={4} />

                                <Box>
                                    <Text fontSize="sm" mb={2}>Contact Person</Text>
                                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                                        <GridItem>
                                            <Text fontSize="sm" color="gray.500">Name</Text>
                                            <Text>{selectedManufacturer.ContactPerson || "N/A"}</Text>
                                        </GridItem>
                                        <GridItem>
                                            <Text fontSize="sm" color="gray.500">Phone</Text>
                                            <Text>{selectedManufacturer.ContactPhone || "N/A"}</Text>
                                        </GridItem>
                                    </Grid>
                                </Box>
                            </Box>
                        ) : (
                            <Text>No details available</Text>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={onDetailsClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Box overflowX="auto">
                <Table variant="simple" width="1700px">
                    <Thead bg="#F9F9F9">
                        <Tr>
                            <Th><Checkbox /></Th>
                            {tableHeadings.map((item, index) => (
                                <Th fontWeight="400" color="#2C2D33" key={index} fontSize="14px" >
                                    <Flex width={item === "Phone" ? "123px" : "unset"} height={item === "Phone" ? "17px" : "unset"} align="center">
                                        {item}
                                        <Image src={sortIcon} alt="sort" height="16px" ml="2" />
                                    </Flex>
                                </Th>
                            ))}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {menu?.length > 0 ? (
                            menu.map((item) => (
                                <Tr key={item.retailerId}>
                                    <Td><Checkbox color="#6E7079" /></Td>
                                    <Td color={"#6E7079"}>{item["firmName"]}</Td>
                                    <Td>
                                        <Flex align="center" color="#6E7079">
                                            {item["email"]}
                                            <IconButton
                                                icon={<Image src={copyIcon} width="12px" />}
                                                size="xs"
                                                ml="2"
                                                variant="ghost"
                                                onClick={() => navigator.clipboard.writeText(item.Email || "")}
                                                aria-label="Copy email"
                                            />
                                        </Flex>
                                    </Td>
                                    <Td color="#6E7079">{item.phone}</Td>
                                    <Td color="#6E7079">{item["retailerCode"]}</Td>
                                    <Td color="#6E7079">{item.Address}</Td>
                                    <Td color="#6E7079">
                                        {item["UpdatedAt"] ? `${new Date(item["UpdatedAt"]).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })} -  ${new Date(item["UpdatedAt"]).toLocaleTimeString('en-IN')}` : "N/A"}
                                    </Td>
                                    <Td color="#6E7079">
                                        {item["CreatedAt"] ? new Date(item["CreatedAt"]).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : "N/A"}
                                    </Td>
                                    <Td>
                                        <Button
                                            size="xs"
                                            backgroundColor={item.Status === 'Inactive' ? '#cc5f5f4f' : '#32936f2b'}
                                            color={item.Status === 'Inactive' ? '#cc5f5f' : '#519C66'}
                                            borderRadius="8px"
                                        >
                                            {item.Status === 'Active' ? 'Active' : 'Blocked'}
                                        </Button>
                                    </Td>
                                    <Td>
                                        <IconButton
                                            onClick={() => handleNav(item)}
                                            icon={<Image src={eyeIcon} width="18px" />}
                                            variant="ghost"
                                            size="sm"
                                        />
                                    </Td>
                                </Tr>
                            ))
                        ) : (
                            <Tr>
                                <Td colSpan={tableHeadings.length + 1} textAlign="center" py={4}>
                                    {loading ? "Loading..." : "No items found"}
                                </Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>

               
            </Box>
             {/* Pagination UI */}
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
                                    {(currentPage - 1) * itemsPerPage + 1}
                                    {Math.min(currentPage * itemsPerPage, totalItems)} of {currentPage} items
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
    );
};

export default RetailerList;