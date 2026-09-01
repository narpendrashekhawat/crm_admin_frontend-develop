import { useState, useEffect } from "react";
import {
  Table, Thead, Tbody, Tr, Th, Td, Image, Button, Select,
  Flex, Box, Text, IconButton, HStack, Input,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton,
  useDisclosure, FormControl, FormLabel, Grid, useToast, VStack
} from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import sortIcon from "../../assets/icons/sort.svg";
import eyeIcon from "../../assets/icons/eye.svg";
import axios from "axios";
import { Config } from "../Utils/Config";
import filterIcon from "../../assets/icons/calendar.svg";
import { useNavigate } from "react-router-dom";

export const dummyAds = [
  {
    id: 1,
    ad_name: "Summer Sale Banner",
    client_name: "Nike",
    duration: "30 Days",
    expiry: "2025-10-01"
  },
  {
    id: 2,
    ad_name: "Holiday Giveaway Video",
    client_name: "Amazon",
    duration: "14 Days",
    expiry: "2025-09-28"
  },
  {
    id: 3,
    ad_name: "Flash Discount Popup",
    client_name: "Apple",
    duration: "7 Days",
    expiry: "2025-09-22"
  },
  {
    id: 4,
    ad_name: "Back to School Campaign",
    client_name: "Walmart",
    duration: "45 Days",
    expiry: "2025-11-05"
  },
  {
    id: 5,
    ad_name: "New Product Teaser",
    client_name: "Samsung",
    duration: "20 Days",
    expiry: "2025-10-10"
  }
];


const tableHeadings = [
  "id", "Ad Type", "Client Name", "Amount", "StartDate","EndDate","Status", "Action"
];

const AdvertisementPage = () => {
  const toast = useToast();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRespItems, setTotalRespItems] = useState(10);
 

  // Filters
const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isFilterActive, setIsFilterActive] = useState(false);
    const [tempStartDate, setTempStartDate] = useState("");
    const [tempEndDate, setTempEndDate] = useState("");
const { isOpen, onOpen, onClose } = useDisclosure();

  // Data
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAd, setSelectedAd] = useState({});

  const navigate = useNavigate();

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


function viewDetails(id) {
   navigate(`/ads-menu/advertisements/${id}`);
}

 
 const formatDate = (date) => {
  if (!date) return undefined;
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0"); 
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};


  // Modals
  const {
    isOpen: isDetailsOpen,
    onOpen: onDetailsOpen,
    onClose: onDetailsClose
  } = useDisclosure();

  // Fetch Ads
  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${Config?.Advertisement_url}`, {
          params: {
             page: currentPage,     
             limit: itemsPerPage,
            startDate: formatDate(startDate),
            endDate: formatDate(endDate)
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
          }
        });
          console.log("Request Params:", {
            startDate: formatDate(startDate),
            endDate: formatDate(endDate)
          });

        console.log(response.data, "nbnbnbnbnbbbn")

        setAds(response.data.apiData || []);
         setTotalPages(response.data.totalPages || 1);
      setCurrentPage(response.data.currentPage || 1); 
      } catch (error) {
        console.error("Error fetching ads:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, [currentPage, itemsPerPage, startDate, endDate]);

  // State for editable fields
const [editAd, setEditAd] = useState({
  ad_name: "",
  client_name: "",
  duration: "",
  expiry: "",
});

// Jab modal open ho, selectedAd ko editAd me set kare
useEffect(() => {
  if (isDetailsOpen && selectedAd) {
    setEditAd({
      ad_name: selectedAd.ad_name || "",
      client_name: selectedAd.client_name || "",
      duration: selectedAd.duration || "",
      expiry: selectedAd.expiry || "",
    });
  }
}, [isDetailsOpen, selectedAd]);

// Save handler
const handleSave = () => {
  console.log("Updated Ad:", editAd); // yaha API call kar sakte ho
  toast({
    title: "Advertisement Updated",
    description: "Changes have been saved successfully!",
    status: "success",
    duration: 3000,
    isClosable: true,
    position: "top-right",
  });
  onDetailsClose();
};


  //View Details
  // const viewDetails = async (ad) => {
  //   try {
  //     const res = await axios.get(`${Config.Advertisement_url}?id=${ad.id}`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("authToken")}`
  //       }
  //     });
  //     const d = res.data.apiData.find((item) => item.id === ad.id);
  //     if (!d) return;

  //     setSelectedAd({
  //       id: d.id,
  //       ad_name: d.ad_name,
  //       client_name: d.client_name,
  //       duration: d.duration,
  //       expiry: d.expiry
  //     });
  //     onDetailsOpen();
  //   } catch (err) {
  //     console.error("Error fetching ad details:", err);
  //   }
  // };


 
// //   {dummy data}
// useEffect(() => {
//   //  Instead of axios call
//   setTimeout(() => {
//     setAds(dummyAds);          // Load dummy data
//     setTotalRespItems(dummyAds.length);
//     setTotalPages(Math.ceil(dummyAds.length / itemsPerPage));
//     setLoading(false);
//   }, 500); // simulate loading delay
// }, [currentPage, itemsPerPage]);

// // View Details
// const viewDetails = (ad) => {
//   setSelectedAd(ad);   // Direct dummy ad set
//   onDetailsOpen();     // Open modal
// };

  return (
    <Box p={4} bg="white" borderRadius="15px" boxShadow="sm">
      {/* Header with Date Filter */}
      <VStack justify="space-between" alignItems="center" mb="20px">
        {/* <Text fontSize="14px">Advertisement List</Text> */}
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
      </VStack>

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

      {/* Details Modal
      <Modal isOpen={isDetailsOpen} onClose={onDetailsClose} size="lg">
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Edit Advertisement</ModalHeader>
    <ModalCloseButton />
    <ModalBody pb={6}>
      {editAd ? (
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          <FormControl>
            <FormLabel color="#828080ff">Ad Name</FormLabel>
            <Input
              value={editAd.ad_name}
              onChange={(e) =>
                setEditAd((prev) => ({ ...prev, ad_name: e.target.value }))
              }
              placeholder="Enter Ad Name"
            />
          </FormControl>

          <FormControl>
            <FormLabel color="#828080ff">Client Name</FormLabel>
            <Input
              value={editAd.client_name}
              onChange={(e) =>
                setEditAd((prev) => ({ ...prev, client_name: e.target.value }))
              }
              placeholder="Enter Client Name"
            />
          </FormControl>

          <FormControl>
            <FormLabel color="#828080ff">Duration</FormLabel>
            <Input
              value={editAd.duration}
              onChange={(e) =>
                setEditAd((prev) => ({ ...prev, duration: e.target.value }))
              }
              placeholder="Enter Duration"
            />
          </FormControl>

          <FormControl>
            <FormLabel color="#828080ff">Expiry</FormLabel>
            <Input
              type="date"
              value={editAd.expiry}
              onChange={(e) =>
                setEditAd((prev) => ({ ...prev, expiry: e.target.value }))
              }
            />
          </FormControl>
        </Grid>
      ) : (
        <Text>No details available</Text>
      )}
    </ModalBody>

    <ModalFooter>
      <Button variant="outline" mr={3} onClick={onDetailsClose}>
        Cancel
      </Button>
      <Button bg={"#3E60AA"} color={"#fff"}  _hover={{ bg: "#14204A" }} onClick={handleSave}>
        Save
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal> */}


      {/* Table */}
      <Box overflowX="auto">
        <Table variant="simple" width="100%">
          <Thead bg="#F9F9F9">
            <Tr>
              {tableHeadings.map((item, i) => (
                <Th key={i} fontWeight="400" fontSize="14px">
                  <Flex align="center">
                    {item}
                    <Image src={sortIcon} alt="sort" height="16px" ml="2" />
                  </Flex>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              <Tr>
                <Td colSpan={tableHeadings.length} textAlign="center">
                  Loading...
                </Td>
              </Tr>
            ) : ads.length > 0 ? (
              ads.map((ad) => (
                <Tr key={ad.id}>
                  <Td fontSize="15px" color="#6E7079">{ad.id}</Td>
                  <Td fontSize="15px" color="#6E7079">{ad.adType}</Td>
                  <Td fontSize="15px" color="#6E7079">{ad.ownerName}</Td>
                  <Td fontSize="15px" color="#6E7079">{ad.amount}</Td>
                  <Td fontSize="15px" color="#6E7079">{new Date(ad.startDate).toLocaleDateString()}</Td>
                  <Td fontSize="15px" color="#6E7079"> {new Date(ad.endDate).toLocaleDateString()}</Td>
                  <Td fontSize="15px" color="#6E7079"><Button
                                           size="xs"
                                           backgroundColor={
                                             ad.status === 'active'
                                               ? '#32936f2b' 
                                               : ad.status === 'inactive'
                                               ? '#cc5f5f4f' 
                                               : "transparent"  
                                           }
                                           color={
                                             ad.status === 'active'
                                               ? '#519C66' 
                                               : ad.status === 'inactive'
                                               ? '#cc5f5f' 
                                               : "transparent" 
                                           }
                                           borderRadius="8px"
                                         >
                                           {ad.status === 'active'
                                             ? 'Active'
                                             : ad.status === 'inactive'
                                             ? 'Inactive'
                                             : ''}
                                         </Button></Td>
                  <Td>
                    <IconButton
                      onClick={() => viewDetails(ad.id)}
                      icon={<Image src={eyeIcon} width="18px" />}
                      variant="ghost"
                      size="sm"
                    />
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={tableHeadings.length} textAlign="center">
                  No advertisements found
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>

      {/* Pagination */}
     {!loading && ads.length > 0 && (
        <Flex justify="space-between" align="center" mt={4}>
          <Flex align="center">
            {/* Items per page */}
            <Select
              size="sm"
              w="70px"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1); // reset to first page
              }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </Select>
            <Text fontSize="sm" color="#666" ml={2}>Items per page</Text>
            <Text fontSize="14px" color="#666666" ml="12px">
  {totalRespItems === 0
    ? "0 of 0 items"
    : `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, totalRespItems)} of ${totalRespItems} items`}
</Text>

          </Flex>

          <Flex align="center">
            {/* Page selector */}
            <Select
              size="sm"
              w="60px"
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
            >
              {[...Array(totalPages).keys()].map((p) => (
                <option key={p + 1} value={p + 1}>
                  {p + 1}
                </option>
              ))}
            </Select>
            <Text fontSize="sm" color="#666" ml={2}>of {totalPages} pages</Text>

            {/* Navigation buttons */}
            <IconButton
              icon={<FiChevronLeft />}
              variant="ghost"
              size="sm"
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              isDisabled={currentPage === 1}
            />
            <IconButton
              icon={<FiChevronRight />}
              variant="ghost"
              size="sm"
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
              isDisabled={currentPage === totalPages}
            />
          </Flex>
        </Flex>
      )}
    </Box>
  );
};

export default AdvertisementPage;
