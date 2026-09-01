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
import filterIcon from "../../assets/icons/calendar.svg";
import { useNavigate } from "react-router-dom";
import useAxios from "../Context/axiosInstance";
import { useAuth } from "../Context/authContext";
import axios from "axios";
import { Config } from "../Utils/Config";
import Footer from "../footer";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const tableHeadings = [
    "Distributor /CNF Name", "Email", "Phone", "Party Code", "Location", "Last Active", "User Since", "Status", "Action"
];

const Distributorlist = () => {
    // State variables for pagination and filtering
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [status, setStatus] = useState("");
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isFilterActive, setIsFilterActive] = useState(false);
    
    // State for data
    const [distributors, setDistributors] = useState([]);
    const [selectedDistributor, setSelectedDistributor] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Modal controls
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isDetailsOpen,
        onOpen: onDetailsOpen,
        onClose: onDetailsClose
    } = useDisclosure();

    const axiosInstances = useAxios();
    const { authToken } = useAuth();
    const nav = useNavigate();

    // Search handler
    const searchHandler = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    // Status filter handler
    const statusHandler = (newStatus) => {
        if (status === newStatus) {
            setStatus("");
        } else {
            setStatus(newStatus);
        }
        setCurrentPage(1); // Reset to first page when changing status filter
    };

    // Date filter handlers
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

    // Handle pagination
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // Handle items per page change
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    // View distributor details
    const distributorDetails = (id) => {
        const distributor = distributors.find(item => item.id === id);
        if (distributor) {
            // Convert to the format expected by the modal
            const formattedDistributor = {
                CompanyName: distributor.companyName,
                Email: distributor.Email,
                Phone: distributor.Phone,
                PartyCode: distributor.DistributorID,
                Location: distributor.Address,
                UpdatedAt: distributor.UpdatedAt,
                CreatedAt: distributor.CreatedAt,
                Status: distributor.Status ? "Active" : "Inactive",
                // Add any additional fields needed
                ContactPerson: "Contact Person",
                ContactPhone: "+1234567890",
                Address: distributor.Address || "123 Main Street, City, Country",
                Description: "Brief description about the distributor."
            };

            setSelectedDistributor(formattedDistributor);
            onDetailsOpen();
        }
    };

    // Navigate to details page
    function handleNav(id) {
        nav(`/DistributorCNFdetails/${id}`);
    }

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return dateString; // Already in readable format
    };

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `${Config.Distributorlist_url}?page=${currentPage}&limit=${itemsPerPage}&Status=${status}&companyName=${search}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('authToken')}`
                        }
                    }
                );
                
                if (response.status === 200) {
                    const data = response.data;
                    setDistributors(data.distributors);
                    setTotalItems(data.totalCount || data.distributors.length);
                    setTotalPages(data.totalPages || Math.ceil((data.totalCount || data.distributors.length) / itemsPerPage));
                    console.log(data.distributors, 'DistributorData');
                }
            } catch (err) {
                console.log(err, 'error fetching distributors');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage, itemsPerPage, status, search, isFilterActive, startDate, endDate]);

    return (
        <Box p={4} bg="white" borderRadius="15px" boxShadow="sm">
            <HStack justify="space-between" alignItems="center" mb="20px">
                <Text fontSize="14px">Distributor / CNF </Text>
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

            {/* Distributor Details Modal */}
            <Modal isOpen={isDetailsOpen} onClose={onDetailsClose} size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Distributor /CNF details</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        {loading ? (
                            <Text>Loading details...</Text>
                        ) : selectedDistributor ? (
                            <Box>
                                <HStack justifyContent="space-between" mb={4}>
                                    <Text fontSize="xl" fontWeight="bold">{selectedDistributor.CompanyName}</Text>
                                    <Badge
                                        px={3}
                                        py={1}
                                        borderRadius="8px"
                                        colorScheme={selectedDistributor.Status === "Active" ? "#cc5f5f" : "red"}
                                    >
                                        {selectedDistributor.Status}
                                    </Badge>
                                </HStack>

                                <Divider mb={4} />

                                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                                    <GridItem>
                                        <Text fontSize="sm" color="gray.500">Email</Text>
                                        <Text>{selectedDistributor.Email}</Text>
                                    </GridItem>
                                    <GridItem>
                                        <Text fontSize="sm" color="gray.500">Phone</Text>
                                        <Text>{selectedDistributor.Phone}</Text>
                                    </GridItem>
                                    <GridItem>
                                        <Text fontSize="sm" color="gray.500">Party Code</Text>
                                        <Text>{selectedDistributor.PartyCode}</Text>
                                    </GridItem>
                                    <GridItem>
                                        <Text fontSize="sm" color="gray.500">Location</Text>
                                        <Text>{selectedDistributor.Location}</Text>
                                    </GridItem>
                                    <GridItem>
                                        <Text fontSize="sm" color="gray.500">User Since</Text>
                                        <Text>{formatDate(selectedDistributor.CreatedAt)}</Text>
                                    </GridItem>
                                    <GridItem>
                                        <Text fontSize="sm" color="gray.500">Last Active</Text>
                                        <Text>{formatDate(selectedDistributor.UpdatedAt)}</Text>
                                    </GridItem>
                                </Grid>

                                {selectedDistributor.Address && (
                                    <Box mt={4}>
                                        <Text fontSize="sm" color="gray.500">Address</Text>
                                        <Text>{selectedDistributor.Address}</Text>
                                    </Box>
                                )}

                                {selectedDistributor.Description && (
                                    <Box mt={4}>
                                        <Text fontSize="sm" color="gray.500">Description</Text>
                                        <Text>{selectedDistributor.Description}</Text>
                                    </Box>
                                )}

                                <Divider my={4} />

                                <Box>
                                    <Text fontSize="sm" mb={2}>Contact Person</Text>
                                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                                        <GridItem>
                                            <Text fontSize="sm" color="gray.500">Name</Text>
                                            <Text>{selectedDistributor.ContactPerson || "N/A"}</Text>
                                        </GridItem>
                                        <GridItem>
                                            <Text fontSize="sm" color="gray.500">Phone</Text>
                                            <Text>{selectedDistributor.ContactPhone || "N/A"}</Text>
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

            {/* Table */}
            <Box overflowX={"auto"} >
                <Table variant="simple" width="1700px" height={'15px'}>
                    <Thead bg="#F9F9F9">
                        <Tr>
                            <Th><Checkbox /></Th>
                            {tableHeadings.map((item, index) => (
                                <Th fontWeight="400" color="#2C2D33" key={index} fontSize="14px" >
                                    <Flex width={item === "Phone" ? "123px" : "unset"} height={item === "Phone" ? "17px" : "unset"} align="center">
                                        {item}
                                        <Image src={sortIcon} alt="sort" width="16px" ml="2" />
                                    </Flex>
                                </Th>
                            ))}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {loading ? (
                            <Tr>
                                <Td colSpan={tableHeadings.length + 1} textAlign="center" py={4}>
                                    Loading...
                                </Td>
                            </Tr>
                        ) : distributors && distributors.length > 0 ? (
                            distributors.map((item) => (
                                <Tr key={item.id}>
                                    <Td><Checkbox color="#6E7079" /></Td>
                                    <Td color={"#6E7079"}>{item["CompanyName"]}</Td>
                                    <Td>
                                        <Flex align="center" color="#6E7079">
                                            {item["Email"]}
                                            <IconButton
                                                icon={<Image src={copyIcon} width="12px" />}
                                                size="xs"
                                                ml="2"
                                                variant="ghost"
                                                onClick={() => navigator.clipboard.writeText(item["Email"])}
                                                aria-label="Copy email"
                                            />
                                        </Flex>
                                    </Td>
                                    <Td color="#6E7079">{item["Phone"]}</Td>
                                    <Td color="#6E7079">{item["DistributorID"]}</Td>
                                    <Td color="#6E7079">{item["Address"]}</Td>
                                    <Td color="#6E7079">
                                        {`${new Date(item["UpdatedAt"]).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })} -  ${new Date(item["UpdatedAt"]).toLocaleTimeString('en-IN')}`}
                                    </Td>
                                    <Td color="#6E7079">{new Date(item["CreatedAt"]).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</Td>
                                    <Td>
                                    <Button
    size="xs"
    backgroundColor={item.Status === 'Inactive' ? '#cc5f5f4f' : '#32936f2b'}
    color={item.Status === 'Inactive' ? '#cc5f5f4f' : '#519C66'}
    borderRadius="8px"
>
    {item.Status === 'Inactive' ? 'Inactive' : 'Active'}
</Button>
                                    </Td>
                                    <Td>
                                        <IconButton
                                            onClick={() => handleNav(item.DistributorID)}
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
                                    No data available
                                </Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>
            </Box>

            {/* Pagination */}
            <Box>
                {!loading && distributors && distributors.length > 0 && (
                    <Flex justify="space-between" align="center" mt={4}>
                        <Flex align="center">
                            <Select 
                                size="sm" 
                                w="65px" 
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
                                w="60px" 
                                height="23px" 
                                borderRadius="8px" 
                                backgroundColor="#f0f4f9" 
                                mr={1} 
                                value={currentPage}
                                onChange={(e) => handlePageChange(Number(e.target.value))}
                            >
                                {[...Array(totalPages).keys()].map(page => (
                                    <option key={page + 1} value={page + 1}>{page + 1}</option>
                                ))}
                            </Select>
                            <Text fontSize="14px" color="#666666" marginLeft="8px">of {totalPages} pages</Text>
                            <IconButton
                                icon={<FiChevronLeft />}
                                variant="ghost"
                                size="sm"
                                aria-label="Previous page"
                                mr={1}
                                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
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

export default Distributorlist;