import { useState, useEffect } from "react";
import {
  Table, Thead, Tbody, Tr, Th, Td, Image, Button, Select,
  Flex, Box, Text, IconButton, HStack, Input,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton,
  useDisclosure, FormControl, FormLabel, Grid, useToast
} from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import sortIcon from "../../assets/icons/sort.svg";
import eyeIcon from "../../assets/icons/eye.svg";
import axios from "axios";
import { Config } from "../Utils/Config";

const tableHeadings = [
  "Plan ID", "Plan Name", "Price", "Pricing Type", "Plan Type", "Min Users","createdAt","updatedAt","deletedAt", "Status", "Action"
];

const SubscriptionPage = ({setCounts}) => {

  const toast = useToast();
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRespItems, setTotalRespItems] = useState(10);

  // Filters
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFilterActive, setIsFilterActive] = useState(false);

  // Data
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState({});
  // const [counts, setCounts] = useState({});

  // Modals
  const {
    isOpen: isDetailsOpen,
    onOpen: onDetailsOpen,
    onClose: onDetailsClose
  } = useDisclosure();

  //  Fetch subscriptions list
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`${Config?.Subscription_url}`, {
          params: {
            page: currentPage,
            limit: itemsPerPage,
            status: status || undefined,
            // startDate: isFilterActive ? startDate : undefined,
            // endDate: isFilterActive ? endDate : undefined,
          },
           headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    },

        });
        console.log(response.data, "ioiooioiiioooiioio");
        
        setSubscriptions(response.data.apiData || []);
        setTotalRespItems(response.data.total || 0);
        setTotalPages(Math.ceil((response.data.total || 0) / itemsPerPage));
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [currentPage, itemsPerPage, status, isFilterActive, startDate, endDate]);

  const statusHandler = (newStatus) => {
    setStatus((prev) => (prev === newStatus ? "" : newStatus));
    setCurrentPage(1);
  };

  //  Open details modal (fetch details)
  const viewDetails = async (sub) => {
  try {
    const response = await axios.get(
      `${Config.Subscription_url}?id=${sub.plan_id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        }
      }
    );

     // plan_id ke basis pe matching object nikalna
    const d = response.data.apiData.find(
      (item) => item.plan_id === sub.plan_id
    );

    if (!d) {
      console.error("No matching plan found");
      return;
    }
    console.log(d, "wqqqqqqqqwqwq")
    // Map backend fields to modal fields exactly
    setSelectedSub({
      plan_id: d.plan_id,
      name: d.name || d.plan_name,        // fallback if API sends plan_name
      base_price: d.base_price || d.price,
      pricing_type: d.pricing_type,
      plan_type: d.plan_type,
      min_users: d.min_users,
      status: d.status
    });

    onDetailsOpen();
  } catch (err) {
    console.error("Error fetching subscription details:", err);
  }
};


const saveSubscription = async () => {
  setLoading(true);
  try {
    const updateRes = await axios.post(
      `${Config.Edit_Subscription_url}`,  
      selectedSub,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        }
      }
    );

    console.log("Update Response:", updateRes.data);

    // Refresh list
    const listRes = await axios.get(`${Config.Subscription_url}`, {
      params: { page: currentPage, limit: itemsPerPage },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`
      }
    });
     console.log(listRes.data, "fdkjfdkjkjfdkjd");
     
    setSubscriptions(listRes.data.apiData || []);
    setCounts({
          totalCount: Number(listRes.data.counts.totalCount),
          activeCount: Number(listRes.data.counts.activeCount),
          inactiveCount: Number(listRes.data.counts.inactiveCount)
        });
   toast({
  title: "Subscription updated successfully!",
  status: "success",
  duration: 3000,
  isClosable: true,
  position: "top-right"
});
    onDetailsClose();
  } catch (error) {
    console.error("Error updating subscription:", error);
    toast({
      title: "Failed to update subscription",
      description: error?.response?.data?.message || "Something went wrong",
      status: "error",
      duration: 3000,
      isClosable: true,
      position: "top-right"
    });
  }
  finally {
      setLoading(false); // spinner stop
    }
};

function formatPricingType(value) {
  if (!value) return "";
  return value
    .replace(/_/g, " ")       // replace underscores with spaces
    .replace(/\b\w/g, (c) => c.toUpperCase()); // capitalize each word
}

  return (
    <Box p={4} bg="white" borderRadius="15px" boxShadow="sm">
      {/* Header */}
      <HStack justify="space-between" alignItems="center" mb="20px">
        <Text fontSize="14px">Subscriptions</Text>
        <HStack>
          <Flex gap="10px" alignItems="center">
            <Button
              onClick={() => statusHandler("Active")}
              size="sm"
              color="white"
              bg={status === "Active" ? "#1D9C2A" : "#2EB33B"}
              borderRadius="15px"
            >
              Active
            </Button>
            <Button
              onClick={() => statusHandler("InActive")}
              size="sm"
              color="white"
              bg={status === "Inactive" ? "#B84F4F" : "#CC5F5F"}
              borderRadius="15px"
            >
              InActive
            </Button>
          </Flex>
        </HStack>
      </HStack>

      {/* Details Modal */}
      <Modal isOpen={isDetailsOpen} onClose={onDetailsClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Subscription Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedSub ? (
              <Box>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <FormControl>
  <FormLabel color={"#828080ff"}>Plan ID </FormLabel>
  <Input
  readOnly
    value={selectedSub.plan_id || ""}
    // onChange={(e) =>
    //   setSelectedSub({ ...selectedSub, plan_id: e.target.value })
      
    // }
  />
</FormControl>

<FormControl>
  <FormLabel color={"#828080ff"}>Plan Name</FormLabel>
  <Input
    value={selectedSub.name || ""}
    onChange={(e) =>
      setSelectedSub({ ...selectedSub, name: e.target.value })
    }
  />
</FormControl>

<FormControl>
  <FormLabel color={"#828080ff"}>Price</FormLabel>
  <Input
    value={selectedSub.base_price || ""}
    onChange={(e) =>
      setSelectedSub({ ...selectedSub, base_price: e.target.value })
    }
  />
</FormControl>

<FormControl>
  <FormLabel color={"#828080ff"}>Pricing Type</FormLabel>
  <Select onChange={(e) => setSelectedSub({ ...selectedSub, pricing_type: e.target.value })} value={selectedSub.pricing_type || ""} placeholder="Select Price">
                <option value="Flat">Flat</option>
                 <option  value="per_user">Per User</option>
               {/* <option value="6 Months">6 Months</option>
                <option value="1 Year">1 Year</option>
                <option value="Lifetime">Lifetime</option> */}
              </Select>
</FormControl>

<FormControl>
  <FormLabel color={"#828080ff"}>Plan Type</FormLabel>
  <Select onChange={(e) => setSelectedSub({ ...selectedSub, plan_type: e.target.value })} value={selectedSub.plan_type || ""} placeholder="Select Plan">
                <option value="Service Plan">Service Plan</option>
                 <option value="Addons">Addons</option>
                {/*<option value="Lifetime">Lifetime</option> */}
                
              </Select>
</FormControl>

<FormControl>
  <FormLabel color={"#828080ff"}>Min Users</FormLabel>
  <Input
    type="number"
    value={selectedSub.min_users || ""}
    onChange={(e) =>
      setSelectedSub({ ...selectedSub, min_users: e.target.value })
    }
  />
</FormControl>

<FormControl>
  <FormLabel color={"#828080ff"}>Status</FormLabel>
  <Select
  placeholder="Select Status"
    value={selectedSub.status || ""}
    onChange={(e) =>
      setSelectedSub({ ...selectedSub, status: e.target.value })
    }
  >
    <option value="Active">Active</option>
    <option value="InActive">InActive</option>
  </Select>
</FormControl>

                </Grid>
              </Box>
            ) : (
              <Text>No details available</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onDetailsClose}>Cancel</Button>
            <Button bg={"#3E60AA"} color={"#fff"} onClick={saveSubscription}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
            ) : subscriptions.length > 0 ? (
              subscriptions.map((sub) => (
                <Tr key={sub.apiData}>
                  <Td fontSize="15px" color="#6E7079">{sub.plan_id}</Td>
                  <Td fontSize="15px" color="#6E7079">{sub.name}</Td>
                  <Td fontSize="15px" color="#6E7079">{sub.base_price}</Td>
                  <Td fontSize="15px" color="#6E7079">{formatPricingType (sub.pricing_type)}</Td>
                  <Td fontSize="15px" color="#6E7079">{formatPricingType (sub.plan_type)}</Td>
                  <Td fontSize="15px" color="#6E7079">{sub.min_users}</Td>
                  <Td fontSize="15px" color="#6E7079">{new Date(sub.createdAt).toLocaleDateString()}</Td>
                  <Td fontSize="15px" color="#6E7079">{new Date(sub.updatedAt).toLocaleDateString()}</Td>
                  <Td fontSize="15px" color="#6E7079">{sub.deletedAt}</Td>
                  <Td>
                    <Button
                      size="xs"
                      backgroundColor={
                        sub.status === "Active"
                          ? "#32936f2b"
                          : sub.status === "Inactive"
                          ? "#cc5f5f4f"
                          : "transparent"
                      }
                      color={
                        sub.status === "Active"
                          ? "#519C66"
                          : sub.status === "Inactive"
                          ? "#cc5f5f"
                          : "transparent"
                      }
                      borderRadius="8px"
                    >
                      {sub.status}
                    </Button>
                  </Td>
                  <Td>
                    <IconButton
                      onClick={() => viewDetails(sub)}
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
                  No subscriptions found
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>

      {/* Pagination */}
      {/* <Box>
        {!loading && subscriptions && subscriptions.length > 0 && (
          <Flex justify="space-between" align="center" mt={4}>
            <Flex align="center">
              <Select
                size="sm"
                w="70px"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </Select>
              <Text fontSize="sm" color="#666" ml={2}>Items per page</Text>
              <Text fontSize="14px" color="#666666" ml="12px">
                {Math.min(1 + (currentPage - 1) * itemsPerPage, totalRespItems)}-
                {Math.min(currentPage * itemsPerPage, totalRespItems)} of {totalRespItems} items
              </Text>
            </Flex>
            <Flex align="center">
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
      </Box> */}
    </Box>
  );
};

export default SubscriptionPage;
