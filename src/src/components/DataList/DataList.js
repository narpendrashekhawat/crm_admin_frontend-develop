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
import { Config } from "../Utils/Config";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import axios from "axios";
import Footer from "../footer";

const tableHeadings = [
    "Manufacture Name", "Email", "Phone", "Party Code", "Location", "Last Active", "User Since", "Status", "Action"
];


// // Static data
// const staticData = [...]

const DataList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [status, setStatus] = useState("");
    const [search, setSearch] = useState("");
    const [totalItems, setTotalItems] = useState(0);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isFilterActive, setIsFilterActive] = useState(false);
    const [selectedManufacturer, setSelectedManufacturer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [menu, setMenu] = useState([]);

    const [manufacturer, setManufacturers] = useState([])
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isDetailsOpen,
        onOpen: onDetailsOpen,
        onClose: onDetailsClose
    } = useDisclosure();

    const axiosInstance = useAxios();
    const { authToken } = useAuth();

    // Handler function
    const statusHandler = (newStatus) => {
        // status
        if (status === newStatus) {
            setStatus("");
        } else {
            setStatus(newStatus);
        }
        //current page
        setCurrentPage(1);
    };

    const searchHandler = (e) => {
        setSearch(e.target.value);
        // change search
        setCurrentPage(1);
    };

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Handle items per page change
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

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
    const viewManufacturerDetails = (id) => {
        const manufacturer = menu.find(item => item.ManufacturerID === id);
        if (manufacturer) {
            // Convert to the format expected by the modal
            const formattedManufacturer = {
                CompanyName: manufacturer.CompanyName,
                Email: manufacturer.Email,
                Phone: manufacturer.Phone,
                PartyCode: manufacturer.ManufacturerID,
                Location: manufacturer.Address,
                UpdatedAt: manufacturer.UpdatedAt,
                CreatedAt: manufacturer.CreatedAt,
                Status: manufacturer.Status ? "Active" : "Inactive",
                // Add any additional fields needed
                ContactPerson: "Contact Person",
                ContactPhone: "+1234567890",
                Address: manufacturer.Address,
                Description: "Brief description about the manufacturer."
            };

            setSelectedManufacturer(formattedManufacturer);
            onDetailsOpen();
        }
    };


    useEffect(() => {
        // Fetch data with the updated pagination parameters
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${Config.DataList_url}?page=${currentPage}&limit=${itemsPerPage}&status=${status}&companyName=${search}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                });

                if (response.status === 200) {
                    setMenu(response?.data?.manufacturers || []);
                    setTotalItems(response?.data?.totalItems || response?.data?.manufacturers?.length || 0);
                    setTotalPages(response?.data?.totalPages || Math.ceil((response?.data?.manufacturers?.length || 0) / itemsPerPage));
                    console.log(response?.data?.manufacturers, 'ManufacturerData');
                }
            } catch (err) {
                console.log(err, 'error here');
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Apply additional filtering client-side if needed
        let filteredData = [...menu];

        if (search) {
            filteredData = filteredData.filter(item =>
                item.CompanyName?.toLowerCase()?.includes(search.toLowerCase()) ||
                item.Email?.toLowerCase()?.includes(search.toLowerCase())
            );
        }

        if (status === "Active") {
            filteredData = filteredData.filter(item => item.Status === true);
        } else if (status === "Inactive") {
            filteredData = filteredData.filter(item => item.Status === false);
        }

        // Apply date filter if active
        if (isFilterActive && startDate && endDate) {
            const startDateTime = new Date(startDate).getTime();
            const endDateTime = new Date(endDate).getTime();

            filteredData = filteredData.filter(item => {
                const userSinceDate = new Date(item.CreatedAt).getTime();
                return userSinceDate >= startDateTime && userSinceDate <= endDateTime;
            });
        }

    }, [currentPage, itemsPerPage, status, search, isFilterActive, startDate, endDate]);

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return dateString; // Already in readable format
    };

    const nav = useNavigate();

    function handleNav(id) {
        nav(`/ProfileItemsInfo/${id}`);
    }

    return (
        <Box p={4} bg="white" borderRadius="15px" boxShadow="sm">
            <HStack justify="space-between" alignItems="center" mb="20px">
                <Text fontSize="14px">Manufacturer</Text>
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
                            bg={status === "Blocked" ? "#B84F4F" : "#CC5F5F"}
                            borderRadius="15px"
                            boxShadow={status === "Blocked" ? "0 0 0 2px #cd6060 inset" : "none"}
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
                        <Button onClick={applyDateFilter}>
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
                <Table variant="simple" width="1800px" height={'15px'}>
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
                        {menu.length > 0 ? (
                            menu.map((item) => (
                                <Tr key={item.ManufacturerID}>
                                    <Td><Checkbox color="#6E7079" /></Td>
                                    <Td color={"#6E7079"}>{item?.CompanyName}</Td>
                                    <Td>
                                        <Flex align="center" color="#6E7079">
                                            {item.Email}
                                            <IconButton
                                                icon={<Image src={copyIcon} width="12px" />}
                                                size="xs"
                                                ml="2"
                                                variant="ghost"
                                                onClick={() => navigator.clipboard.writeText(item.Email)}
                                                aria-label="Copy email"
                                            />
                                        </Flex>
                                    </Td>
                                    <Td color="#6E7079">{item.Phone}</Td>
                                    <Td color="#6E7079">{item["manufacturerCode"]}</Td>
                                    <Td color="#6E7079">{item.Address}</Td>
                                    <Td color="#6E7079">
                                        {`${new Date(item["UpdatedAt"]).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })} -  ${new Date(item["UpdatedAt"]).toLocaleTimeString('en-IN')}`}
                                    </Td>

                                    <Td color="#6E7079">{new Date(item["CreatedAt"]).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</Td>
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
                                            onClick={() => handleNav(item.ManufacturerID)}
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
                                    No items found
                                </Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>

                {/* Fixed Pagination Section */}
                
            </Box>

            <Box>
                    {!loading && menu && menu.length > 0 && (
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

export default DataList;