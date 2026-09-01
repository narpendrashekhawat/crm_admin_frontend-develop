import { Box, HStack, VStack, Grid, GridItem, Heading, Text, Icon, Divider, Image, useToast } from "@chakra-ui/react";
import React, { useState, useEffect } from "react"; 
import axios from 'axios'; 
import LeftSidebar from "../../components/LeftSideBarLayout/LeftSideBar";
import HeaderBar from "../../components/Header/HeaderBar";
import { FaUsers, FaHospitalAlt, FaShoppingCart, FaChartLine, FaBuilding, FaPills, FaWarehouse, FaClinicMedical, FaExclamationCircle, FaCheckCircle, FaClock, FaMapMarkerAlt } from 'react-icons/fa'; 
import { GiMedicines } from "react-icons/gi"; 
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,PieChart, Pie, Cell } from 'recharts';
import { Config } from "../../components/Utils/Config";

const KPICard = ({ title, value, trend }) => (
  <Box
    p={5}
    bg="white"
    borderRadius="xl"
    boxShadow="md"
    minH="120px"
    transition="transform 0.5s"
    _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
  >
    <Text fontSize="sm" color="gray.500" fontWeight="bold" mb={2}>
      {title}
    </Text>
    <Heading size="2xl" color="gray.700" mb={2} fontWeight="semibold">
      {value}
    </Heading>

    <Text 
      fontSize="sm" 
      color={trend.includes('-') ? 'red.500' : 'green.500'} 
      fontWeight="medium"
    >
      {trend} Month-over-Month
    </Text>
  </Box>
);

 
const TopManufacturersCard = ({ data }) => (
    <Box p={5} bg="white" borderRadius="xl" boxShadow="md" height="380px">
        <Heading size="md" mb={4} color="gray.700" pb={2}>
            Top 5 Manufacturers
        </Heading>
        <VStack spacing={4} align="stretch">
            {data && data.length > 0 ? (
                data.map((item, index) => (
                    <HStack key={index} justifyContent="space-between">
                        <HStack>
                            <Icon as={FaBuilding} color="blue.500" />
                            <Text fontWeight="medium" noOfLines={1}>{item.companyName}</Text>
                        </HStack>
                        
                        <Text fontWeight="bold" fontSize="sm" color="gray.600">
                            Orders: {item.total_orders}
                        </Text>
                    </HStack>
                ))
            ) : (
                 <Text color="gray.500">No manufacturer data.</Text>
            )}
        </VStack>
    </Box>
);


const TopProductsCard = ({ data }) => (
    <Box p={5} bg="white" borderRadius="xl" boxShadow="md" height="380px">
        <Heading size="md" mb={4} color="gray.700" pb={2}>
            Top 5 Selling Products
        </Heading>
        <VStack spacing={4} align="stretch">
            {data && data.length > 0 ? (
                data.map((item, index) => (
                    <HStack key={index} spacing={3}>
                        <Image src="https://placehold.co/40x40/E2E8F0/A0AEC0?text=Rx" borderRadius="md" />
                        <VStack align="flex-start" spacing={0}>
                            <Text fontWeight="medium" noOfLines={1}>{item.PName}</Text>
                            <Text fontSize="sm" color="gray.500">Sold: {item.total_sold}</Text>
                        </VStack>
                    </HStack>
                ))
            ) : (
                <Text color="gray.500">No product data.</Text>
            )}
        </VStack>
    </Box>
);

const TopPartnersCard = ({ title, data }) => (
    <Box p={5} bg="white" borderRadius="xl" boxShadow="md" height="380px">
        <Heading size="md" mb={4} color="gray.700" pb={2}>
            {title}
        </Heading>
        <VStack spacing={4} align="stretch">
            {data && data.length > 0 ? (
                data.map((item, index) => (
                    <VStack key={index} align="stretch" spacing={1}>
                        <HStack justifyContent="space-between">
                            <Text fontWeight="medium" noOfLines={1}>{item.companyName}</Text>
                            <Text fontWeight="bold" color="gray.700">{item.total_orders}</Text>
                        </HStack>
                        {/* <HStack justifyContent="space-between">
                             <Text fontSize="xs" color="gray.400">ID: {item.userId}</Text>
                             <Text fontSize="xs" color="gray.400">{item.userType}</Text>
                        </HStack> */}
                    </VStack>
                ))
            ) : (
                <Text color="gray.500">No partner data.</Text>
            )}
        </VStack>
    </Box>
);

const SubscriptionChart = ({ data }) => (
    <Box p={5} bg="white" borderRadius="xl" boxShadow="md" height="350px">
        <Heading size="md" mb={4} color="gray.700">
            Subscription Growth
        </Heading>
        <ResponsiveContainer width="100%" height="85%">
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                    dataKey="month" 
                    stroke="#718096"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(tick) => tick ? tick.substring(0, 3) : ''} 
                />
                <YAxis stroke="#718096" style={{ fontSize: '12px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }} />
              
                <Line 
                    type="monotone" 
                    dataKey="active_subscriptions" 
                    name="Subscriptions"
                    stroke="#5da0deff" 
                    strokeWidth={3}
                    dot={{ fill: '#386c9cff', r: 5 }}
                    />

                    <Line 
                    type="monotone" 
                    dataKey="total_amount" 
                    name="Amount"
                    stroke="#5da0deff" 
                    strokeWidth={3}
                    dot={{ fill: '#386c9cff', r: 5 }}
                />
                
            </LineChart>
        </ResponsiveContainer>
    </Box>
);

const UsersChart = ({ data }) => (
    <Box p={5} bg="white" borderRadius="xl" boxShadow="md" height="350px">
        <Heading size="md" mb={4} color="gray.700">
            Users Growth
        </Heading>
        <ResponsiveContainer width="100%" height="85%">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                    dataKey="month" 
                    stroke="#253753ff"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(tick) => tick ? tick.substring(0, 3) : ''}
                />
                <YAxis stroke="#204175ff" style={{ fontSize: '12px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff' }} />
               
                <Bar 
                    dataKey="total_users" 
                    name="Users"
                    fill="#5458cdff" 
                    radius={[8, 8, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    </Box>
);
const PendingActionsCard = () => (
    <Box p={5} bg="white" borderRadius="xl" boxShadow="md" height="300px">
        <Heading size="md" mb={4} color="gray.700" fontSize="16px" display="flex" alignItems="center" gap={2}>
            Pending Actions <Icon as={FaExclamationCircle} color="orange.500" />
        </Heading>
        <VStack  align="stretch" spacing={3}>
            <Box p={3} bg="orange.50" borderRadius="md" borderLeft="4px solid" borderColor="orange.400">
                <Text fontWeight="bold" fontSize="sm" color="gray.700">3 Retailers Pending</Text>
                <Text fontSize="xs" color="gray.500">Require document verification</Text>
            </Box>
            <Box p={3} bg="red.50" borderRadius="md" borderLeft="4px solid" borderColor="red.400">
                <Text fontWeight="bold" fontSize="sm" color="gray.700">2 Support Tickets</Text>
                <Text fontSize="xs" color="gray.500">High priority - Payment issues</Text>
            </Box>
            <Box p={3} bg="blue.50" borderRadius="md" borderLeft="4px solid" borderColor="blue.400">
                <Text fontWeight="bold" fontSize="sm" color="gray.700">5 New Products</Text>
                <Text fontSize="xs" color="gray.500">Waiting for approval</Text>
            </Box>
        </VStack>
    </Box>
);

const UserCompositionCard = () => {
    const data = [
        { name: 'Retailers', value: 40, color: '#5458cdff' },
        { name: 'Distributors', value: 20, color: '#00C49F' },
        { name: 'Manufacturers', value: 50, color: '#f3b52eff' },
    ];
    
    return (
        <Box p={5} bg="white" borderRadius="xl" boxShadow="md" height="300px">
            <Heading size="md" mb={0} color="gray.700" fontSize="16px">
                User Composition
            </Heading>
            <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="60%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={2}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '50px' }}/>
                </PieChart>
            </ResponsiveContainer>
        </Box>
    );
};

const RecentActivitiesCard = () => (
    <Box p={5} bg="white" borderRadius="xl" boxShadow="md" height="300px">
        <Heading size="md" mb={4} color="gray.700" fontSize="16px">
            Recent Activities
        </Heading>
        <VStack align="stretch" spacing={4} overflowY="auto" maxHeight="220px" css={{ '&::-webkit-scrollbar': { width: '4px' } }}>
            {[
                { text: "New Retailer Registered: City Gen Store", time: "2 mins ago", color: "green.500" },
                { text: "Order #12345 placed by PharmaCo", time: "1 hour ago", color: "blue.500" },
                { text: "Distributor 'MedLife' updated profile", time: "3 hours ago", color: "gray.500" },
                { text: "New Product 'Dolo 650' added", time: "5 hours ago", color: "purple.500" },
            ].map((item, idx) => (
                <HStack key={idx} align="start" spacing={3}>
                    <Icon as={FaClock} color={item.color} mt={1} boxSize={3} />
                    <VStack align="start" spacing={0}>
                        <Text fontSize="sm" fontWeight="medium" color="gray.700" noOfLines={1}>{item.text}</Text>
                        <Text fontSize="xs" color="gray.400">{item.time}</Text>
                    </VStack>
                </HStack>
            ))}
        </VStack>
    </Box>
);

const TopLocationsCard = () => (
    <Box p={5} bg="white" borderRadius="xl" boxShadow="md" height="300px">
        <Heading size="md" mb={4} color="gray.700" fontSize="16px">
            Top Locations (Sales)
        </Heading>
        <VStack align="stretch" spacing={5}>
            {[
                { city: "Jaipur", val: 85, color: "blue.400" },
                { city: "Delhi", val: 60, color: "green.400" },
                { city: "Mumbai", val: 45, color: "purple.400" },
                { city: "Ajmer", val: 30, color: "orange.400" },
            ].map((item, idx) => (
                <Box key={idx}>
                    <HStack justify="space-between" mb={1}>
                        <Text fontSize="sm" fontWeight="medium" color="gray.600">{item.city}</Text>
                        <Text fontSize="xs" fontWeight="bold" color="gray.500">{item.val}%</Text>
                    </HStack>
                    <Box w="100%" h="8px" bg="gray.100" borderRadius="full">
                        <Box h="100%" w={`${item.val}%`} bg={item.color} borderRadius="full" />
                    </Box>
                </Box>
            ))}
        </VStack>
    </Box>
);



const Overview = () => {
    const initialDashboardData = {
        activeSubscriptions: "...",
        totalRevenue: "...",
        activeManufacturers: "...",
        totalProducts: "...",
        topResult: {
            dis: [],
            ret: [],
            man: [],     
            products: [] 
        },
        subscriptionGrowth: [], 
        userGrowth: []        
    };

    const [dashboardData, setDashboardData] = useState(initialDashboardData);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    // const API_URL = "http://103.99.39.249:5005/api/overview/dashboardData";
    // const BEARER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzAsInVzZXJOYW1lIjoic3VwcG9ydEBjb3JldGVhbXMudXMiLCJpYXQiOjE3NjMzNjI4MjcsImV4cCI6MTc2NTk1NDgyN30.O0oKmGh5nLPD2a69b4YUFZljICyBweEIGPcNuQIh0Q8";

    const formatRevenue = (value) => {
        const num = parseFloat(value);
        if (isNaN(num)) return value;
        // if (num >= 10000000) return `₹ ${(num / 10000000).toFixed(2)} Cr`;
        // if (num >= 100000) return `₹ ${(num / 100000).toFixed(2)} L`;
        return `₹ ${num.toLocaleString('en-IN')}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${Config.dashboard_data}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem(`authToken`)}`}
                });

                if (response.data && response.data.status === 200) {
                    const apiData = response.data.apiData;
                    
                    const SubscriptionData = (apiData.subscriptionGrowth || []).map(item => ({
                        ...item,
                        total_amount: parseFloat(item.total_amount || 0) 
                    })); 
                    setDashboardData({
                        
                        activeSubscriptions: apiData.activeSubscrptions || '0', 
                        totalRevenue: apiData.totalRevenue || '0.00',
                        activeManufacturers: apiData.activeManufacturers || '0',
                        totalProducts: apiData.totalProducts || '0',
                        topResult: apiData.topResult || { dis: [], ret: [], man: [], products: [] },
                        subscriptionGrowth: apiData.subscriptionGrowth || [],
                        userGrowth: apiData.userGrowth || []
                    });
                    
                    toast({
                        title: "Data loaded successfully.",
                        status: "success",
                        duration: 1000,
                        isClosable: true,
                    });
                } else {
                     throw new Error('API request failed with status: ' + response.data.status);
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                toast({
                    title: "Error fetching data.",
                    description: error.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [toast]);

    return (
        <Box backgroundColor='#F0F4F9' minHeight="100vh">
            <HStack justifyContent='space-between' px='20px' alignItems='flex-start' spacing={0}>
                <Box as="aside" width="20%">
                    <LeftSidebar /> 
                </Box>
                
                <Box as="main" width='80%'>
                    <HeaderBar />
    
                    <VStack spacing={6} align="stretch" p={6}>
                        
                        {/* KPI Grid */}
                        <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6}>
                            <KPICard 
                                title="Total Subscriptions" 
                                value={loading ? "..." : dashboardData.activeSubscriptions.toLocaleString('en-IN')} 
                                trend="+5%" 
                            />
                            <KPICard 
                                title="Active Users" 
                                value={loading ? "..." : dashboardData.activeManufacturers.toLocaleString('en-IN')} 
                                trend="" 
                            />
                            <KPICard 
                                title="Total Products" 
                                value={loading ? "..." : dashboardData.totalProducts.toLocaleString('en-IN')} 
                                trend="" 
                            />
                            <KPICard 
                                title="Total Revenue" 
                                value={loading ? "..." : formatRevenue(dashboardData.totalRevenue)} 
                                trend="" 
                            />
                        </Grid>

                       
                        <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6}>
                            <GridItem>
                               
                                <TopManufacturersCard data={loading ? [] : dashboardData.topResult.man} />
                            </GridItem>
                            <GridItem>
                               
                                <TopProductsCard data={loading ? [] : dashboardData.topResult.products} />
                            </GridItem>
                            <GridItem>
                            
                                <TopPartnersCard 
                                    title="Top 5 Distributors" 
                                    data={loading ? [] : dashboardData.topResult.dis} 
                                />
                            </GridItem>
                            <GridItem>
                               
                                <TopPartnersCard 
                                    title="Top 5 Retailers" 
                                    data={loading ? [] : dashboardData.topResult.ret} 
                                />
                            </GridItem>
                        </Grid>
                        
                  
                        <Grid templateColumns={{ base: "repeat(1, 1fr)", lg: "repeat(2, 1fr)" }} gap={6}>
                            <GridItem>
                                <SubscriptionChart data={loading ? [] : dashboardData.subscriptionGrowth} 
                                />
                            </GridItem>
                            <GridItem>
                                <UsersChart data={loading ? [] : dashboardData.userGrowth} />
                            </GridItem>
                        </Grid>
                       
<Box mt={6}>
    <Heading size="md" mb={4} color="gray.600">Insights & Actions</Heading>
    <Grid 
        templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)", xl: "repeat(4, 1fr)" }} 
        gap={6}
    >
        <GridItem>
            <PendingActionsCard />
        </GridItem>
        <GridItem>
            <UserCompositionCard />
        </GridItem>
        <GridItem>
            <RecentActivitiesCard />
        </GridItem>
        <GridItem>
            <TopLocationsCard />
        </GridItem>
    </Grid>
</Box>

                     </VStack>
                </Box>
            </HStack>
        </Box>
    );
}

export default Overview;