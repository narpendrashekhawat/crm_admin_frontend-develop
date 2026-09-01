import React, { useEffect, useState } from "react";
import {
  Box, Text, HStack, VStack, Table, Thead, Tbody, Tr, Th, Td,
  Badge, Button, Input, InputGroup, InputLeftElement, Select,
  Avatar, Divider,
  useToast, Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalFooter, ModalCloseButton,
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, Heading,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { GoHomeFill } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import LeftSidebar from "../../components/LeftSideBarLayout/LeftSideBar";
import HeaderBar from "../../components/Header/HeaderBar";
import Footer from "../../components/footer";
import axios from "axios";
import { Config } from "../../components/Utils/Config";
import { useAuth } from "../../components/Context/authContext";
import dayjs from "dayjs";

const DUMMY_AFFILIATES = [
  { id: "AFF001", name: "Rajesh Kumar", email: "rajesh.kumar@example.com", avatar: "RK", usersAdded: 142, holdings: 54800, totalWithdrawals: 12200, status: "active", joinedDate: "12 Jan 2024", withdrawalCount: 3 },
  { id: "AFF002", name: "Priya Sharma", email: "priya.sharma@example.com", avatar: "PS", usersAdded: 89, holdings: 31500, totalWithdrawals: 7800, status: "active", joinedDate: "03 Mar 2024", withdrawalCount: 1 },
  { id: "AFF003", name: "Amit Verma", email: "amit.verma@example.com", avatar: "AV", usersAdded: 210, holdings: 92000, totalWithdrawals: 45000, status: "active", joinedDate: "18 Nov 2023", withdrawalCount: 0 },
  { id: "AFF004", name: "Sunita Patel", email: "sunita.patel@example.com", avatar: "SP", usersAdded: 55, holdings: 18700, totalWithdrawals: 3200, status: "blocked", joinedDate: "25 May 2024", withdrawalCount: 1 },
  { id: "AFF005", name: "Vikram Singh", email: "vikram.singh@example.com", avatar: "VS", usersAdded: 176, holdings: 67300, totalWithdrawals: 28000, status: "active", joinedDate: "07 Feb 2024", withdrawalCount: 2 },
  { id: "AFF006", name: "Meena Joshi", email: "meena.joshi@example.com", avatar: "MJ", usersAdded: 38, holdings: 9400, totalWithdrawals: 1500, status: "inactive", joinedDate: "14 Aug 2024", withdrawalCount: 0 },
  { id: "AFF007", name: "Ravi Gupta", email: "ravi.gupta@example.com", avatar: "RG", usersAdded: 305, holdings: 128000, totalWithdrawals: 72000, status: "active", joinedDate: "01 Sep 2023", withdrawalCount: 5 },
  { id: "AFF008", name: "Deepa Nair", email: "deepa.nair@example.com", avatar: "DN", usersAdded: 67, holdings: 24600, totalWithdrawals: 5600, status: "blocked", joinedDate: "22 Jun 2024", withdrawalCount: 1 },
];

const avatarColors = ["#4361EE", "#7B2FBE", "#E63946", "#2A9D8F", "#E76F51", "#264653"];

const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

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

const statusConfig = {
  active: { bg: "#E8F5E9", color: "#2E7D32", border: "#C8E6C9" },
  inactive: { bg: "#FFF8E1", color: "#F57F17", border: "#FFE082" },
  blocked: { bg: "#FEECEC", color: "#C62828", border: "#FFCDD2" },
};

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [confirmModal, setConfirmModal] = useState({ open: false, type: null, affiliate: null });
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [debounceSearch, setDebounceSearch] = useState("");

  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [couponModal, setCouponModal] = useState(false);
  const [creatingCoupon, setCreatingCoupon] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: "",
    description: "",
    type: "percentage",
    value: "",
    max_discount: "",
    min_amount: "",
    valid_from: "",
    valid_until: "",
    max_usage: "",
    });

  const [editingCoupon, setEditingCoupon] = useState(null);
  const [updatingCoupon, setUpdatingCoupon] = useState(false);

  const { authToken } = useAuth();

  const fetchCouponsList = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${Config.get_coupons_list}?page=${page}&limit=${limit}&search=${debounceSearch}&status=${statusFilter}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      if (res.data?.status === 200) {
        setCoupons(res.data?.apiData?.coupons);
        setTotalPages(res.data?.apiData?.totalPages ?? 1);
        setTotalCount(res.data?.apiData?.total ?? 0);
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

  useEffect(() => { setPage(1); }, [debounceSearch, statusFilter]);

  // Fetch whenever page, debounceSearch, or statusFilter changes
  useEffect(() => { fetchCouponsList(); }, [page, debounceSearch, statusFilter]);

  const [updatingStatus, setUpdatingStatus] = useState(false);

  const updateAffiliateStatus = async () => {
    try {
      setUpdatingStatus(true);

      const affiliateId = confirmModal.affiliate?.affiliateId;

      const status =
        confirmModal.type === "block" ? "Inactive" : "Active";

      const res = await axios.post(`${Config.update_affiliate_status}`,
        {
          affiliateId,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );

      if (res.data?.status === 200) {
        toast({
          title: `Affiliate ${status === "Inactive" ? "Blocked" : "Activated"
            } successfully`,
          status: "success",
          duration: 3000,
          position: "top-right",
        });

        fetchCouponsList();

        setConfirmModal({ open: false, type: null, affiliate: null });
      }
    } catch (error) {
      console.log(error);

      toast({
        title: "Failed to update status",
        description: error.message,
        status: "error",
        duration: 3000,
        position: "top-right",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceSearch(search);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  const [loadingStats, setLoadingStats] = useState(false);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchAffiliateStats = async () => {
      try {
        setLoadingStats(true);
        const res = await axios.get(`${Config.subscription_coupon_stats}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (res.data?.status === 200) {
          setStats(res.data?.apiData);
        }
      } catch (error) {
        console.log(error);
        toast({
          title: "Error Fetching affiliate stats",
          description: error.message,
          status: "error",
          duration: 3000,
          position: "top-right",
        });
      } finally {
        setLoadingStats(false);
      }
    }

    fetchAffiliateStats();
  }, []);

  const handleCouponChange = (e) => {
    const { name, value } = e.target;

    setCouponForm((prev) => ({
        ...prev,
        [name]: name === "code" ? value.toUpperCase() : value,
    }));
    };

    const handleCreateCoupon = async () => {
    try {
        if (!couponForm.code.trim()) {
        toast({
            title: "Coupon code is required",
            status: "error",
            position: "top-right",
        });
        return;
        }

        if (!couponForm.value) {
        toast({
            title: "Coupon value is required",
            status: "error",
            position: "top-right",
        });
        return;
        }

        setCreatingCoupon(true);

        const payload = {
        code: couponForm.code.trim().toUpperCase(),
        description: couponForm.description.trim(),
        type: couponForm.type,
        value: Number(couponForm.value),
        max_discount: couponForm.max_discount
            ? Number(couponForm.max_discount)
            : null,
        min_amount: couponForm.min_amount
            ? Number(couponForm.min_amount)
            : null,
        valid_from: couponForm.valid_from,
        valid_until: couponForm.valid_until,
        max_usage: couponForm.max_usage
            ? Number(couponForm.max_usage)
            : null,
        };

        const res = await axios.post(
        Config.create_coupon,
        payload,
        {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        }
        );

        if (res.data?.status === 200 || res.data?.status === 201) {
        toast({
            title: "Coupon created successfully",
            status: "success",
            duration: 3000,
            position: "top-right",
        });

        setCouponModal(false);

        setCouponForm({
            code: "",
            description: "",
            type: "percentage",
            value: "",
            max_discount: "",
            min_amount: "",
            valid_from: "",
            valid_until: "",
            max_usage: "",
        });

        fetchCouponsList();
        }
    } catch (error) {
        console.error("Create coupon error:", error);

        toast({
        title: "Failed to create coupon",
        description:
            error?.response?.data?.message || error.message,
        status: "error",
        duration: 4000,
        position: "top-right",
        });
    } finally {
        setCreatingCoupon(false);
    }
    };

    const handleEditCoupon = (coupon) => {
    setEditingCoupon(coupon);

    setCouponForm({
        code: coupon.code || "",
        description: coupon.description || "",
        type: coupon.type || "percentage",
        value: coupon.value ?? "",
        max_discount: coupon.max_discount ?? "",
        min_amount: coupon.min_amount ?? "",
        valid_from: coupon.valid_from
        ? dayjs(coupon.valid_from).format("YYYY-MM-DDTHH:mm")
        : "",
        valid_until: coupon.valid_until
        ? dayjs(coupon.valid_until).format("YYYY-MM-DDTHH:mm")
        : "",
        max_usage: coupon.max_usage ?? "",
    });

    setCouponModal(true);
    };

    const handleUpdateCoupon = async () => {
  try {
    if (!couponForm.code.trim()) {
      toast({
        title: "Coupon code is required",
        status: "error",
        position: "top-right",
      });
      return;
    }

    if (!couponForm.description.trim()) {
      toast({
        title: "Coupon description is required",
        status: "error",
        position: "top-right",
      });
      return;
    }

    if (!couponForm.value) {
      toast({
        title: "Coupon value is required",
        status: "error",
        position: "top-right",
      });
      return;
    }

    setUpdatingCoupon(true);

    const payload = {
      coupon_id: editingCoupon?.id,
      code: couponForm.code.trim().toUpperCase(),
      description: couponForm.description.trim(),
      type: couponForm.type,
      value: Number(couponForm.value),
      max_discount: couponForm.max_discount
        ? Number(couponForm.max_discount)
        : null,
      min_amount: couponForm.min_amount
        ? Number(couponForm.min_amount)
        : null,
      valid_from: couponForm.valid_from,
      valid_until: couponForm.valid_until,
      max_usage: couponForm.max_usage
        ? Number(couponForm.max_usage)
        : null,
    };

    const res = await axios.put(
      Config.update_coupon,
      payload,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );

    if (res.data?.status === 200 || res.data?.status === 201) {
      toast({
        title: "Coupon updated successfully",
        status: "success",
        duration: 3000,
        position: "top-right",
      });

      setCouponModal(false);
      setEditingCoupon(null);

      setCouponForm({
        code: "",
        description: "",
        type: "percentage",
        value: "",
        max_discount: "",
        min_amount: "",
        valid_from: "",
        valid_until: "",
        max_usage: "",
      });

      fetchCouponsList();
    }
  } catch (error) {
    console.error("Update coupon error:", error);

    toast({
      title: "Failed to update coupon",
      description:
        error?.response?.data?.message || error.message,
      status: "error",
      duration: 4000,
      position: "top-right",
    });
  } finally {
    setUpdatingCoupon(false);
  }
};

  return (
    <Box backgroundColor="#F0F4F9" height="100%">
      <HStack justifyContent="space-between" px="20px" alignItems="flex-start">
        <LeftSidebar />
        <Box width="80%">
          <HeaderBar />
          <Box p={4} bg="white" mt="1rem" padding="12px 20px" borderRadius="15px 15px 0px 0px">

            {/* Breadcrumb */}
            <Breadcrumb color="#8B8D97" padding="10px 0px 2rem 0px">
              <BreadcrumbItem>
                <BreadcrumbLink href="/overview"><GoHomeFill color="#5570F1" /></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href="/coupons" color="#8B8D97" fontSize="13px">Coupons Management</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>

            {/* Page Header */}
            <HStack justifyContent="space-between" mb="1rem">
              <Heading color="#45464E" fontSize="16px" fontWeight="600">Coupons Management</Heading>
               <Button
                    bg="#3E60AA"
                    color="white"
                    fontSize="13px"
                    fontWeight="600"
                    borderRadius="8px"
                    px="18px"
                    _hover={{ bg: "#304F91" }}
                    onClick={() => setCouponModal(true)}
                >
                    + Add Coupon
                </Button>
            </HStack>

            {/* Stat Cards */}
            <HStack flexWrap="wrap" gap="19px" mb="1.5rem">
              <StatCard label="Total Coupons" value={stats.total_coupons} accentColor="#5570F1" />
              <StatCard label="Active Coupons" value={stats.active_coupons} accentColor="#2A9D8F" />
              <StatCard label="Inactive Coupons" value={stats.inactive_coupons} accentColor="#7B2FBE" />
              <StatCard label="Expire Coupons" value={stats.expired_coupons} accentColor="#E76F51" />
            </HStack>

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
                      placeholder="Search by coupon code or ID..."
                      borderRadius="8px" fontSize="13px" bg="#F0F4F9" border="none"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      _focus={{ boxShadow: "none", bg: "#E8EEF7" }}
                    />
                  </InputGroup>

                  {/* Filter — right */}
                  <Select
                    size="sm" w="130px" borderRadius="8px" fontSize="13px"
                    bg="#F0F4F9" border="none"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    _focus={{ boxShadow: "none" }}
                  >
                    <option value="">All</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </Select>
                </HStack>
                <Divider borderColor="gray.100" />
              </Box>

              {/* Table Body */}
              <Box overflowX="auto">
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr bg="#F0F4F9">
                      {["Code", "Type", "Value", "Max Discount","Min Amount","Max Usage","Usage Count","Valid From", "Valid Till","Status", "Action"].map((col) => (
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
                            <Text fontSize="13px" fontWeight="600" color="#45464E" _hover={{ textDecoration: "underline" }} cursor={'pointer'}  onClick={() => navigate(`/coupons/${coupon.id}`)}>{coupon.code}</Text>
                          </Td>
                          <Td px="18px" py="13px">
                            <Text fontSize="13px" fontWeight="600" color="#45464E">{coupon.type?.toUpperCase()}</Text>
                          </Td>
                           <Td px="18px" py="13px">
                            <Text fontSize="13px" fontWeight="600" color="#45464E">{coupon.value}</Text>
                          </Td>
                          <Td px="18px" py="13px">
                            <Text fontSize="13px" fontWeight="600" color="#45464E">{formatINR(coupon.max_discount)}</Text>
                          </Td>
                          <Td px="18px" py="13px">
                            <Text fontSize="13px" fontWeight="600" color="#45464E">{formatINR(coupon.min_amount)}</Text>
                          </Td>
                          <Td px="18px" py="13px">
                            <Text fontSize="13px" fontWeight="600" color="#45464E">{coupon.max_usage}</Text>
                          </Td>
                          <Td px="18px" py="13px">
                            <Text fontSize="13px" fontWeight="600" color="#45464E">{coupon.usage_count}</Text>
                          </Td>
                          <Td px="18px" py="13px">
                            <Text fontSize="13px" color="#45464E">{coupon.valid_from ? dayjs(coupon.valid_from).format("DD MMM YYYY") : "-"}</Text>
                          </Td>
                          <Td px="18px" py="13px">
                            <Text fontSize="13px" color="#45464E">{coupon.valid_from ? dayjs(coupon.valid_until).format("DD MMM YYYY") : "-"}</Text>
                          </Td>

                          {/* Status */}
                          <Td px="18px" py="13px">
                            <Badge
                              borderRadius="20px" fontSize="11px" fontWeight="600" px="10px" py="3px"
                              bg={statusConfig[coupon.status]?.bg}
                              color={statusConfig[coupon.status]?.color}
                              border="1px solid"
                              borderColor={statusConfig[coupon.status]?.border}
                              textTransform="capitalize"
                            >
                              {coupon.status}
                            </Badge>
                          </Td>

                          {/* Action */}
                          <Td px="18px" py="13px">
                            {/* <Button
                              size="xs" h="32px" px="13px" fontSize="11px" fontWeight="600" borderRadius="7px"
                              bg={coupon.status === "Active" ? "#E53E3E" : "#3E60AA"}
                              color={coupon.status === "Active" ? "white" : "white"}
                              border="1px solid"
                              borderColor={coupon.status === "Active" ? "gray.300" : "#3E60AA"}
                              _hover={{ opacity: 0.88 }}
                              onClick={() => setConfirmModal({ open: true, type: coupon.status === "Active" ? "block" : "activate", affiliate: coupon })}
                            >
                              {coupon.status === "Active" ? "Block" : "Activate"}
                            </Button> */}
                            <Button
                                size="xs"
                                h="32px"
                                px="13px"
                                fontSize="11px"
                                fontWeight="600"
                                borderRadius="7px"
                                bg="#3E60AA"
                                color="white"
                                border="1px solid"
                                borderColor="#3E60AA"
                                _hover={{ opacity: 0.88 }}
                                onClick={() => handleEditCoupon(coupon)}
                                >
                                Edit
                            </Button>
                          </Td>
                        </Tr>
                      ))
                    )}
                  </Tbody>
                </Table>
              </Box>

              {/* Pagination footer */}
              {/* Pagination footer */}
              <HStack justify="space-between" px="20px" py="12px" borderTop="1px solid" borderColor="gray.100">
                <Text fontSize="12px" color="#8B8D97">
                  Showing {((page - 1) * limit) + 1}–{Math.min(page * limit, totalCount)} of {totalCount} Coupons
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

      {/* Block/Activate Modal */}
      <Modal isOpen={confirmModal.open} onClose={() => setConfirmModal({ open: false })} isCentered size="sm">
        <ModalOverlay bg="rgba(69,70,78,0.4)" backdropFilter="blur(4px)" />
        <ModalContent borderRadius="16px" p="8px">
          <ModalHeader fontSize="16px" fontWeight="600" color="#45464E">
            {confirmModal.type === "block" ? "Block Affiliate?" : "Activate Affiliate?"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="14px" color="#8B8D97">
              {confirmModal.type === "block"
                ? `Are you sure you want to block ${confirmModal.affiliate?.name}? They will lose access immediately.`
                : `Activate ${confirmModal.affiliate?.name}'s account? They will regain full access.`}
            </Text>
          </ModalBody>
          <ModalFooter gap="8px">
            <Button variant="ghost" fontSize="13px" borderRadius="8px" onClick={() => setConfirmModal({ open: false })}>Cancel</Button>
            <Button
              bg={confirmModal.type === "block" ? "#45464E" : "#2E7D32"}
              color="white" fontSize="13px" fontWeight="600" borderRadius="8px" _hover={{ opacity: 0.88 }}
              onClick={updateAffiliateStatus} isLoading={updatingStatus} disabled={updatingStatus}
            >
              {confirmModal.type === "block" ? "Yes, Block" : "Yes, Activate"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={couponModal}
        onClose={() => {
            setCouponModal(false);
            setEditingCoupon(null);
            setCouponForm({
                code: "",
                description: "",
                type: "percentage",
                value: "",
                max_discount: "",
                min_amount: "",
                valid_from: "",
                valid_until: "",
                max_usage: "",
            });
            }}
        isCentered
        size="lg"
        closeOnOverlayClick={false}
        >
        <ModalOverlay
            bg="rgba(69,70,78,0.4)"
            backdropFilter="blur(4px)"
        />

        <ModalContent borderRadius="16px" p="8px">
            <ModalHeader
                fontSize="17px"
                fontWeight="600"
                color="#45464E"
                >
                {editingCoupon ? "Edit Coupon" : "Add Coupon"}
                </ModalHeader>

            <ModalCloseButton />

            <ModalBody>
            <VStack spacing="16px" align="stretch">

                {/* Coupon Code */}
                <Box>
                <Text
                    fontSize="13px"
                    fontWeight="600"
                    color="#45464E"
                    mb="6px"
                >
                    Coupon Code <Text as="span" color="red.500">*</Text>
                </Text>

                <Input
                    name="code"
                    value={couponForm.code}
                    onChange={handleCouponChange}
                    placeholder="Enter coupon code"
                    fontSize="13px"
                    borderRadius="8px"
                    textTransform="uppercase"
                    isDisabled={!!editingCoupon}
                    />
                </Box>

                {/* Description */}
                <Box>
                <Text
                    fontSize="13px"
                    fontWeight="600"
                    color="#45464E"
                    mb="6px"
                >
                    Description <Text as="span" color="red.500">*</Text>
                </Text>

                <Input
                    name="description"
                    value={couponForm.description}
                    onChange={handleCouponChange}
                    placeholder="Enter coupon description"
                    fontSize="13px"
                    borderRadius="8px"
                />
                </Box>

                {/* Type + Value */}
                <HStack spacing="12px">
                <Box flex="1">
                    <Text
                    fontSize="13px"
                    fontWeight="600"
                    color="#45464E"
                    mb="6px"
                    >
                    Type <Text as="span" color="red.500">*</Text>
                    </Text>

                    <Select
                    name="type"
                    value={couponForm.type}
                    onChange={handleCouponChange}
                    fontSize="13px"
                    borderRadius="8px"
                    >
                    <option value="percentage">
                        Percentage
                    </option>

                    <option value="fixed">
                        Fixed
                    </option>
                    </Select>
                </Box>

                <Box flex="1">
                    <Text
                    fontSize="13px"
                    fontWeight="600"
                    color="#45464E"
                    mb="6px"
                    >
                    Value <Text as="span" color="red.500">*</Text>
                    </Text>

                    <Input
                    name="value"
                    type="number"
                    value={couponForm.value}
                    onChange={handleCouponChange}
                    placeholder="Enter value"
                    fontSize="13px"
                    borderRadius="8px"
                    />
                </Box>
                </HStack>

                {/* Max Discount + Min Amount */}
                <HStack spacing="12px">
                <Box flex="1">
                    <Text
                    fontSize="13px"
                    fontWeight="600"
                    color="#45464E"
                    mb="6px"
                    >
                    Max Discount <Text as="span" color="red.500">*</Text>
                    </Text>

                    <Input
                    name="max_discount"
                    type="number"
                    value={couponForm.max_discount}
                    onChange={handleCouponChange}
                    placeholder="Enter max discount"
                    fontSize="13px"
                    borderRadius="8px"
                    />
                </Box>

                <Box flex="1">
                    <Text
                    fontSize="13px"
                    fontWeight="600"
                    color="#45464E"
                    mb="6px"
                    >
                    Minimum Amount <Text as="span" color="red.500">*</Text>
                    </Text>

                    <Input
                    name="min_amount"
                    type="number"
                    value={couponForm.min_amount}
                    onChange={handleCouponChange}
                    placeholder="Enter minimum amount"
                    fontSize="13px"
                    borderRadius="8px"
                    />
                </Box>
                </HStack>

                {/* Valid From + Valid Until */}
                <HStack spacing="12px">
                <Box flex="1">
                    <Text
                    fontSize="13px"
                    fontWeight="600"
                    color="#45464E"
                    mb="6px"
                    >
                    Valid From <Text as="span" color="red.500">*</Text>
                    </Text>

                    <Input
                    name="valid_from"
                    type="datetime-local"
                    value={couponForm.valid_from}
                    onChange={handleCouponChange}
                    fontSize="13px"
                    borderRadius="8px"
                    />
                </Box>

                <Box flex="1">
                    <Text
                    fontSize="13px"
                    fontWeight="600"
                    color="#45464E"
                    mb="6px"
                    >
                    Valid Until <Text as="span" color="red.500">*</Text>
                    </Text>

                    <Input
                    name="valid_until"
                    type="datetime-local"
                    value={couponForm.valid_until}
                    onChange={handleCouponChange}
                    fontSize="13px"
                    borderRadius="8px"
                    />
                </Box>
                </HStack>

                {/* Max Usage */}
                <Box>
                <Text
                    fontSize="13px"
                    fontWeight="600"
                    color="#45464E"
                    mb="6px"
                >
                    Maximum Usage <Text as="span" color="red.500">*</Text>
                </Text>

                <Input
                    name="max_usage"
                    type="number"
                    value={couponForm.max_usage}
                    onChange={handleCouponChange}
                    placeholder="Enter maximum usage"
                    fontSize="13px"
                    borderRadius="8px"
                />
                </Box>

            </VStack>
            </ModalBody>

            <ModalFooter gap="8px">
            <Button
                variant="ghost"
                fontSize="13px"
                borderRadius="8px"
                onClick={() => {
                    setCouponModal(false);
                    setEditingCoupon(null);
                    setCouponForm({
                    code: "",
                    description: "",
                    type: "percentage",
                    value: "",
                    max_discount: "",
                    min_amount: "",
                    valid_from: "",
                    valid_until: "",
                    max_usage: "",
                    });
                }}
                >
                Cancel
                </Button>

            <Button
                bg="#3E60AA"
                color="white"
                fontSize="13px"
                fontWeight="600"
                borderRadius="8px"
                _hover={{ opacity: 0.88 }}
                onClick={editingCoupon ? handleUpdateCoupon : handleCreateCoupon}
                isLoading={editingCoupon ? updatingCoupon : creatingCoupon}
                >
                {editingCoupon ? "Update Coupon" : "Create Coupon"}
                </Button>
            </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Coupons;