import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    Button,
    Flex,
    Heading,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    Badge,
    Input,
    HStack,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Select,
} from "@chakra-ui/react";
import axios from "axios";
import { Config } from "../../components/Utils/Config";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import LeftSidebar from "../../components/LeftSideBarLayout/LeftSideBar";
import HeaderBar from "../../components/Header/HeaderBar";
import { GoHomeFill } from "react-icons/go";
import Footer from "../../components/footer";
import { FiUpload } from "react-icons/fi";

const tabs = [
    {
        id: "stats",
        label: "Stats",
    },
    {
        id: "suppliers",
        label: "Suppliers",
    },
    {
        id: "stocks",
        label: "Stocks",
    },
];

const BusinessDetails = () => {
    const [activeTab, setActiveTab] = useState("stats");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [linkedSuppliers, setLinkedSuppliers] = useState([]);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const containerRef = useRef(null);
    const fetchingRef = useRef(false);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [stocksLoading, setStocksLoading] = useState(false);
    const [stocks, setStocks] = useState([]);

    const [openUpload, setOpenUpload] = useState(false);
    const [stockSheet, setStockSheet] = useState(null);
    const [uploadingStockSheet, setUploadingStockSheet] = useState(false);

    const [stockSearch, setStockSearch] = useState("");
    const [stockDebouncedSearch, setStockDebouncedSearch] = useState("");

    const [stockPage, setStockPage] = useState(1);
    const [sLimit, setSLimit] = useState(10);
    const [hasMoreStocks, setHasMoreStocks] = useState(true);
    const [stockLoadingMore, setStockLoadingMore] = useState(false);
    const [statsFilter, setStatsFilter] = useState("30");

    const [statsLoading, setStatsLoading] = useState(false);
    const [statsData, setStatsData] = useState({});
    const [monthWiseData, setMonthWiseData] = useState([]);

    const stockContainerRef = useRef(null);
    const stockFetchingRef = useRef(false);

    const { id } = useParams();
    const nav = useNavigate();
    const {state} = useLocation();

    const fetchSupplierByUser = async (userId, currentPage = 1, force = false) => {
        try {
            if (!force && (!hasMore || isLoadingMore)) return;

            setIsLoadingMore(true);
            // setLoading(true);
            const res = await axios.get(`${Config.linked_supplier_by_user}?page=${currentPage}&limit=${limit}&status=&search=${debouncedSearch}&start_date=&end_date=&userId=${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });

            if (res.data?.status === 200) {
                const data = res.data?.linkedUsers || [];
                setLinkedSuppliers((prev) =>
                    currentPage === 1
                        ? data
                        : [...prev, ...data]
                );

                if (currentPage >= res.data?.totalPage) {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.log("Error Fetching linked suppliers", error);
        } finally {
            // setLoading(false);
            setIsLoadingMore(false);
            fetchingRef.current = false;
        }
    };

    useEffect(() => {

        if (activeTab !=="suppliers" || !id) return;

        fetchSupplierByUser(id, page, page === 1);

    }, [activeTab, page, id, debouncedSearch]);

    const handleScroll = () => {
        const scrollArea = containerRef.current;

        if (!scrollArea) return;

        const { scrollHeight, clientHeight, scrollTop } = scrollArea;

        const isNearBottom = scrollTop + clientHeight >= scrollHeight - 20;

        if (isNearBottom && hasMore && !fetchingRef.current) {
            fetchingRef.current = true;
            setPage((prev) => prev + 1);
        }
    };

    useEffect(() => {

        const timer = setTimeout(() => {

            setDebouncedSearch(search);

        }, 500);

        return () => clearTimeout(timer);

    }, [search]);

    useEffect(() => {

        setLinkedSuppliers([]);
        setHasMore(true);
        setPage(1);

    }, [debouncedSearch]);

    const fetchStocks = async (userId, currentPage = 1, force = false) => {

        try {
            if (!force && (!hasMore && stockLoadingMore)) return;

            setStockLoadingMore(true);

            const res = await axios.get(
                `${Config.stocks_by_dis}?userId=${userId}&page=${stockPage}&limit=${sLimit}&expStatus=&search=${stockDebouncedSearch}&stockStatus=`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                }
            );

            if (res.data?.status === 200) {
                const data = res.data?.apiData || [];
                setStocks((prev) =>
                    currentPage === 1
                        ? data
                        : [...prev, ...data]
                );

                if (currentPage >= res.data?.totalPage) {
                    setHasMoreStocks(false);
                }
            }

        } catch (error) {

            console.log(error);

        } finally {

            setStockLoadingMore(false);
            stockFetchingRef.current = false;

        }
    };

    useEffect(() => {

        if (activeTab === "stocks" && id) {
            fetchStocks(id, stockPage, stockPage === 1);
        }

    }, [activeTab, id, stockPage, stockDebouncedSearch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setStockDebouncedSearch(stockSearch);
        }, 500);

        return () => clearTimeout(timer);
    }, [stockSearch]);

    useEffect(() => {
        setStocks([]);
        setStockPage(1);
        setHasMoreStocks(true);
    }, [stockDebouncedSearch]);


    const handleStockScroll = () => {

        const scrollArea = stockContainerRef.current;

        if (!scrollArea) return;

        const { scrollTop, clientHeight, scrollHeight } = scrollArea;

        const isNearBottom = scrollTop + clientHeight >= scrollHeight - 20;

        if (isNearBottom && hasMoreStocks && !stockFetchingRef.current) {
            stockFetchingRef.current = true;
            setStockPage((prev) => prev + 1);
        }
    }
    const handleStockUpload = async () => {
        try {
            if (!stockSheet) return;

            setUploadingStockSheet(true);

            const formData = new FormData();
            formData.append("file", stockSheet);
            formData.append("uploadedBy", id);
            formData.append("sheetId", 1);

            const res = await axios.post(Config.Upload_Stock_Sheet, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });

            if (res?.status === 200) {
                setOpenUpload(false);
                setStockSheet(null);
                fetchStocks(id);
            }
        } catch (error) {
            console.log("Error uploading stock sheet", error);
        } finally {
            setUploadingStockSheet(false);
        }
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const fetchStats = async (orgId) => {

        try {

            setStatsLoading(true);

            let startDate = "";
            let endDate = "";

            // LAST 30 DAYS
            if (statsFilter === "30") {

                const today = new Date();

                const last30 = new Date();

                last30.setDate(today.getDate() - 30);

                startDate = last30.toISOString().split("T")[0];

                endDate = today.toISOString().split("T")[0];

            }

            // MONTH FILTERS
            else {

                const monthMap = {
                    jan: 0,
                    feb: 1,
                    mar: 2,
                    apr: 3,
                    may: 4,
                    jun: 5,
                    jul: 6,
                    aug: 7,
                    sep: 8,
                    oct: 9,
                    nov: 10,
                    dec: 11,
                };

                const year = new Date().getFullYear();

                const monthIndex = monthMap[statsFilter];

                const firstDay = new Date(year, monthIndex, 1);

                const lastDay = new Date(year, monthIndex + 1, 0);

                startDate = formatDate(firstDay);

                endDate = formatDate(lastDay);

            }

            const res = await axios.get(
                `${Config.get_dis_stats}?orgId=${orgId}&startDate=${startDate}&endDate=${endDate}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`
                    }
                }
            );

            if (res.data?.status === 200) {

                setStatsData(
                    res.data?.apiData || {}
                );

                setMonthWiseData(
                    res.data?.salesOrderMonthWise || []
                );

            }

        } catch (error) {

            console.log("Error fetching stats", error);

        } finally {

            setStatsLoading(false);

        }

    };

    useEffect(() => {

        if (activeTab=="stats" && id) {

            fetchStats(id);

        }

    }, [activeTab, id, statsFilter]);

    const formatDisplayDate = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);

    return `${day}-${month}-${year}`;
};

    const renderTabContent = () => {
        switch (activeTab) {
            case "stats":

                const topStats = [
                    {
                        title: "PO Raised Count",
                        value: statsData?.totalPOCount || 0,
                        subText:
                            statsFilter === "30"
                                ? "Last 30 Days"
                                : "Selected Month",
                        color: "#6C5DD3",
                        bg: "#F4F1FF",
                        icon: "📦",
                    },
                    {
                        title: "Sales Orders Count",
                        value: statsData?.totalSOCount || 0,
                        subText:
                            statsFilter === "30"
                                ? "Last 30 Days"
                                : "Selected Month",
                        color: "#00B074",
                        bg: "#E9FFF6",
                        icon: "🛒",
                    },
                    {
                        title: "Stock Count",
                        value: statsData?.totalStockCount || 0,
                        subText: "Medicines Available",
                        color: "#FF9F43",
                        bg: "#FFF5E9",
                        icon: "💊",
                    },
                    {
                        title: "Alerts Sent",
                        value: statsData?.totalAlertCount || 0,
                        subText: "Expiry & Payment Alerts",
                        color: "#5570F1",
                        bg: "#EEF3FF",
                        icon: "🔔",
                    },
                ];

                const secondaryStats = [
                    {
                        title: "Avg Monthly Bill",
                        value: `₹${Math.round(
                            statsData?.avgMonthlyBill || 0
                        )}`,
                        subText: "Average Subscription Billing",
                    },
                    {
                        title: "This Month Bill",
                        value: `₹${Math.round(
                            statsData?.currentMonthBill || 0
                        )}`,
                        subText: "Current Month Subscription",
                    },
                    {
                        title: "Employees Count",
                        value: statsData?.totalEmpCount || 0,
                        subText: "Active Employees",
                    },
                ];

                const yearlySales = monthWiseData.map((item) => ({
                    month: item.month.slice(0, 3),
                    sales: item.count,
                }));

                if (statsLoading) {

                    return (

                        <Flex
                            justify="center"
                            align="center"
                            h="400px"
                        >

                            <Text
                                fontSize="14px"
                                color="gray.500"
                            >
                                Loading Statistics...
                            </Text>

                        </Flex>

                    );

                }

                return (

                    <Box>

                        {/* HEADER */}

                        <Flex
                            justify="space-between"
                            align="center"
                            mb={4}
                            flexWrap="wrap"
                            gap={4}
                        >

                            <Box>

                                <Heading
                                    fontSize="21px"
                                    color="#1C1D22"
                                >
                                    {state?.disName} Statistics
                                </Heading>

                                <Text
                                    mt={1}
                                    fontSize="11px"
                                    color="#8B8D97"
                                >
                                    Business analytics & performance overview
                                </Text>

                            </Box>

                            <Select
                                value={statsFilter}
                                onChange={(e) =>
                                    setStatsFilter(e.target.value)
                                }
                                w="180px"
                                bg="white"
                                borderRadius="12px"
                                fontSize="13px"
                                height="38px"
                            >

                                <option value="30">
                                    Last 30 Days
                                </option>

                                <option value="jan">
                                    January
                                </option>

                                <option value="feb">
                                    February
                                </option>

                                <option value="mar">
                                    March
                                </option>

                                <option value="apr">
                                    April
                                </option>

                                <option value="may">
                                    May
                                </option>

                                <option value="jun">
                                    June
                                </option>

                                <option value="jul">
                                    July
                                </option>

                                <option value="aug">
                                    August
                                </option>

                                <option value="sep">
                                    September
                                </option>

                                <option value="oct">
                                    October
                                </option>

                                <option value="nov">
                                    November
                                </option>

                                <option value="dec">
                                    December
                                </option>

                            </Select>

                        </Flex>

                        {/* TOP STATS */}

                        <Box
                            display="grid"
                            gridTemplateColumns={{
                                base: "1fr",
                                md: "repeat(2,1fr)",
                                xl: "repeat(4,1fr)",
                            }}
                            gap={3}
                            mb={4}
                        >

                            {topStats.map((item, index) => (

                                <Box
                                    key={index}
                                    bg="white"
                                    borderRadius="16px"
                                    p={4}
                                    border="1px solid #ECECEC"
                                    boxShadow="0px 2px 6px rgba(0,0,0,0.03)"
                                >

                                    <Flex
                                        justify="space-between"
                                        align="flex-start"
                                        mb={3}
                                    >

                                        <Box>

                                            <Text
                                                fontSize="11px"
                                                color="#8B8D97"
                                                fontWeight="500"
                                            >
                                                {item.title}
                                            </Text>

                                            <Heading
                                                mt={1}
                                                fontSize="24px"
                                                color="#1C1D22"
                                            >
                                                {item.value}
                                            </Heading>

                                        </Box>

                                        <Flex
                                            w="38px"
                                            h="38px"
                                            borderRadius="10px"
                                            bg={item.bg}
                                            align="center"
                                            justify="center"
                                            fontSize="16px"
                                        >
                                            {item.icon}
                                        </Flex>

                                    </Flex>

                                    <Text
                                        fontSize="10px"
                                        color={item.color}
                                        fontWeight="600"
                                    >
                                        {item.subText}
                                    </Text>

                                </Box>

                            ))}

                        </Box>

                        {/* SECONDARY STATS */}

                        <Box
                            display="grid"
                            gridTemplateColumns={{
                                base: "1fr",
                                md: "repeat(2,1fr)",
                                lg: "repeat(3,1fr)",
                            }}
                            gap={3}
                            mb={4}
                        >

                            {secondaryStats.map((item, index) => (

                                <Box
                                    key={index}
                                    bg="white"
                                    borderRadius="16px"
                                    p={4}
                                    border="1px solid #ECECEC"
                                    boxShadow="0px 2px 6px rgba(0,0,0,0.03)"
                                >

                                    <Text
                                        fontSize="11px"
                                        color="#8B8D97"
                                        fontWeight="500"
                                    >
                                        {item.title}
                                    </Text>

                                    <Heading
                                        mt={2}
                                        fontSize="22px"
                                        color="#1C1D22"
                                    >
                                        {item.value}
                                    </Heading>

                                    <Text
                                        mt={1}
                                        fontSize="10px"
                                        color="#00B074"
                                        fontWeight="600"
                                    >
                                        {item.subText}
                                    </Text>

                                </Box>

                            ))}

                        </Box>

                        {/* GRAPH */}

                        {/* GRAPH */}

                        {/* GRAPH */}

                        <Box
                            bg="white"
                            borderRadius="20px"
                            p={5}
                            border="1px solid #ECECEC"
                            boxShadow="0px 4px 12px rgba(0,0,0,0.04)"
                        >

                            {/* HEADER */}

                            <Flex
                                justify="space-between"
                                align="center"
                                mb={5}
                                flexWrap="wrap"
                                gap={3}
                            >

                                <Box>

                                    <Heading
                                        fontSize="18px"
                                        color="#1C1D22"
                                    >
                                        Financial Year Sales Overview
                                    </Heading>

                                    <Text
                                        mt={1}
                                        fontSize="11px"
                                        color="#8B8D97"
                                    >
                                        Overall yearly sales performance
                                    </Text>

                                </Box>

                                <Box
                                    bg="#F4F1FF"
                                    px={3}
                                    py={2}
                                    borderRadius="12px"
                                >

                                    <Text
                                        fontSize="11px"
                                        color="#6C5DD3"
                                        fontWeight="700"
                                    >
                                        +100% Growth
                                    </Text>

                                </Box>

                            </Flex>

                            {/* CHART AREA */}

                            <Box
                                position="relative"
                                h="320px"
                                borderTop="1px solid #F3F3F3"
                                pt={6}
                            >

                                {/* GRID LINES */}

                                <Flex
                                    direction="column"
                                    justify="space-between"
                                    position="absolute"
                                    top="0"
                                    left="0"
                                    right="0"
                                    bottom="30px"
                                    zIndex={0}
                                >

                                    {[1, 2, 3, 4].map((_, index) => (

                                        <Box
                                            key={index}
                                            borderTop="1px dashed #EFEFEF"
                                            width="100%"
                                        />

                                    ))}

                                </Flex>

                                {/* BARS */}

                                <Flex
                                    align="end"
                                    justify="space-between"
                                    h="100%"
                                    gap={2}
                                    position="relative"
                                    zIndex={1}
                                >

                                    {yearlySales.map((item, index) => (

                                        <Flex
                                            key={index}
                                            direction="column"
                                            align="center"
                                            justify="end"
                                            flex={1}
                                            h="100%"
                                        >

                                            {/* VALUE */}

                                            <Text
                                                mb={2}
                                                fontSize="10px"
                                                color={
                                                    item.month === "Mar"
                                                        ? "#6C5DD3"
                                                        : "#6E7079"
                                                }
                                                fontWeight="700"
                                            >
                                                {item.sales}
                                            </Text>

                                            {/* BAR */}

                                            <Box
                                                width="100%"
                                                maxW="28px"
                                                borderRadius="20px 20px 8px 8px"
                                                bg={
                                                    item.month === "Mar"
                                                        ? "linear-gradient(180deg, #7C5CFC 0%, #5B4BDB 100%)"
                                                        : "linear-gradient(180deg, #E8E1FF 0%, #CFC3FF 100%)"
                                                }
                                                height={`${Math.max(item.sales * 1.5, 40)}px`}
                                                transition="0.25s ease"
                                                boxShadow={
                                                    item.month === "Mar"
                                                        ? "0px 6px 14px rgba(108,93,211,0.25)"
                                                        : "none"
                                                }
                                                _hover={{
                                                    transform: "translateY(-6px)",
                                                    opacity: 0.92,
                                                }}
                                            />

                                            {/* MONTH */}

                                            <Text
                                                mt={3}
                                                fontSize="10px"
                                                color={
                                                    item.month === "Mar"
                                                        ? "#1C1D22"
                                                        : "#8B8D97"
                                                }
                                                fontWeight="700"
                                            >
                                                {item.month}
                                            </Text>

                                        </Flex>

                                    ))}

                                </Flex>

                            </Box>

                        </Box>

                    </Box>

                );
            case "suppliers":
                return (
                    <Box>
                        {/* Top Actions */}
                        <Flex
                            justify="space-between"
                            align="center"
                            mb={2}
                            flexWrap="wrap"
                            gap={4}
                        >
                            <Input
                                placeholder="Search Supplier..."
                                maxW="320px"
                                bg="white"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                            <Flex gap={3}>
                                <Button
                                    colorScheme="purple"
                                    borderRadius="lg"
                                    height={"36px"}
                                    width={"170px"}
                                    onClick={() => nav(`/distributors/business-details/${id}/add-supplierMfr`)}
                                >
                                    + Add Manufacturer
                                </Button>

                                <Button
                                    height={"36px"}
                                    width={"170px"}
                                    colorScheme="blue"
                                    borderRadius="lg"
                                    onClick={() =>
                                        nav(`/distributors/business-details/${id}/add-supplierDis-CNF`)
                                    }
                                >
                                    + Add Distributor
                                </Button>
                            </Flex>
                        </Flex>

                        {/* Table */}
                        <Box
                            ref={containerRef}
                            onScroll={handleScroll}
                            border="1px solid"
                            borderColor="gray.200"
                            borderRadius="md"
                            overflowY="auto"
                            height={"440px"}
                        >
                            <Table variant="simple">
                                <Thead bg="gray.50" fontSize={"14px"}>
                                    <Tr>
                                        <Th>Supplier Name</Th>
                                        <Th>Type</Th>
                                        <Th>Email</Th>
                                        <Th>Phone</Th>
                                        <Th>Location</Th>
                                        <Th>Status</Th>
                                    </Tr>
                                </Thead>

                                <Tbody>
                                    {linkedSuppliers.map((supplier, index) => (
                                        <Tr key={supplier.id} minH={'42px !important'}
                                            maxH={'42px !important'}
                                            h={'42px !important'}
                                            fontSize={'13px'} color={'#6E7079'}>
                                            <Td py="8px"
                                                px="16px"
                                                fontWeight="500"
                                                fontSize="12px">
                                                {supplier.name}
                                            </Td>

                                            <Td py="8px"
                                                px="16px"
                                                fontWeight="500"
                                                fontSize="12px">{supplier.type}</Td>

                                            <Td py="8px"
                                                px="16px"
                                                fontWeight="500"
                                                fontSize="12px">{supplier.email}</Td>

                                            <Td py="8px"
                                                px="16px"
                                                fontWeight="500"
                                                fontSize="12px">{supplier.phone}</Td>

                                            <Td py="8px"
                                                px="16px"
                                                fontWeight="500"
                                                fontSize="12px">{supplier?.billingAddress?.city}</Td>

                                            <Td>
                                                <Badge
                                                    px={3}
                                                    py={1}
                                                    borderRadius="md"
                                                    colorScheme={
                                                        supplier.status === "Approved"
                                                            ? "green"
                                                            : supplier.status === "Rejected"
                                                                ? "red"
                                                                : "yellow"
                                                    }
                                                >
                                                    {supplier.status}
                                                </Badge>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                            {isLoadingMore && (
                                <Flex justify="center" py={4}>
                                    <Text fontSize="sm" color="gray.500">
                                        Loading more suppliers...
                                    </Text>
                                </Flex>
                            )}
                            {!hasMore && linkedSuppliers.length > 0 && (
                                <Flex justify="center" py={4}>
                                    <Text fontSize="sm" color="gray.400">
                                        No more suppliers
                                    </Text>
                                </Flex>
                            )}
                        </Box>
                    </Box>
                );

            case "stocks":
                return (
                    <Box>

                        <Flex
                            justify="space-between"
                            align="center"
                            mb={3}
                            gap={4}
                            width="100%"
                        >

                            <Input
                                placeholder="Search Medicine..."
                                maxW="320px"
                                bg="white"
                                value={stockSearch}
                                onChange={(e) =>
                                    setStockSearch(e.target.value)
                                }
                            />

                            <Button
                                colorScheme="purple"
                                borderRadius="lg"
                                height={"36px"}
                                fontSize="13px"
                                leftIcon={<FiUpload />}
                                onClick={() => setOpenUpload(true)}
                            >
                                Upload Stock Sheet
                            </Button>

                        </Flex>

                        <Box
                            border="1px solid"
                            borderColor="gray.200"
                            borderRadius="md"
                           overflowX="auto"
                            overflowY="auto"
                            height={"440px"}
                            ref={stockContainerRef}
                            onScroll={handleStockScroll}
                        >

                            <Table variant="simple" minW="1400px">

                                <Thead fontSize={"14px"} bg="gray.50">

                                    <Tr>

                                        <Th>P Code</Th>

                                        <Th>
                                            Medicine Name
                                        </Th>

                                        <Th>
                                            Batch No
                                        </Th>

                                        <Th>
                                            Expiry
                                        </Th>

                                        <Th>
                                            Added On
                                        </Th>

                                        <Th>
                                            MRP
                                        </Th>

                                        <Th>
                                            Stock
                                        </Th>

                                        <Th>
                                            Purchased From
                                        </Th>

                                        <Th>
                                            Packaging
                                        </Th>

                                        <Th>
                                            Salt Composition
                                        </Th>

                                    </Tr>

                                </Thead>

                                <Tbody>

                                    {stocks.map((stock) => (

                                        <Tr
                                            key={stock.SId}
                                            minH={'42px !important'}
                                            maxH={'42px !important'}
                                            h={'42px !important'}
                                            fontSize={'13px'}
                                            color={'#6E7079'}
                                        >

                                            <Td
                                                py="8px"
                                                px="16px"
                                                fontWeight="600"
                                                fontSize="12px"
                                            >
                                                {stock.product.PCode}
                                            </Td>

                                            <Td
                                                py="8px"
                                                px="16px"
                                                fontWeight="500"
                                                fontSize="12px"
                                            >
                                                {stock.product.PName.length <= 30 ? stock.product.PName : stock.product.PName.slice(0, 26) + "..."}
                                            </Td>

                                            <Td
                                                py="8px"
                                                px="16px"
                                                fontSize="12px"
                                            >
                                                {stock.BatchNo}
                                            </Td>

                                            <Td
                                                py="8px"
                                                px="16px"
                                                fontSize="12px"
                                            >
                                                {formatDisplayDate(stock.ExpDate)}
                                            </Td>

                                            <Td
                                                py="8px"
                                                px="16px"
                                                fontSize="12px"
                                                whiteSpace="nowrap"
                                                minW="85px"
                                            >
                                                {formatDisplayDate(stock.createdAt)}
                                            </Td>

                                            <Td
                                                py="8px"
                                                px="16px"
                                                fontSize="12px"
                                            >
                                                {stock.MRP}
                                            </Td>

                                            <Td
                                                py="8px"
                                                px="16px"
                                                fontWeight="600"
                                                fontSize="12px"
                                            >
                                                {stock.Stock}
                                            </Td>

                                            <Td
                                                py="8px"
                                                px="16px"
                                                fontSize="12px"
                                            >
                                                {stock.purchasedFrom}
                                            </Td>

                                            <Td
                                                py="8px"
                                                px="16px"
                                                fontSize="12px"
                                            >
                                                {stock.product.Package}
                                            </Td>

                                            <Td
                                                py="8px"
                                                px="16px"
                                                fontSize="12px"
                                                maxW="220px"
                                                whiteSpace="normal"
                                            >
                                                {stock.product.SaltComposition}
                                            </Td>

                                        </Tr>

                                    ))}
                                    {stocks.length === 0 && !stocksLoading && (
                                        <Tr>
                                            <Td
                                                colSpan={9}
                                                textAlign="center"
                                                py={10}
                                            >
                                                <Text
                                                    color="gray.400"
                                                    fontSize="14px"
                                                >
                                                    No Stocks Found
                                                </Text>
                                            </Td>
                                        </Tr>
                                    )}

                                </Tbody>

                            </Table>

                        </Box>

                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <Modal
                isOpen={openUpload}
                onClose={() => setOpenUpload(false)}
                isCentered
            >

                <ModalOverlay />

                <ModalContent>

                    <ModalHeader>
                        Upload Stock Sheet
                    </ModalHeader>

                    <ModalCloseButton />

                    <ModalBody>

                        <Input
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            p={1}
                            onChange={(e) =>
                                setStockSheet(e.target.files[0])
                            }
                        />

                    </ModalBody>

                    <ModalFooter gap={3}>

                        <Button
                            variant="ghost"
                            onClick={() => setOpenUpload(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            colorScheme="purple"
                            onClick={handleStockUpload}
                            isLoading={uploadingStockSheet}
                        >
                            Upload
                        </Button>

                    </ModalFooter>

                </ModalContent>

            </Modal>
            <Box backgroundColor="#F0F4F9" minH="100vh">
                <HStack
                    justifyContent="space-between"
                    px="20px"
                    alignItems="flex-start"
                >
                    {/* Sidebar */}
                    <LeftSidebar />

                    {/* Main Content */}
                    <Box width="80%">
                        <HeaderBar />

                        <Box
                            p={4}
                            bg="white"
                            mt="1rem"
                            borderRadius="15px 15px 0px 0px"
                        >
                            {/* Breadcrumb */}
                            <Breadcrumb
                                color="#8B8D97"
                                padding="10px 0px 0.25rem 0px"
                            >
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/overview">
                                        <GoHomeFill color="#5570F1" />
                                    </BreadcrumbLink>
                                </BreadcrumbItem>

                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        href="/distributors"
                                        color="#8B8D97"
                                        fontSize="13px"
                                    >
                                        Distributors
                                    </BreadcrumbLink>
                                </BreadcrumbItem>

                                <BreadcrumbItem isCurrentPage>
                                    <BreadcrumbLink
                                        color="#8B8D97"
                                        fontSize="13px"
                                    >
                                        {state?.disName}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </Breadcrumb>

                            {/* Page Header */}
                            <Flex
                                justify="space-between"
                                align="center"
                                mb={1}
                                flexWrap="wrap"
                                gap={4}
                            >
                                <Box>
                                    <Heading size="lg" color="gray.800">
                                        {state.disName}
                                    </Heading>
                                </Box>
                            </Flex>

                            {/* Tabs */}
                            <Flex
                                bg="white"
                                p={2}
                                borderRadius="xl"
                                boxShadow="sm"
                                gap={2}
                                width="fit-content"
                                mb={2}
                            >
                                {tabs.map((tab) => (
                                    <Button
                                        key={tab.id}
                                        onClick={() =>
                                            setActiveTab(tab.id)
                                        }
                                        borderRadius="lg"
                                        px={6}
                                        variant={
                                            activeTab === tab.id
                                                ? "solid"
                                                : "ghost"
                                        }
                                        bg={
                                            activeTab === tab.id
                                                ? "purple.600"
                                                : "transparent"
                                        }
                                        color={
                                            activeTab === tab.id
                                                ? "white"
                                                : "gray.600"
                                        }
                                        _hover={{
                                            bg:
                                                activeTab === tab.id
                                                    ? "purple.700"
                                                    : "purple.50",
                                        }}
                                    >
                                        {tab.label}
                                    </Button>
                                ))}
                            </Flex>

                            {/* Content */}
                            <Box
                                bg="white"
                                borderRadius="2xl"
                                p={1}
                                boxShadow="sm"
                            >
                                {renderTabContent()}
                            </Box>
                        </Box>

                        <Footer />
                    </Box>
                </HStack>
            </Box>
        </>
    );
};

export default BusinessDetails;