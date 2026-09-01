import React, { useEffect, useState } from "react";
import {
  Box, HStack, Text, VStack,
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  Table, Thead, Tbody, Tr, Th, Td,
  Badge, Avatar, Button, IconButton, Input,
  useToast,
  InputGroup,
  InputLeftElement,
  Select,Divider
} from "@chakra-ui/react";
import { GoHomeFill } from "react-icons/go";
import { ChevronLeftIcon, ChevronRightIcon, CopyIcon, SearchIcon } from "@chakra-ui/icons";
import { useLocation, useParams } from "react-router-dom";
import LeftSidebar from "../../components/LeftSideBarLayout/LeftSideBar";
import HeaderBar from "../../components/Header/HeaderBar";
import Footer from "../../components/footer";
import axios from "axios";
import { Config } from "../../components/Utils/Config";
import dayjs from "dayjs";


/* ─────────────────────────── CONFIG ─────────────────────────── */

const statusConfig = {
  Active: { bg: "#E8F5E9", color: "#2E7D32", border: "#C8E6C9" },
  active: { bg: "#E8F5E9", color: "#2E7D32", border: "#C8E6C9" },
  Inactive: { bg: "#FFF8E1", color: "#F57F17", border: "#FFE082" },
  inactive: { bg: "#FFF8E1", color: "#F57F17", border: "#FFE082" },
  blocked: { bg: "#FEECEC", color: "#C62828", border: "#FFCDD2" },
  Blocked: { bg: "#FEECEC", color: "#C62828", border: "#FFCDD2" },
  approved: { bg: "#E8F5E9", color: "#2E7D32", border: "#C8E6C9" },
  Approved: { bg: "#E8F5E9", color: "#2E7D32", border: "#C8E6C9" },
  Pending: { bg: "#EEF2FF", color: "#4338CA", border: "#C7D2FE" },
  pending: { bg: "#EEF2FF", color: "#4338CA", border: "#C7D2FE" },
  Paid: { bg: "#E8F5E9", color: "#2E7D32", border: "#C8E6C9" },
  cancelled: { bg: "#FEECEC", color: "#C62828", border: "#FFCDD2" },
  Rejected: { bg: "#FEECEC", color: "#C62828", border: "#FFCDD2" },
};


const StatCard = ({ label, value, helpText, accentColor }) => (
  <Box
    bg="#F0F4F9" borderRadius="12px" p="14px 18px" flex="1" minW="160px"
    position="relative" overflow="hidden"
    _before={{ content: '""', position: "absolute", top: 0, left: 0, width: "4px", height: "100%", bg: accentColor, borderRadius: "4px 0 0 4px" }}
  >
    <Text fontSize="12px" color="#8B8D97" mb="4px">{label}</Text>
    <Text fontSize="20px" fontWeight="500" color="#45464E">{value}</Text>
    {helpText && <Text fontSize="12px" color="#8B8D97" mt="2px">{helpText}</Text>}
  </Box>
);


/* ─────────────────────────── MAIN COMPONENT ─────────────────────────── */

const CouponsDetails = () => {
  const { id } = useParams();
  const toast = useToast();
  const location = useLocation();

  const [coupons, setCoupons] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [debounceSearch, setDebounceSearch] = useState("");

  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [couponDetails, setCouponDetails] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const fetchCouponsList = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${Config.subcription_used_coupons}?page=${page}&limit=${limit}&search=${debounceSearch}&couponId=${id}&status=${statusFilter}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      if (res.data?.status === 200) {
        setCoupons(res.data?.apiData?.data);
        setTotalPages(res.data?.apiData?.pagination?.totalPages ?? 1);
        setTotalCount(res.data?.apiData?.pagination?.total ?? 0);
      }
    } catch (error) {
      console.log(error);
      console.error(error);
      toast({
        title: "Error Fetching Coupons List",
        description: `${error.message}`,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: 'top'
      });
    }
    setLoading(false);
  }

const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

const fetchCouponDetails = async () => {
  setCouponLoading(true);

  try {
    const res = await axios.get(
      `${Config.get_subscription_coupon_details}?couponId=${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );

    if (res.data?.status === 200) {
      setCouponDetails(
        res.data?.apiData?.data || res.data?.apiData
      );
    }
  } catch (error) {
    console.error("Coupon details error:", error);

    toast({
      title: "Error Fetching Coupon Details",
      description: error.message,
      status: "error",
      duration: 4000,
      isClosable: true,
      position: "top",
    });
  } finally {
    setCouponLoading(false);
  }
};

useEffect(() => {
  fetchCouponsList();
}, [page, debounceSearch, statusFilter]);

useEffect(() => {
  setPage(1);
}, [debounceSearch, statusFilter]);
useEffect(() => {
  fetchCouponDetails();
}, []);

const handleSearchKeyDown = (e) => {
  if (e.key === "Enter") {
    setPage(1);
    setDebounceSearch(search.trim());
  }
};

  return (
    <Box backgroundColor="#F0F4F9" minHeight="100vh">
      <HStack justifyContent="space-between" px="20px" alignItems="flex-start">
        <LeftSidebar />

        <Box width="80%">
          <HeaderBar />

          <Box bg="white" mt="1rem" padding="16px 20px 24px" borderRadius="15px 15px 0 0">

            {/* Breadcrumb */}
            <Breadcrumb color="#8B8D97" padding="10px 0 1.5rem 0">
              <BreadcrumbItem>
                <BreadcrumbLink href="/overview"><GoHomeFill color="#5570F1" /></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href="/coupons" fontSize="13px">Coupons Management</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink fontSize="13px">{id}</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>

             {/* Stat Cards */}
            <HStack flexWrap="wrap" gap="19px" mb="1.5rem">
              <StatCard label="Total Used Count" value={couponDetails?.statistics?.total_used_count}  accentColor="#5570F1" />
              <StatCard label="Total Discount" value={formatINR(couponDetails?.statistics?.total_discount)} accentColor="#2A9D8F" />
              <StatCard label="Total Revenue" value={formatINR(couponDetails?.statistics?.total_revenue)} accentColor="#7B2FBE" />
              <StatCard label="Total Paid Amount" value={formatINR(couponDetails?.statistics?.total_paid_amount)} accentColor="#E76F51" />
              <StatCard label="Total Pending Amount" value={formatINR(couponDetails?.statistics?.total_pending_amount)} accentColor="#e7519c" />
            </HStack>


            {/* Subscription Coupon Details */}
            <Box
            bg="white"
            borderRadius="12px"
            border="1px solid"
            borderColor="gray.100"
            p="20px"
            mb="20px"
            >
            <HStack justify="space-between" mb="18px">
                <Box>
                <Text
                    fontSize="16px"
                    fontWeight="600"
                    color="#45464E"
                >
                 Coupon Details
                </Text>

                <Text
                    fontSize="12px"
                    color="#8B8D97"
                    mt="3px"
                >
                    Coupon information and usage details
                </Text>
                </Box>

                {couponDetails?.status && (
                <Badge
                    borderRadius="20px"
                    fontSize="11px"
                    fontWeight="600"
                    px="12px"
                    py="5px"
                    bg={statusConfig[couponDetails.status]?.bg}
                    color={statusConfig[couponDetails.status]?.color}
                    border="1px solid"
                    borderColor={statusConfig[couponDetails.status]?.border}
                >
                    {couponDetails.status}
                </Badge>
                )}
            </HStack>

            {couponLoading ? (
                <Text fontSize="13px" color="#8B8D97">
                Loading coupon details...
                </Text>
            ) : (
                <Box
                display="grid"
                gridTemplateColumns={{
                    base: "1fr",
                    md: "repeat(2, 1fr)",
                    lg: "repeat(4, 1fr)",
                }}
                gap="20px"
                >
                {/* Coupon Code */}
                <Box>
                    <Text
                    fontSize="11px"
                    color="#8B8D97"
                    textTransform="uppercase"
                    fontWeight="600"
                    mb="5px"
                    >
                    Coupon Code
                    </Text>

                    <HStack>
                    <Text
                        fontSize="14px"
                        fontWeight="600"
                        color="#45464E"
                    >
                        {couponDetails?.code || "-"}
                    </Text>

                    {couponDetails?.code && (
                        <IconButton
                        size="xs"
                        variant="ghost"
                        icon={<CopyIcon />}
                        aria-label="Copy coupon code"
                        onClick={() => {
                            navigator.clipboard.writeText(
                            couponDetails.code
                            );

                            toast({
                            title: "Coupon code copied",
                            status: "success",
                            duration: 1500,
                            position: "top",
                            });
                        }}
                        />
                    )}
                    </HStack>
                </Box>

                {/* Description */}
                <Box>
                    <Text
                    fontSize="11px"
                    color="#8B8D97"
                    textTransform="uppercase"
                    fontWeight="600"
                    mb="5px"
                    >
                    Description
                    </Text>

                    <Text
                    fontSize="14px"
                    fontWeight="500"
                    color="#45464E"
                    >
                    {couponDetails?.description || "-"}
                    </Text>
                </Box>

                {/* Discount Type */}
                <Box>
                    <Text
                    fontSize="11px"
                    color="#8B8D97"
                    textTransform="uppercase"
                    fontWeight="600"
                    mb="5px"
                    >
                    Discount Type
                    </Text>

                    <Text
                    fontSize="14px"
                    fontWeight="500"
                    color="#45464E"
                    textTransform="capitalize"
                    >
                    {couponDetails?.type || "-"}
                    </Text>
                </Box>

                {/* Discount Value */}
                <Box>
                    <Text
                    fontSize="11px"
                    color="#8B8D97"
                    textTransform="uppercase"
                    fontWeight="600"
                    mb="5px"
                    >
                    Discount Value
                    </Text>

                    <Text
                    fontSize="14px"
                    fontWeight="600"
                    color="#45464E"
                    >
                    {couponDetails?.type === "percentage"
                        ? `${couponDetails?.value || 0}%`
                        : formatINR(couponDetails?.value || 0)}
                    </Text>
                </Box>

                {/* Maximum Discount */}
                <Box>
                    <Text
                    fontSize="11px"
                    color="#8B8D97"
                    textTransform="uppercase"
                    fontWeight="600"
                    mb="5px"
                    >
                    Maximum Discount
                    </Text>

                    <Text
                    fontSize="14px"
                    fontWeight="500"
                    color="#45464E"
                    >
                    {formatINR(couponDetails?.max_discount || 0)}
                    </Text>
                </Box>

                {/* Minimum Amount */}
                <Box>
                    <Text
                    fontSize="11px"
                    color="#8B8D97"
                    textTransform="uppercase"
                    fontWeight="600"
                    mb="5px"
                    >
                    Minimum Amount
                    </Text>

                    <Text
                    fontSize="14px"
                    fontWeight="500"
                    color="#45464E"
                    >
                    {formatINR(couponDetails?.min_amount || 0)}
                    </Text>
                </Box>

                {/* Valid From */}
                <Box>
                    <Text
                    fontSize="11px"
                    color="#8B8D97"
                    textTransform="uppercase"
                    fontWeight="600"
                    mb="5px"
                    >
                    Valid From
                    </Text>

                    <Text
                    fontSize="14px"
                    fontWeight="500"
                    color="#45464E"
                    >
                    {couponDetails?.valid_from
                        ? dayjs(couponDetails.valid_from).format(
                            "DD MMM YYYY"
                        )
                        : "-"}
                    </Text>
                </Box>

                {/* Valid Until */}
                <Box>
                    <Text
                    fontSize="11px"
                    color="#8B8D97"
                    textTransform="uppercase"
                    fontWeight="600"
                    mb="5px"
                    >
                    Valid Until
                    </Text>

                    <Text
                    fontSize="14px"
                    fontWeight="500"
                    color="#45464E"
                    >
                    {couponDetails?.valid_until
                        ? dayjs(couponDetails.valid_until).format(
                            "DD MMM YYYY"
                        )
                        : "-"}
                    </Text>
                </Box>

                {/* Maximum Usage */}
                <Box>
                    <Text
                    fontSize="11px"
                    color="#8B8D97"
                    textTransform="uppercase"
                    fontWeight="600"
                    mb="5px"
                    >
                    Maximum Usage
                    </Text>

                    <Text
                    fontSize="14px"
                    fontWeight="500"
                    color="#45464E"
                    >
                    {couponDetails?.max_usage || "Unlimited"}
                    </Text>
                </Box>

                {/* Usage Count */}
                <Box>
                    <Text
                    fontSize="11px"
                    color="#8B8D97"
                    textTransform="uppercase"
                    fontWeight="600"
                    mb="5px"
                    >
                    Usage Count
                    </Text>

                    <Text
                    fontSize="14px"
                    fontWeight="600"
                    color="#45464E"
                    >
                    {couponDetails?.usage_count || 0}
                    </Text>
                </Box>
                </Box>
            )}
            </Box>

            {/* Table */}
            <Box bg="white" borderRadius="12px" border="1px solid" borderColor="gray.100" overflow="hidden">

              {/* ── Search left, Filter right ── */}
              <Box px="20px" pt="16px" pb="0">
                <HStack justify="space-between" mb="14px" spacing="10px">

                  {/* Search — left, wider */}
                  <InputGroup size="md" w="620px">
                    <InputLeftElement pointerEvents="none">
                      <SearchIcon color="#8B8D97" boxSize="12px" />
                    </InputLeftElement>
                    <Input
                      placeholder="Search by Invoice no or ID..."
                      borderRadius="8px" fontSize="13px" bg="#F0F4F9" border="none"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      _focus={{ boxShadow: "none", bg: "#E8EEF7" }}
                      onKeyDown={handleSearchKeyDown}
                    />
                  </InputGroup>

                  {/* Filter — right */}
                  <Select
                    size="sm"
                    w="150px"
                    borderRadius="8px"
                    fontSize="13px"
                    bg="#F0F4F9"
                    border="none"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    _focus={{ boxShadow: "none" }}
                    >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                    <option value="partially_refunded">Partially Refunded</option>
                    </Select>
                </HStack>
                <Divider borderColor="gray.100" />
              </Box>

              {/* Table Body */}
              <Box overflowX="auto">
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr bg="#F0F4F9">
                      {["Invoice No", "Company Name", "Purchase Date", "Billing Start","Billing End","Subtotal","Discount Amt","Taxable Amt", "Gst Amt","Total","Amt Paid","Status"].map((col) => (
                        <Th key={col} fontSize="11px" color="#8B8D97" fontWeight="600"
                          textTransform="uppercase" letterSpacing="0.05em"
                          py="11px" px="18px" borderBottom="1px solid" borderColor="gray.100">
                          {col}
                        </Th>
                      ))}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {coupons.length === 0 ? (
                      <Tr><Td colSpan={7} textAlign="center" py="40px" color="#8B8D97" fontSize="14px">No coupons found.</Td></Tr>
                    ) : (
                      coupons.map((coupon) => (
                        <Tr key={coupon.id} _hover={{ bg: "#FAFBFC" }} borderBottom="1px solid" borderColor="gray.50">

                          {/* Coupons — name clickable */}

                          <Td px="18px" py="13px">
                            <Text fontSize="13px" fontWeight="600" color="#45464E">{coupon.invoice_no}</Text>
                          </Td>
                          <Td px="18px" py="13px">
                            <Text fontSize="13px" fontWeight="600" color="#45464E">{coupon?.user?.companyName}({coupon?.user?.userType})</Text>
                          </Td>
                           <Td px="18px" py="13px">
                            <Text fontSize="13px" fontWeight="600" color="#45464E">{coupon.purchase_date ? dayjs(coupon.purchase_date).format("DD MMM YYYY") : "-"}</Text>
                          </Td>
                          <Td px="18px" py="13px">
                            <Text fontSize="13px" fontWeight="600" color="#45464E">{coupon.billing_period_start ? dayjs(coupon.billing_period_start).format("DD MMM YYYY") : "-"}</Text>
                          </Td>
                          <Td px="18px" py="13px">
                            <Text fontSize="13px" fontWeight="600" color="#45464E">{coupon.billing_period_end ? dayjs(coupon.billing_period_end).format("DD MMM YYYY") : "-"}</Text>
                          </Td>
                          <Td px="18px" py="13px">
                            <Text fontSize="13px" fontWeight="600" color="#45464E">{formatINR(coupon?.invoice?.subtotal)}</Text>
                          </Td>
                          <Td px="18px" py="13px">
                            <Text fontSize="13px" fontWeight="600" color="#45464E">{formatINR(coupon?.discount_amount)}</Text>
                          </Td>
                          <Td px="18px" py="13px">
                            <Text fontSize="13px" fontWeight="600" color="#45464E">{formatINR(coupon?.invoice?.taxable_amount)}</Text>
                          </Td>
                          <Td px="18px" py="13px">
                            <Text fontSize="13px" fontWeight="600" color="#45464E">{formatINR(coupon?.invoice?.gstAmt)}</Text>
                          </Td>
                          <Td px="18px" py="13px">
                            <Text fontSize="13px" fontWeight="600" color="#45464E">{formatINR(coupon?.invoice?.total)}</Text>
                          </Td>
                          <Td px="18px" py="13px">
                            <Text fontSize="13px" fontWeight="600" color="#45464E">{formatINR(coupon?.invoice?.amount_paid)}</Text>
                          </Td>

                          {/* Status */}
                          <Td px="18px" py="13px">
                            <Badge
                              borderRadius="20px" fontSize="11px" fontWeight="600" px="10px" py="3px"
                              bg={statusConfig[coupon?.invoice?.status]?.bg}
                              color={statusConfig[coupon?.invoice?.status]?.color}
                              border="1px solid"
                              borderColor={statusConfig[coupon?.invoice?.status]?.border}
                              textTransform="capitalize"
                            >
                              {coupon?.invoice?.status}
                            </Badge>
                          </Td>

                          
                        </Tr>
                      ))
                    )}
                  </Tbody>
                </Table>
              </Box>

              {/* Pagination footer */}
              <HStack justify="space-between" px="20px" py="12px" borderTop="1px solid" borderColor="gray.100">
                <Text fontSize="12px" color="#8B8D97">
                  Showing {((page - 1) * limit) + 1}–{Math.min(page * limit, totalCount)} of {totalCount} Inovice
                </Text>
                <HStack spacing="6px">
                  <Button
                    size="xs" variant="outline" borderRadius="6px" fontSize="11px"
                    isDisabled={page <= 1 || loading}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                  >
                    Prev
                  </Button>

                  {/* Page number pills */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce((acc, p, idx, arr) => {
                      if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((item, idx) =>
                      item === "..." ? (
                        <Text key={`ellipsis-${idx}`} fontSize="12px" color="#8B8D97" px="4px">…</Text>
                      ) : (
                        <Button
                          key={item}
                          size="xs" borderRadius="6px" fontSize="11px"
                          bg={page === item ? "#3E60AA" : "white"}
                          color={page === item ? "white" : "#45464E"}
                          border="1px solid"
                          borderColor={page === item ? "#3E60AA" : "gray.200"}
                          _hover={{ opacity: 0.88 }}
                          onClick={() => setPage(item)}
                        >
                          {item}
                        </Button>
                      )
                    )
                  }

                  <Button
                    size="xs" variant="outline" borderRadius="6px" fontSize="11px"
                    isDisabled={page >= totalPages || loading}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </Button>
                </HStack>
              </HStack>
            </Box>

          </Box>
          <Footer />
        </Box>
      </HStack>
    </Box>
  );
};

export default CouponsDetails;