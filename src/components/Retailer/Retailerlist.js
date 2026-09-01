import { useState, useEffect } from "react";
import {
    Table, Thead, Tbody, Tr, Th, Td, Image, Button, Select,
    Flex, VStack, Box, Text, IconButton, Checkbox, HStack, Input,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton,
    useDisclosure, FormControl, FormLabel, Divider, Badge, Grid, GridItem,
    Tooltip,
    Switch
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
import { TbDownload } from "react-icons/tb";
import { px } from "framer-motion";

const tableHeadings = [
    "Retailers Name", "Last Active", "Phone", "Email", "Party Code", "Location", "User Since", "Status"
];

const RetailerList = () => {
    // Single set of pagination state variables
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // Filter state variables
    const [status, setStatus] = useState("");
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isFilterActive, setIsFilterActive] = useState(false);
    const [tempStartDate, setTempStartDate] = useState("");
    const [tempEndDate, setTempEndDate] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleSwitch = () => {
     let a= isLoggedIn?false:true;
     setIsLoggedIn(a);
    };

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
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    }

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

    const [totalRespItems,setTotalRespItems]=useState(10);
    

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {

                const response = await axios.get(`${Config.Retailerlist_url}?page=${currentPage}&limit=${itemsPerPage}&status=${status}&firmName=${searchTerm}&startDate=${startDate}&endDate=${endDate}&isloggedIn=${isLoggedIn}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                });

                if (response.status === 200) {
                    setMenu(response?.data?.data?.retailers || []);
                   setTotalRespItems(response?.data?.data?.totalRetailers)
                    setTotalItems(response?.data?.data?.totalItems || response?.data?.retailers?.length || 0);
                    setTotalPages(response?.data?.data?.totalPages || Math.ceil((response?.data?.retailers?.length || 0) / itemsPerPage));
                    console.log(response?.data?.retailers, 'retailersData');
                }
            } catch (err) {
                console.log(err, 'error here');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        
    }, [currentPage, itemsPerPage, status, searchTerm, isFilterActive, startDate, endDate, isLoggedIn]);

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return dateString; // Already in readable format
    };

    const nav = useNavigate();

    function handleNav(item) {
        console.log(item)
        nav(`/retailers/RetailerProfile/${item?.retailerID}`);
    }
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
    setSelectedRows(menu.map((item) => item.retailerID));
  } else {
    setSelectedRows([]);
  }
};

  const handleDownload = async () => {
    try {
      const response = await fetch(`${Config.Retailerlist_url}/download`, {
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
      link.download = "retailer.csv"; 
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

    return (
        <Box p={4} bg="white" borderRadius="15px" boxShadow="sm">
            <HStack justify="space-between" alignItems="center" mb="20px">
                <Text fontSize="14px">Retailers</Text>
                <HStack alignSelf={"end"}>
                    <Flex gap="10px" alignItems="center">

                    <Flex align="center" border="1px solid" borderRadius="10px" p="5px" height="32px">
                            <Image src={searchIcon} alt="search" width="20px" />
                            <Input
                                
                                value={searchTerm}
                                onChange={handleSearch}
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
                        <text
                    marginLeft={"10px"}>Logged in atleast Once</text>
                    
                   
                    <Switch
                    marginRight={"20px"}
                    marginLeft={"10px"}
                    onChange={handleSwitch}
                    
                    
                    />
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
                        <Button onClick={applyDateFilter} mr={'10px'}variant={'outline'}>
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
                            <Th><Checkbox
                  isChecked={selectedRows.length === menu.length && menu.length > 0}
                  isIndeterminate={
                    selectedRows.length > 0 && selectedRows.length < menu.length
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                /></Th>
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
                    <Tbody fontSize={"14px"}>
                        {menu?.length > 0 ? (
                            menu.map((item) => (
                                <Tr  key={item.id}>
                                    <Td> <Checkbox
                                     isChecked={selectedRows.includes(item.retailerID)}  
                                     onChange={() => handleCheckboxChange(item.retailerID)}
                                   />
                                   
                                    </Td>
                                    <Td _hover={{fontWeight:"700", textDecoration:"underline", cursor:"pointer"}} 
                                        color={"#6E7079"}
                                        onClick={() => handleNav(item)} >{item["firmName"]} 
                                    </Td>
                                    <Td color="#6E7079">
                                        {item["UpdatedAt"] ? `${new Date(item["UpdatedAt"]).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })} -  ${new Date(item["UpdatedAt"]).toLocaleTimeString('en-IN')}` : "N/A"}
                                    </Td>
                                    <Td color="#6E7079">{item.Phone}</Td>
                                    <Td>
                                        <Flex align="center" color="#6E7079">
                                            {item.Email}
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
                                    <Td color="#6E7079">{item["retailerCode"]}</Td>
                                    <Td color="#6E7079">
                                        {item.Address.length> 30 ? (
                                          <Tooltip 
                                                label={item.Address}
                                                color={"white"}
                                                bg={"black"}
                                                borderRadius={"5px"}
                                                boxShadow={"0 0 5px #6E7079"}
                                                placement="bottom"
                                                >
                                            <span> {item.Address.length >30 ? (item.Address).slice(0,30) + "..." : item.Address}</span>
                                        </Tooltip>  ) : 
                                        ( <span>{item.Address}</span>
                                        )}
                                    </Td>
                                    {/* <Td color="#6E7079">
                                        {item["UpdatedAt"] ? `${new Date(item["UpdatedAt"]).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })} -  ${new Date(item["UpdatedAt"]).toLocaleTimeString('en-IN')}` : "N/A"}
                                    </Td> */}
                                    <Td color="#6E7079">
                                        {item["CreatedAt"] ? new Date(item["CreatedAt"]).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : "N/A"}
                                    </Td>
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
                                            onClick={() => handleNav(item)}
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
                                    {loading ? "Loading..." : "No items found"}
                                </Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>

               
            </Box>
             {/* Pagination UI */}
             <Box>
                {!loading && menu && menu.length > 0 && (
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

export default RetailerList;