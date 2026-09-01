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
import useAxios from "../../components/Context/axiosInstance";
import { useAuth } from "../../components/Context/authContext";
import axios from "axios";
// import { Config } from "../Utils/Config";
import { Config } from "../../components/Utils/Config"
import Footer from "../../components/footer";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const tableHeadings = [
    "Hospital", "Type", "Email", "Phone", "Hospital Code", "Location", "Last Active", "User Since", "Status"
];

export default function HospitalList() {

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


    // State for data
    const [distributors, setDistributors] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [selectedDistributor, setSelectedDistributor] = useState(null);
    const [loading, setLoading] = useState(true);

    console.log(hospitals, "check")
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

    // View Hospital details
    const hospitalDetails = (id) => {
        const hospital = hospitals.find(item => item.id === id);
        if (hospital) {
            // Convert to the format expected by the modal
            const formattedDistributor = {
                CompanyName: hospital.companyName,
                Email: hospital.Email,
                Phone: hospital.Phone,
                PartyCode: hospital.hospitalId,
                Location: hospital.Address,
                UpdatedAt: hospital.UpdatedAt,
                CreatedAt: hospital.CreatedAt,
                Status: hospital.Status ? "Active" : "Inactive",
                // Add any additional fields needed
                ContactPerson: "Contact Person",
                ContactPhone: "+1234567890",
                Address: hospital.Address || "123 Main Street, City, Country",
                Description: "Brief description about the distributor."
            };

            setSelectedDistributor(formattedDistributor);
            onDetailsOpen();
        }
    };

    // Navigate to details page

    function handleNav(id) {
        // nav(`/DistributorCNFdetails/${id}`);
        nav(`/hospitals/HospitalsDetails/${id}`)
    }

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return dateString; // Already in readable format
    };

    const [totalRespItem, setTotalRespItems] = useState(10);
    // const [totalDistributors,settotalDistributors]=useState('10')

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `${Config?.Get_Hospitals_List}?page=${currentPage}&limit=${itemsPerPage}&status=${status}&hospitalName=${search}&startDate=${startDate}&endDate=${endDate}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('authToken')}`
                        }
                    }
                );

                if (response.status === 200) {
                    console.log(response?.data?.data, "hospital response")
                    const data = response?.data?.data;
                    const hospitalName = response?.data?.data;

                    // setHospitals(hospitalName?.map(value=>value.hospitalName));
                    setHospitals(hospitalName);
                    console.log(hospitals.data, "hospital name");
                    setTotalItems(response?.data?.totalHospitals || response?.data?.totalHospitals?.length || 0);
                    setTotalRespItems(response?.data?.totalHospitals)
                    setTotalPages(response?.data?.totalPages
                        || Math.ceil((data.currentPage
                            //  || data.distributors.length
                        ) / currentPage)
                    );
                }
            } catch (err) {
                console.log(err, 'error fetching Hospitals');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage, itemsPerPage, status, search, isFilterActive, startDate, endDate]);
    return (
        <Box p={4} bg="white" borderRadius="15px" boxShadow="sm">
            <HStack justify="space-between" alignItems="center" mb="20px">
                <Text fontSize="14px">Hospitals </Text>
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

            {/* Hospital Details Modal */}
            {/* <Modal isOpen={isDetailsOpen} onClose={onDetailsClose} size="lg">
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
            </Modal> */}

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
                        ) : hospitals && hospitals.length > 0 ? (
                            hospitals.map((item) => (
                                <Tr key={item.id}>

                                    <Td><Checkbox color="#6E7079" /></Td>
                                   
                                    <Td color={"#6E7079"} 
                                        fontWeight="400"  
                                        cursor="pointer" 
                                        
                                       
                                        _hover={{ 
                                            textDecoration: "underline", 
                                            color: "#6E7079",
                                            fontWeight: "700" 
                                        }}
                                        onClick={() => handleNav(item.hospitalId)} 
                                    >{item["hospitalName"]}
                                        
                                    </Td>
                                    <Td color="#6E7079">{item["type"]}</Td>
                                    
                                    <Td>
                                        <Flex align="center" color="#6E7079">
                                            {item["Email"]}
                                            <IconButton
                                                icon={<Image src={copyIcon} width="12px" />}
                                                size="xs"
                                                ml="2"
                                                variant="ghost"
                                                onClick={() => navigator.clipboard.writeText(item["email"])}
                                                aria-label="Copy email"
                                            />
                                        </Flex>
                                    </Td>
                                    <Td color="#6E7079">{item["phone"]}</Td>
                                    <Td color="#6E7079">{item["hospitalId"]}</Td>
                                    <Td color="#6E7079">{item["address"]}</Td>
                                    <Td color="#6E7079">
                                        {`${new Date(item["updatedAt"]).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })} -  ${new Date(item["updatedAt"]).toLocaleTimeString('en-IN')}`}
                                    </Td>
                                    <Td color="#6E7079">{new Date(item["createdAt"]).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</Td>
                                    <Td>
                                        <Button
                                            size="xs"
                                            backgroundColor={item.status === 'Blocked' ? '#cc5f5f4f' : '#32936f2b'}
                                            color={item.status === 'Blocked' ? '#cc5f5f' : '#519C66'}
                                            borderRadius="8px"
                                        >
                                            {item.status === 'Active' ? 'Active' : 'Blocked'}
                                        </Button>
                                    </Td>
                                    {/* <Td>
                                        <IconButton
                                            onClick={() => handleNav(item.hospitalId)}
                                            icon={<Image src={eyeIcon} width="18px" />}
                                            variant="ghost"
                                            size="sm"
                                        />
                                    </Td> */}
                                </Tr>
                            ))
                        ) : (
                            <Tr>
                                <Td colSpan={tableHeadings.length + 1} textAlign="center" py={4}>
                                    -
                                </Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>
            </Box>

            {/* Pagination */}
            <Box>
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
                            {Math.min(1 + (currentPage - 1) * itemsPerPage, totalPages)}-
                            {Math.min(currentPage * itemsPerPage)} of {totalItems} items
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
            </Box>
        </Box>
    )
}

