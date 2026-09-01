import React from 'react'
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Text, Image, Flex, VStack, HStack, Table, useToast, Thead, Tbody, Td, Th, Tr, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, PopoverCloseButton, Popover } from "@chakra-ui/react";
import { Config } from "../../components/Utils/Config";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import LeftSidebar from "../../components/LeftSideBarLayout/LeftSideBar";
import HeaderBar from "../../components/Header/HeaderBar";
import Footer from "../../components/footer";
import { useAuth } from "../../components/Context/authContext";
import axios, { all } from "axios";
import useAxios from "../../components/Context/axiosInstance";
import { GoHomeFill } from "react-icons/go";
import CheckIcon from '../../assets/icons/checkicons.png';
import graycheckIcon from '../../assets/icons/graycheckicons.png';
import { LuCalendar } from 'react-icons/lu';
import { FiDownload } from "react-icons/fi";

const SubscriptionsPage = () => {

    const { id } = useParams();
    const location = useLocation();
    const [plan, setPlan] = useState(null);
    const [licenses, setLicenses] = useState(null);
    const [allPlans, setAllplains] = useState();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [upgrading, setUpgrading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(""); // empty by default
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    let user = "";


    if (location.pathname.includes("distributors")) {
        user = "Distributor";
    }
    else {
        user = "Manufacturer";
    }

    const fetchSubscriptionData = async (startDate = "", endDate = "") => {
        try {
            setLoading(true);
            const response = await axios.get(`${Config.subscription_details}?userId=${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
                params: {
                    ...(startDate && { startDate }), // Only send if user selected
                    ...(endDate && { endDate }),
                }
            });   

            if (response.data?.status === 200) {
                const apiData = response?.data?.apiData;
                setPlan(apiData.updatedPlan || null);
                setInvoices(apiData.invoiceData || []);
                setLicenses(apiData.licenses)
                setFilteredInvoices(apiData.invoiceData || []);
                setAllplains(apiData?.allPlans);
                console.log(apiData?.allPlans['Service plan'][0].min_users, "kkkkkkkkkkkkk")
                console.log(allPlans, "allplains")
            } else {
                setError(response.data?.message || 'Failed to fetch subscription data.');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred while fetching subscription data.');
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        fetchSubscriptionData()
    }, [])

    const parseDate = (dateStr) => {
        if (!dateStr) return null;
        const [day, month, year] = dateStr.split("/").map(Number); // Split "11/09/2025"
        return new Date(year, month - 1, day); // Month is 0-based
    };

    const formatDateRange = (startDate, endDate) => {
        const start = parseDate(startDate);
        const end = parseDate(endDate);

        if (!start || isNaN(start)) return ""; // fallback if invalid
        if (!end || isNaN(end)) {
            // If end date is missing, just show single date
            return `${start.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`;
        }

        const sameMonth = start.getMonth() === end.getMonth();
        const optionsDay = { day: "numeric" };
        const optionsMonthDay = { day: "numeric", month: "short" };

        if (sameMonth) {
            return `${start.toLocaleDateString("en-GB", optionsDay)}–${end.toLocaleDateString(
                "en-GB",
                optionsMonthDay
            )} ${start.getFullYear()}`;
        } else {
            return `${start.toLocaleDateString(
                "en-GB",
                optionsMonthDay
            )} – ${end.toLocaleDateString("en-GB", optionsMonthDay)} ${start.getFullYear()}`;
        }
    };



    const formatDateRanges = (startDate, endDate) => {
        if (!startDate) return "";

        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : null;

        // If no end date -> just show start date
        if (!end || isNaN(end)) {
            return start.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
            });
        }

        // ✅ If both are same date -> show single date
        if (
            start.getUTCDate() === end.getUTCDate() &&
            start.getUTCMonth() === end.getUTCMonth() &&
            start.getUTCFullYear() === end.getUTCFullYear()
        ) {
            return start.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
            });
        }

        // Same month -> compact format
        if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
            return `${start.toLocaleDateString("en-GB", { day: "numeric" })}–${end.toLocaleDateString(
                "en-GB",
                { day: "numeric", month: "short" }
            )} ${start.getFullYear()}`;
        }

        // Different month/year
        return `${start.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${end.toLocaleDateString(
            "en-GB",
            { day: "numeric", month: "short" }
        )} ${start.getFullYear()}`;
    };

    // Example:
    console.log(formatDateRange("2025-09-11T05:36:44.000Z", "2025-09-11T10:49:27.668Z"));

    const formatctivedDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getOrdinal = (number) => {
        if (!number && number !== 0) return "";
        const lastDigit = number % 10;
        const lastTwoDigits = number % 100;

        if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
            return `${number}th`;
        }

        switch (lastDigit) {
            case 1: return `${number}st`;
            case 2: return `${number}nd`;
            case 3: return `${number}rd`;
            default: return `${number}th`;
        }
    };

    const features = plan?.description
        ? plan.description.split("|").map((text, index) => ({
            image: index === 0 ? CheckIcon : graycheckIcon,
            text,
            color: index === 0 ? "blue.500" : undefined,
            fontFamily: "'Inter', sans-serif",
            fontWeight: index === 0 ? "bold" : "regular",
        }))
        : [];

        const items = [
        { id: 1, name: `Starting ${allPlans && formatctivedDate(allPlans['Service plan'][0]?.activated_at)}`, descriptions: `₹00.00 INR per user/month - For First ${allPlans && allPlans['Service plan'][0].min_users} users` },
        { id: 2, name: "", descriptions: `₹ ${allPlans && allPlans['Service plan'][0].base_price} INR per user/month From ${allPlans && getOrdinal(allPlans['Service plan'][0].min_users + 1)} user onward` },
        { id: 3, name: "ADD ON Plans", descriptions: "", },
    ]

    return (
        <>
            <Box backgroundColor="#F0F4F9" height="100%">
                <HStack justifyContent="space-between" px="20px" alignItems="flex-start">
                    <LeftSidebar />
                    <Box width="80%">
                        <HeaderBar />
                        <Box p={4} bg="white" mt="1rem" padding="12px 20px" borderRadius="15px 15px 0px 0px">
                            <Breadcrumb color="#8B8D97" padding="10px 0px 2rem 0px">
                                <BreadcrumbItem>
                                    <BreadcrumbLink as={Link} to="/overview"><GoHomeFill color="#5570F1" /> </BreadcrumbLink>
                                </BreadcrumbItem>

                                <BreadcrumbItem>
                                    <BreadcrumbLink as={Link} to={user === "Distributor" ? "/distributors" : "/manufacturers"} color="#8B8D97" fontSize="13px"> {user === "Distributor" ? "Distributor List" : "Manufacturer List"} </BreadcrumbLink>
                                </BreadcrumbItem>

                                <BreadcrumbItem>
                                    <BreadcrumbLink as={Link} to={user === "Distributor" ? `/distributors/DistributorCNFdetails/${id}` : `/manufacturers/ProfileItemsInfo/${id}`} color="#8B8D97" fontSize="13px">Profile Details</BreadcrumbLink>
                                </BreadcrumbItem>

                                <BreadcrumbItem>
                                    <BreadcrumbLink as={Link} to={user === "Distributor" ? `/distributors/DistributorCNFdetails/${id}/SubscriptionsPage` : `/manufacturers/ProfileItemsInfo/${id}/SubscriptionsPage`} color="#8B8D97" fontSize="13px">Subscriptions Page</BreadcrumbLink>
                                </BreadcrumbItem>
                            </Breadcrumb>

                            {/* Breadcrumb */}


                            {/* Title */}
                            <Text fontSize="2xl" fontWeight="bold" fontFamily={'cursive'} mt={4} mb={2} textAlign="center">
                                Subscription & Pricing
                            </Text>

                            <Flex
                                direction={{ base: "column", md: "row" }}
                                gap={6}
                                px={6}
                                py={6}
                                w="100%"

                            >

                                {/* Left Card */}
                                <VStack>
                                    <Box
                                        bg={'#FFBB00'}
                                        borderRadius="20px"
                                        pt={3}
                                        pb={1}
                                        pl={1}
                                        pr={1}
                                        color="black"
                                        minW="300px"
                                        maxW='400px'
                                        position="relative"
                                        boxShadow="xl"
                                    >

                                        <Text textAlign={'center'}
                                            justifyContent={'center'}
                                            alignItems={'center'}
                                            color="black"
                                            px={4}
                                            //py={2}
                                            mt={-2}
                                            borderRadius="full"
                                            fontSize="xs"
                                            fontWeight="normal"
                                            fontFamily={'cursive'}
                                            mb={2}
                                        >
                                            {plan?.active_status === "Active" ? "Currently Active" : "Inactive"}
                                        </Text>

                                        <VStack bg={'white'} borderRadius={30}>
                                            <Text textAlign="center" flex={1} fontSize="2xs" mb={1}>
                                                <sub>
                                                    <Text as="span" color="green.500" fontWeight="semibold">
                                                        Active:
                                                    </Text>{" "}
                                                    Since {new Date(plan?.activated_at).toLocaleDateString("en-GB", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </sub>
                                            </Text>
                                            <VStack align="start" spacing={4} mb={6}>
                                                <Box>
                                                    <Text fontSize="2xl" fontWeight="bold" mb={1}>
                                                        {/* Jee1 SCM + ERP Service */}
                                                        {plan?.planName}
                                                    </Text>
                                                    <Text fontSize="sm" opacity={0.9} color={'#666666'}>
                                                        Ideal for Complete solution
                                                    </Text>
                                                </Box>

                                                <HStack>
                                                    <Text fontSize="4xl" fontWeight="bold">₹{Math.round(plan?.basePrice)}</Text>
                                                    <Text fontSize="xs" fontWeight={'bold'} mt={-2}>/per user/per month</Text>
                                                </HStack>

                                            </VStack>
                                            <VStack align="start" spacing={3} mb={8}>
                                                {features.map((feature, index) => (
                                                    <HStack key={index} spacing={3}>
                                                        <Image src={feature.image} boxSize="20px" alt="check" color={feature.color} />
                                                        <Text fontSize="md" fontFamily={feature.fontFamily} fontWeight={feature.fontWeight}>{feature.text}</Text>
                                                    </HStack>
                                                ))}
                                            </VStack>

                                            <VStack spacing={3}>
                                                {/* <Button
                                                    bg="gray.800"
                                                    color="white"
                                                    size="lg"
                                                    width="full"
                                                    borderRadius="full"
                                                    _hover={{ bg: 'gray.700' }}
                                                    isLoading={upgrading} // ✅ shows loading spinner
                                                    onClick={handleUpgradeWhiteLabel} // ✅ call API on click
                                                    >
                                                    Upgrade to White Label
                                                </Button> */}
                                                {/* <Button
                                                    variant="link"
                                                    color="black"
                                                    fontSize="sm"
                                                    textDecoration="underline"
                                                    mt={-2}
                                                    mb={2}  
                                                    onClick={handleUpgradeWhiteLabel}
                                                    isLoading={upgrading}
                                                >
                                                    Contact Sales
                                                </Button> */}
                                            </VStack>
                                        </VStack>
                                    </Box>
                                </VStack>

                                
                                {/* Right Plan Details */}
                                <VStack w={'full'} gap={6}>
                                    <Box
                                        flex={1}
                                        bg={'white'}
                                        borderRadius="24px"
                                        p={6}
                                        boxShadow="sm"
                                        w={'full'}

                                    >
                                        <VStack align={"start"} spacing={5}>
                                            {/* Header */}
                                            <Box>
                                                <Text fontSize="xl" fontWeight="bold" fontFamily={'cursive'} mb={1}>
                                                    Plan Details
                                                </Text>
                                                <Text color="gray.600" fontSize="sm">
                                                    Ideal for Complete solution
                                                </Text>
                                            </Box>
                                            {/* Plan Info Grid */}
                                            <Flex wrap="wrap" gap={0} justifyContent={'space-between'} width="full">
                                                <Box>
                                                    <Text fontWeight="semibold" mb={2} color={'#797979'} fontSize="md">Plan Details</Text>
                                                    <Text color="#797979" fontSize="sm">Flexible Plan</Text>
                                                </Box>

                                                <Box>
                                                    <Text fontWeight="semibold" mb={2} fontSize="md" color={'#797979'}>Licenses</Text>
                                                    <VStack align="start" spacing={0} fontSize="sm" color="gray.600">
                                                        {licenses?.map((license, index) => (
                                                            <Text key={index}>{license.description}</Text>
                                                        ))}
                                                    </VStack>
                                                </Box>

                                                <Box>
                                                    <Text fontWeight="semibold" mb={2} fontSize="md" color={'#797979'}>Estimated Monthly Bill</Text>
                                                    <Text fontSize="md" fontWeight="bold" color={'#797979'}>{plan?.estimatedBill} INR</Text>
                                                </Box>
                                            </Flex>

                                            {/* Charges Section */}
                                            <Box width="full">
                                                <Text fontSize="lg" fontWeight="bold" mb={0} color="blue.600">
                                                    Charges
                                                </Text>
                                                <Text fontSize="sm" color="gray.600" mb={4} mt={0}>
                                                    You are receiving a Free Full Usage Plan for the First {allPlans && allPlans['Service plan'][0].min_users} users, you add in your account.
                                                </Text>

                                                <Table size="sm" variant='outline' >
                                                    <Thead>
                                                        <Tr>
                                                            <Th color={'#797979'} >Plan Details</Th>
                                                            <Th textAlign="start" color={'#797979'} >Licenses</Th>

                                                        </Tr>
                                                    </Thead>
                                                    <Tbody color={'#797979'} >
                                                        {items.map((item) => (
                                                            <Tr key={items.id} bg={'#FAF7F7'}>
                                                                <Td>{item.name}</Td>
                                                                <Td textAlign="start">{item.descriptions}</Td>
                                                            </Tr>
                                                        ))}

                                                        {allPlans && allPlans['Addons']?.map((itemss) => (
                                                            <Tr key={itemss.plan_id} bg={'#FAF7F7'}>
                                                                <Td>{itemss.name}</Td>
                                                                <Td textAlign="start">
                                                                    ₹ {itemss.base_price} per user/month
                                                                </Td>
                                                            </Tr>
                                                        ))}

                                                    </Tbody>
                                                </Table>
                                            </Box>
                                            <Box mt={6} p={4} bg="gray.50" borderRadius="md" border="1px solid #E2E8F0">
                                                <Text fontSize="lg" fontWeight="bold" mb={3} color="blue.600">
                                                    Subscription & Billing Policy
                                                </Text>

                                                <VStack align="start" spacing={3} fontSize="sm" color="gray.700">
                                                    <Text>
                                                        <strong>Free Users:</strong> Your plan includes up to {allPlans && allPlans['Service plan'][0].min_users} users (including the owner) for free.
                                                    </Text>
                                                    <Text>
                                                        <strong>Adding Employees:</strong> When you add more than {allPlans && allPlans['Service plan'][0].min_users} employees, charges for the additional users are applied immediately and prorated for the remaining days in the current billing cycle.
                                                    </Text>
                                                    <Text>
                                                        <strong>Removing or Deactivating Employees:</strong> If you remove or deactivate an employee during the current billing cycle, <strong>no refunds or credits</strong> will be issued for that employee. Your subscription will update and charges will be adjusted from the next billing cycle.
                                                    </Text>
                                                    <Text>
                                                        <strong>Ads-Free Plan:</strong> When you enable Ads-Free, charges are applied immediately on a prorated basis. If you disable Ads-Free, it remains active until the end of the current billing cycle. <strong>No refunds or credits</strong> will be issued for mid-cycle cancellations.
                                                    </Text>
                                                </VStack>
                                            </Box>
                                        </VStack>
                                    </Box>
                                    <Box
                                        flex={1}
                                        bg={'white'}
                                        borderRadius="24px"
                                        p={6}
                                        boxShadow="sm"
                                        w={'full'}

                                    >
                                        <VStack align="start" spacing={5}>
                                            {/* Header */}
                                            <Box>
                                                <Text fontSize="xl" fontWeight="bold" fontFamily={'cursive'} mb={1}>
                                                    Billing Details
                                                </Text>
                                                <Text color="gray.600" fontSize="sm">
                                                    Ideal for Complete solution
                                                </Text>
                                            </Box>

                                            {/* Plan Info Grid */}
                                            <Flex wrap="wrap" gap={0} justifyContent={'space-between'} width="full">
                                                <Box>
                                                    <Text fontWeight="semibold" mb={2} color={'#797979'} fontSize="md">Next Billing Date</Text>
                                                    <Text color="#797979" fontSize="sm">{plan?.nextBillingDate}</Text>
                                                </Box>

                                                {/* <Box>
                                                    <Text fontWeight="semibold" mb={2} fontSize="md" color={'#797979'}>Payments account ID</Text>

                                                    <Text color="#797979" fontSize="sm">5666777777</Text>
                                                    </Box> */}

                                                <Box>
                                                    <Text fontWeight="semibold" mb={2} fontSize="md" color={'#797979'}>Billing Address</Text>
                                                    <Text color="#797979" fontSize="sm">{plan?.address?.addLine1} {plan?.address?.addLine2 ? "," : ''}</Text>
                                                    <Text color="#797979" fontSize="sm">{plan?.address?.addLine2}{plan?.address?.city ? "," : ''}</Text>
                                                    <Text color="#797979" fontSize="sm">{plan?.address?.city}{plan?.address?.State ? "," : ''}{plan?.address?.State}</Text>
                                                </Box>
                                            </Flex>
                                        </VStack>
                                    </Box>
                                    <Box
                                        flex={1}
                                        bg={'white'}
                                        //borderRadius="24px"
                                        p={6}
                                        w={'full'}
                                        mt={-4}
                                        mb={-10}
                                    //boxShadow="sm"
                                    >
                                        <HStack align="start" spacing={5} justifyContent={'space-between'}>
                                            {/* Header */}
                                            <Box>
                                                <Text fontSize="xl" fontWeight={700} fontFamily={'cursive'} mb={1}>
                                                    View Past Invoices
                                                </Text>
                                            </Box>
                                            <Box>
                                                <Popover open={isFilterOpen} onOpenChange={(e) => setIsFilterOpen(e.open)}>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            maxH="36px"
                                                            _hover={{ bg: "bg.info" }}
                                                            _active={{ bg: "bg.info" }}
                                                            _focusVisible={{ bg: "bg.info" }}
                                                            borderRadius="6px"
                                                            bg="none"
                                                            variant="outline"
                                                        >
                                                            <LuCalendar />
                                                            Filter
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent>
                                                        <PopoverCloseButton />
                                                        <PopoverArrow>
                                                        </PopoverArrow>
                                                        <PopoverBody>
                                                            <Text fontWeight="bold" mb={2}>Filter by Month & Year</Text>
                                                            <input
                                                                type="month"
                                                                value={selectedMonth}
                                                                onChange={(e) => setSelectedMonth(e.target.value)}
                                                                style={{
                                                                    width: "100%", padding: "8px", fontSize: "14px",
                                                                    border: "1px solid #ccc", borderRadius: "6px",
                                                                }}
                                                            />
                                                            <HStack justifyContent="end" mt={4}>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => {
                                                                        setSelectedMonth("");
                                                                        // fetchSubscriptionData();
                                                                        setIsFilterOpen(false);
                                                                    }}
                                                                >
                                                                    Reset
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    colorScheme="blue"
                                                                    onClick={() => {
                                                                        if (selectedMonth) {
                                                                            const [year, month] = selectedMonth.split("-");
                                                                            // const startDate = new Date(year, month - 1, 1)
                                                                            //     .toISOString()
                                                                            //     .split("T")[0]; // first day of selected month
                                                                            // const endDate = new Date(year, month, 0)
                                                                            //     .toISOString()
                                                                            //     .split("T")[0]; // last day of selected month

                                                                            const formatDateLocal = (y, m, d) => {
                                                                                const date = new Date(y, m, d);
                                                                                const yyyy = date.getFullYear();
                                                                                const mm = String(date.getMonth() + 1).padStart(2, "0");
                                                                                const dd = String(date.getDate()).padStart(2, "0");
                                                                                return `${yyyy}-${mm}-${dd}`;
                                                                            };

                                                                            const startDate = formatDateLocal(year, month - 1, 1); // first day of month
                                                                            const endDate = formatDateLocal(year, month, 0);

                                                                            // fetchSubscriptionData(startDate, endDate); // ✅ call API with date range
                                                                        } else {
                                                                            // fetchSubscriptionData(); // fetch all if no filter
                                                                        }
                                                                        setIsFilterOpen(false);
                                                                    }}
                                                                >
                                                                    Apply
                                                                </Button>
                                                            </HStack>
                                                        </PopoverBody>
                                                    </PopoverContent>
                                                </Popover>
                                            </Box>
                                        </HStack>
                                    </Box>
                                    {filteredInvoices?.map((invoice) => (
                                    <Box
                                        key={invoice.invoiceId}
                                        flex={1}
                                        bg={'white'}
                                        borderRadius="24px"
                                        p={6}
                                        boxShadow="sm"
                                        w={'full'}

                                    >
                                        {/* Header */}
                                        <HStack align="start" spacing={5} w={'100%'} justifyContent={'space-between'}>
                                            <Box w={'56%'}>
                                                <Text fontSize="xl" fontWeight="bold" mb={1}>

                                                    {/* Show invoice period, fallback to formatted date if undefined */}
                                                    {formatDateRanges(invoice?.startDate, invoice?.endDate)}
                                                    {/* {formatDate(invoice?.startDate)}-{formatDate(invoice?.endDate)} */}
                                                    {invoice?.inv_url && (
                                                    <Button
                                                        bg={'transparent'}
                                                        onClick={() => {
                                                            const link = document.createElement('a');
                                                            link.href = invoice.inv_url;
                                                            link.download = ''; // you can add a custom filename if needed
                                                            document.body.appendChild(link);
                                                            link.click();
                                                            document.body.removeChild(link);
                                                        }}
                                                    >
                                                        <FiDownload color="black" />
                                                    </Button>
                                                    )}
                                                </Text>
                                                <Text color="gray.600" fontSize="xs">
                                                    Prices are INR per licence + Add on/month, unless stated otherwise
                                                </Text>
                                            </Box>
                                            {/* Status Button */}
                                            <Box>
                                                <Button
                                                    bg={invoice.status === "paid" ? 'green.600' : 'orange.500'}
                                                    borderRadius={14}
                                                    size={'md'}
                                                    w={'80px'}
                                                >
                                                   {invoice.status === "paid" ? "Paid" : "Unpaid"}
                                                </Button>
                                            </Box>
                                            {/* Bill Amount */}
                                            <HStack>
                                                <Text color="gray.600" fontSize="sm">
                                                    Bill Amount
                                                </Text>
                                                <Text fontSize="xl" fontWeight="bold" fontFamily={'cursive'} mb={1}>
                                                    ₹{invoice.billAmount?.toFixed(2)} INR
                                                </Text>
                                            </HStack>
                                        </HStack>

                                        {/* Table */}
                                        <Table size="sm" variant='simple' mt={2}>
                                            <Thead>
                                                <Tr borderBottom="1px solid" borderColor="gray.300">
                                                    <Th color={'#797979'}>Date</Th>
                                                    <Th textAlign="start" color={'#797979'}>Description</Th>
                                                    <Th color={'#797979'}>Amount (INR)</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {invoice.lineItems?.map((item, index) => (
                                                <Tr key={index}>
                                                    <Td color={'#797979'}>
                                                        {formatDateRange(item.startDate, item.endDate)}
                                                    </Td>
                                                    <Td textAlign="start" color={'#797979'}>
                                                        {item.description} ({item.quantity})
                                                    </Td>
                                                    <Td color={'#797979'}>₹{item.amount.toFixed(2)}</Td>
                                                </Tr>
                                                ))}
                                            </Tbody>
                                        </Table>
                                    </Box>
                                    ))}
                                </VStack>
                            </Flex>
                        </Box>
                    </Box>
                </HStack>
                <Footer />
            </Box>
        </>
    )
}

export default SubscriptionsPage
