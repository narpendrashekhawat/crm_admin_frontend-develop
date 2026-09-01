import React, { useEffect, useState } from "react";
import {
  Box, HStack, Text, VStack,
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  Table, Thead, Tbody, Tr, Th, Td,
  Badge, Avatar, Button, IconButton, Input,
  useToast,
  InputGroup,
  InputLeftElement,
  Select,
} from "@chakra-ui/react";
import { GoHomeFill } from "react-icons/go";
import { ChevronLeftIcon, ChevronRightIcon, CopyIcon, SearchIcon } from "@chakra-ui/icons";
import { useLocation, useParams } from "react-router-dom";
import LeftSidebar from "../../components/LeftSideBarLayout/LeftSideBar";
import HeaderBar from "../../components/Header/HeaderBar";
import Footer from "../../components/footer";
import axios from "axios";
import { Config } from "../../components/Utils/Config";

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

const TABS = ["Referred Users", "Commissions", "Withdrawal Requests"];

/* ─────────────────────────── HELPERS ─────────────────────────── */

const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const fmtDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

const getAvatarColor = (name = "") => {
  const colors = ["#5570F1", "#16A34A", "#F59E0B", "#EF4444", "#8B5CF6"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

/* ── Paginator ── */
const Paginator = ({ page, totalPages, setPage, total, pageSize, label }) => {
  if (!totalPages || totalPages === 0 || total === 0) return null;
  return (
    <HStack justify="space-between" px="20px" py="14px" borderTop="1px solid #E2E8F0">
      <Text fontSize="13px" color="#8B8D97">
        Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total} {label}
      </Text>
      <HStack spacing="4px">
        <IconButton
          icon={<ChevronLeftIcon />} size="sm" variant="outline"
          isDisabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          aria-label="Prev"
        />
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Button
            key={p} size="sm" minW="36px"
            variant={p === page ? "solid" : "outline"}
            colorScheme={p === page ? "blue" : "gray"}
            onClick={() => setPage(p)}
          >
            {p}
          </Button>
        ))}
        <IconButton
          icon={<ChevronRightIcon />} size="sm" variant="outline"
          isDisabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          aria-label="Next"
        />
      </HStack>
    </HStack>
  );
};

/* ── Date Filter Bar ── */
const DateFilterBar = ({ from, to, setFrom, setTo, onReset }) => (
  <HStack
    px="20px" py="12px" borderBottom="1px solid #E2E8F0"
    spacing="12px" flexWrap="wrap" bg="#FAFBFF"
  >
    <Text fontSize="12px" color="#8B8D97" fontWeight="600">Filter by date:</Text>
    <HStack spacing="6px">
      <Text fontSize="12px" color="#8B8D97">From</Text>
      <Input type="date" size="sm" w="150px" borderRadius="8px"
        value={from} onChange={(e) => setFrom(e.target.value)} />
    </HStack>
    <HStack spacing="6px">
      <Text fontSize="12px" color="#8B8D97">To</Text>
      <Input type="date" size="sm" w="150px" borderRadius="8px"
        value={to} onChange={(e) => setTo(e.target.value)} />
    </HStack>
    {(from || to) && (
      <Button size="sm" variant="ghost" colorScheme="red" fontSize="12px" onClick={onReset}>
        Clear
      </Button>
    )}
  </HStack>
);

/* ── Stat Square Card ── */
const StatSquare = ({ label, value, color }) => (
  <Box
    bg="white" border="1px solid #E2E8F0" borderRadius="10px"
    p="12px 10px" display="flex" flexDirection="column"
    alignItems="center" justifyContent="center" textAlign="center"
  >
    <Text fontWeight="800" fontSize="20px" color={color} lineHeight="1">{value ?? "—"}</Text>
    <Text fontSize="10px" color="#8B8D97" mt="5px" lineHeight="1.3"
      textTransform="uppercase" letterSpacing="0.4px">{label}</Text>
  </Box>
);

/* ── Amount Row Card ── */
const AmountRow = ({ label, value, color }) => (
  <HStack
    justify="space-between" align="center" px="14px" py="10px"
    bg="white" border="1px solid #E2E8F0" borderRadius="8px"
    borderLeft="3px solid" borderLeftColor={color}
  >
    <Text fontSize="12px" color="#8B8D97" lineHeight="1.3">{label}</Text>
    <Text fontWeight="700" fontSize="14px" color={color} whiteSpace="nowrap">{value}</Text>
  </HStack>
);

/* ─────────────────────────── MAIN COMPONENT ─────────────────────────── */

const AffiliateDetails = () => {
  const { id } = useParams();
  const toast = useToast();
  const location = useLocation();

  /* ── profile / stats / wallet ── */
  const [loading, setLoading] = useState(false);
  const [profileDetails, setProfileDetails] = useState({});
  const [bankDetails, setBankDetails] = useState({});
  const [profileStats, setProfileStats] = useState({});
  const [wallet, setWallet] = useState({});

  /* ── tabs ── */
  const [activeTab, setActiveTab] = useState(0);

  /* ── Tab 0: Referred Users ── */
  const [referredUsers, setReferredUsers] = useState([]);
  const [ReferralsLoading, setReferralsLoading] = useState(false);
  const [referralStatus, setReferralStatus] = useState("");
  const [searchReferals, setSearchReferrals] = useState("");
  const [refPage, setRefPage] = useState(1);
  const [refTotalPages, setRefTotalPages] = useState(1);
  const [refTotal, setRefTotal] = useState(0);
  const REF_LIMIT = 10;
  const [referalUserType, setReferalUserType] = useState("");

  /* ── Tab 1: Commissions ── */
  const [commissionsList, setCommisionLists] = useState([]);
  const [commissionsLoading, setCommissionsLoading] = useState(false);
  const [commPage, setCommPage] = useState(1);
  const [commTotalPages, setCommTotalPages] = useState(1);
  const [commTotal, setCommTotal] = useState(0);
  const COMM_LIMIT = 10;
  const [stmtFrom, setStmtFrom] = useState("");
  const [stmtTo, setStmtTo] = useState("");

  /* ── Tab 2: Withdrawals ── */
  const [withdrawalsList, setWithdrawalsLists] = useState([]);
  const [withdrawalsLoading, setWithdrawalsLoading] = useState(false);
  const [wdPage, setWdPage] = useState(1);
  const [wdTotalPages, setWdTotalPages] = useState(1);
  const [wdTotal, setWdTotal] = useState(0);
  const WD_LIMIT = 10;
  const [wdFrom, setWdFrom] = useState("");
  const [wdTo, setWdTo] = useState("");
  const [paidStatus, setPaidStatus] = useState("");

  /* ── Modals ── */
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingWithdrawals, setUpdatingWithdrawals] = useState(false);

  const [editDisCom, setEditDisCom] = useState(0);
  const [editRetCom, setEditRetCom] = useState(0);
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);
  const [updatingCommission, setUpdatingCommission] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    if (location.state?.tab !== undefined) {
      setActiveTab(location.state?.tab);

      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth"
        });
      }, 200);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  /* ════════════════════════════════════════
     FETCH: Affiliate Details
  ════════════════════════════════════════ */
  const fetchAffiliateDetails = async (affiliateId) => {
    try {
      setLoading(true);
      const res = await axios.get(`${Config.affiliate_details}/${affiliateId}`, {
        headers: { Authorization: `${localStorage.getItem("authToken")}` },
      });
      if (res.data?.status === 200) {
        setProfileDetails(res.data?.apiData?.affDetails ?? {});
        setBankDetails(res.data?.apiData?.bankDetails ?? {});
        setProfileStats(res.data?.apiData?.statsData ?? {});
        setWallet(res.data?.apiData?.wallet ?? {});
      }
    } catch (error) {
      toast({ title: "Error Fetching Affiliate Details", description: error.message, status: "error", duration: 4000, isClosable: true, position: "top" });
    } finally {
      setLoading(false);
    }
  };

  /* ════════════════════════════════════════
     FETCH: Referred Users  (Tab 0)
  ════════════════════════════════════════ */
  const fetchReferedUsers = async (affiliateId) => {
    try {
      setReferralsLoading(true);
      const res = await axios.get(
        `${Config.affiliate_referrals}/${affiliateId}?page=${refPage}&limit=${REF_LIMIT}&userType=${referalUserType}&status=${referralStatus}&search=${searchReferals}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
      );
      if (res.data?.status === 200) {
        setReferredUsers(res.data?.apiData?.referrals ?? []);
        setRefTotalPages(res.data?.pagination?.totalPages ?? 1);
        setRefTotal(res.data?.pagination?.total ?? 0);
      }
    } catch (error) {
      toast({ title: "Error Fetching Referral Users", description: error.message, status: "error", duration: 4000, isClosable: true, position: "top" });
    } finally {
      setReferralsLoading(false);
    }
  };

  /* ════════════════════════════════════════
     FETCH: Commissions  (Tab 1)
  ════════════════════════════════════════ */
  const fetchCommisions = async (affiliateId) => {
    try {
      setCommissionsLoading(true);
      const res = await axios.get(
        `${Config.affiliate_commisions}/${affiliateId}?page=${commPage}&limit=${COMM_LIMIT}&startDate=${stmtFrom}&endDate=${stmtTo}`,
        { headers: { Authorization: `${localStorage.getItem("authToken")}` } }
      );
      if (res.data?.status === 200) {
        setCommisionLists(res.data?.apiData ?? []);
        setCommTotalPages(res.data?.pagination?.totalPages ?? 1);
        setCommTotal(res.data?.pagination?.total ?? 0);
      }
    } catch (error) {
      toast({ title: "Error Fetching commissions", description: error.message, status: "error", duration: 4000, isClosable: true, position: "top" });
    } finally {
      setCommissionsLoading(false);
    }
  };

  /* ════════════════════════════════════════
     FETCH: Withdrawals  (Tab 2)
  ════════════════════════════════════════ */
  const fetchAffliliateWithdrawals = async (affiliateId) => {
    try {
      setWithdrawalsLoading(true);
      const res = await axios.get(
        `${Config.affiliate_withdrawals}/${affiliateId}?page=${wdPage}&limit=${WD_LIMIT}&status=${paidStatus}&startDate=${wdFrom}&endDate=${wdTo}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
      );
      if (res.data?.status === 200) {
        setWithdrawalsLists(res.data?.apiData?.withdrawals ?? []);
        setWdTotalPages(res.data?.pagination?.totalPages ?? 1);
        setWdTotal(res.data?.pagination?.total ?? 0);
      }
    } catch (error) {
      toast({ title: "Error Fetching Withdrawals", description: error.message, status: "error", duration: 4000, isClosable: true, position: "top" });
    } finally {
      setWithdrawalsLoading(false);
    }
  };

  /* ════════════════════════════════════════
     useEffects
  ════════════════════════════════════════ */
  useEffect(() => { fetchAffiliateDetails(id); }, []);

  // Tab switch — fetch fresh data, reset pages
  useEffect(() => {
    if (activeTab === 0) { setRefPage(1); fetchReferedUsers(id); }
    if (activeTab === 1) { setCommPage(1); fetchCommisions(id); }
    if (activeTab === 2) { setWdPage(1); setPaidStatus(""); fetchAffliliateWithdrawals(id); }
  }, [activeTab]);

  // Tab 0 — re-fetch when page changes
  useEffect(() => {
    if (activeTab === 0) {
      fetchReferedUsers(id);
    }
  }, [refPage, searchReferals, referralStatus, referalUserType]);

  useEffect(() => {
    if (activeTab === 1) fetchCommisions(id);
  }, [commPage, stmtFrom, stmtTo]);

  // Tab 1 — re-fetch when page or date filters change
  useEffect(() => {
    if (activeTab === 1) fetchCommisions(id);
  }, [commPage, stmtFrom, stmtTo]);

  // Tab 2 — re-fetch when page or date filters change
  useEffect(() => {
    if (activeTab === 2) fetchAffliliateWithdrawals(id);
  }, [wdPage, wdFrom, wdTo, paidStatus]);

  /* ════════════════════════════════════════
     ACTION: Submit Withdrawal
  ════════════════════════════════════════ */
  const handleSubmitWithdrawal = async (affiliateId, status, wdId, reason = "") => {
    try {
      if (status === "Paid" && !transactionId) {
        toast({ title: "Transaction ID Required", status: "warning", duration: 3000, position: "top-right" });
        return;
      }

      if (status === "Rejected" && !reason.trim()) {
        toast({ title: "Reject reason is required", status: "warning", duration: 3000, position: "top-right" });
        return;
      }

      setUpdatingWithdrawals(true);
      const res = await axios.post(
        `${Config.affiliate_update_withdrawals}/${affiliateId}`,
        { wdId, trans_id: transactionId, status, reason },
        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
      );
      if (res.data?.status === 200) {
        toast({ title: "Success", description: res.data.message, status: "success", duration: 3000 });
        setTransactionId(""); setSelectedWithdrawal(null); setIsModalOpen(false); setRejectReason(''); setOpenRejectModal(false);
        fetchAffliliateWithdrawals(affiliateId);
      }
    } catch (error) {
      toast({ title: "Error Updating Withdrawal", description: error.message, status: "error", duration: 4000, isClosable: true, position: "top" });
    } finally {
      setUpdatingWithdrawals(false);
    }
  };

  /* ════════════════════════════════════════
     ACTION: Update Commission
  ════════════════════════════════════════ */
  const handleUpdateCommission = async (affiliateId) => {
    try {
      setUpdatingCommission(true);
      const res = await axios.post(
        `${Config.update_affiliate_commission}/${affiliateId}`,
        { disCom: editDisCom, retCom: editRetCom },
        { headers: { Authorization: `${localStorage.getItem("authToken")}` } }
      );
      if (res.data?.status === 200) {
        toast({ title: "Success", description: res.data.message, status: "success", duration: 3000 });
        setIsCommissionModalOpen(false);
        fetchAffiliateDetails(affiliateId);
      }
    } catch (error) {
      toast({ title: "Error Updating Commission", description: error.message, status: "error", duration: 4000, isClosable: true, position: "top" });
    } finally {
      setUpdatingCommission(false);
    }
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(profileDetails.affiliateCode ?? "").then(() => {
      toast({ title: "Referral code copied!", description: `"${profileDetails.affiliateCode}" copied.`, status: "success", duration: 2500, isClosable: true, position: "top-right" });
    });
  };

  /* ════════════════════════════════════════
     RENDER
  ════════════════════════════════════════ */
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
                <BreadcrumbLink href="/affiliate" fontSize="13px">Affiliate Management</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink fontSize="13px">{profileDetails.name}</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>

            {/* ══ SECTION 1 — PROFILE ══ */}
            <Box bg="#F0F4F9" borderRadius="14px" p="20px" pt="10px" pb="10px" mb="1.5rem" border="1px solid #E2E8F0">
              <HStack spacing="18px" align="flex-start" mb="6px">
                <Avatar
                  name={profileDetails.name} src={profileDetails.profilePic || undefined}
                  size="xl" flexShrink="0"
                  bg={!profileDetails.profilePic ? getAvatarColor(profileDetails.name ?? "") : undefined}
                />
                <VStack align="flex-start" spacing="2px" justify="center" minW="180px" mt="14px" mr="2rem">
                  <Text fontWeight="700" fontSize="17px" color="#1A202C">{profileDetails.name}</Text>
                  <Text fontSize="13px" color="#8B8D97">{profileDetails.phone}</Text>
                  <Text fontSize="12px" color="#8B8D97">{profileDetails.email}</Text>
                </VStack>
                <HStack spacing="28px" align="center" flex="1" flexWrap="wrap" mt="14px" gap="2rem">
                  <VStack align="flex-start" spacing="1px">
                    <Text fontSize="10px" color="#8B8D97" fontWeight="600">ADDRESS</Text>
                    <Text fontSize="13px" fontWeight="500">{profileDetails.address}</Text>
                  </VStack>
                  <VStack align="flex-start" spacing="1px">
                    <Text fontSize="10px" color="#8B8D97" fontWeight="600">JOINED</Text>
                    <Text fontSize="13px" fontWeight="500">{fmtDate(profileDetails.joiningDate)}</Text>
                  </VStack>
                  <VStack align="flex-start" spacing="1px">
                    <Text fontSize="10px" color="#8B8D97" fontWeight="600">REF CODE</Text>
                    <HStack spacing="4px">
                      <Text fontWeight="700" color="#5570F1">{profileDetails.affiliateCode}</Text>
                      <IconButton icon={<CopyIcon />} size="xs" variant="ghost" onClick={handleCopyReferral} />
                    </HStack>
                  </VStack>
                </HStack>
              </HStack>

              {/* Cards row */}
              <HStack spacing="12px" flexWrap="wrap" align="center" mt="6px" ml={28}>
                <Box bg="#ECFEFF" border="1px solid #67E8F9" borderRadius="10px" px="14px" py="10px">
                  <Text fontWeight="800" color="#0891B2">{profileStats.totalDis}</Text>
                  <Text fontSize="10px" color="#0891B2">DISTRIBUTORS ADDED</Text>
                </Box>
                <Box bg="#F0FDF4" border="1px solid #86EFAC" borderRadius="10px" px="14px" py="10px">
                  <Text fontWeight="800" color="#16A34A">{profileStats.totalRet}</Text>
                  <Text fontSize="10px" color="#16A34A">RETAILERS ADDED</Text>
                </Box>
                <Box bg="#EFF6FF" border="1px solid #BFDBFE" borderRadius="10px" px="14px" py="10px">
                  <Text fontWeight="800" color="#1D4ED8">{profileDetails.disCom}%</Text>
                  <Text fontSize="10px" color="#1D4ED8">DISTRIBUTOR COMMISSION</Text>
                </Box>
                <Box bg="#F5F3FF" border="1px solid #DDD6FE" borderRadius="10px" px="14px" py="10px">
                  <Text fontWeight="800" color="#6D28D9">{profileDetails.retCom}%</Text>
                  <Text fontSize="10px" color="#6D28D9">RETAILER COMMISSION</Text>
                </Box>
                <Button size="sm" variant="outline" colorScheme="blue" borderRadius="8px" fontSize="12px"
                  onClick={() => { setEditDisCom(profileDetails.disCom); setEditRetCom(profileDetails.retCom); setIsCommissionModalOpen(true); }}>
                  Edit Commission
                </Button>
              </HStack>

              {/* Bank Details */}
              <Box mt="12px">
                <Text fontSize="11px" color="#8B8D97" textTransform="uppercase" letterSpacing="0.6px" mb="8px" fontWeight="600">
                  Bank Details
                </Text>
                <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" bg="white" borderRadius="10px" border="1px solid #E2E8F0" overflow="hidden">
                  {[
                    { label: "Account Number", value: bankDetails.accountNo },
                    { label: "IFSC Code", value: bankDetails.IFSC },
                    { label: "Bank Name", value: bankDetails.bankName },
                    { label: "Branch", value: bankDetails.branch },
                  ].map((f, idx) => (
                    <Box key={f.label} px="16px" py="12px" borderRight={idx < 3 ? "1px solid #E2E8F0" : "none"}>
                      <Text fontSize="10px" color="#8B8D97" textTransform="uppercase" letterSpacing="0.5px" fontWeight="600" mb="4px">{f.label}</Text>
                      <Text fontSize="13px" fontWeight="600" color="#1A202C">{f.value ?? "—"}</Text>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>

            {/* ══ SECTION 2 — STATS ══ */}
            <HStack align="stretch" spacing="14px" mb="1.5rem">
              <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gridTemplateRows="repeat(2, 1fr)"
                gap="10px" bg="#F0F4F9" borderRadius="12px" border="1px solid #E2E8F0" p="12px" flex="0 0 auto">
                {[
                  { label: "Total Users", value: profileStats.totalUserAdded, color: "#5570F1" },
                  { label: "Active", value: profileStats.totalActive, color: "#2E7D32" },
                  { label: "Inactive", value: profileStats.totalInactive, color: "#F57F17" },
                  { label: "Distributors", value: profileStats.totalDis, color: "#0284C7" },
                  { label: "Retailers", value: profileStats.totalRet, color: "#7C3AED" },
                ].map((s) => <StatSquare key={s.label} {...s} />)}
              </Box>
              <VStack spacing="8px" flex="1" align="stretch" justify="center">
                {[
                  { label: "Total Earned (Lifetime)", value: fmt(wallet.totalEarned), color: "#059669" },
                  { label: "Upcoming Tentative Pay", value: fmt(0), color: "#0D9488" },
                  { label: "Current Balance", value: fmt(wallet.currentBalance), color: "#16A34A" },
                  { label: "Total Withdrawn", value: fmt(wallet.totolWithdraw), color: "#DC2626" },
                  { label: "Raise Request Amount", value: fmt(wallet.raiseRequestAmount), color: "#D97706" },
                ].map((s) => <AmountRow key={s.label} {...s} />)}
              </VStack>
            </HStack>

            {/* ══ SECTION 3 — TABBED TABLES ══ */}
            <Box bg="white" borderRadius="12px" border="1px solid #E2E8F0">

              {/* Tab bar */}
              <HStack spacing="0" borderBottom="2px solid #E2E8F0" px="4px">
                {TABS.map((tab, idx) => (
                  <Box
                    key={tab} px="24px" py="14px" cursor="pointer" mb="-2px"
                    borderBottom={activeTab === idx ? "2px solid #5570F1" : "2px solid transparent"}
                    onClick={() => setActiveTab(idx)}
                    _hover={{ bg: "#F9FAFB" }} borderRadius="4px 4px 0 0" transition="all 0.15s"
                  >
                    <Text fontSize="13px" fontWeight={activeTab === idx ? "700" : "500"}
                      color={activeTab === idx ? "#5570F1" : "#8B8D97"} whiteSpace="nowrap">
                      {tab}
                    </Text>
                  </Box>
                ))}
              </HStack>

              {/* ─── TAB 0 — REFERRED USERS ─── */}
              {activeTab === 0 && (
                <>
                  <HStack justify="space-between" px="20px" py="14px" flexWrap="wrap" gap="8px">
                    <VStack align="flex-start" spacing="1px">
                      <Text fontWeight="700" fontSize="15px">Referred Users</Text>
                      <Text fontSize="12px" color="#8B8D97">All users onboarded by this affiliate</Text>

                      <HStack justify="space-between" mt={"5px"} spacing="10px">
                        <InputGroup size="sm" w="480px">
                          <InputLeftElement pointerEvents="none">
                            <SearchIcon color="#8B8D97" boxSize="12px" />
                          </InputLeftElement>
                          <Input
                            placeholder="Search by name..."
                            borderRadius="8px" fontSize="13px" bg="#F0F4F9" border="none"
                            value={searchReferals}
                            onChange={(e) => setSearchReferrals(e.target.value)}
                            _focus={{ boxShadow: "none", bg: "#E8EEF7" }}
                          />
                        </InputGroup>

                        <Select
                          size="sm" w="130px" borderRadius="8px" fontSize="13px"
                          bg="#F0F4F9" border="none"
                          value={referralStatus}
                          onChange={(e) => setReferralStatus(e.target.value)}
                          _focus={{ boxShadow: "none" }}
                        >
                          <option value="">All</option>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </Select>

                        <Select
                          size="sm" w="130px" borderRadius="8px" fontSize="13px"
                          bg="#F0F4F9" border="none"
                          value={referalUserType}
                          onChange={(e) => setReferalUserType(e.target.value)}
                          _focus={{ boxShadow: "none" }}
                        >
                          <option value="">All</option>
                          <option value="distributor">Distributor</option>
                          <option value="retailer">Retailer</option>
                        </Select>
                      </HStack>
                    </VStack>
                    <HStack spacing="14px">
                      {[
                        { label: "Active", color: "#2E7D32", filter: "Active" },
                        { label: "Inactive", color: "#F57F17", filter: "Inactive" },
                      ].map(({ label, color, filter }) => (
                        <HStack key={label} spacing="5px">
                          <Box w="9px" h="9px" borderRadius="50%" bg={color} />
                          <Text fontSize="12px" color="#8B8D97">
                            {label}: {referredUsers.filter(r => r.status === filter).length}
                          </Text>
                        </HStack>
                      ))}
                    </HStack>
                  </HStack>

                  <Table size="md">
                    <Thead>
                      <Tr bg="#F0F4F9">
                        <Th py="14px" fontSize="12px" w="50px">S.No.</Th>
                        <Th fontSize="12px">Company</Th>
                        <Th fontSize="12px">Contact</Th>
                        <Th fontSize="12px">Type</Th>
                        <Th fontSize="12px">Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {ReferralsLoading ? (
                        <Tr><Td colSpan={6} textAlign="center" py="32px" color="#8B8D97" fontSize="13px">Loading...</Td></Tr>
                      ) : referredUsers.length === 0 ? (
                        <Tr><Td colSpan={6} textAlign="center" py="32px" color="#8B8D97" fontSize="13px">No referred users found.</Td></Tr>
                      ) : referredUsers.map((r, i) => {
                        const curStatus = (r.status ?? "inactive").toLowerCase();
                        const isBlocked = curStatus === "blocked";
                        return (
                          <Tr key={r.id ?? i} _hover={{ bg: "#FAFBFF" }}>
                            <Td py="15px" color="#8B8D97" fontSize="13px">
                              {(refPage - 1) * REF_LIMIT + i + 1}
                            </Td>
                            <Td>
                              <HStack spacing="10px">
                                <Avatar name={r.companyName} src={r.profilePic || undefined} size="sm" />
                                <VStack align="flex-start" spacing="1px">
                                  <Text fontWeight="600" fontSize="13px">{r.companyName}</Text>
                                  <Text fontSize="11px" color="#8B8D97">ID: {r.id}</Text>
                                </VStack>
                              </HStack>
                            </Td>
                            <Td>
                              <VStack align="flex-start" spacing="1px">
                                <Text fontSize="13px" color="#444A6D">{r.phone}</Text>
                                <Text fontSize="11px" color="#8B8D97">{r.email}</Text>
                              </VStack>
                            </Td>
                            <Td>
                              <Badge
                                bg={r.userType === "Distributor" ? "#EFF6FF" : "#F5F3FF"}
                                color={r.userType === "Distributor" ? "#1D4ED8" : "#6D28D9"}
                                border="1px solid"
                                borderColor={r.userType === "Distributor" ? "#BFDBFE" : "#DDD6FE"}
                                borderRadius="20px" px="10px" py="3px" fontSize="12px"
                              >
                                {r.userType}
                              </Badge>
                            </Td>
                            <Td>
                              <Badge
                                bg={statusConfig[curStatus]?.bg}
                                color={statusConfig[curStatus]?.color}
                                border="1px solid"
                                borderColor={statusConfig[curStatus]?.border}
                                borderRadius="20px" px="10px" py="3px" fontSize="12px" fontWeight="600"
                              >
                                {curStatus}
                              </Badge>
                            </Td>
                            {/* <Td>
                              <Button size="sm" variant="outline"
                                colorScheme={isBlocked ? "green" : "red"}
                                borderRadius="8px" fontSize="12px"
                              >
                                {isBlocked ? "Activate" : "Block"}
                              </Button>
                            </Td> */}
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>

                  {/* ── Referrals Paginator ── */}
                  <Paginator
                    page={refPage} totalPages={refTotalPages} setPage={setRefPage}
                    total={refTotal} pageSize={REF_LIMIT} label="users"
                  />
                </>
              )}

              {/* ─── TAB 1 — COMMISSIONS ─── */}
              {activeTab === 1 && (
                <>
                  <HStack justify="space-between" px="20px" py="14px" flexWrap="wrap" gap="8px">
                    <VStack align="flex-start" spacing="1px">
                      <Text fontWeight="700" fontSize="15px">Commission History</Text>
                      <Text fontSize="12px" color="#8B8D97">Commissions earned per referred user</Text>
                    </VStack>
                    <HStack spacing="14px">
                      <HStack spacing="6px">
                        <Box w="9px" h="9px" borderRadius="50%" bg="#1D4ED8" />
                        <Text fontSize="12px" color="#8B8D97">Distributor</Text>
                      </HStack>
                      <HStack spacing="6px">
                        <Box w="9px" h="9px" borderRadius="50%" bg="#6D28D9" />
                        <Text fontSize="12px" color="#8B8D97">Retailer</Text>
                      </HStack>
                    </HStack>
                  </HStack>

                  <DateFilterBar
                    from={stmtFrom} to={stmtTo}
                    setFrom={(v) => { setStmtFrom(v); setCommPage(1); }}
                    setTo={(v) => { setStmtTo(v); setCommPage(1); }}
                    onReset={() => { setStmtFrom(""); setStmtTo(""); setCommPage(1); }}
                  />

                  <Table size="md">
                    <Thead>
                      <Tr bg="#F0F4F9">
                        <Th py="14px" fontSize="12px" w="50px">S.No.</Th>
                        <Th fontSize="12px">Referred Users</Th>
                        <Th fontSize="12px">User Type</Th>
                        <Th fontSize="12px">Received Date</Th>
                        <Th fontSize="12px" isNumeric>Commission Credited</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {commissionsLoading ? (
                        <Tr><Td colSpan={5} textAlign="center" py="32px" color="#8B8D97" fontSize="13px">Loading...</Td></Tr>
                      ) : commissionsList.length === 0 ? (
                        <Tr><Td colSpan={5} textAlign="center" py="32px" color="#8B8D97" fontSize="13px">No commission records found.</Td></Tr>
                      ) : commissionsList.map((r, i) => {
                        const sno = (commPage - 1) * COMM_LIMIT + i + 1;
                        const isDist = r.user?.userType === "Distributor";
                        return (
                          <Tr key={i} _hover={{ bg: "#FAFBFF" }}>
                            <Td py="15px" color="#8B8D97" fontSize="13px">{sno}</Td>
                            <Td>
                              <VStack align="flex-start" spacing="1px">
                                <Text fontWeight="600" fontSize="13px">{r.user?.companyName}</Text>
                                <Text fontSize="11px" color="#8B8D97">ID: {r.user?.id}</Text>
                              </VStack>
                            </Td>
                            <Td>
                              <Badge
                                bg={isDist ? "#EFF6FF" : "#F5F3FF"}
                                color={isDist ? "#1D4ED8" : "#6D28D9"}
                                border="1px solid"
                                borderColor={isDist ? "#BFDBFE" : "#DDD6FE"}
                                borderRadius="20px" px="10px" py="3px" fontSize="12px"
                              >
                                {r.user?.userType}
                              </Badge>
                            </Td>
                            <Td fontSize="13px">{fmtDate(r.receivedDate)}</Td>
                            <Td isNumeric>
                              <Text color="#16A34A" fontWeight="700" fontSize="13px">+{fmt(r.amount)}</Text>
                            </Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>

                  {/* ── Commissions Paginator ── */}
                  <Paginator
                    page={commPage} totalPages={commTotalPages} setPage={setCommPage}
                    total={commTotal} pageSize={COMM_LIMIT} label="entries"
                  />
                </>
              )}

              {/* ─── TAB 2 — WITHDRAWAL REQUESTS ─── */}
              {activeTab === 2 && (
                <>
                  <HStack justify="space-between" px="20px" py="14px" flexWrap="wrap" gap="8px">
                    <VStack align="flex-start" spacing="1px">
                      <Text fontWeight="700" fontSize="15px">Withdrawal Requests</Text>
                      <Text fontSize="12px" color="#8B8D97">Pending, approved & cancelled withdrawals</Text>
                    </VStack>
                    <Text fontSize="13px" color="#8B8D97">{wdTotal} requests</Text>
                  </HStack>

                  <HStack>
                    <DateFilterBar
                      from={wdFrom} to={wdTo}
                      setFrom={(v) => { setWdFrom(v); setWdPage(1); }}
                      setTo={(v) => { setWdTo(v); setWdPage(1); }}
                      onReset={() => { setWdFrom(""); setWdTo(""); setWdPage(1); }}
                    />

                    <Select
                      size="sm" w="130px" borderRadius="8px" fontSize="13px"
                      bg="#F0F4F9" border="none"
                      value={paidStatus}
                      onChange={(e) => setPaidStatus(e.target.value)}
                      _focus={{ boxShadow: "none" }}
                    >
                      <option value="">All</option>
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Rejected">Rejected</option>
                    </Select>
                  </HStack>

                  <Table size="md">
                    <Thead>
                      <Tr bg="#F0F4F9">
                        <Th py="14px" fontSize="12px" w="50px">S.No.</Th>
                        <Th fontSize="12px">Request Date</Th>
                        <Th fontSize="12px">Payment Date</Th>
                        <Th fontSize="12px" isNumeric>Withdrawal Amount</Th>
                        <Th fontSize="12px">Status</Th>
                        <Th fontSize="12px">Remark</Th>
                        <Th fontSize="12px">Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {withdrawalsLoading ? (
                        <Tr><Td colSpan={7} textAlign="center" py="32px" color="#8B8D97" fontSize="13px">Loading...</Td></Tr>
                      ) : withdrawalsList.length === 0 ? (
                        <Tr><Td colSpan={7} textAlign="center" py="32px" color="#8B8D97" fontSize="13px">No requests found.</Td></Tr>
                      ) : withdrawalsList.map((r, i) => {
                        const sno = (wdPage - 1) * WD_LIMIT + i + 1;
                        const st = r.status ?? "";
                        return (
                          <Tr key={r.wdId ?? i} _hover={{ bg: "#FAFBFF" }}>
                            <Td py="15px" color="#8B8D97" fontSize="13px">{sno}</Td>
                            <Td fontSize="13px">{fmtDate(r.requestDate)}</Td>
                            <Td fontSize="13px">{fmtDate(r.paymentDate)}</Td>
                            <Td isNumeric fontWeight="700" fontSize="13px" color="#DC2626">{fmt(r.amount)}</Td>
                            <Td>
                              <Badge
                                bg={statusConfig[st]?.bg} color={statusConfig[st]?.color}
                                border="1px solid" borderColor={statusConfig[st]?.border}
                                borderRadius="20px" px="10px" py="3px" fontSize="12px"
                              >
                                {st}
                              </Badge>
                            </Td>
                            <Td maxW="280px">
                              {r.reason
                                ? <Text fontSize="13px" fontWeight={"semibold"} color="#C62828" lineHeight="1.5">{r.reason}</Text>
                                : <Text fontSize="13px" color="#CBD5E1">—</Text>}
                            </Td>
                            <Td>
                              {st === "Pending" ? (
                                <HStack spacing="6px">
                                  <Button size="sm" colorScheme="green" variant="outline"
                                    onClick={() => { setIsModalOpen(true); setTransactionId(""); setSelectedWithdrawal(r); }}>
                                    Accept
                                  </Button>
                                  <Button size="sm" colorScheme="red" variant="outline"
                                    onClick={() => { setSelectedWithdrawal(r); setRejectReason(''); setOpenRejectModal(true); }}>
                                    Reject
                                  </Button>
                                </HStack>
                              ) : (
                                <Text fontSize="13px" color="#CBD5E1">—</Text>
                              )}
                            </Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>

                  {/* ── Withdrawals Paginator ── */}
                  <Paginator
                    page={wdPage} totalPages={wdTotalPages} setPage={setWdPage}
                    total={wdTotal} pageSize={WD_LIMIT} label="requests"
                  />
                </>
              )}

              {/* ─── Process Withdrawal Modal ─── */}
              {isModalOpen && (
                <Box position="fixed" top="0" left="0" w="100%" h="100%" bg="rgba(0,0,0,0.4)" zIndex="1000">
                  <Box bg="white" p="20px" borderRadius="10px" w="400px" mx="auto" mt="10%">
                    <Text fontWeight="700" mb="12px">Process Withdrawal</Text>
                    <VStack spacing="10px" align="stretch">
                      {selectedWithdrawal?.bank && (
                        <Box border="1px solid #E2E8F0" borderRadius="8px" p="10px" bg="#F9FAFB">
                          <Text fontSize="12px" fontWeight="600" mb="6px">Bank Details</Text>
                          <Text fontSize="12px"><b>{selectedWithdrawal.bank.bankName}</b> — {selectedWithdrawal.bank.branch}</Text>
                          <Text fontSize="11px" color="#8B8D97">A/C: ••••{String(selectedWithdrawal.bank.accNo).slice(-4)}</Text>
                          <Text fontSize="11px" color="#8B8D97">IFSC: {selectedWithdrawal.bank.IFSC}</Text>
                          <Text fontSize="11px" color="#8B8D97">Holder: {selectedWithdrawal.bank.accHolder}</Text>
                        </Box>
                      )}
                      <Box>
                        <Text fontSize="12px">Amount</Text>
                        <Input value={selectedWithdrawal?.amount} isReadOnly />
                      </Box>
                      <Box>
                        <Text fontSize="12px">Transaction ID</Text>
                        <Input value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="Enter transaction ID" />
                      </Box>
                      <HStack justify="flex-end">
                        <Button size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button size="sm" colorScheme="green" isLoading={updatingWithdrawals}
                          onClick={() => handleSubmitWithdrawal(id, "Paid", selectedWithdrawal?.wdId)}>
                          Submit
                        </Button>
                      </HStack>
                    </VStack>
                  </Box>
                </Box>
              )}

              {/* ─── Edit Commission Modal ─── */}
              {isCommissionModalOpen && (
                <Box position="fixed" top="0" left="0" w="100%" h="100%" bg="rgba(0,0,0,0.4)" zIndex="1000">
                  <Box bg="white" p="24px" borderRadius="12px" w="420px" mx="auto" mt="10%" boxShadow="0 20px 60px rgba(0,0,0,0.15)">
                    <HStack justify="space-between" mb="20px">
                      <VStack align="flex-start" spacing="1px">
                        <Text fontWeight="700" fontSize="15px">Edit Commission Rates</Text>
                        <Text fontSize="12px" color="#8B8D97">Update distributor & retailer commission</Text>
                      </VStack>
                      <IconButton icon={<Text fontSize="16px" color="#8B8D97">✕</Text>} size="sm" variant="ghost"
                        onClick={() => setIsCommissionModalOpen(false)} aria-label="Close" />
                    </HStack>
                    <VStack spacing="16px" align="stretch">
                      <Box bg="#EFF6FF" border="1px solid #BFDBFE" borderRadius="10px" px="16px" py="12px">
                        <Text fontSize="11px" color="#1D4ED8" fontWeight="600" textTransform="uppercase" letterSpacing="0.5px" mb="8px">
                          Distributor Commission (%)
                        </Text>
                        <Input value={editDisCom} onChange={(e) => setEditDisCom(e.target.value)} type="number" min="0"
                          bg="white" border="1px solid #BFDBFE" borderRadius="8px" fontSize="14px" fontWeight="600" color="#1D4ED8"
                          _focus={{ borderColor: "#1D4ED8", boxShadow: "0 0 0 1px #1D4ED8" }} />
                      </Box>
                      <Box bg="#F5F3FF" border="1px solid #DDD6FE" borderRadius="10px" px="16px" py="12px">
                        <Text fontSize="11px" color="#6D28D9" fontWeight="600" textTransform="uppercase" letterSpacing="0.5px" mb="8px">
                          Retailer Commission (%)
                        </Text>
                        <Input value={editRetCom} onChange={(e) => setEditRetCom(e.target.value)} type="number" min="0"
                          bg="white" border="1px solid #DDD6FE" borderRadius="8px" fontSize="14px" fontWeight="600" color="#6D28D9"
                          _focus={{ borderColor: "#6D28D9", boxShadow: "0 0 0 1px #6D28D9" }} />
                      </Box>
                      <HStack justify="flex-end" spacing="10px" pt="4px">
                        <Button size="sm" variant="outline" borderRadius="8px" onClick={() => setIsCommissionModalOpen(false)}>Cancel</Button>
                        <Button size="sm" colorScheme="blue" borderRadius="8px" isLoading={updatingCommission}
                          loadingText="Saving..." onClick={() => handleUpdateCommission(id)}>
                          Save Changes
                        </Button>
                      </HStack>
                    </VStack>
                  </Box>
                </Box>
              )}

              {openRejectModal && (
                <Box position="fixed" top="0" left="0" w="100%" h="100%" bg="rgba(0,0,0,0.4)" zIndex="1000">
                  <Box bg="white" p="20px" borderRadius="10px" w="400px" mx="auto" mt="10%">

                    <Text fontWeight="700" mb="12px">Reject Withdrawal</Text>

                    <VStack spacing="12px" align="stretch">

                      <Text fontSize="13px" color="#8B8D97">
                        Please provide a reason for rejecting this request.
                      </Text>

                      <Input
                        placeholder="Enter reject reason..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                      />

                      <HStack justify="flex-end">
                        <Button size="sm" onClick={() => setOpenRejectModal(false)}>
                          Cancel
                        </Button>

                        <Button
                          size="sm"
                          colorScheme="red"
                          isLoading={updatingWithdrawals}
                          onClick={() =>
                            handleSubmitWithdrawal(
                              id,
                              "Rejected",
                              selectedWithdrawal?.wdId,
                              rejectReason
                            )
                          }
                        >
                          Reject
                        </Button>
                      </HStack>
                    </VStack>
                  </Box>
                </Box>
              )}

            </Box>
          </Box>
          <Footer />
        </Box>
      </HStack>
    </Box>
  );
};

export default AffiliateDetails;