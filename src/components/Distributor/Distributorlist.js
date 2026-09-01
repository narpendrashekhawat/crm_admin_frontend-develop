import { useState, useEffect, useRef } from "react";
import {
    Table, Thead, Tbody, Tr, Th, Td, Image, Button, Select,
    Flex, Box, Text, IconButton, Checkbox, HStack, Input,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton,
    useDisclosure, FormControl, FormLabel, Divider, Badge, Grid, GridItem,
    Switch,
    Tooltip
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
import { TbDownload } from "react-icons/tb";
import { faL } from "@fortawesome/free-solid-svg-icons";

const tableHeadings = [
    "Distributor /CNF Name", "Last Active",
    // "Type",
    "Phone", "Email", "Party Code", "Action", "Location", "User Since", "Status", "Role Details", "Profile"
];

const FILTER_OPTIONS = [
    { label: "0 - 1 Months", value: "0-1" },
    { label: "1 - 3 Months", value: "1-3" },
    { label: "3 - 6 Months", value: "3-6" },
    { label: "6 - 9 Months", value: "6-9" },
    { label: "9 - 12 Months", value: "9-12" },
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
    const [tempStartDate, setTempStartDate] = useState("");
    const [tempEndDate, setTempEndDate] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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

    const [openAlertModal, setOpenAlertModal] = useState(false);
    const [selectedDistributorId, setSelectedDistributorId] = useState(null);
    const [timeFilter, setTimeFilter] = useState("1-3");

    const handleOpenAlertModal = (userId) => {
        setSelectedDistributorId(userId);

        setTimeFilter("0-1");
        setOpenAlertModal(true);
    }

    const [sendingSms, setSendingSms] = useState(false);

    const sendExpiryAlert = async (selectedDistributorId, timeFilter) => {
        try {
            setSendingSms(true);
            const res = await axios.get(`${Config.send_expiry_alert}?userId=${selectedDistributorId}&timeFilter=${timeFilter}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });

            if (res?.status === 200) {

                setOpenAlertModal(false);

            }
        } catch (error) {
            console.log(error);
        } finally {
            setSendingSms(false);
        }
    }

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
        setStartDate(tempStartDate);
        setEndDate(tempEndDate);
        setIsFilterActive(!!tempStartDate && !!tempEndDate);
        setCurrentPage(1);
        onClose();
    };


    const resetDateFilter = () => {
        setTempStartDate("");
        setTempEndDate("");
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

    const handleRoleDetails = (e) => {

        nav("/RolePage");
    }

    // View distributor details
    const distributorDetails = (id) => {
        const distributor = distributors.find(item => item.id === id);
        if (distributor) {
            // Convert to the format expected by the modal
            const formattedDistributor = {
                CompanyName: distributor.companyName,
                Email: distributor.Email,
                Phone: distributor.Phone,
                PartyCode: distributor.distributorCode,
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
    function handleNav(id, companyName) {
        // nav(`/distributors/DistributorCNFdetails/${id}`);
        nav(`/distributors/business-details/${id}`, {
            state: {
                disName: companyName
            }
        });
    }

    function handleAssign(id) {
        nav(`/distributors/RolePage/${id}`);
    }

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return dateString; // Already in readable format
    };

    const [totalRespItem, setTotalRespItems] = useState(10);
    // const [totalDistributors,settotalDistributors]=useState('10') 

    // const containerRef = useRef(null);
    // const currentPageRef=useRef(1);
    // const [page, setPage] = useState(1);
    // const [pageLimit, setPageLimit] = useState(10);
    // const [isLoadingMore, setIsLoadingMore] = useState(false);
    // const [hasMore, setHasMore] = useState(true);

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `${Config.Distributorlist_url}?page=${currentPage}&limit=${itemsPerPage}&status=${status}&companyName=${search}&startDate=${startDate}&endDate=${endDate}&isloggedIn=${isLoggedIn}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('authToken')}`
                        }
                    }
                );
                console.log("dfgfdfgfdfgfgfgfgfghghghghghg", response.data);

                if (response.status === 200) {
                    const data = response?.data?.data;
                    setDistributors(data?.distributors);
                    setTotalItems(data?.data?.totalDistributors);
                    setTotalRespItems(response?.data?.data?.totalDistributors)
                    setTotalPages(data?.totalPages || Math.ceil((data.currentPage || data.distributors.length) / currentPage));
                    console.log(data.distributors, 'DistributorData');
                }
            } catch (err) {
                console.log(err, 'error fetching distributors');
            } finally {
                setLoading(false);
                // setIsLoadingMore(false);
            }
        };
        fetchData();
    }, [currentPage, itemsPerPage, status, search, isFilterActive, startDate, endDate, isLoggedIn]);


    //  Checkbox state
    const [selectedRows, setSelectedRows] = useState([]);

    // //  Row select
    const handleCheckboxChange = (id) => {
        setSelectedRows((prev) =>
            prev.includes(id)
                ? prev.filter((rowId) => rowId !== id)
                : [...prev, id]
        );
    };

    //  Select All
    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedRows(distributors.map((item) => item.distributorCode));
        } else {
            setSelectedRows([]);
        }
    };

    const handleDownload = async () => {
        try {
            const response = await fetch(`${Config.Distributorlist_url}/download`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                },
            });

            if (!response.ok) {
                throw new Error("Failed to download file");
            }

            // Response ko Blob (binary data) me convert karna
            const blob = await response.blob();

            // File URL banana
            const url = window.URL.createObjectURL(blob);

            // Anchor tag bana ke programmatically click karna
            const link = document.createElement("a");
            link.href = url;
            link.download = "distributor.csv";
            document.body.appendChild(link);
            link.click();

            // Cleanup
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
        }
    };

    //isLoggedIn Filter
    const handleSwitch = () => {
        // fetch(`${Config.Distributorlist_url}`, {
        //     method: "POST",
        //     headers: { 
        //         Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        //         body: JSON.stringify({isLoggedIn: true})
        //     }
        // })
        let a = isLoggedIn ? false : true
        setIsLoggedIn(a);
    }

    return (
        <Box p={4} bg="white" borderRadius="15px" boxShadow="sm">
            <HStack justify="space-between" alignItems="center" mb="20px">
                <Text fontSize="14px">Distributor / CNF </Text>
                <HStack alignSelf={"end"}>
                    <Flex gap="10px" alignItems="center">
                        <Flex align="center" border="1px solid #ccc" borderRadius="10px" p="5px" height="32px">
                            <Image src={searchIcon} width="16px" />
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
                        <Flex align={"center"}>
                            <Text
                                fontSize={"14px"}
                                // color={"white"} 
                                // bg={"gray.600"} 
                                borderRadius={"10px"}
                                padding={"5px"}
                                fontWeight={"bold"}
                            >
                                Logged in at least once
                            </Text>
                            <Switch
                                size={"md"}
                                marginRight={"15px"}
                                onChange={handleSwitch}
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

                    <Button
                        size="sm"
                        fontWeight="400"
                        border="1px solid #53545C"
                        fontSize="11px"
                        bg="white"
                        gap={'1'}
                        onClick={handleDownload}
                    ><TbDownload />
                        Download
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
                                value={tempStartDate}
                                onChange={(e) => setTempStartDate(e.target.value)}
                                max={tempEndDate || undefined}
                            />

                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>End Date</FormLabel>
                            <Input
                                type="date"
                                value={tempEndDate}
                                onChange={(e) => setTempEndDate(e.target.value)}
                                min={tempStartDate || undefined}
                            />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={applyDateFilter} variant={'outline'} mr={'10px'}>
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

            <Modal
                isOpen={openAlertModal}
                onClose={() => setOpenAlertModal(false)}
                isCentered
            >
                <ModalOverlay />

                <ModalContent borderRadius="16px">

                    <ModalHeader
                        fontSize="18px"
                        fontWeight="600"
                    >
                        Create Expiry Alert
                    </ModalHeader>

                    <ModalCloseButton />

                    <ModalBody pb={6}>

                        <Text
                            fontSize="14px"
                            color="#4A4A4A"
                            mb={4}
                        >
                            Are you sure you want to create an
                            expiry alert for this distributor?
                        </Text>

                        <FormControl mt={5}>

                            <FormLabel fontSize="14px">
                                Select Expiry Duration
                            </FormLabel>

                            <Select
                                value={timeFilter}
                                onChange={(e) =>
                                    setTimeFilter(e.target.value)
                                }
                            >
                                {FILTER_OPTIONS.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </Select>

                        </FormControl>

                    </ModalBody>

                    <ModalFooter>

                        <Button
                            variant="outline"
                            mr={3}
                            onClick={() => setOpenAlertModal(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            colorScheme="blue"
                            isLoading={sendingSms}
                            loadingText="Saving"
                            onClick={() => sendExpiryAlert(selectedDistributorId, timeFilter)}
                        >
                            Save
                        </Button>

                    </ModalFooter>

                </ModalContent>
            </Modal>

            {/* Table */}
            <Box overflowX={"auto"} height={"500px"} overflowY={"auto"}>
                <Table variant="simple" width="1600px" height={'15px'} size={"sm"} borderX={"1px solid #ecececff"} borderBottom={"1px solid #ecececff"}>
                    <Thead position={"sticky"} top={0} zIndex={1} bg="#F9F9F9" height={"40px"}>
                        <Tr>
                            <Th><Checkbox
                                isChecked={selectedRows.length === distributors.length && distributors.length > 0}
                                isIndeterminate={
                                    selectedRows.length > 0 && selectedRows.length < distributors.length
                                }
                                onChange={(e) => handleSelectAll(e.target.checked)}
                            /></Th>
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
                                    <Td><Checkbox
                                        isChecked={selectedRows.includes(item.distributorCode)}
                                        onChange={() => handleCheckboxChange(item.distributorCode)}
                                    /></Td>
                                    <Td color={"#6E7079"}
                                        _hover={{ fontWeight: "700", textDecoration: "underline", cursor: "pointer" }}
                                        onClick={() => handleNav(item.DistributorID, item?.CompanyName)}>{item["CompanyName"]}</Td>
                                    {/* <Td color="#6E7079">{item["type"]}</Td> */}
                                    <Td color="#6E7079">
                                        {`${new Date(item["UpdatedAt"]).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })} -  ${new Date(item["UpdatedAt"]).toLocaleTimeString('en-IN')}`}
                                    </Td>
                                    <Td color="#6E7079">{item["Phone"]}</Td>
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
                                    <Td paddingLeft={"1rem"} paddingRight={"1rem"} color="#6E7079">{item["distributorCode"]}</Td>
                                    <Td paddingLeft={"1rem"} paddingRight={"1rem"} color={"#6E7079"}>
                                        <Button fontSize={"13px"} padding={"5px"} onClick={() => handleOpenAlertModal(item?.DistributorID)}>Expiry Alert</Button>
                                    </Td>
                                    <Td color="#6E7079">
                                        {item["Address"].length > 30 ? (
                                            <Tooltip label={item["Address"]}
                                                color={"white"}
                                                bgColor={"black"}
                                                placement="bottom"
                                                borderRadius={"5px"}
                                                boxShadow={"0 0 6px #6E7079"}
                                            >
                                                <span > {item["Address"].length > 40 ? item["Address"].slice(0, 30) + ("...") : item["Address"]}</span>
                                            </Tooltip>) :
                                            (<span> {item["Address"]} </span>
                                            )}
                                    </Td>
                                    {/* <Td color="#6E7079">
                                        {`${new Date(item["UpdatedAt"]).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })} -  ${new Date(item["UpdatedAt"]).toLocaleTimeString('en-IN')}`}
                                    </Td> */}
                                    <Td color="#6E7079">{new Date(item["CreatedAt"]).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</Td>
                                    <Td>
                                        <Button
                                            size="xs"
                                            backgroundColor={
                                                item.Status === 'Active'
                                                    ? '#32936f2b'
                                                    : item.Status === 'Inactive'
                                                        ? '#cc5f5f4f'
                                                        : ''
                                            }
                                            color={
                                                item.Status === 'Active'
                                                    ? '#519C66'
                                                    : item.Status === 'Inactive'
                                                        ? '#cc5f5f'
                                                        : ''
                                            }
                                            borderRadius="8px"
                                        >
                                            {item.Status === 'Active'
                                                ? 'Active'
                                                : item.Status === 'Inactive'
                                                    ? 'Blocked'
                                                    : ''}
                                        </Button>
                                    </Td>
                                    {/* <Td>
                                        <IconButton
                                            onClick={() => handleNav(item.DistributorID)}
                                            icon={<Image src={eyeIcon} width="18px" />}
                                            variant="ghost"
                                            size="sm"
                                        />
                                    </Td> */}
                                    <Td>
                                        <Button fontSize={"13px"} padding={"5px"} onClick={() => handleAssign(item.DistributorID)}>
                                            Assign Role
                                        </Button>
                                    </Td>
                                    <Td>
                                        <Button fontSize={"13px"} padding={"5px"} onClick={() => nav(`/distributors/DistributorCNFdetails/${item.DistributorID}`)}>
                                            View Profile
                                        </Button>
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
                                {Math.min(1 + (currentPage - 1) * itemsPerPage, totalRespItem)}-
                                {Math.min(currentPage * itemsPerPage, totalRespItem)} of {totalRespItem} items
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